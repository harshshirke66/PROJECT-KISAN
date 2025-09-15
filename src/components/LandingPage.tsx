import React, { useState } from 'react';
import { 
  Leaf, 
  Camera, 
  TrendingUp, 
  FileText, 
  Mic, 
  Shield, 
  Users, 
  Award,
  ChevronRight,
  Play,
  Star,
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Sprout,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      heroTitle: {
        en: 'Your AI-Powered Farming Assistant',
        hi: 'आपका AI-संचालित कृषि सहायक',
        mr: 'तुमचा AI-चालित कृषी सहायक',
        gu: 'તમારો AI-સંચાલિત કૃષિ સહાયક',
        pa: 'ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਹਾਇਕ'
      },
      heroSubtitle: {
        en: 'Revolutionizing Indian agriculture with intelligent crop diagnosis, real-time market prices, and personalized farming guidance',
        hi: 'बुद्धिमान फसल निदान, वास्तविक समय बाजार मूल्य, और व्यक्तिगत कृषि मार्गदर्शन के साथ भारतीय कृषि में क्रांति',
        mr: 'बुद्धिमान पीक निदान, रिअल-टाइम बाजार किंमती आणि वैयक्तिक शेती मार्गदर्शनासह भारतीय शेतीमध्ये क्रांती',
        gu: 'બુદ્ધિશાળી પાક નિદાન, રીઅલ-ટાઇમ બજાર ભાવ અને વ્યક્તિગત ખેતી માર્ગદર્શન સાથે ભારતીય કૃષિમાં ક્રાંતિ',
        pa: 'ਬੁੱਧੀਮਾਨ ਫਸਲ ਨਿਦਾਨ, ਰੀਅਲ-ਟਾਈਮ ਮਾਰਕੀਟ ਰੇਟ ਅਤੇ ਵਿਅਕਤੀਗਤ ਖੇਤੀ ਮਾਰਗਦਰਸ਼ਨ ਨਾਲ ਭਾਰਤੀ ਖੇਤੀ ਵਿੱਚ ਕ੍ਰਾਂਤੀ'
      },
      launchApp: {
        en: 'Launch KISAN Assistant',
        hi: 'KISAN सहायक शुरू करें',
        mr: 'KISAN सहायक सुरू करा',
        gu: 'KISAN સહાયક શરૂ કરો',
        pa: 'KISAN ਸਹਾਇਕ ਸ਼ੁਰੂ ਕਰੋ'
      },
      watchDemo: {
        en: 'Watch Demo',
        hi: 'डेमो देखें',
        mr: 'डेमो पहा',
        gu: 'ડેમો જુઓ',
        pa: 'ਡੈਮੋ ਦੇਖੋ'
      },
      features: {
        en: 'Powerful Features for Modern Farmers',
        hi: 'आधुनिक किसानों के लिए शक्तिशाली सुविधाएं',
        mr: 'आधुनिक शेतकऱ्यांसाठी शक्तिशाली वैशिष्ट्ये',
        gu: 'આધુનિક ખેડૂતો માટે શક્તિશાળી સુવિધાઓ',
        pa: 'ਆਧੁਨਿਕ ਕਿਸਾਨਾਂ ਲਈ ਸ਼ਕਤੀਸ਼ਾਲੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ'
      },
      cropDiagnosis: {
        en: 'AI Crop Diagnosis',
        hi: 'AI फसल निदान',
        mr: 'AI पीक निदान',
        gu: 'AI પાક નિદાન',
        pa: 'AI ਫਸਲ ਨਿਦਾਨ'
      },
      cropDiagnosisDesc: {
        en: 'Instantly identify diseases and pests using advanced AI image recognition',
        hi: 'उन्नत AI छवि पहचान का उपयोग करके तुरंत रोगों और कीटों की पहचान करें',
        mr: 'प्रगत AI प्रतिमा ओळखीचा वापर करून तत्काळ रोग आणि कीटकांची ओळख करा',
        gu: 'અદ્યતન AI ઇમેજ રિકગ્નિશનનો ઉપયોગ કરીને તાત્કાલિક રોગો અને જંતુઓની ઓળખ કરો',
        pa: 'ਉੱਨਤ AI ਚਿੱਤਰ ਪਛਾਣ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਤੁਰੰਤ ਬਿਮਾਰੀਆਂ ਅਤੇ ਕੀੜਿਆਂ ਦੀ ਪਛਾਣ ਕਰੋ'
      },
      marketPrices: {
        en: 'Real-time Market Prices',
        hi: 'वास्तविक समय बाजार मूल्य',
        mr: 'रिअल-टाइम बाजार किंमती',
        gu: 'રીઅલ-ટાઇમ બજાર ભાવ',
        pa: 'ਰੀਅਲ-ਟਾਈਮ ਮਾਰਕੀਟ ਰੇਟ'
      },
      marketPricesDesc: {
        en: 'Get live market rates and price trends for better selling decisions',
        hi: 'बेहतर बिक्री निर्णयों के लिए लाइव बाजार दरें और मूल्य रुझान प्राप्त करें',
        mr: 'चांगल्या विक्री निर्णयांसाठी लाइव्ह बाजार दर आणि किंमत ट्रेंड मिळवा',
        gu: 'વધુ સારા વેચાણ નિર્ણયો માટે લાઇવ બજાર દરો અને ભાવ વલણો મેળવો',
        pa: 'ਬਿਹਤਰ ਵਿਕਰੀ ਫੈਸਲਿਆਂ ਲਈ ਲਾਈਵ ਮਾਰਕੀਟ ਰੇਟ ਅਤੇ ਕੀਮਤ ਰੁਝਾਨ ਪ੍ਰਾਪਤ ਕਰੋ'
      },
      govSchemes: {
        en: 'Government Schemes',
        hi: 'सरकारी योजनाएं',
        mr: 'सरकारी योजना',
        gu: 'સરકારી યોજનાઓ',
        pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ'
      },
      govSchemesDesc: {
        en: 'Stay updated with latest subsidies and government benefits',
        hi: 'नवीनतम सब्सिडी और सरकारी लाभों के साथ अपडेट रहें',
        mr: 'नवीनतम सबसिडी आणि सरकारी फायद्यांसह अपडेट राहा',
        gu: 'નવીનતમ સબસિડી અને સરકારી લાભો સાથે અપડેટ રહો',
        pa: 'ਨਵੀਨਤਮ ਸਬਸਿਡੀ ਅਤੇ ਸਰਕਾਰੀ ਲਾਭਾਂ ਨਾਲ ਅਪਡੇਟ ਰਹੋ'
      },
      voiceAssistant: {
        en: 'Voice Assistant',
        hi: 'वॉइस असिस्टेंट',
        mr: 'व्हॉइस असिस्टंट',
        gu: 'વૉઇસ આસિસ્ટન્ટ',
        pa: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ'
      },
      voiceAssistantDesc: {
        en: 'Ask questions in your local language and get instant answers',
        hi: 'अपनी स्थानीय भाषा में प्रश्न पूछें और तुरंत उत्तर पाएं',
        mr: 'तुमच्या स्थानिक भाषेत प्रश्न विचारा आणि तत्काळ उत्तरे मिळवा',
        gu: 'તમારી સ્થાનિક ભાષામાં પ્રશ્નો પૂછો અને તાત્કાલિક જવાબો મેળવો',
        pa: 'ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਤੁਰੰਤ ਜਵਾਬ ਪਾਓ'
      },
      trustedBy: {
        en: 'Trusted by Farmers Across India',
        hi: 'पूरे भारत के किसानों द्वारा भरोसेमंद',
        mr: 'संपूर्ण भारतातील शेतकऱ्यांचा विश्वास',
        gu: 'સમગ્ર ભારતના ખેડૂતો દ્વારા વિશ્વસનીય',
        pa: 'ਪੂਰੇ ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਦੁਆਰਾ ਭਰੋਸੇਮੰਦ'
      },
      multiLanguage: {
        en: 'Multi-Language Support',
        hi: 'बहु-भाषा समर्थन',
        mr: 'बहु-भाषा समर्थन',
        gu: 'બહુ-ભાષા સપોર્ટ',
        pa: 'ਬਹੁ-ਭਾਸ਼ਾ ਸਹਾਇਤਾ'
      },
      multiLanguageDesc: {
        en: 'Available in Hindi, Marathi, Gujarati, Punjabi and English',
        hi: 'हिंदी, मराठी, गुजराती, पंजाबी और अंग्रेजी में उपलब्ध',
        mr: 'हिंदी, मराठी, गुजराती, पंजाबी आणि इंग्रजीमध्ये उपलब्ध',
        gu: 'હિન્દી, મરાઠી, ગુજરાતી, પંજાબી અને અંગ્રેજીમાં ઉપલબ્ધ',
        pa: 'ਹਿੰਦੀ, ਮਰਾਠੀ, ਗੁਜਰਾਤੀ, ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਉਪਲਬਧ'
      },
      smartTech: {
        en: 'Smart Technology',
        hi: 'स्मार्ट तकनीक',
        mr: 'स्मार्ट तंत्रज्ञान',
        gu: 'સ્માર્ટ ટેકનોલોજી',
        pa: 'ਸਮਾਰਟ ਤਕਨਾਲੋਜੀ'
      },
      smartTechDesc: {
        en: 'Powered by advanced AI and machine learning algorithms',
        hi: 'उन्नत AI और मशीन लर्निंग एल्गोरिदम द्वारा संचालित',
        mr: 'प्रगत AI आणि मशीन लर्निंग अल्गोरिदमद्वारे चालित',
        gu: 'અદ્યતન AI અને મશીન લર્નિંગ અલ્ગોરિધમ દ્વારા સંચાલિત',
        pa: 'ਉੱਨਤ AI ਅਤੇ ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਐਲਗੋਰਿਦਮ ਦੁਆਰਾ ਸੰਚਾਲਿਤ'
      },
      weatherForecast: {
        en: 'Weather Forecast',
        hi: 'मौसम पूर्वानुमान',
        mr: 'हवामान अंदाज',
        gu: 'હવામાન આગાહી',
        pa: 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ'
      },
      weatherForecastDesc: {
        en: '7-day weather forecast with farming recommendations',
        hi: 'कृषि सुझावों के साथ 7-दिन का मौसम पूर्वानुमान',
        mr: 'शेती शिफारसींसह 7-दिवसीय हवामान अंदाज',
        gu: 'ખેતી ભલામણો સાથે 7-દિવસીય હવામાન આગાહી',
        pa: 'ਖੇਤੀ ਸਿਫਾਰਸ਼ਾਂ ਦੇ ਨਾਲ 7-ਦਿਨ ਦੀ ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ'
      },
      cropRecommendations: {
        en: 'Crop Recommendations',
        hi: 'फसल सुझाव',
        mr: 'पीक शिफारसी',
        gu: 'પાક ભલામણો',
        pa: 'ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ'
      },
      cropRecommendationsDesc: {
        en: 'AI-powered crop suggestions based on soil and weather',
        hi: 'मिट्टी और मौसम के आधार पर AI-संचालित फसल सुझाव',
        mr: 'माती आणि हवामानावर आधारित AI-चालित पीक सूचना',
        gu: 'માટી અને હવામાન પર આધારિત AI-સંચાલિત પાક સૂચનાઓ',
        pa: 'ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੇ ਆਧਾਰ \'ਤੇ AI-ਸੰਚਾਲਿਤ ਫਸਲ ਸੁਝਾਅ'
      },
      farmingTips: {
        en: 'Expert Farming Tips',
        hi: 'विशेषज्ञ कृषि सुझाव',
        mr: 'तज्ञ शेती टिप्स',
        gu: 'નિષ્ણાત ખેતી ટિપ્સ',
        pa: 'ਮਾਹਰ ਖੇਤੀ ਟਿੱਪਸ'
      },
      farmingTipsDesc: {
        en: 'Seasonal tips and best practices from agricultural experts',
        hi: 'कृषि विशेषज्ञों से मौसमी सुझाव और सर्वोत्तम प्रथाएं',
        mr: 'कृषी तज्ञांकडून हंगामी टिप्स आणि सर्वोत्तम पद्धती',
        gu: 'કૃષિ નિષ્ણાતો પાસેથી મોસમી ટિપ્સ અને શ્રેષ્ઠ પ્રથાઓ',
        pa: 'ਖੇਤੀ ਮਾਹਰਾਂ ਤੋਂ ਮੌਸਮੀ ਟਿੱਪਸ ਅਤੇ ਸਭ ਤੋਂ ਵਧੀਆ ਅਭਿਆਸ'
      },
      farmAnalytics: {
        en: 'Farm Analytics',
        hi: 'कृषि विश्लेषण',
        mr: 'शेती विश्लेषण',
        gu: 'ખેત વિશ્લેષણ',
        pa: 'ਖੇਤ ਵਿਸ਼ਲੇਸ਼ਣ'
      },
      farmAnalyticsDesc: {
        en: 'Track your farm performance and profitability insights',
        hi: 'अपने खेत के प्रदर्शन और लाभप्रदता की जानकारी ट्रैक करें',
        mr: 'तुमच्या शेताची कामगिरी आणि नफ्याची माहिती ट्रॅक करा',
        gu: 'તમારા ખેતરની કામગીરી અને નફાકારકતાની માહિતી ટ્રૅક કરો',
        pa: 'ਆਪਣੇ ਖੇਤ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਅਤੇ ਮੁਨਾਫੇ ਦੀ ਜਾਣਕਾਰੀ ਨੂੰ ਟਰੈਕ ਕਰੋ'
      },
      getStarted: {
        en: 'Ready to Transform Your Farming?',
        hi: 'अपनी खेती को बदलने के लिए तैयार हैं?',
        mr: 'तुमची शेती बदलण्यासाठी तयार आहात?',
        gu: 'તમારી ખેતીને બદલવા માટે તૈયાર છો?',
        pa: 'ਆਪਣੀ ਖੇਤੀ ਨੂੰ ਬਦਲਣ ਲਈ ਤਿਆਰ ਹੋ?'
      },
      getStartedDesc: {
        en: 'Join thousands of farmers who are already using KISAN to increase their productivity and profits',
        hi: 'हजारों किसानों से जुड़ें जो पहले से ही अपनी उत्पादकता और मुनाफे को बढ़ाने के लिए KISAN का उपयोग कर रहे हैं',
        mr: 'हजारो शेतकऱ्यांसोबत सामील व्हा जे आधीच त्यांची उत्पादकता आणि नफा वाढवण्यासाठी KISAN वापरत आहेत',
        gu: 'હજારો ખેડૂતો સાથે જોડાઓ જેઓ પહેલેથી જ તેમની ઉત્પાદકતા અને નફો વધારવા માટે KISAN નો ઉપયોગ કરી રહ્યા છે',
        pa: 'ਹਜ਼ਾਰਾਂ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ ਜੋ ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਆਪਣੀ ਉਤਪਾਦਕਤਾ ਅਤੇ ਮੁਨਾਫੇ ਨੂੰ ਵਧਾਉਣ ਲਈ KISAN ਦੀ ਵਰਤੋਂ ਕਰ ਰਹੇ ਹਨ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const features = [
    {
      icon: Camera,
      title: getLocalizedText('cropDiagnosis'),
      description: getLocalizedText('cropDiagnosisDesc'),
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: getLocalizedText('marketPrices'),
      description: getLocalizedText('marketPricesDesc'),
      color: 'yellow'
    },
    {
      icon: FileText,
      title: getLocalizedText('govSchemes'),
      description: getLocalizedText('govSchemesDesc'),
      color: 'blue'
    },
    {
      icon: Mic,
      title: getLocalizedText('voiceAssistant'),
      description: getLocalizedText('voiceAssistantDesc'),
      color: 'purple'
    },
    {
      icon: Cloud,
      title: getLocalizedText('weatherForecast'),
      description: getLocalizedText('weatherForecastDesc'),
      color: 'indigo'
    },
    {
      icon: Sprout,
      title: getLocalizedText('cropRecommendations'),
      description: getLocalizedText('cropRecommendationsDesc'),
      color: 'emerald'
    },
    {
      icon: Lightbulb,
      title: getLocalizedText('farmingTips'),
      description: getLocalizedText('farmingTipsDesc'),
      color: 'orange'
    },
    {
      icon: BarChart3,
      title: getLocalizedText('farmAnalytics'),
      description: getLocalizedText('farmAnalyticsDesc'),
      color: 'violet'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: getLocalizedText('multiLanguage'),
      description: getLocalizedText('multiLanguageDesc')
    },
    {
      icon: Brain,
      title: getLocalizedText('smartTech'),
      description: getLocalizedText('smartTechDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  Project KISAN
                </h1>
                <p className="text-xs text-green-600 font-medium hidden sm:block">AI Farming Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-green-50 border border-green-200 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    <span className="hidden sm:inline">{lang.flag} </span>{lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-emerald-500/10 to-yellow-500/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5"></div>
          
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-300 opacity-60"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-700 opacity-60"></div>
          <div className="absolute bottom-20 right-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-1000 opacity-60"></div>
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-60 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-500 opacity-40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-8 sm:pt-12">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-yellow-100 border border-green-200 mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-green-700 font-medium text-sm">
                {selectedLanguage === 'en' ? '🚀 Now Available in 5+ Indian Languages' : '🚀 अब 5+ भारतीय भाषाओं में उपलब्ध'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent drop-shadow-sm">
                Project KISAN
              </span>
              <br />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent font-bold">
                {getLocalizedText('heroTitle')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {getLocalizedText('heroSubtitle')}
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8">
              <button
                onClick={onLaunchApp}
                className="group relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>{getLocalizedText('launchApp')}</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>
              
              <button className="group relative bg-white/90 backdrop-blur-sm text-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 flex items-center space-x-3 overflow-hidden">
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-4 w-4 text-white ml-1" />
                  </div>
                <span>{getLocalizedText('watchDemo')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-32 left-10 animate-bounce delay-300 hidden lg:block">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl shadow-2xl border border-green-200 backdrop-blur-sm">
            <Leaf className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="absolute top-40 right-16 animate-pulse delay-700 hidden lg:block">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl shadow-2xl border border-yellow-200 backdrop-blur-sm">
            <TrendingUp className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce delay-1000 hidden lg:block">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-2xl border border-blue-200 backdrop-blur-sm">
            <Brain className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-1/2 right-10 animate-bounce delay-500 hidden lg:block">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl shadow-2xl border border-purple-200 backdrop-blur-sm">
            <Smartphone className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
              <Smartphone className="h-5 w-5 mr-3" />
              <span className="font-medium">
                {selectedLanguage === 'en' ? 'Download Our Mobile App' : 'हमारा मोबाइल ऐप डाउनलोड करें'}
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {selectedLanguage === 'en' ? 'Project KISAN App' : 'Project KISAN ऐप'}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {selectedLanguage === 'en' 
                ? 'Get the full farming experience on your mobile device. Available for Android and iOS.'
                : 'अपने मोबाइल डिवाइस पर पूरा कृषि अनुभव प्राप्त करें। Android और iOS के लिए उपलब्ध।'
              }
            </p>
          </div>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4 min-w-[200px]">
              <div className="bg-white p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <div className="text-xs opacity-80">
                  {selectedLanguage === 'en' ? 'Download on the' : 'डाउनलोड करें'}
                </div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </button>
            
            <button className="group bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4 min-w-[200px]">
              <div className="bg-white p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <div className="text-xs opacity-80">
                  {selectedLanguage === 'en' ? 'Download on the' : 'डाउनलोड करें'}
                </div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </button>
          </div>
          
          {/* App Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Camera className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">
                {selectedLanguage === 'en' ? 'Instant Diagnosis' : 'तुरंत निदान'}
              </h3>
              <p className="text-sm opacity-90">
                {selectedLanguage === 'en' 
                  ? 'Take photos and get instant crop disease diagnosis'
                  : 'तस्वीर लें और तुरंत फसल रोग निदान पाएं'
                }
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <TrendingUp className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">
                {selectedLanguage === 'en' ? 'Live Market Prices' : 'लाइव बाजार भाव'}
              </h3>
              <p className="text-sm opacity-90">
                {selectedLanguage === 'en' 
                  ? 'Get real-time market prices and trends'
                  : 'रीयल-टाइम बाजार भाव और रुझान पाएं'
                }
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Mic className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">
                {selectedLanguage === 'en' ? 'Voice Assistant' : 'वॉइस असिस्टेंट'}
              </h3>
              <p className="text-sm opacity-90">
                {selectedLanguage === 'en' 
                  ? 'Ask questions in your local language'
                  : 'अपनी स्थानीय भाषा में सवाल पूछें'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {getLocalizedText('features')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-yellow-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100"
                >
                  <div className={`bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {getLocalizedText('trustedBy')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-6 bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl flex-shrink-0">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl">
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-700 font-medium">
                {selectedLanguage === 'en' ? 'Active Farmers' : 'सक्रिय किसान'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-3xl">
              <div className="text-4xl font-bold text-yellow-600 mb-2">95%</div>
              <div className="text-gray-700 font-medium">
                {selectedLanguage === 'en' ? 'Accuracy Rate' : 'सटीकता दर'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">
                {selectedLanguage === 'en' ? 'Support Available' : 'सहायता उपलब्ध'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {getLocalizedText('getStarted')}
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            {getLocalizedText('getStartedDesc')}
          </p>
          
          <button
            onClick={onLaunchApp}
            className="group bg-white text-green-700 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-4 mx-auto"
          >
            <span>{getLocalizedText('launchApp')}</span>
            <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Project KISAN</span>
          </div>
          
          {/* Team Axon Credit */}
          <div className="mb-6">
            <p className="text-lg font-semibold text-green-400 mb-2">
              {selectedLanguage === 'en' ? 'Developed by Team Axon' : 'Team Axon द्वारा विकसित'}
            </p>
            <p className="text-gray-400 text-sm">
              {selectedLanguage === 'en' 
                ? 'Innovative solutions for modern agriculture'
                : 'आधुनिक कृषि के लिए नवाचार समाधान'
              }
            </p>
          </div>
          
          <p className="text-gray-400 mb-4">
            {selectedLanguage === 'en' 
              ? '© 2024 Project KISAN - Empowering Indian Farmers with AI Technology'
              : '© 2024 Project KISAN - AI तकनीक के साथ भारतीय किसानों को सशक्त बनाना'
            }
          </p>
          <p className="text-gray-500 text-sm">
            {selectedLanguage === 'en'
              ? 'Available in all major Indian languages • Designed for Indian farmers'
              : 'सभी प्रमुख भारतीय भाषाओं में उपलब्ध • भारतीय किसानों के लिए डिज़ाइन किया गया'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;