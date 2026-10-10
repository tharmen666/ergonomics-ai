import "server-only";
import { env } from "@/lib/config/env";
import { MemoryRepository } from "./memory-repository";
import type { Repository } from "./repository";

export type { Repository } from "./repository";

let repo: Repository | undefined;

export async function getRepository(): Promise<Repository> {
  if (repo) return repo;
  const url = env().DATABASE_URL;
  if (url) {
    // Lazy import keeps the postgres driver out of the bundle when unused.
    const { PostgresRepository } = await import("./postgres-repository");
    repo = new PostgresRepository(url);
  } else {
    repo = new MemoryRepository();
  }
  return repo;
}
