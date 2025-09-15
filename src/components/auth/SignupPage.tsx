import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Leaf, ArrowLeft, Loader } from 'lucide-react';
import { signUp } from '../../config/supabase';

interface SignupPageProps {
  onSignup: () => void;
  onBackToLanding: () => void;
  onSwitchToLogin: () => void;
  selectedLanguage: string;
}

const SignupPage: React.FC<SignupPageProps> = ({ 
  onSignup, 
  onBackToLanding, 
  onSwitchToLogin, 
  selectedLanguage 
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      createAccount: {
        en: 'Create Account',
        hi: 'खाता बनाएं',
        mr: 'खाते तयार करा',
        gu: 'એકાઉન્ટ બનાવો',
        pa: 'ਖਾਤਾ ਬਣਾਓ'
      },
      subtitle: {
        en: 'Join thousands of farmers using KISAN',
        hi: 'KISAN का उपयोग करने वाले हजारों किसानों से जुड़ें',
        mr: 'KISAN वापरणाऱ्या हजारो शेतकऱ्यांसोबत सामील व्हा',
        gu: 'KISAN વાપરતા હજારો ખેડૂતો સાથે જોડાઓ',
        pa: 'KISAN ਵਰਤਣ ਵਾਲੇ ਹਜ਼ਾਰਾਂ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ'
      },
      fullName: {
        en: 'Full Name',
        hi: 'पूरा नाम',
        mr: 'पूर्ण नाव',
        gu: 'પૂરું નામ',
        pa: 'ਪੂਰਾ ਨਾਮ'
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
      confirmPassword: {
        en: 'Confirm Password',
        hi: 'पासवर्ड की पुष्टि करें',
        mr: 'पासवर्डची पुष्टी करा',
        gu: 'પાસવર્ડની પુષ્ટિ કરો',
        pa: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ'
      },
      signUp: {
        en: 'Create Account',
        hi: 'खाता बनाएं',
        mr: 'खाते तयार करा',
        gu: 'એકાઉન્ટ બનાવો',
        pa: 'ਖਾਤਾ ਬਣਾਓ'
      },
      haveAccount: {
        en: 'Already have an account?',
        hi: 'पहले से खाता है?',
        mr: 'आधीच खाते आहे?',
        gu: 'પહેલેથી એકાઉન્ટ છે?',
        pa: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?'
      },
      signIn: {
        en: 'Sign In',
        hi: 'साइन इन करें',
        mr: 'साइन इन करा',
        gu: 'સાઇન ઇન કરો',
        pa: 'ਸਾਈਨ ਇਨ ਕਰੋ'
      },
      backToHome: {
        en: 'Back to Home',
        hi: 'होम पर वापस',
        mr: 'होमवर परत',
        gu: 'હોમ પર પાછા',
        pa: 'ਘਰ ਵਾਪਸ'
      },
      emailConfirmation: {
        en: 'Check Your Email',
        hi: 'अपना ईमेल चेक करें',
        mr: 'तुमचा ईमेल तपासा',
        gu: 'તમારો ઈમેઈલ તપાસો',
        pa: 'ਆਪਣਾ ਈਮੇਲ ਚੈੱਕ ਕਰੋ'
      },
      emailConfirmationMessage: {
        en: 'We\'ve sent a confirmation link to your email address. Please check your email and click the link to verify your account before signing in.',
        hi: 'हमने आपके ईमेल पते पर एक पुष्टिकरण लिंक भेजा है। कृपया साइन इन करने से पहले अपना ईमेल चेक करें और अपने खाते को सत्यापित करने के लिए लिंक पर क्लिक करें।',
        mr: 'आम्ही तुमच्या ईमेल पत्त्यावर एक पुष्टीकरण दुवा पाठवला आहे. कृपया साइन इन करण्यापूर्वी तुमचा ईमेल तपासा आणि तुमचे खाते सत्यापित करण्यासाठी दुव्यावर क्लिक करा.',
        gu: 'અમે તમારા ઈમેઈલ સરનામા પર એક પુષ્ટિકરણ લિંક મોકલ્યો છે. કૃપા કરીને સાઈન ઈન કરતા પહેલા તમારો ઈમેઈલ તપાસો અને તમારા એકાઉન્ટને ચકાસવા માટે લિંક પર ક્લિક કરો.',
        pa: 'ਅਸੀਂ ਤੁਹਾਡੇ ਈਮੇਲ ਪਤੇ \'ਤੇ ਇੱਕ ਪੁਸ਼ਟੀਕਰਨ ਲਿੰਕ ਭੇਜਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ ਇਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣਾ ਈਮੇਲ ਚੈੱਕ ਕਰੋ ਅਤੇ ਆਪਣੇ ਖਾਤੇ ਨੂੰ ਸਤਿਆਪਿਤ ਕਰਨ ਲਈ ਲਿੰਕ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।'
      },
      goToLogin: {
        en: 'Go to Login',
        hi: 'लॉगिन पर जाएं',
        mr: 'लॉगिनवर जा',
        gu: 'લૉગિન પર જાઓ',
        pa: 'ਲਾਗਇਨ \'ਤੇ ਜਾਓ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Always show email confirmation for new signups
        // Supabase requires email confirmation by default
        setShowEmailConfirmation(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  // Show email confirmation screen
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-yellow-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-3xl shadow-2xl">
                  <Mail className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-2">
                {getLocalizedText('emailConfirmation')}
              </h1>
            </div>

            {/* Email Confirmation Message */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-6 rounded-xl mb-6">
                <p className="text-sm leading-relaxed">
                  {getLocalizedText('emailConfirmationMessage')}
                </p>
              </div>

              <button
                onClick={onSwitchToLogin}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-4 px-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {getLocalizedText('goToLogin')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-3xl shadow-2xl">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-2">
              {getLocalizedText('createAccount')}
            </h1>
            <p className="text-gray-600 text-lg">
              {getLocalizedText('subtitle')}
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {getLocalizedText('fullName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    placeholder="Rajesh Kumar"
                    required
                  />
                </div>
              </div>

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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {getLocalizedText('confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50/50 text-gray-900 placeholder-gray-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white py-4 px-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <span>{getLocalizedText('signUp')}</span>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {getLocalizedText('haveAccount')}{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  {getLocalizedText('signIn')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;