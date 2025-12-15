import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Target, Zap, TrendingUp } from 'lucide-react';

const LandingD_BoldOrange = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b-4 border-orange-500 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Flame className="w-10 h-10 text-orange-500" />
                <div className="absolute inset-0 bg-orange-400 blur-lg opacity-50"></div>
              </div>
              <span className="text-2xl font-black text-gray-900">
                POWER<span className="text-orange-500">GYM</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-orange-600 font-bold transition-colors"
              >
                LOGIN
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg font-bold uppercase text-sm tracking-wide"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
        {/* Diagonal Stripes Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #f97316 0, #f97316 10px, transparent 10px, transparent 20px)'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto space-y-10">
            <div className="inline-flex items-center space-x-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-bold text-sm uppercase tracking-wide shadow-lg">
              <Flame className="w-5 h-5" />
              <span>#1 Gym Management Platform</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight uppercase">
              Ignite Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Gym's Potential
              </span>
            </h1>

            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-semibold leading-relaxed">
              The most powerful platform to manage members, track performance, 
              and skyrocket your gym's growth. Built for champions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-2xl font-black text-xl uppercase tracking-wide group transform hover:scale-105"
              >
                Start Now
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center bg-white text-gray-900 px-10 py-5 rounded-xl hover:bg-gray-100 transition-all border-4 border-gray-900 font-black text-xl uppercase tracking-wide"
              >
                Watch Demo
              </Link>
            </div>

            {/* Power Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
              {[
                { number: '10k+', label: 'Members', icon: <Target className="w-6 h-6" /> },
                { number: '500+', label: 'Gyms', icon: <Flame className="w-6 h-6" /> },
                { number: '99%', label: 'Uptime', icon: <Zap className="w-6 h-6" /> },
                { number: '24/7', label: 'Support', icon: <TrendingUp className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-orange-500">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stat.number}</div>
                  <div className="text-sm font-bold text-gray-600 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4 uppercase">
              Unstoppable Features
            </h2>
            <p className="text-xl text-gray-600 font-semibold">
              Everything you need to dominate the fitness industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame className="w-10 h-10" />,
                title: "Blazing Fast Check-Ins",
                desc: "Lightning-quick member verification. No more waiting.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: <Target className="w-10 h-10" />,
                title: "Precision Analytics",
                desc: "Hit your targets with data-driven insights.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: "Power Automation",
                desc: "Let the system do the heavy lifting for you.",
                gradient: "from-orange-500 to-yellow-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-orange-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                <h3 className="relative text-2xl font-black text-gray-900 mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 font-semibold">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #f97316 0, #f97316 2px, transparent 2px, transparent 20px)'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Flame className="w-20 h-20 text-orange-500 mx-auto mb-6" />
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 uppercase">
            Join The Elite
          </h2>
          <p className="text-2xl text-gray-300 mb-10 font-bold">
            Over 500 gyms have already made the switch
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-2xl font-black text-2xl uppercase tracking-wide transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="ml-3 w-7 h-7" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t-4 border-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-wide">
            © 2025 PowerGym. Built for Winners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingD_BoldOrange;
