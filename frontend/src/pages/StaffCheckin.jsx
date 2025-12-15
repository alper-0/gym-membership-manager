import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, LogOut, Search, CheckCircle, XCircle, 
  Loader, AlertCircle, User, Calendar, Clock, Mail 
} from 'lucide-react';
import { checkinAPI } from '../services/api';

const StaffCheckin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [recentCheckins, setRecentCheckins] = useState([]);

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await checkinAPI.checkIn({ memberEmail: email });
      setResult(response.data);
      
      // Add to recent checkins
      if (response.data.allowed) {
        setRecentCheckins([
          { ...response.data, timestamp: new Date().toISOString() },
          ...recentCheckins.slice(0, 9)
        ]);
      }
      
      // Clear email field on success
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Vital<span className="text-green-500">Fit</span>
                </h1>
                <p className="text-sm text-gray-600">Check-in Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
              
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                >
                  Admin Dashboard
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Member Check-in 🎯
          </h2>
          <p className="text-gray-600">Scan or enter member email to check them in</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Check-in Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
              <form onSubmit={handleCheckin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-gray-900 mb-3">
                    Member Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-lg"
                      placeholder="member@example.com"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-4 rounded-xl hover:bg-green-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      <span>Checking in...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6" />
                      <span>Check In Member</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Check-in Result */}
              {result && (
                <div className={`mt-6 p-6 rounded-2xl border-4 ${
                  result.allowed 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      result.allowed ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {result.allowed ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <XCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 ${
                        result.allowed ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {result.allowed ? 'Access Granted ✓' : 'Access Denied ✗'}
                      </h3>
                      
                      {result.member && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center space-x-2">
                            <User className={`w-4 h-4 ${
                              result.allowed ? 'text-green-700' : 'text-red-700'
                            }`} />
                            <span className={`font-semibold ${
                              result.allowed ? 'text-green-900' : 'text-red-900'
                            }`}>
                              {result.member.first_name} {result.member.last_name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className={`w-4 h-4 ${
                              result.allowed ? 'text-green-700' : 'text-red-700'
                            }`} />
                            <span className={`text-sm ${
                              result.allowed ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {result.member.email}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {result.reason && (
                        <p className={`text-sm font-medium ${
                          result.allowed ? 'text-green-700' : 'text-red-700'
                        }`}>
                          Reason: {result.reason}
                        </p>
                      )}
                      
                      <p className={`text-xs mt-2 ${
                        result.allowed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Enter the member's registered email address</li>
                  <li>• System will automatically verify their subscription</li>
                  <li>• Green = Access Granted, Red = Access Denied</li>
                  <li>• All check-ins are logged for security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Check-ins Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-green-100 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Recent Check-ins</h3>
              </div>

              {recentCheckins.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentCheckins.map((checkin, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        checkin.allowed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {checkin.member?.first_name} {checkin.member?.last_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {checkin.member?.email}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          checkin.allowed ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {checkin.allowed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-3 h-3 ${
                          checkin.allowed ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className={`text-xs ${
                          checkin.allowed ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {new Date(checkin.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">No check-ins yet today</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Check in your first member to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffCheckin;
