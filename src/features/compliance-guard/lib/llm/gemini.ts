import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { type JsonGenerationRequest, type LlmProvider, withTimeout } from "./provider";

export class GeminiProvider implements LlmProvider {
  readonly name = "gemini";
  readonly supportsGeneration = true;
  private readonly client: GoogleGenAI;

  constructor(
    apiKey: string,
    readonly model: string,
    private readonly embedModel: string,
    private readonly dims: number,
  ) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateJson<T>({ system, prompt, schema, temperature = 0.1, timeoutMs = 20_000 }: JsonGenerationRequest<T>): Promise<T> {
    const res = await withTimeout(
      this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: system,
          temperature,
          responseMimeType: "application/json",
          // Structured output: the model is constrained to our Zod schema.
          responseJsonSchema: z.toJSONSchema(schema, { target: "draft-7" }),
        },
      }),
      timeoutMs,
      "gemini.generateContent",
    );
    const text = res.text;
    if (!text) throw new Error("Gemini returned an empty response");
    // Re-validate: never trust model output even with constrained decoding.
    return schema.parse(JSON.parse(text));
  }

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    const BATCH = 100;
    const out: number[][] = [];
    for (let i = 0; i < texts.length; i += BATCH) {
      const res = await withTimeout(
        this.client.models.embedContent({
          model: this.embedModel,
          contents: texts.slice(i, i + BATCH),
          config: { outputDimensionality: this.dims, taskType: "RETRIEVAL_DOCUMENT" },
        }),
        30_000,
        "gemini.embedContent",
      );
      for (const e of res.embeddings ?? []) out.push(e.values ?? []);
    }
    return out;
  }
}
