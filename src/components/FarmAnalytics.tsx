import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Loader, RefreshCw } from 'lucide-react';
import { getFarmAnalytics } from '../services/geminiService';

interface FarmAnalyticsProps {
  selectedLanguage: string;
}

const FarmAnalytics: React.FC<FarmAnalyticsProps> = ({ selectedLanguage }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Farm Analytics',
        hi: 'कृषि विश्लेषण',
        mr: 'शेती विश्लेषण',
        gu: 'ખેત વિશ્લેષણ',
        pa: 'ਖੇਤ ਵਿਸ਼ਲੇਸ਼ਣ'
      },
      subtitle: {
        en: 'Performance insights',
        hi: 'प्रदर्शन अंतर्दृष्टि',
        mr: 'कामगिरी अंतर्दृष्टी',
        gu: 'પ્રદર્શન આંતરદૃષ્ટિ',
        pa: 'ਪ੍ਰਦਰਸ਼ਨ ਸੂਝ'
      },
      thisMonth: {
        en: 'This Month',
        hi: 'इस महीने',
        mr: 'या महिन्यात',
        gu: 'આ મહિને',
        pa: 'ਇਸ ਮਹੀਨੇ'
      },
      thisYear: {
        en: 'This Year',
        hi: 'इस साल',
        mr: 'या वर्षी',
        gu: 'આ વર્ષે',
        pa: 'ਇਸ ਸਾਲ'
      },
      totalRevenue: {
        en: 'Total Revenue',
        hi: 'कुल आय',
        mr: 'एकूण उत्पन्न',
        gu: 'કુલ આવક',
        pa: 'ਕੁੱਲ ਆਮਦਨ'
      },
      totalExpenses: {
        en: 'Total Expenses',
        hi: 'कुल खर्च',
        mr: 'एकूण खर्च',
        gu: 'કુલ ખર્ચ',
        pa: 'ਕੁੱਲ ਖਰਚ'
      },
      netProfit: {
        en: 'Net Profit',
        hi: 'शुद्ध लाभ',
        mr: 'निव्वळ नफा',
        gu: 'ચોખ્ખો નફો',
        pa: 'ਸ਼ੁੱਧ ਮੁਨਾਫਾ'
      },
      cropYield: {
        en: 'Crop Yield',
        hi: 'फसल उत्पादन',
        mr: 'पीक उत्पादन',
        gu: 'પાક ઉત્પાદન',
        pa: 'ਫਸਲ ਉਤਪਾਦਨ'
      },
      getAnalytics: {
        en: 'Get Analytics',
        hi: 'विश्लेषण प्राप्त करें',
        mr: 'विश्लेषण मिळवा',
        gu: 'વિશ્લેષણ મેળવો',
        pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰੋ'
      },
      loading: {
        en: 'Loading...',
        hi: 'लोड हो रहा है...',
        mr: 'लोड होत आहे...',
        gu: 'લોડ થઈ રહ્યું છે...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
      },
      refresh: {
        en: 'Refresh',
        hi: 'रिफ्रेश',
        mr: 'रिफ्रेश',
        gu: 'રિફ્રેશ',
        pa: 'ਰਿਫ੍ਰੈਸ਼'
      },
      profitMargin: {
        en: 'Profit Margin',
        hi: 'लाभ मार्जिन',
        mr: 'नफा मार्जिन',
        gu: 'નફો માર્જિન',
        pa: 'ਮੁਨਾਫਾ ਮਾਰਜਿਨ'
      },
      recommendations: {
        en: 'Recommendations',
        hi: 'सुझाव',
        mr: 'शिफारसी',
        gu: 'ભલામણો',
        pa: 'ਸਿਫਾਰਸ਼ਾਂ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await getFarmAnalytics(selectedPeriod, selectedLanguage);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod, selectedLanguage]);

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) return <TrendingUp className="h-3 w-3 text-green-600" />;
    return <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getLocalizedText('thisMonth')}
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === 'year'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getLocalizedText('thisYear')}
            </button>
          </div>
        </div>

        {analytics ? (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{getLocalizedText('totalRevenue')}</p>
                    <p className="text-lg font-bold text-green-600">{analytics.revenue || '₹45,000'}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                {analytics.revenueChange && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(analytics.revenueChange)}
                    <span className={`text-xs ${getChangeColor(analytics.revenueChange)}`}>
                      {analytics.revenueChange}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{getLocalizedText('totalExpenses')}</p>
                    <p className="text-lg font-bold text-red-600">{analytics.expenses || '₹28,000'}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                {analytics.expensesChange && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(analytics.expensesChange)}
                    <span className={`text-xs ${getChangeColor(analytics.expensesChange)}`}>
                      {analytics.expensesChange}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{getLocalizedText('netProfit')}</p>
                    <p className="text-lg font-bold text-blue-600">{analytics.profit || '₹17,000'}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                {analytics.profitChange && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(analytics.profitChange)}
                    <span className={`text-xs ${getChangeColor(analytics.profitChange)}`}>
                      {analytics.profitChange}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{getLocalizedText('profitMargin')}</p>
                    <p className="text-lg font-bold text-yellow-600">{analytics.profitMargin || '38%'}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-yellow-600" />
                </div>
                {analytics.marginChange && (
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(analytics.marginChange)}
                    <span className={`text-xs ${getChangeColor(analytics.marginChange)}`}>
                      {analytics.marginChange}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {analytics.recommendations && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {getLocalizedText('recommendations')}
                </h4>
                <p className="text-sm text-purple-700">{analytics.recommendations}</p>
              </div>
            )}

            <button 
              onClick={loadAnalytics}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{getLocalizedText('refresh')}</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={loadAnalytics}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            <span>{isLoading ? getLocalizedText('loading') : getLocalizedText('getAnalytics')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmAnalytics;