import { MaterialSchema, type Material } from './schemas';
import { BaseDataService, type DataServiceConfig } from './BaseDataService';
import { ValidationUtils } from './schemas';

export class MaterialsService extends BaseDataService<Material> {
  constructor() {
    const config: DataServiceConfig<Material> = {
      filename: 'materials.json',
      schema: MaterialSchema as any,
      generateId: () => ValidationUtils.generateId('mat'),
    };
    super(config);
  }

  // Material-specific query methods
  async getByCategory(category: Material['category']): Promise<Material[]> {
    return this.find(material => material.category === category);
  }

  async getActiveMaterials(): Promise<Material[]> {
    return this.find(material => material.active);
  }

  async searchByName(searchTerm: string): Promise<Material[]> {
    const term = searchTerm.toLowerCase();
    return this.find(material => 
      material.name.toLowerCase().includes(term) ||
      (material.description?.toLowerCase().includes(term) ?? false)
    );
  }

  async getCostRange(): Promise<{ min: number; max: number }> {
    const materials = await this.getActiveMaterials();
    if (materials.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const costs = materials.map(m => m.costPerMeter);
    return {
      min: Math.min(...costs),
      max: Math.max(...costs),
    };
  }

  // Bulk operations for materials
  async deactivateMaterial(id: string): Promise<Material | null> {
    return this.update(id, { active: false });
  }

  async activateMaterial(id: string): Promise<Material | null> {
    return this.update(id, { active: true });
  }

  async updateCost(id: string, costPerMeter: number): Promise<Material | null> {
    if (costPerMeter < 0) {
      throw new Error('Cost per meter must be non-negative');
    }
    return this.update(id, { costPerMeter });
  }

  // Export/Import with material-specific validation
  async exportMaterials(): Promise<Material[]> {
    return this.exportData();
  }

  async importMaterials(materials: Material[], options: { replace?: boolean } = {}): Promise<void> {
    // Additional validation for materials
    const validatedMaterials = materials.filter(material => {
      // Check if cost is reasonable
      if (!ValidationUtils.validateMaterialCost(material.costPerMeter)) {
        console.warn(`Material ${material.name} has unreasonable cost: ${material.costPerMeter}`);
        return false;
      }
      return true;
    });

    await this.importData(validatedMaterials, { ...options, validate: true });
  }
}