import { StorageTest } from '@/components/storage/StorageTest';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Workshop Quotation Manager
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Desktop PWA for workshop quotations and cutting optimization
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <p className="text-sm">
            <strong>Sprint 1 - Day 1:</strong> Testing File System Access API foundation.
            Use Chrome or Edge for best results.
          </p>
        </div>
      </div>

      {/* Storage Test Component */}
      <StorageTest />
      
      <div className="mt-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg opacity-50">
            <h2 className="text-xl font-semibold mb-2">Materials</h2>
            <p className="text-muted-foreground">
              Manage your material database with pricing and specifications
            </p>
            <div className="mt-2 text-xs text-gray-500">Coming in Sprint 2</div>
          </div>
          
          <div className="p-6 border rounded-lg opacity-50">
            <h2 className="text-xl font-semibold mb-2">Quotes</h2>
            <p className="text-muted-foreground">
              Create detailed quotes with automatic calculations
            </p>
            <div className="mt-2 text-xs text-gray-500">Coming in Sprint 3</div>
          </div>
          
          <div className="p-6 border rounded-lg opacity-50">
            <h2 className="text-xl font-semibold mb-2">Cutting Optimizer</h2>
            <p className="text-muted-foreground">
              Optimize material usage with smart cutting calculations
            </p>
            <div className="mt-2 text-xs text-gray-500">Coming in Sprint 3</div>
          </div>
        </div>
      </div>
    </div>
  )
}