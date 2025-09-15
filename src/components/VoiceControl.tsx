import React from 'react';
import { Mic, Pause } from 'lucide-react';

interface VoiceControlProps {
  isListening: boolean;
  onToggle: () => void;
  selectedLanguage: string;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ isListening, onToggle, selectedLanguage }) => {
  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      listening: {
        en: 'Listening...',
        hi: 'सुन रहा हूं...',
        mr: 'ऐकत आहे...',
        gu: 'સાંભળી રહ્યું છું...',
        pa: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...'
      },
      askByVoice: {
        en: 'Ask by Voice',
        hi: 'बोलकर पूछें',
        mr: 'आवाजाने विचारा',
        gu: 'અવાજથી પૂછો',
        pa: 'ਆਵਾਜ਼ ਨਾਲ ਪੁੱਛੋ'
      },
      helpMessage: {
        en: 'Ask anything - I\'m here to help',
        hi: 'कुछ भी पूछें - मैं यहां हूं मदद के लिए',
        mr: 'काहीही विचारा - मी मदतीसाठी येथे आहे',
        gu: 'કંઈપણ પૂછો - હું મદદ માટે અહીં છું',
        pa: 'ਕੁਝ ਵੀ ਪੁੱਛੋ - ਮੈਂ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ'
      },
      listeningMessage: {
        en: 'Listening to your voice...',
        hi: 'आपकी आवाज़ सुन रहा हूं...',
        mr: 'तुमचा आवाज ऐकत आहे...',
        gu: 'તમારો અવાજ સાંભળી રહ્યું છું...',
        pa: 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਰਿਹਾ ਹਾਂ...'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  return (
    <div className="bg-green-600 text-white py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onToggle}
            className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 text-sm sm:text-base ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {isListening ? (
              <>
                <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{getLocalizedText('listening')}</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{getLocalizedText('askByVoice')}</span>
              </>
            )}
          </button>
          
          <div className="hidden md:flex items-center space-x-2 text-green-100">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm">
              {isListening ? getLocalizedText('listeningMessage') : getLocalizedText('helpMessage')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;