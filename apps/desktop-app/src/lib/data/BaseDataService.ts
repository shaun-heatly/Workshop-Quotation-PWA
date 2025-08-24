import { storageManager } from '@/lib/storage';
import { z } from 'zod';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataServiceConfig<T extends BaseEntity> {
  filename: string;
  schema: z.ZodSchema<T>;
  generateId?: () => string;
}

export class BaseDataService<T extends BaseEntity> {
  private filename: string;
  private schema: z.ZodSchema<T>;
  private generateId: () => string;

  constructor(config: DataServiceConfig<T>) {
    this.filename = config.filename;
    this.schema = config.schema;
    this.generateId = config.generateId || this.defaultGenerateId;
  }

  // CRUD Operations
  
  async getAll(): Promise<T[]> {
    try {
      const data = await storageManager.readFile<T[]>(this.filename);
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Validate each item
      return data.filter(item => {
        try {
          this.schema.parse(item);
          return true;
        } catch (error) {
          console.warn(`Invalid ${this.filename} item:`, item, error);
          return false;
        }
      });
    } catch (error) {
      console.error(`Failed to load ${this.filename}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    // Validate the new item
    const validatedItem = this.schema.parse(newItem);

    // Add to existing data
    const items = await this.getAll();
    items.push(validatedItem);

    await this.saveAll(items);
    return validatedItem;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    } as T;

    // Validate the updated item
    const validatedItem = this.schema.parse(updatedItem);

    items[index] = validatedItem;
    await this.saveAll(items);
    return validatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === initialLength) {
      return false; // Item not found
    }

    await this.saveAll(filteredItems);
    return true;
  }

  async deleteAll(): Promise<void> {
    await this.saveAll([]);
  }

  // Bulk operations

  async createMany(dataArray: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    const now = new Date().toISOString();
    const newItems = dataArray.map(data => ({
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T));

    // Validate all new items
    const validatedItems = newItems.map(item => this.schema.parse(item));

    // Add to existing data
    const existingItems = await this.getAll();
    const allItems = [...existingItems, ...validatedItems];

    await this.saveAll(allItems);
    return validatedItems;
  }

  async updateMany(updates: Array<{ id: string; data: Partial<Omit<T, 'id' | 'createdAt'>> }>): Promise<T[]> {
    const items = await this.getAll();
    const updatedItems: T[] = [];
    const now = new Date().toISOString();

    for (const update of updates) {
      const index = items.findIndex(item => item.id === update.id);
      if (index !== -1) {
        const updatedItem = {
          ...items[index],
          ...update.data,
          updatedAt: now,
        } as T;

        // Validate the updated item
        const validatedItem = this.schema.parse(updatedItem);
        items[index] = validatedItem;
        updatedItems.push(validatedItem);
      }
    }

    if (updatedItems.length > 0) {
      await this.saveAll(items);
    }

    return updatedItems;
  }

  // Query operations

  async find(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll();
    return items.filter(predicate);
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.getAll();
    return items.find(predicate) || null;
  }

  async count(): Promise<number> {
    const items = await this.getAll();
    return items.length;
  }

  async exists(id: string): Promise<boolean> {
    const items = await this.getAll();
    return items.some(item => item.id === id);
  }

  // Import/Export operations

  async exportData(): Promise<T[]> {
    return this.getAll();
  }

  async importData(data: T[], options: { replace?: boolean; validate?: boolean } = {}): Promise<void> {
    const { replace = false, validate = true } = options;

    let itemsToImport = data;

    if (validate) {
      // Validate all items before importing
      itemsToImport = data.filter(item => {
        try {
          this.schema.parse(item);
          return true;
        } catch (error) {
          console.warn('Invalid item during import:', item, error);
          return false;
        }
      });
    }

    if (replace) {
      await this.saveAll(itemsToImport);
    } else {
      const existingItems = await this.getAll();
      const existingIds = new Set(existingItems.map(item => item.id));
      
      // Only import items that don't already exist
      const newItems = itemsToImport.filter(item => !existingIds.has(item.id));
      const allItems = [...existingItems, ...newItems];
      
      await this.saveAll(allItems);
    }
  }

  // Private helper methods

  private async saveAll(items: T[]): Promise<void> {
    try {
      await storageManager.writeFile(this.filename, items);
    } catch (error) {
      console.error(`Failed to save ${this.filename}:`, error);
      throw new Error(`Failed to save data to ${this.filename}`);
    }
  }

  private defaultGenerateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for validation and schema management

  validateItem(item: any): T {
    return this.schema.parse(item);
  }

  isValidItem(item: any): item is T {
    try {
      this.schema.parse(item);
      return true;
    } catch {
      return false;
    }
  }

  getSchema(): z.ZodSchema<T> {
    return this.schema;
  }
}