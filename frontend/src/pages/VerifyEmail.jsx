import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Heart, Mail, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  const email = location.state?.email || localStorage.getItem('verificationEmail');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.verifyEmail({ email, code });
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('verificationEmail');
        navigate('/login', { state: { message: 'Email verified! Please login.' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    setError('');
    setResendLoading(true);

    try {
      await authAPI.resendCode({ email });
      setResendMessage('New verification code sent! Check your console/email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Verification Card */}
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4 shadow-lg">
            <Mail className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mt-2">
            We sent a 5-digit code to <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-100">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h3>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {resendMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{resendMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-center text-2xl font-bold tracking-widest"
                    placeholder="12345"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Check your server console for the code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 5}
                  className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Email</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : "Didn't receive the code? Resend"}
                </button>
                
                <p className="text-sm text-gray-600">
                  <Link to="/register" className="text-green-600 hover:text-green-700 transition-colors">
                    Use a different email
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default VerifyEmail;
