import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, LogOut, Users, CreditCard, DollarSign, Activity, 
  Plus, Loader, AlertCircle, CheckCircle 
} from 'lucide-react';
import { membershipAPI } from '../services/api';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    durationDays: '',
    price: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await membershipAPI.getPlans();
      setPlans(response.data);
    } catch (err) {
      setError('Failed to load plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setError('');
    setCreateSuccess('');

    try {
      await membershipAPI.createPlan({
        name: newPlan.name,
        description: newPlan.description,
        durationDays: parseInt(newPlan.durationDays),
        price: parseFloat(newPlan.price),
      });
      
      setCreateSuccess('Membership plan created successfully!');
      setNewPlan({ name: '', description: '', durationDays: '', price: '' });
      setShowCreatePlan(false);
      fetchPlans(); // Refresh list
      
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create plan');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
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
                <p className="text-sm text-gray-600">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/checkin')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
              >
                Check-in Portal
              </button>
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
            Admin Dashboard 🎯
          </h2>
          <p className="text-gray-600">Manage your gym operations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {createSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{createSuccess}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Members</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">--</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Plans</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{plans.length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-teal-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Today's Check-ins</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">--</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">--</p>
          </div>
        </div>

        {/* Membership Plans */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">Membership Plans</h3>
            </div>
            
            <button
              onClick={() => setShowCreatePlan(!showCreatePlan)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>

          {/* Create Plan Form */}
          {showCreatePlan && (
            <form onSubmit={handleCreatePlan} className="mb-8 p-6 bg-green-50 rounded-2xl border-2 border-green-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Create New Plan</h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., Monthly Membership"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    value={newPlan.durationDays}
                    onChange={(e) => setNewPlan({ ...newPlan, durationDays: e.target.value })}
                    required
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="Full gym access for 30 days"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="50.00"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePlan(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Plans List */}
          {plans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-bold text-gray-900">{plan.duration_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-bold text-green-600">${plan.price}</span>
                    </div>
                  </div>
                  
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {plan.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No membership plans yet</p>
              <p className="text-sm text-gray-500 mt-2">Create your first plan to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
