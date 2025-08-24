// Data services
export { BaseDataService } from './BaseDataService';
import { MaterialsService } from './MaterialsService';
import { SettingsService } from './SettingsService';

// Re-export for types
export { MaterialsService, SettingsService };

// Schemas and types
export * from './schemas';

// Service instances (singletons)
let materialsService: MaterialsService | null = null;
let settingsService: SettingsService | null = null;

export const getMaterialsService = (): MaterialsService => {
  if (!materialsService) {
    materialsService = new MaterialsService();
  }
  return materialsService;
};

export const getSettingsService = (): SettingsService => {
  if (!settingsService) {
    settingsService = new SettingsService();
  }
  return settingsService;
};

// Reset services (useful for testing)
export const resetServices = (): void => {
  materialsService = null;
  settingsService = null;
};