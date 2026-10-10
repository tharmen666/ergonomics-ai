import { z } from 'zod';

export const BusinessCategoryEnum = z.enum([
  'fast_food',
  'coffee_bakery',
  'forecourt',
  'pharmacy',
  'wholesale',
  'general_retail',
  'other',
]);
export type BusinessCategory = z.infer<typeof BusinessCategoryEnum>;

export const EquipmentSchema = z.object({
  lpg: z.boolean().default(false),
  pressureVessels: z.boolean().default(false),
  deepFryers: z.boolean().default(false),
  switchboards: z.boolean().default(true),
  coldRooms: z.boolean().default(false),
  hazardousChemicals: z.boolean().default(false),
  forklifts: z.boolean().default(false),
  highBayStacking: z.boolean().default(false),
  undergroundFuelTanks: z.boolean().default(false),
  mhiThresholdExceeded: z.boolean().default(false),
});
export type EquipmentIntake = z.infer<typeof EquipmentSchema>;

export const siteIntakeSchema = z.object({
  category: BusinessCategoryEnum,
  otherDescription: z.string().optional(),
  employerName: z.string().min(2, 'Employer / Legal entity name is required'),
  branchName: z.string().min(2, 'Branch name is required'),
  address: z.string().min(5, 'Physical address is required'),
  headcount: z.number().int().min(1, 'Headcount must be at least 1'),
  peakOnSite: z.number().int().min(1).optional(),
  isShopOrOffice: z.boolean(),
  equipment: EquipmentSchema.default({
    lpg: false,
    pressureVessels: false,
    deepFryers: false,
    switchboards: true,
    coldRooms: false,
    hazardousChemicals: false,
    forklifts: false,
    highBayStacking: false,
    undergroundFuelTanks: false,
    mhiThresholdExceeded: false,
  }),
  contactEmail: z.string().email().optional(),
}).refine((data) => {
  if (data.category === 'other') {
    return typeof data.otherDescription === 'string' && data.otherDescription.trim().length > 0;
  }
  return true;
}, {
  message: 'Description is required when category is other',
  path: ['otherDescription'],
}).refine((data) => {
  if (data.peakOnSite !== undefined) {
    return data.peakOnSite <= data.headcount;
  }
  return true;
}, {
  message: 'peakOnSite must not exceed headcount',
  path: ['peakOnSite'],
});

export type SiteIntake = z.infer<typeof siteIntakeSchema>;
