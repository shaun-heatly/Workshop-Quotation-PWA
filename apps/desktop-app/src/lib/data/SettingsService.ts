import { AppSettingsSchema, type AppSettings } from './schemas';
import { storageManager } from '@/lib/storage';

export class SettingsService {
  private readonly filename = 'settings.json';
  private cachedSettings: AppSettings | null = null;

  // Get current settings (with defaults)
  async getSettings(): Promise<AppSettings> {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }

    try {
      const data = await storageManager.readFile<AppSettings>(this.filename);
      
      if (!data) {
        // Return default settings
        const defaultSettings = AppSettingsSchema.parse({
          workshopName: 'My Workshop',
        });
        this.cachedSettings = defaultSettings;
        return defaultSettings;
      }

      // Validate and merge with defaults
      const validatedSettings = AppSettingsSchema.parse(data);
      this.cachedSettings = validatedSettings;
      return validatedSettings;
    } catch (error) {
      console.error('Failed to load settings, using defaults:', error);
      
      // Return default settings on error
      const defaultSettings = AppSettingsSchema.parse({
        workshopName: 'My Workshop',
      });
      this.cachedSettings = defaultSettings;
      return defaultSettings;
    }
  }

  // Update specific settings
  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    
    // Validate the updated settings
    const validatedSettings = AppSettingsSchema.parse(updatedSettings);
    
    try {
      await storageManager.writeFile(this.filename, validatedSettings);
      this.cachedSettings = validatedSettings;
      return validatedSettings;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  // Get specific setting value
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  // Update specific setting
  async updateSetting<K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ): Promise<AppSettings> {
    return this.updateSettings({ [key]: value } as Partial<AppSettings>);
  }

  // Reset to defaults
  async resetSettings(): Promise<AppSettings> {
    const defaultSettings = AppSettingsSchema.parse({
      workshopName: 'My Workshop',
    });
    
    try {
      await storageManager.writeFile(this.filename, defaultSettings);
      this.cachedSettings = defaultSettings;
      return defaultSettings;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw new Error('Failed to reset settings');
    }
  }

  // Export settings
  async exportSettings(): Promise<AppSettings> {
    return this.getSettings();
  }

  // Import settings
  async importSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return this.updateSettings(settings);
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cachedSettings = null;
  }

  // Validate settings object
  validateSettings(settings: any): settings is AppSettings {
    try {
      AppSettingsSchema.parse(settings);
      return true;
    } catch {
      return false;
    }
  }
}