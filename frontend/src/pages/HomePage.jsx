import { Link } from 'react-router-dom';
import { 
  Dumbbell, Heart, Users, Clock, TrendingUp, Award,
  CheckCircle, ArrowRight, LogIn, UserPlus, MapPin, Phone, Mail
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "State-of-the-Art Equipment",
      description: "Latest fitness equipment from top brands to help you reach your goals",
      color: "green"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Trainers",
      description: "Certified personal trainers ready to guide your fitness journey",
      color: "emerald"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Access",
      description: "Work out on your schedule with round-the-clock gym access",
      color: "teal"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Group Classes",
      description: "Yoga, Spinning, HIIT, Zumba and more - find your perfect class",
      color: "green"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Modern Facilities",
      description: "Clean locker rooms, showers, and premium amenities",
      color: "emerald"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your workouts and achievements through your member portal",
      color: "teal"
    }
  ];

  const membershipPlans = [
    {
      name: "Day Pass",
      price: "$5",
      period: "per day",
      features: [
        "Full gym access",
        "All equipment available",
        "Locker room access",
        "Valid for 24 hours"
      ],
      color: "from-gray-400 to-gray-500",
      popular: false
    },
    {
      name: "Monthly",
      price: "$30",
      period: "per month",
      features: [
        "Unlimited gym access",
        "All group classes",
        "Free fitness assessment",
        "Member portal access",
        "Guest passes (2/month)"
      ],
      color: "from-green-400 to-emerald-500",
      popular: true
    },
    {
      name: "Annual",
      price: "$299",
      period: "per year",
      features: [
        "Everything in Monthly",
        "2 months free",
        "Priority class booking",
        "Personal trainer discount",
        "Free gym merchandise",
        "Unlimited guest passes"
      ],
      color: "from-emerald-400 to-teal-500",
      popular: false
    }
  ];

  const classes = [
    { name: "Yoga", time: "Mon, Wed, Fri - 7:00 AM", trainer: "Sarah M." },
    { name: "HIIT Training", time: "Tue, Thu - 6:00 PM", trainer: "Mike R." },
    { name: "Spinning", time: "Mon, Wed - 6:30 PM", trainer: "Jessica L." },
    { name: "Zumba", time: "Sat - 10:00 AM", trainer: "Maria S." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b-2 border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Vital<span className="text-green-500">Fit</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Features
              </a>
              <a href="#membership" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Membership
              </a>
              <a href="#classes" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Classes
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Member Login</span>
              </Link>
              <Link 
                to="/register"
                className="flex items-center space-x-2 px-6 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Now</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Heart className="w-4 h-4" />
                <span>Your Local Fitness Community</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Transform Your
                <span className="block text-green-500">
                  Body & Mind
                </span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                Join VitalFit today and discover a state-of-the-art fitness center 
                with expert trainers, premium equipment, and a supportive community 
                dedicated to your success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl font-bold text-lg group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#membership"
                  className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-bold text-lg"
                >
                  View Pricing
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 font-medium">No signup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 font-medium">Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 font-medium">Free trial day</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100 transform hover:scale-105 transition-transform">
                <div className="space-y-6">
                  {/* Active Members */}
                  <div className="flex items-center justify-between p-6 bg-green-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Active Members</div>
                        <div className="text-3xl font-bold text-gray-900">1,234+</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full">
                      Growing
                    </div>
                  </div>

                  {/* Classes Weekly */}
                  <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Classes Weekly</div>
                        <div className="text-3xl font-bold text-gray-900">50+</div>
                      </div>
                    </div>
                    <div className="text-emerald-600 font-semibold text-sm bg-emerald-100 px-3 py-1 rounded-full">
                      Variety
                    </div>
                  </div>

                  {/* Years in Business */}
                  <div className="flex items-center justify-between p-6 bg-teal-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Years Experience</div>
                        <div className="text-3xl font-bold text-gray-900">15+</div>
                      </div>
                    </div>
                    <div className="text-teal-600 font-semibold text-sm bg-teal-100 px-3 py-1 rounded-full">
                      Trusted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VitalFit?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to achieve your fitness goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="membership" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {membershipPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white p-8 rounded-3xl shadow-xl border-4 transition-all ${
                  plan.popular 
                    ? 'border-green-400 transform scale-105' 
                    : 'border-green-100 hover:border-green-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-1">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-600">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/register"
                  className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                    plan.popular
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            All plans include access to locker rooms, showers, and Wi-Fi
          </p>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Classes
            </h2>
            <p className="text-xl text-gray-600">
              Join our energizing group fitness classes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {classes.map((classItem, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 hover:border-green-300 transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {classItem.time}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <Users className="w-4 h-4 inline mr-1" />
                    Instructor: {classItem.trainer}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/register"
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span>View full schedule</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-green-50 mb-8">
            Join VitalFit today and get your first day FREE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center justify-center bg-white text-green-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition-all shadow-2xl font-bold text-lg"
            >
              Join Now
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center bg-green-700 text-white px-10 py-5 rounded-xl hover:bg-green-800 transition-all border-2 border-white font-bold text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo Column */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  Vital<span className="text-green-400">Fit</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Your local fitness community dedicated to helping you achieve 
                your health and wellness goals.
              </p>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>123 Fitness Ave, Your City, ST 12345</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>info@vitalfit.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#membership" className="hover:text-green-400 transition-colors">Membership</a></li>
                <li><a href="#classes" className="hover:text-green-400 transition-colors">Classes</a></li>
                <li><Link to="/login" className="hover:text-green-400 transition-colors">Member Login</Link></li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-bold mb-4">Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 24 Hours</li>
                <li>Saturday - Sunday: 24 Hours</li>
                <li className="text-green-400 font-semibold">Open 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 VitalFit Gym. All rights reserved. Your fitness, our passion.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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

export default HomePage;
