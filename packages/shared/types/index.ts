// Core data types shared between website and desktop app

export interface Material {
  id: string;
  category: 'steel' | 'aluminum' | 'wood' | 'plastic' | 'other';
  name: string;
  description?: string;
  specifications: {
    thickness?: number;      // mm
    width?: number;          // mm
    standardLength?: number; // mm (4000, 6000, etc.)
    weight?: number;         // kg/m
  };
  costPerMeter: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface MaterialUsage {
  materialId: string;
  quantity: number;
  length: number;
  totalCost: number;
}

export interface Cut {
  length: number;
  quantity: number;
  label: string;
}

export interface PlacedCut {
  cutId: string;
  length: number;
  position: number;
  label: string;
}

export interface StockPiece {
  id: string;
  originalLength: number;
  cuts: PlacedCut[];
  remaining: number;
  isExisting?: boolean; // For partial stock pieces
}

export interface OptimizationResult {
  stockNeeded: number;
  stockUsed: StockPiece[];
  totalWaste: number;
  efficiency: number;
  totalCost?: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  customer: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  items: QuoteItem[];
  materials: MaterialUsage[];
  cuttingList?: {
    cuts: Cut[];
    optimization: OptimizationResult;
  };
  totals: {
    materials: number;
    labor: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  quoteId: string;
  jobNumber: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  estimatedHours: number;
  actualHours?: number;
  materialAllocations: MaterialAllocation[];
  notes: string[];
  createdAt: string;
  completedAt?: string;
}

export interface MaterialAllocation {
  materialId: string;
  allocatedQuantity: number;
  usedQuantity?: number;
  notes?: string;
}

export interface Rate {
  id: string;
  category: 'labor' | 'overhead';
  name: string;
  ratePerHour: number;
  active: boolean;
}

export interface License {
  key: string;              // "WQ2024-ABCD-1234-EFGH"
  email: string;
  issuedAt: string;
  expiresAt: string;
  features: string[];       // ["cutting", "pdf", "advanced"]
  validated: boolean;
  lastValidated?: string;
}

export interface AppSettings {
  workshopName: string;
  currency: string;
  defaultStockLength: number;
  defaultBladeKerf: number;
  taxRate: number;
  dataFolder?: string;
}

// API types for license validation
export interface LicenseValidationRequest {
  key: string;
  email: string;
}

export interface LicenseValidationResponse {
  valid: boolean;
  license?: License;
  error?: string;
}