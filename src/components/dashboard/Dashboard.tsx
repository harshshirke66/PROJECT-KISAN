import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Camera,
  FileText,
  Mic,
  RefreshCw,
  Sprout,
  Lightbulb
} from 'lucide-react';
import { signOut, getCurrentUser } from '../../config/supabase';
import CropDiagnosis from '../CropDiagnosis';
import MarketAnalysis from '../MarketAnalysis';
import GovernmentSchemes from '../GovernmentSchemes';
import WeatherForecast from '../WeatherForecast';
import CropRecommendations from '../CropRecommendations';
import FarmingTips from '../FarmingTips';
import VoiceControl from '../VoiceControl';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { handleVoiceQuery, handleQuickAction, getRealTimeAlerts } from '../../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, selectedLanguage, setSelectedLanguage }) => {
  const [user, setUser] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  useEffect(() => {
    loadUser();
    loadAlerts();
  }, [selectedLanguage]);

  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, isListening]);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const loadAlerts = async () => {
    try {
      const realTimeAlerts = await getRealTimeAlerts(selectedLanguage);
      setAlerts(realTimeAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    }
  };

  const handleVoiceInput = async (query: string) => {
    if (!query.trim()) return;
    
    setIsProcessingVoice(true);
    setVoiceResponse(null);

    try {
      const response = await handleVoiceQuery(query, selectedLanguage);
      setVoiceResponse(response);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 
                        selectedLanguage === 'mr' ? 'mr-IN' :
                        selectedLanguage === 'gu' ? 'gu-IN' :
                        selectedLanguage === 'pa' ? 'pa-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      dashboard: {
        en: 'Dashboard',
        hi: 'डैशबोर्ड',
        mr: 'डॅशबोर्ड',
        gu: 'ડેશબોર્ડ',
        pa: 'ਡੈਸ਼ਬੋਰਡ'
      },
      welcome: {
        en: 'Welcome back',
        hi: 'वापस स्वागत है',
        mr: 'परत स्वागत आहे',
        gu: 'પાછા સ્વાગત છે',
        pa: 'ਵਾਪਸ ਸਵਾਗਤ ਹੈ'
      },
      overview: {
        en: 'Overview',
        hi: 'अवलोकन',
        mr: 'अवलोकन',
        gu: 'વિહંગાવલોકન',
        pa: 'ਸੰਖੇਪ'
      },
      cropHealth: {
        en: 'Crop Health',
        hi: 'फसल स्वास्थ्य',
        mr: 'पीक आरोग्य',
        gu: 'પાક આરોગ્ય',
        pa: 'ਫਸਲ ਸਿਹਤ'
      },
      marketPrices: {
        en: 'Market Prices',
        hi: 'बाजार भाव',
        mr: 'बाजार भाव',
        gu: 'બજાર ભાવ',
        pa: 'ਮਾਰਕੀਟ ਰੇਟ'
      },
      schemes: {
        en: 'Gov. Schemes',
        hi: 'सरकारी योजनाएं',
        mr: 'सरकारी योजना',
        gu: 'સરકારી યોજનાઓ',
        pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ'
      },
      totalCrops: {
        en: 'Total Crops',
        hi: 'कुल फसलें',
        mr: 'एकूण पिके',
        gu: 'કુલ પાકો',
        pa: 'ਕੁੱਲ ਫਸਲਾਂ'
      },
      healthyCrops: {
        en: 'Healthy Crops',
        hi: 'स्वस्थ फसलें',
        mr: 'निरोगी पिके',
        gu: 'તંદુરસ્ત પાકો',
        pa: 'ਸਿਹਤਮੰਦ ਫਸਲਾਂ'
      },
      monthlyRevenue: {
        en: 'Monthly Revenue',
        hi: 'मासिक आय',
        mr: 'मासिक उत्पन्न',
        gu: 'માસિક આવક',
        pa: 'ਮਾਸਿਕ ਆਮਦਨ'
      },
      activeAlerts: {
        en: 'Active Alerts',
        hi: 'सक्रिय अलर्ट',
        mr: 'सक्रिय अलर्ट',
        gu: 'સક્રિય અલર્ટ',
        pa: 'ਸਰਗਰਮ ਅਲਰਟ'
      },
      recentAlerts: {
        en: 'Recent Alerts',
        hi: 'हाल की अलर्ट',
        mr: 'अलीकडील अलर्ट',
        gu: 'તાજેતરની અલર્ટ',
        pa: 'ਹਾਲ ਦੇ ਅਲਰਟ'
      },
      quickActions: {
        en: 'Quick Actions',
        hi: 'त्वरित कार्य',
        mr: 'त्वरित कृती',
        gu: 'ઝડપી ક્રિયાઓ',
        pa: 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ'
      },
      cropDiagnosis: {
        en: 'Crop Diagnosis',
        hi: 'फसल निदान',
        mr: 'पीक निदान',
        gu: 'પાક નિદાન',
        pa: 'ਫਸਲ ਨਿਦਾਨ'
      },
      voiceAssistant: {
        en: 'Voice Assistant',
        hi: 'वॉइस असिस्टेंट',
        mr: 'व्हॉइस असिस्टंट',
        gu: 'વૉઇસ આસિસ્ટન્ટ',
        pa: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ'
      },
      checkWeather: {
        en: 'Check Weather',
        hi: 'मौसम देखें',
        mr: 'हवामान पहा',
        gu: 'હવામાન જુઓ',
        pa: 'ਮੌਸਮ ਦੇਖੋ'
      },
      recommendations: {
        en: 'Recommendations',
        hi: 'सुझाव',
        mr: 'शिफारसी',
        gu: 'ભલામણો',
        pa: 'ਸਿਫਾਰਸ਼ਾਂ'
      },
      tips: {
        en: 'Tips',
        hi: 'सुझाव',
        mr: 'टिप्स',
        gu: 'ટિપ્સ',
        pa: 'ਟਿੱਪਸ'
      },
      viewReports: {
        en: 'View Reports',
        hi: 'रिपोर्ट देखें',
        mr: 'अहवाल पहा',
        gu: 'રિપોર્ટ જુઓ',
        pa: 'ਰਿਪੋਰਟਾਂ ਦੇਖੋ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const stats = [
    {
      title: getLocalizedText('totalCrops'),
      value: '12',
      icon: Leaf,
      color: 'green',
      change: '+2 this month'
    },
    {
      title: getLocalizedText('healthyCrops'),
      value: '10',
      icon: TrendingUp,
      color: 'emerald',
      change: '83% healthy'
    },
    {
      title: getLocalizedText('monthlyRevenue'),
      value: '₹45,000',
      icon: DollarSign,
      color: 'yellow',
      change: '+12% from last month'
    },
    {
      title: getLocalizedText('activeAlerts'),
      value: alerts.length.toString(),
      icon: AlertTriangle,
      color: 'red',
      change: 'Needs attention'
    }
  ];

  const quickActions = [
    {
      title: getLocalizedText('cropDiagnosis'),
      icon: Camera,
      color: 'blue',
      action: () => setActiveTab('diagnosis')
    },
    {
      title: getLocalizedText('voiceAssistant'),
      icon: Mic,
      color: 'purple',
      action: handleVoiceToggle
    },
    {
      title: getLocalizedText('checkWeather'),
      icon: Calendar,
      color: 'orange',
      action: () => handleQuickAction('weather')
    },
    {
      title: getLocalizedText('viewReports'),
      icon: FileText,
      color: 'indigo',
      action: () => handleQuickAction('reports')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Project KISAN</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{getLocalizedText('dashboard')}</p>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Selector */}
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    <span className="hidden sm:inline">{lang.flag} </span>{lang.name}
                  </option>
                ))}
              </select>

              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || 'Farmer'}
                  </p>
                  <p className="text-xs text-gray-600">{getLocalizedText('welcome')}</p>
                </div>
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-full">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Voice Control */}
      <VoiceControl 
        isListening={isListening || isProcessingVoice}
        onToggle={handleVoiceToggle}
        selectedLanguage={selectedLanguage}
      />

      {/* Voice Response Display */}
      {voiceResponse && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800 mb-2">AI Assistant Response:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{voiceResponse}</p>
          </div>
        </div>
      )}

      {/* Current transcript display */}
      {transcript && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>You are saying:</strong> {transcript}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: getLocalizedText('overview'), icon: BarChart3 },
              { id: 'diagnosis', label: getLocalizedText('cropHealth'), icon: Leaf },
              { id: 'market', label: getLocalizedText('marketPrices'), icon: TrendingUp },
              { id: 'schemes', label: getLocalizedText('schemes'), icon: FileText },
              { id: 'weather', label: getLocalizedText('weather'), icon: Calendar },
              { id: 'recommendations', label: getLocalizedText('recommendations'), icon: Sprout },
              { id: 'tips', label: getLocalizedText('tips'), icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Recent Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{getLocalizedText('recentAlerts')}</h2>
                <button
                  onClick={loadAlerts}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Refresh</span>
                </button>
              </div>
              <div className="space-y-3">
                {alerts.length > 0 ? (
                  alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.severity === 'high' 
                          ? 'bg-red-50 border-red-400' 
                          : alert.severity === 'medium'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-green-50 border-green-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No alerts at the moment</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">{getLocalizedText('quickActions')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`flex flex-col items-center space-y-2 sm:space-y-3 p-4 sm:p-6 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-colors group`}
                    >
                      <div className={`bg-${action.color}-100 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${action.color}-600`} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-tight">{action.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnosis' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <CropDiagnosis selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <MarketAnalysis selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <GovernmentSchemes selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <WeatherForecast selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <CropRecommendations selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <FarmingTips selectedLanguage={selectedLanguage} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-2xl mx-auto mt-4 sm:mt-0">
            <FarmAnalytics selectedLanguage={selectedLanguage} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;