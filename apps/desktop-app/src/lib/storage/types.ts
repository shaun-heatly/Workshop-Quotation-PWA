// Storage abstraction types

export interface StorageAdapter {
  // Directory management
  selectFolder(): Promise<boolean>;
  hasFolder(): boolean;
  getFolderPath(): string | null;
  
  // File operations
  writeFile(filename: string, data: any): Promise<void>;
  readFile<T = any>(filename: string): Promise<T | null>;
  deleteFile(filename: string): Promise<void>;
  listFiles(): Promise<string[]>;
  fileExists(filename: string): Promise<boolean>;
  
  // Metadata
  getStorageInfo(): Promise<StorageInfo>;
}

export interface StorageInfo {
  type: 'filesystem' | 'localstorage';
  location: string;
  available: boolean;
  canWrite: boolean;
  estimatedSize?: number;
}

export interface FileSystemHandle extends EventTarget {
  readonly kind: 'file' | 'directory';
  readonly name: string;
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
  removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
  keys(): AsyncIterableIterator<string>;
  values(): AsyncIterableIterator<FileSystemHandle>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

export interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

// Global type extensions
declare global {
  interface Window {
    showDirectoryPicker?: (options?: DirectoryPickerOptions) => Promise<FileSystemDirectoryHandle>;
  }
}

export interface DirectoryPickerOptions {
  mode?: 'read' | 'readwrite';
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
}