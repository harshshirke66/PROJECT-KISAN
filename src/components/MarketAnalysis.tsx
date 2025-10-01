import React, { useState, useEffect } from 'react';
import { TrendingUp, Loader, RefreshCw, Search } from 'lucide-react';
import { getMarketAnalysis, getRealTimeMarketData, getSpecificCropAnalysis } from '../services/geminiService';

interface MarketData {
  crop: string;
  price: string;
  change: string;
  trend: 'up' | 'down';
}

interface MarketAnalysisProps {
  selectedLanguage: string;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ selectedLanguage }) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Market Prices',
        hi: 'बाजार भाव',
        mr: 'बाजार भाव',
        gu: 'બજાર ભાવ',
        pa: 'ਮਾਰਕੀਟ ਰੇਟ'
      },
      subtitle: {
        en: 'Today\'s prices and trends',
        hi: 'आज की कीमतें और रुझान',
        mr: 'आजचे दर आणि ट्रेंड',
        gu: 'આજના ભાવ અને વલણો',
        pa: 'ਅੱਜ ਦੇ ਰੇਟ ਅਤੇ ਰੁਝਾਨ'
      },
      refresh: {
        en: 'Refresh',
        hi: 'रिफ्रेश',
        mr: 'रिफ्रेश',
        gu: 'રિફ્રેશ',
        pa: 'ਰਿਫ੍ਰੈਸ਼'
      },
      analysis: {
        en: 'Analysis',
        hi: 'विश्लेषण',
        mr: 'विश्लेषण',
        gu: 'વિશ્લેષણ',
        pa: 'ਵਿਸ਼ਲੇਸ਼ਣ'
      },
      analyzing: {
        en: 'Analyzing...',
        hi: 'विश्लेषण...',
        mr: 'विश्लेषण...',
        gu: 'વિશ્લેષણ...',
        pa: 'ਵਿਸ਼ਲੇਸ਼ਣ...'
      },
      marketAnalysis: {
        en: 'Market Analysis:',
        hi: 'बाजार विश्लेषण:',
        mr: 'बाजार विश्लेषण:',
        gu: 'બજાર વિશ્લેષણ:',
        pa: 'ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ:'
      },
      searchPlaceholder: {
        en: 'Search crop (e.g., eggplant, tomato)',
        hi: 'फसल खोजें (जैसे बैंगन, टमाटर)',
        mr: 'पीक शोधा (उदा. वांगी, टोमॅटो)',
        gu: 'પાક શોધો (જેમ કે રીંગણ, ટામેટાં)',
        pa: 'ਫਸਲ ਖੋਜੋ (ਜਿਵੇਂ ਬੈਂਗਣ, ਟਮਾਟਰ)'
      },
      searchButton: {
        en: 'Search',
        hi: 'खोजें',
        mr: 'शोधा',
        gu: 'શોધો',
        pa: 'ਖੋਜੋ'
      },
      searching: {
        en: 'Searching...',
        hi: 'खोज रहे हैं...',
        mr: 'शोधत आहे...',
        gu: 'શોધી રહ્યા છીએ...',
        pa: 'ਖੋਜ ਰਹੇ ਹਾਂ...'
      },
      searchResult: {
        en: 'Search Result:',
        hi: 'खोज परिणाम:',
        mr: 'शोध परिणाम:',
        gu: 'શોધ પરિણામ:',
        pa: 'ਖੋਜ ਨਤੀਜਾ:'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  // Load real-time market data on component mount
  useEffect(() => {
    const loadMarketData = async () => {
      setIsRefreshing(true);
      try {
        const data = await getRealTimeMarketData(selectedLanguage);
        setMarketData(data);
      } catch (error) {
        console.error('Error loading market data:', error);
        // Fallback to empty array if API fails
        setMarketData([]);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadMarketData();
  }, [selectedLanguage]);

  const handleMarketAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await getMarketAnalysis(selectedLanguage);
      setAnalysis(result);
    } catch (error) {
      console.error('Error getting market analysis:', error);
      const errorMessage = selectedLanguage === 'en' 
        ? 'Market analysis error occurred. Please try again.'
        : 'बाजार विश्लेषण में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setAnalysis(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    
    try {
      const result = await getSpecificCropAnalysis(searchQuery.trim(), selectedLanguage);
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching crop:', error);
      const errorMessage = selectedLanguage === 'en' 
        ? 'Search error occurred. Please try again.'
        : 'खोज में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setSearchResult(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCropSearch();
    }
  };

  const refreshMarketData = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRealTimeMarketData(selectedLanguage);
      setMarketData(data);
    } catch (error) {
      console.error('Error refreshing market data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getLocalizedText('searchPlaceholder')}
              className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
              disabled={isSearching}
            />
            <button
              onClick={handleCropSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center space-x-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="text-sm">
                {isSearching ? getLocalizedText('searching') : getLocalizedText('searchButton')}
              </span>
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              {getLocalizedText('searchResult')} "{searchQuery}"
            </h4>
            <p className="text-sm text-blue-700 whitespace-pre-wrap">{searchResult}</p>
          </div>
        )}
        
        <div className="space-y-3">
          {marketData.length > 0 ? (
            marketData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">{item.crop}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{item.price}</div>
                  <div className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              {selectedLanguage === 'en' ? 'Loading market data...' : 'बाजार डेटा लोड हो रहा है...'}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={refreshMarketData}
            disabled={isRefreshing}
            className="flex-1 flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{getLocalizedText('refresh')}</span>
          </button>
          
          <button 
            onClick={handleMarketAnalysis}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            <span>{isLoading ? getLocalizedText('analyzing') : getLocalizedText('analysis')}</span>
          </button>
        </div>

        {analysis && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">{getLocalizedText('marketAnalysis')}</h4>
            <p className="text-sm text-yellow-700 whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysis;