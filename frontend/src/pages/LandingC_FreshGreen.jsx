import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Activity, Award, Calendar } from 'lucide-react';

const LandingC_FreshGreen = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Vital<span className="text-green-500">Fit</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-green-500 text-white px-6 py-2.5 rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Activity className="w-4 h-4" />
                <span>Your Health, Our Priority</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Transform Your
                <span className="block text-green-500">
                  Fitness Journey
                </span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                Complete gym management made simple. Track memberships, monitor progress, 
                and create a thriving fitness community with our all-in-one platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:shadow-xl font-bold text-lg group"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition-all border-2 border-gray-200 font-bold text-lg"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600 font-medium">Award Winning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-600 font-medium">Trusted by 1000+ Gyms</span>
                </div>
              </div>
            </div>

            {/* Hero Image Alternative - Stats Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Total Check-ins</div>
                        <div className="text-3xl font-bold text-gray-900">2,847</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full">
                      +12.5%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Active Members</div>
                        <div className="text-3xl font-bold text-gray-900">1,234</div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-semibold text-sm bg-emerald-100 px-3 py-1 rounded-full">
                      +8.2%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Member Satisfaction</div>
                        <div className="text-3xl font-bold text-gray-900">98.5%</div>
                      </div>
                    </div>
                    <div className="text-teal-600 font-semibold text-sm bg-teal-100 px-3 py-1 rounded-full">
                      Excellent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything for Your Success
          </h2>
          <p className="text-xl text-gray-600">
            Powerful tools to grow your fitness business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Heart className="w-7 h-7" />,
              title: "Member Care",
              desc: "Track health goals and progress",
              color: "green"
            },
            {
              icon: <Activity className="w-7 h-7" />,
              title: "Live Dashboard",
              desc: "Real-time insights and metrics",
              color: "emerald"
            },
            {
              icon: <Calendar className="w-7 h-7" />,
              title: "Easy Scheduling",
              desc: "Manage classes and bookings",
              color: "teal"
            },
            {
              icon: <Award className="w-7 h-7" />,
              title: "Reward Programs",
              desc: "Keep members motivated",
              color: "green"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-green-300"
            >
              <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-4 text-${feature.color}-600 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Grow Your Gym?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Start your 30-day free trial. No credit card required.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center bg-white text-green-600 px-10 py-5 rounded-full hover:bg-gray-50 transition-all shadow-2xl font-bold text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2025 VitalFit. Empowering fitness communities worldwide.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingC_FreshGreen;
