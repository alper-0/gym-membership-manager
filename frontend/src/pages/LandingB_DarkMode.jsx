import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Lock, Star } from 'lucide-react';

const LandingB_DarkMode = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GymPro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50 font-medium"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>Premium Gym Management Platform</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Fitness Management
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Next-generation platform for modern gyms. Seamless check-ins, powerful analytics, 
              and everything you need to scale your fitness business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50 font-semibold text-lg group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all border border-gray-700 font-semibold text-lg"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-gray-400 mt-1">Gyms Powered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  50k+
                </div>
                <div className="text-gray-400 mt-1">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-400 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-400">
              Sub-second check-ins with real-time validation. Your members deserve speed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all group">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-gray-400">
              Deep insights into member behavior, revenue trends, and growth opportunities.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Bank-Level Security</h3>
            <p className="text-gray-400">
              Enterprise encryption, secure authentication, and compliance-ready infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 py-20 border-t border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Experience the Difference
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the elite gyms transforming their member experience
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center bg-white text-gray-900 px-10 py-5 rounded-xl hover:bg-gray-100 transition-all shadow-2xl font-bold text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2025 GymPro. Engineered for excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingB_DarkMode;
