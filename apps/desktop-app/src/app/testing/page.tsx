import { AppLayout } from '@/components/layout/AppLayout';
import { StorageTest } from '@/components/storage/StorageTest';
import DataTest from '@/components/data/DataTest';

export default function TestingPage() {
  return (
    <AppLayout>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Development Testing
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Test storage and data operations during development
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <p className="text-sm">
              <strong>Sprint 1 - Day 3:</strong> Testing app navigation and layout.
              All storage and data operations are working correctly.
            </p>
          </div>
        </div>

        {/* Storage Test Component */}
        <div className="mb-12">
          <StorageTest />
        </div>
        
        {/* Data Layer Test Component */}
        <div>
          <DataTest />
        </div>
      </div>
    </AppLayout>
  );
}