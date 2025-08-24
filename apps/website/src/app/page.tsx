import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">
                Workshop Quotation Manager
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/download"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your Workshop
            <span className="text-blue-600"> Quotations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Desktop PWA designed for small workshops. Create quotes, optimize cutting lists, 
            and track jobs with smart material calculations. Your data stays local and secure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything Your Workshop Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for fabrication, welding, and woodworking shops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Quotations</h3>
              <p className="text-gray-600">
                Create professional quotes with automatic material calculations and labor estimates
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                ✂️
              </div>
              <h3 className="text-xl font-semibold mb-2">Cutting Optimizer</h3>
              <p className="text-gray-600">
                Minimize waste with intelligent cutting list optimization for linear materials
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                🗂️
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Tracking</h3>
              <p className="text-gray-600">
                Convert quotes to jobs and track progress with material allocation and time logging
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                💾
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Data</h3>
              <p className="text-gray-600">
                Your data stays on your computer. Works with OneDrive/Google Drive for sync
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                📄
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Generation</h3>
              <p className="text-gray-600">
                Professional quotes and job sheets with your branding and detailed BOMs
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                🔧
              </div>
              <h3 className="text-xl font-semibold mb-2">Workshop Ready</h3>
              <p className="text-gray-600">
                Desktop-first design optimized for workshop environments and workflows
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Workshop?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with a free trial. No credit card required.
          </p>
          <Link
            href="/download"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
          >
            Download Free Trial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">Workshop Quotation Manager</div>
              <p className="text-gray-400">
                Built for workshops that build things.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/download">Download</Link></li>
                <li><Link href="/features">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/support">Contact Support</Link></li>
                <li><Link href="/licenses">License Help</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © 2024 Workshop Quotation Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}