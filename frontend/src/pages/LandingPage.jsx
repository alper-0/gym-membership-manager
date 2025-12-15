import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Dumbbell, Users, Clock, Shield } from 'lucide-react';

const LandingA_ModernBlue = () => {
  const features = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Smart Check-In",
      description: "Quick and secure gym access with real-time validation"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Member Portal",
      description: "View your subscription, history, and account details"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Plans",
      description: "Choose from weekly, monthly, or annual memberships"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data protected with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                FitManager
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span>Modern Gym Management</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Manage Your Gym
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Complete membership management system with secure check-ins, flexible plans, 
              and real-time tracking. Built for modern fitness centers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg"
              >
                View Demo
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">14-day free trial</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600 font-medium">Active Members</span>
                  <span className="text-3xl font-bold text-blue-600">847</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600 font-medium">Check-ins Today</span>
                  <span className="text-3xl font-bold text-green-600">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Revenue This Month</span>
                  <span className="text-3xl font-bold text-purple-600">$42.5k</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features to streamline your gym operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of fitness centers using FitManager
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 FitManager. Built with modern technology for modern gyms.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingA_ModernBlue;
