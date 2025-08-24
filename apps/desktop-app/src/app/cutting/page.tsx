import { AppLayout } from '@/components/layout/AppLayout';
import { Plus, Calculator, Scissors, FileText, TrendingDown } from 'lucide-react';

export default function CuttingPage() {
  return (
    <AppLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cutting Lists</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            New Cutting List
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="ml-4 text-lg font-semibold text-gray-900">Quick Optimizer</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Quickly optimize cuts for a single material without creating a full cutting list
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Open Optimizer
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="ml-4 text-lg font-semibold text-gray-900">Waste Analysis</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View material waste statistics and optimization efficiency across all cutting lists
            </p>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              View Analysis
            </button>
          </div>
        </div>

        {/* Recent Cutting Lists */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Cutting Lists</h2>
          </div>
          <div className="p-12 text-center">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cutting lists yet</h3>
            <p className="text-gray-500 mb-4">Create your first cutting list to optimize material usage</p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Create Cutting List
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">Optimization Algorithm</h3>
              <p className="mt-1 text-sm text-blue-700">
                Our cutting optimizer uses a longest-first algorithm to minimize waste and maximize material usage efficiency.
                It automatically accounts for blade kerf and can handle multiple stock lengths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}