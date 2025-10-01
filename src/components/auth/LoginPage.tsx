import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Leaf, ArrowLeft, Loader } from 'lucide-react';
import { signIn } from '../../config/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onBackToLanding: () => void;
  onSwitchToSignup: () => void;
  selectedLanguage: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onBackToLanding, 
  onSwitchToSignup, 
  selectedLanguage 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      welcome: {
        en: 'Welcome Back',
        hi: 'वापस स्वागत है',
        mr: 'परत स्वागत आहे',
        gu: 'પાછા સ્વાગત છે',
        pa: 'ਵਾਪਸ ਸਵਾਗਤ ਹੈ'
      },
      subtitle: {
        en: 'Sign in to your KISAN account',
        hi: 'अपने KISAN खाते में साइन इन करें',
        mr: 'तुमच्या KISAN खात्यात साइन इन करा',
        gu: 'તમારા KISAN એકાઉન્ટમાં સાઇન ઇન કરો',
        pa: 'ਆਪਣੇ KISAN ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ'
      },
      email: {
        en: 'Email Address',
        hi: 'ईमेल पता',
        mr: 'ईमेल पत्ता',
        gu: 'ઈમેઈલ સરનામું',
        pa: 'ਈਮੇਲ ਪਤਾ'
      },
      password: {
        en: 'Password',
        hi: 'पासवर्ड',
        mr: 'पासवर्ड',
        gu: 'પાસવર્ડ',
        pa: 'ਪਾਸਵਰਡ'
      },
      signIn: {
        en: 'Sign In',
        hi: 'साइन इन करें',
        mr: 'साइन इन करा',
        gu: 'સાઇન ઇન કરો',
        pa: 'ਸਾਈਨ ਇਨ ਕਰੋ'
      },
      noAccount: {
        en: "Don't have an account?",
        hi: 'खाता नहीं है?',
        mr: 'खाते नाही?',
        gu: 'એકાઉન્ટ નથી?',
        pa: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?'
      },
      signUp: {
        en: 'Sign Up',
        hi: 'साइन अप करें',
        mr: 'साइन अप करा',
        gu: 'સાઇન અપ કરો',
        pa: 'ਸਾਈਨ ਅਪ ਕਰੋ'
      },
      backToHome: {
        en: 'Back to Home',
        hi: 'होम पर वापस',
        mr: 'होमवर परत',
        gu: 'હોમ પર પાછા',
        pa: 'ਘਰ ਵਾਪਸ'
      },
      emailNotConfirmed: {
        en: 'Please check your email and click the confirmation link to verify your account before signing in.',
        hi: 'साइन इन करने से पहले कृपया अपना ईमेल चेक करें और अपने खाते को सत्यापित करने के लिए पुष्टिकरण लिंक पर क्लिक करें।',
        mr: 'साइन इन करण्यापूर्वी कृपया तुमचा ईमेल तपासा आणि तुमचे खाते सत्यापित करण्यासाठी पुष्टीकरण दुव्यावर क्लिक करा.',
        gu: 'સાઈન ઈન કરતા પહેલા કૃપા કરીને તમારો ઈમેઈલ તપાસો અને તમારા એકાઉન્ટને ચકાસવા માટે પુષ્ટિકરણ લિંક પર ક્લિક કરો.',
        pa: 'ਸਾਈਨ ਇਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਈਮੇਲ ਚੈੱਕ ਕਰੋ ਅਤੇ ਆਪਣੇ ਖਾਤੇ ਨੂੰ ਸਤਿਆਪਿਤ ਕਰਨ ਲਈ ਪੁਸ਼ਟੀਕਰਨ ਲਿੰਕ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Handle specific email confirmation error
        if (error.message === 'Email not confirmed') {
          setError(getLocalizedText('emailNotConfirmed'));
        } else {
          setError(error.message);
        }
      } else if (data.user) {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-yellow-500/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">{getLocalizedText('backToHome')}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-3xl shadow-2xl">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-2">
              {getLocalizedText('welcome')}
            </h1>
            <p className="text-gray-600 text-lg">
              {getLocalizedText('subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {getLocalizedText('email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    placeholder="farmer@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {getLocalizedText('password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-4 px-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <span>{getLocalizedText('signIn')}</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {getLocalizedText('noAccount')}{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  {getLocalizedText('signUp')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;