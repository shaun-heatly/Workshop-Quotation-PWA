import { z } from 'zod';

// Base entity schema
export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Material schema
export const MaterialSchema = BaseEntitySchema.extend({
  category: z.enum(['steel', 'aluminum', 'wood', 'plastic', 'other']),
  name: z.string().min(1, 'Material name is required'),
  description: z.string().optional(),
  specifications: z.object({
    thickness: z.number().positive().optional(),      // mm
    width: z.number().positive().optional(),          // mm  
    standardLength: z.number().positive().optional(), // mm (4000, 6000, etc.)
    weight: z.number().positive().optional(),         // kg/m
  }).default({}),
  costPerMeter: z.number().min(0, 'Cost must be non-negative'),
  active: z.boolean().default(true),
});

// Settings schema
export const AppSettingsSchema = z.object({
  workshopName: z.string().min(1, 'Workshop name is required'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').default('USD'),
  defaultStockLength: z.number().positive().default(4000), // 4m default
  defaultBladeKerf: z.number().min(0).default(3),          // 3mm default
  taxRate: z.number().min(0).max(100).default(0),          // percentage
  dataFolder: z.string().optional(),
  // Add more settings as needed
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  autoBackup: z.boolean().default(true),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

// Rate schema (for labor/overhead rates)
export const RateSchema = BaseEntitySchema.extend({
  category: z.enum(['labor', 'overhead', 'machine']),
  name: z.string().min(1, 'Rate name is required'),
  description: z.string().optional(),
  ratePerHour: z.number().min(0, 'Rate must be non-negative'),
  active: z.boolean().default(true),
});

// Quote Item schema
export const QuoteItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
  notes: z.string().optional(),
});

// Material Usage schema (for quotes)
export const MaterialUsageSchema = z.object({
  materialId: z.string().min(1),
  quantity: z.number().positive('Quantity must be positive'),
  length: z.number().positive('Length must be positive'),
  totalCost: z.number().min(0, 'Total cost must be non-negative'),
});

// Cut schema (for cutting optimization)
export const CutSchema = z.object({
  length: z.number().positive('Cut length must be positive'),
  quantity: z.number().positive('Cut quantity must be positive'),
  label: z.string().min(1, 'Cut label is required'),
});

// Stock Piece schema
export const StockPieceSchema = z.object({
  id: z.string().min(1),
  originalLength: z.number().positive(),
  cuts: z.array(z.object({
    cutId: z.string(),
    length: z.number().positive(),
    position: z.number().min(0),
    label: z.string(),
  })),
  remaining: z.number().min(0),
  isExisting: z.boolean().optional().default(false),
});

// Optimization Result schema
export const OptimizationResultSchema = z.object({
  stockNeeded: z.number().min(0),
  stockUsed: z.array(StockPieceSchema),
  totalWaste: z.number().min(0),
  efficiency: z.number().min(0).max(100),
  totalCost: z.number().min(0).optional(),
});

// Quote schema
export const QuoteSchema = BaseEntitySchema.extend({
  quoteNumber: z.string().min(1, 'Quote number is required'),
  status: z.enum(['draft', 'sent', 'approved', 'rejected']).default('draft'),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
  }),
  items: z.array(QuoteItemSchema),
  materials: z.array(MaterialUsageSchema),
  cuttingList: z.object({
    cuts: z.array(CutSchema),
    optimization: OptimizationResultSchema,
  }).optional(),
  totals: z.object({
    materials: z.number().min(0),
    labor: z.number().min(0),
    total: z.number().min(0),
  }),
  notes: z.string().optional(),
});

// Job schema
export const JobSchema = BaseEntitySchema.extend({
  quoteId: z.string().min(1, 'Quote ID is required'),
  jobNumber: z.string().min(1, 'Job number is required'),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  assignedTo: z.string().optional(),
  estimatedHours: z.number().min(0, 'Estimated hours must be non-negative'),
  actualHours: z.number().min(0).optional(),
  materialAllocations: z.array(z.object({
    materialId: z.string().min(1),
    allocatedQuantity: z.number().positive(),
    usedQuantity: z.number().min(0).optional(),
    notes: z.string().optional(),
  })),
  notes: z.array(z.string()),
  completedAt: z.string().datetime().optional(),
});

// License schema
export const LicenseSchema = z.object({
  key: z.string().min(1, 'License key is required'),
  email: z.string().email('Valid email is required'),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  features: z.array(z.string()),
  validated: z.boolean().default(false),
  lastValidated: z.string().datetime().optional(),
});

// Validation helpers and utilities
export const ValidationUtils = {
  // Custom validators
  isPositiveInteger: (val: number) => Number.isInteger(val) && val > 0,
  
  // Date validation helpers
  isFutureDate: (dateString: string) => new Date(dateString) > new Date(),
  isPastDate: (dateString: string) => new Date(dateString) < new Date(),
  
  // Material validation
  validateMaterialCost: (cost: number) => cost >= 0 && cost <= 10000, // reasonable range
  
  // Quote validation
  validateQuoteTotal: (items: any[], materials: any[]) => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const materialsTotal = materials.reduce((sum, mat) => sum + (mat.totalCost || 0), 0);
    return itemsTotal + materialsTotal;
  },
  
  // ID generation and validation
  generateId: (prefix?: string) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
  },
  
  isValidId: (id: string) => /^[a-zA-Z0-9-_]+$/.test(id) && id.length >= 5,
};

// Type exports (inferred from Zod schemas)
export type Material = z.infer<typeof MaterialSchema>;
export type AppSettings = z.infer<typeof AppSettingsSchema>;
export type Rate = z.infer<typeof RateSchema>;
export type QuoteItem = z.infer<typeof QuoteItemSchema>;
export type MaterialUsage = z.infer<typeof MaterialUsageSchema>;
export type Cut = z.infer<typeof CutSchema>;
export type StockPiece = z.infer<typeof StockPieceSchema>;
export type OptimizationResult = z.infer<typeof OptimizationResultSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Job = z.infer<typeof JobSchema>;
export type License = z.infer<typeof LicenseSchema>;
export type BaseEntity = z.infer<typeof BaseEntitySchema>;