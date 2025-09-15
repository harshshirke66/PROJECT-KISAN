import React, { useState, useEffect } from 'react';
import { FileText, Loader, ExternalLink } from 'lucide-react';
import { getSchemeInformation, getRealTimeSchemes } from '../services/geminiService';

interface Scheme {
  name: string;
  amount: string;
  status: string;
  description: string;
}

interface GovernmentSchemesProps {
  selectedLanguage: string;
}

const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ selectedLanguage }) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [schemeDetails, setSchemeDetails] = useState<string | null>(null);

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Government Schemes',
        hi: 'सरकारी योजनाएं',
        mr: 'सरकारी योजना',
        gu: 'સરકારી યોજનાઓ',
        pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ'
      },
      subtitle: {
        en: 'Subsidies and benefits',
        hi: 'सब्सिडी और लाभ',
        mr: 'सबसिडी आणि फायदे',
        gu: 'સબસિડી અને લાભો',
        pa: 'ਸਬਸਿਡੀ ਅਤੇ ਲਾਭ'
      },
      detailedInfo: {
        en: 'Detailed Information',
        hi: 'विस्तृत जानकारी',
        mr: 'तपशीलवार माहिती',
        gu: 'વિગતવાર માહિતી',
        pa: 'ਵਿਸਤ੍ਰਿਤ ਜਾਣਕਾਰੀ'
      },
      gettingInfo: {
        en: 'Getting information...',
        hi: 'जानकारी प्राप्त कर रहे हैं...',
        mr: 'माहिती मिळवत आहे...',
        gu: 'માહિતી મેળવી રહ્યા છીએ...',
        pa: 'ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰ ਰਹੇ ਹਾਂ...'
      },
      schemeDetails: {
        en: 'Scheme Details:',
        hi: 'योजना विवरण:',
        mr: 'योजना तपशील:',
        gu: 'યોજના વિગતો:',
        pa: 'ਯੋਜਨਾ ਵੇਰਵਾ:'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  // Load real-time schemes on component mount
  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const realTimeSchemes = await getRealTimeSchemes(selectedLanguage);
        setSchemes(realTimeSchemes);
      } catch (error) {
        console.error('Error loading schemes:', error);
        // Fallback to empty array if API fails
        setSchemes([]);
      }
    };

    loadSchemes();
  }, [selectedLanguage]);

  const handleSchemeInquiry = async () => {
    setIsLoading(true);
    try {
      const details = await getSchemeInformation(selectedLanguage);
      setSchemeDetails(details);
    } catch (error) {
      console.error('Error getting scheme information:', error);
      const errorMessage = selectedLanguage === 'en' 
        ? 'Error retrieving scheme information. Please try again.'
        : 'योजना की जानकारी प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setSchemeDetails(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {schemes.length > 0 ? (
            schemes.slice(0, 2).map((scheme, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800 text-sm">{scheme.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    scheme.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {scheme.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{scheme.description}</p>
                <p className="text-sm font-bold text-blue-600">{scheme.amount}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg text-center text-blue-600">
              {selectedLanguage === 'en' ? 'Loading schemes...' : 'योजनाएं लोड हो रही हैं...'}
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSchemeInquiry}
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          <span>{isLoading ? getLocalizedText('gettingInfo') : getLocalizedText('detailedInfo')}</span>
        </button>

        {schemeDetails && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">{getLocalizedText('schemeDetails')}</h4>
            <p className="text-sm text-blue-700 whitespace-pre-wrap">{schemeDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemes;