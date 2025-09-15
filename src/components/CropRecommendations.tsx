import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, MapPin, Loader, TrendingUp } from 'lucide-react';
import { getCropRecommendations } from '../services/geminiService';

interface CropRecommendationsProps {
  selectedLanguage: string;
}

const CropRecommendations: React.FC<CropRecommendationsProps> = ({ selectedLanguage }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('current');

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Crop Recommendations',
        hi: 'फसल सुझाव',
        mr: 'पीक शिफारसी',
        gu: 'પાક ભલામણો',
        pa: 'ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ'
      },
      subtitle: {
        en: 'Best crops for your region',
        hi: 'आपके क्षेत्र के लिए सर्वोत्तम फसलें',
        mr: 'तुमच्या प्रदेशासाठी सर्वोत्तम पिके',
        gu: 'તમારા વિસ્તાર માટે શ્રેષ્ઠ પાકો',
        pa: 'ਤੁਹਾਡੇ ਖੇਤਰ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਫਸਲਾਂ'
      },
      currentSeason: {
        en: 'Current Season',
        hi: 'वर्तमान मौसम',
        mr: 'सध्याचा हंगाम',
        gu: 'વર્તમાન મોસમ',
        pa: 'ਮੌਜੂਦਾ ਮੌਸਮ'
      },
      nextSeason: {
        en: 'Next Season',
        hi: 'अगला मौसम',
        mr: 'पुढचा हंगाम',
        gu: 'આગામી મોસમ',
        pa: 'ਅਗਲਾ ਮੌਸਮ'
      },
      getRecommendations: {
        en: 'Get Recommendations',
        hi: 'सुझाव प्राप्त करें',
        mr: 'शिफारसी मिळवा',
        gu: 'ભલામણો મેળવો',
        pa: 'ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ'
      },
      loading: {
        en: 'Loading...',
        hi: 'लोड हो रहा है...',
        mr: 'लोड होत आहे...',
        gu: 'લોડ થઈ રહ્યું છે...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
      },
      profitability: {
        en: 'Profitability',
        hi: 'लाभप्रदता',
        mr: 'नफा',
        gu: 'નફાકારકતા',
        pa: 'ਮੁਨਾਫਾ'
      },
      growthTime: {
        en: 'Growth Time',
        hi: 'विकास समय',
        mr: 'वाढीचा काळ',
        gu: 'વૃદ્ધિ સમય',
        pa: 'ਵਿਕਾਸ ਸਮਾਂ'
      },
      waterRequirement: {
        en: 'Water Need',
        hi: 'पानी की आवश्यकता',
        mr: 'पाण्याची गरज',
        gu: 'પાણીની જરૂર',
        pa: 'ਪਾਣੀ ਦੀ ਲੋੜ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await getCropRecommendations(selectedSeason, selectedLanguage);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [selectedSeason, selectedLanguage]);

  const getProfitabilityColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('high') || lowerLevel.includes('उच्च')) return 'text-green-600';
    if (lowerLevel.includes('medium') || lowerLevel.includes('मध्यम')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedSeason('current')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedSeason === 'current'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getLocalizedText('currentSeason')}
            </button>
            <button
              onClick={() => setSelectedSeason('next')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedSeason === 'next'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getLocalizedText('nextSeason')}
            </button>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((crop, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{crop.name}</h4>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-4 w-4 ${getProfitabilityColor(crop.profitability)}`} />
                    <span className={`text-xs font-medium ${getProfitabilityColor(crop.profitability)}`}>
                      {crop.profitability}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">{crop.growthTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">{crop.waterRequirement}</span>
                  </div>
                </div>
                
                {crop.tips && (
                  <p className="text-xs text-green-700 mt-2 bg-green-100 p-2 rounded">
                    <strong>Tip:</strong> {crop.tips}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <button 
            onClick={loadRecommendations}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Sprout className="h-4 w-4" />
            )}
            <span>{isLoading ? getLocalizedText('loading') : getLocalizedText('getRecommendations')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CropRecommendations;