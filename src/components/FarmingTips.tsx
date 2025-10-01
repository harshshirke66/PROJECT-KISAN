import React, { useState, useEffect } from 'react';
import { Lightbulb, BookOpen, Loader, ChevronRight, Star } from 'lucide-react';
import { getFarmingTips } from '../services/geminiService';

interface FarmingTipsProps {
  selectedLanguage: string;
}

const FarmingTips: React.FC<FarmingTipsProps> = ({ selectedLanguage }) => {
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Farming Tips',
        hi: 'कृषि सुझाव',
        mr: 'शेती टिप्स',
        gu: 'ખેતી ટિપ્સ',
        pa: 'ਖੇਤੀ ਟਿੱਪਸ'
      },
      subtitle: {
        en: 'Expert advice for better farming',
        hi: 'बेहतर खेती के लिए विशेषज्ञ सलाह',
        mr: 'चांगल्या शेतीसाठी तज्ञांचा सल्ला',
        gu: 'વધુ સારી ખેતી માટે નિષ્ણાત સલાહ',
        pa: 'ਬਿਹਤਰ ਖੇਤੀ ਲਈ ਮਾਹਰ ਸਲਾਹ'
      },
      general: {
        en: 'General',
        hi: 'सामान्य',
        mr: 'सामान्य',
        gu: 'સામાન્ય',
        pa: 'ਆਮ'
      },
      seasonal: {
        en: 'Seasonal',
        hi: 'मौसमी',
        mr: 'हंगामी',
        gu: 'મોસમી',
        pa: 'ਮੌਸਮੀ'
      },
      organic: {
        en: 'Organic',
        hi: 'जैविक',
        mr: 'सेंद्रिय',
        gu: 'કાર્બનિક',
        pa: 'ਜੈਵਿਕ'
      },
      irrigation: {
        en: 'Irrigation',
        hi: 'सिंचाई',
        mr: 'सिंचन',
        gu: 'સિંચાઈ',
        pa: 'ਸਿੰਚਾਈ'
      },
      getTips: {
        en: 'Get Tips',
        hi: 'सुझाव प्राप्त करें',
        mr: 'टिप्स मिळवा',
        gu: 'ટિપ્સ મેળવો',
        pa: 'ਟਿੱਪਸ ਪ੍ਰਾਪਤ ਕਰੋ'
      },
      loading: {
        en: 'Loading...',
        hi: 'लोड हो रहा है...',
        mr: 'लोड होत आहे...',
        gu: 'લોડ થઈ રહ્યું છે...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
      },
      difficulty: {
        en: 'Difficulty',
        hi: 'कठिनाई',
        mr: 'अडचण',
        gu: 'મુશ્કેલી',
        pa: 'ਮੁਸ਼ਕਿਲ'
      },
      easy: {
        en: 'Easy',
        hi: 'आसान',
        mr: 'सोपे',
        gu: 'સરળ',
        pa: 'ਆਸਾਨ'
      },
      medium: {
        en: 'Medium',
        hi: 'मध्यम',
        mr: 'मध्यम',
        gu: 'મધ્યમ',
        pa: 'ਮੱਧਮ'
      },
      hard: {
        en: 'Hard',
        hi: 'कठिन',
        mr: 'कठीण',
        gu: 'મુશ્કેલ',
        pa: 'ਮੁਸ਼ਕਿਲ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const categories = [
    { id: 'general', label: getLocalizedText('general') },
    { id: 'seasonal', label: getLocalizedText('seasonal') },
    { id: 'organic', label: getLocalizedText('organic') },
    { id: 'irrigation', label: getLocalizedText('irrigation') }
  ];

  const loadTips = async () => {
    setIsLoading(true);
    try {
      const farmingTips = await getFarmingTips(selectedCategory, selectedLanguage);
      setTips(farmingTips);
    } catch (error) {
      console.error('Error loading tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTips();
  }, [selectedCategory, selectedLanguage]);

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty.includes('easy') || lowerDifficulty.includes('आसान')) return 'bg-green-100 text-green-700';
    if (lowerDifficulty.includes('medium') || lowerDifficulty.includes('मध्यम')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyStars = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty.includes('easy') || lowerDifficulty.includes('आसान')) return 1;
    if (lowerDifficulty.includes('medium') || lowerDifficulty.includes('मध्यम')) return 2;
    return 3;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {tips.length > 0 ? (
          <div className="space-y-3">
            {tips.slice(0, 3).map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm flex-1">{tip.title}</h4>
                  {tip.difficulty && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(tip.difficulty)}`}>
                      {tip.difficulty}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-700 mb-2">{tip.description}</p>
                
                {tip.difficulty && (
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < getDifficultyStars(tip.difficulty)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{getLocalizedText('difficulty')}</span>
                  </div>
                )}
                
                {tip.benefits && (
                  <div className="bg-yellow-100 p-2 rounded text-xs">
                    <strong>Benefits:</strong> {tip.benefits}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <button 
            onClick={loadTips}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
            <span>{isLoading ? getLocalizedText('loading') : getLocalizedText('getTips')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmingTips;