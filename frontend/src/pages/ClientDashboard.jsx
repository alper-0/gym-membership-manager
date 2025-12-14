import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, LogOut, User, CreditCard, Calendar, Clock, 
  TrendingUp, Activity, Loader, AlertCircle 
} from 'lucide-react';
import { membershipAPI, checkinAPI } from '../services/api';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [subscription, setSubscription] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [subResponse, checkinsResponse] = await Promise.all([
        membershipAPI.getMySubscription(),
        checkinAPI.getMyCheckins()
      ]);
      
      setSubscription(subResponse.data);
      setCheckins(checkinsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDaysRemaining = () => {
    if (!subscription?.end_date) return 0;
    const end = new Date(subscription.end_date);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'expired': return 'bg-red-100 text-red-700 border-red-300';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">Member Portal</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.profile?.first_name || 'Member'}! 👋
          </h2>
          <p className="text-gray-600">Here's your fitness journey overview</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">{checkins.length}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Check-ins</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {subscription?.status === 'active' ? getDaysRemaining() : 0}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Days Remaining</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-teal-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(subscription?.status || 'inactive')}`}>
                {subscription?.status?.toUpperCase() || 'NO PLAN'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Membership Status</h3>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Your Membership</h3>
          </div>

          {subscription && subscription.plan_name ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">Plan</span>
                <span className="text-xl font-bold text-gray-900">{subscription.plan_name}</span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">Duration</span>
                <span className="text-xl font-bold text-gray-900">{subscription.duration_days} days</span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">Start Date</span>
                <span className="text-xl font-bold text-gray-900">
                  {new Date(subscription.start_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">End Date</span>
                <span className="text-xl font-bold text-gray-900">
                  {new Date(subscription.end_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Price</span>
                <span className="text-2xl font-bold text-green-600">${subscription.price}</span>
              </div>

              {subscription.status === 'active' && getDaysRemaining() <= 7 && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <p className="text-sm text-yellow-700 font-medium">
                    ⚠️ Your membership expires in {getDaysRemaining()} days. Contact the gym to renew!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">You don't have an active membership</p>
              <p className="text-sm text-gray-500">Contact the gym to purchase a membership plan</p>
            </div>
          )}
        </div>

        {/* Check-in History */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Recent Check-ins</h3>
          </div>

          {checkins.length > 0 ? (
            <div className="space-y-3">
              {checkins.slice(0, 10).map((checkin) => (
                <div 
                  key={checkin.id}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(checkin.check_in_time).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(checkin.check_in_time).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    checkin.status === 'allowed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {checkin.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No check-ins yet</p>
              <p className="text-sm text-gray-500 mt-2">Visit the gym to start tracking your fitness journey!</p>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">Full Name</label>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {user?.profile?.first_name} {user?.profile?.last_name}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">Email</label>
              <p className="text-lg font-bold text-gray-900 mt-1">{user?.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">Phone</label>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {user?.profile?.phone || 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase">Member Since</label>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {new Date(user?.profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
