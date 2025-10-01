import React, { useState, useEffect } from 'react';
import Header from './Header';
import VoiceControl from './VoiceControl';
import AlertsSection from './AlertsSection';
import CropDiagnosis from './CropDiagnosis';
import MarketAnalysis from './MarketAnalysis';
import GovernmentSchemes from './GovernmentSchemes';
import QuickActions from './QuickActions';
import Footer from './Footer';
import { ArrowLeft } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { handleVoiceQuery, handleQuickAction, getRealTimeAlerts } from '../services/geminiService';

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

interface MainAppProps {
  onBackToLanding: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onBackToLanding }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Load real-time alerts on component mount (removed automatic refresh interval)
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const realTimeAlerts = await getRealTimeAlerts(selectedLanguage);
        setAlerts(realTimeAlerts);
      } catch (error) {
        console.error('Error loading alerts:', error);
        // Fallback to empty array if API fails
        setAlerts([]);
      }
    };

    loadAlerts();
    // Removed the setInterval to prevent excessive API calls
  }, [selectedLanguage]);

  // Handle voice input
  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, isListening]);

  const handleVoiceInput = async (query: string) => {
    if (!query.trim()) return;
    
    setIsProcessingVoice(true);
    setVoiceResponse(null);

    try {
      const response = await handleVoiceQuery(query, selectedLanguage);
      setVoiceResponse(response);
      
      // Text-to-speech for response
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
      const errorMessage = selectedLanguage === 'en' 
        ? 'Error processing your question. Please try again.'
        : 'आपके सवाल का जवाब देने में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setVoiceResponse(errorMessage);
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

  const handleQuickActionClick = async (action: string) => {
    setIsProcessingVoice(true);
    setVoiceResponse(null);

    try {
      const response = await handleQuickAction(action, selectedLanguage);
      setVoiceResponse(response);
      
      // Text-to-speech for response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 
                        selectedLanguage === 'mr' ? 'mr-IN' :
                        selectedLanguage === 'gu' ? 'gu-IN' :
                        selectedLanguage === 'pa' ? 'pa-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error handling quick action:', error);
      const errorMessage = selectedLanguage === 'en' 
        ? 'Error retrieving information. Please try again.'
        : 'जानकारी प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setVoiceResponse(errorMessage);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      aiResponse: {
        en: 'AI Assistant Response:',
        hi: 'AI सहायक का जवाब:',
        mr: 'AI सहाय्यकाचे उत्तर:',
        gu: 'AI સહાયકનો જવાબ:',
        pa: 'AI ਸਹਾਇਕ ਦਾ ਜਵਾਬ:'
      },
      youAreSaying: {
        en: 'You are saying:',
        hi: 'आप कह रहे हैं:',
        mr: 'तुम्ही म्हणत आहात:',
        gu: 'તમે કહી રહ્યા છો:',
        pa: 'ਤੁਸੀਂ ਕਹਿ ਰਹੇ ਹੋ:'
      },
      browserNotSupported: {
        en: 'Your browser does not support voice recognition. Please use Chrome or Firefox.',
        hi: 'आपका ब्राउज़र वॉइस रिकॉग्निशन को सपोर्ट नहीं करता। कृपया Chrome या Firefox का उपयोग करें।',
        mr: 'तुमचा ब्राउझर व्हॉइस रिकॉग्निशनला सपोर्ट करत नाही. कृपया Chrome किंवा Firefox वापरा.',
        gu: 'તમારું બ્રાઉઝર વૉઇસ રિકગ્નિશનને સપોર્ટ કરતું નથી. કૃપા કરીને Chrome અથવા Firefox નો ઉપયોગ કરો.',
        pa: 'ਤੁਹਾਡਾ ਬ੍ਰਾਊਜ਼ਰ ਵੌਇਸ ਰਿਕਗਨਿਸ਼ਨ ਨੂੰ ਸਪੋਰਟ ਨਹੀਂ ਕਰਦਾ। ਕਿਰਪਾ ਕਰਕੇ Chrome ਜਾਂ Firefox ਦੀ ਵਰਤੋਂ ਕਰੋ।'
      },
      backToHome: {
        en: 'Back to Home',
        hi: 'होम पर वापस',
        mr: 'होमवर परत',
        gu: 'હોમ પર પાછા',
        pa: 'ਘਰ ਵਾਪਸ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <Header 
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Back to Landing Button */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{getLocalizedText('backToHome')}</span>
          </button>
        </div>
      </div>

      <VoiceControl 
        isListening={isListening || isProcessingVoice}
        onToggle={handleVoiceToggle}
        selectedLanguage={selectedLanguage}
      />

      {/* Voice Response Display */}
      {voiceResponse && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800 mb-2">{getLocalizedText('aiResponse')}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{voiceResponse}</p>
          </div>
        </div>
      )}

      {/* Current transcript display */}
      {transcript && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>{getLocalizedText('youAreSaying')}</strong> {transcript}
            </p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlertsSection alerts={alerts} selectedLanguage={selectedLanguage} />

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <CropDiagnosis selectedLanguage={selectedLanguage} />
          <MarketAnalysis selectedLanguage={selectedLanguage} />
          <GovernmentSchemes selectedLanguage={selectedLanguage} />
        </div>

        <QuickActions onActionClick={handleQuickActionClick} selectedLanguage={selectedLanguage} />
      </main>

      <Footer selectedLanguage={selectedLanguage} />

      {/* Browser support warning */}
      {!browserSupportsSpeechRecognition && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg">
          <p className="text-sm">
            {getLocalizedText('browserNotSupported')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MainApp;