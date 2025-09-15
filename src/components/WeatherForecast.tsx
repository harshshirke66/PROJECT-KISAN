import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Loader } from 'lucide-react';
import { getWeatherForecast } from '../services/geminiService';

interface WeatherForecastProps {
  selectedLanguage: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ selectedLanguage }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Weather Forecast',
        hi: 'मौसम पूर्वानुमान',
        mr: 'हवामान अंदाज',
        gu: 'હવામાન આગાહી',
        pa: 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ'
      },
      subtitle: {
        en: '7-day farming weather',
        hi: '7-दिन कृषि मौसम',
        mr: '7-दिवसीय शेती हवामान',
        gu: '7-દિવસીય ખેતી હવામાન',
        pa: '7-ਦਿਨ ਖੇਤੀ ਮੌਸਮ'
      },
      getWeather: {
        en: 'Get Weather',
        hi: 'मौसम प्राप्त करें',
        mr: 'हवामान मिळवा',
        gu: 'હવામાન મેળવો',
        pa: 'ਮੌਸਮ ਪ੍ਰਾਪਤ ਕਰੋ'
      },
      loading: {
        en: 'Loading...',
        hi: 'लोड हो रहा है...',
        mr: 'लोड होत आहे...',
        gu: 'લોડ થઈ રહ્યું છે...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
      },
      temperature: {
        en: 'Temperature',
        hi: 'तापमान',
        mr: 'तापमान',
        gu: 'તાપમાન',
        pa: 'ਤਾਪਮਾਨ'
      },
      humidity: {
        en: 'Humidity',
        hi: 'आर्द्रता',
        mr: 'आर्द्रता',
        gu: 'ભેજ',
        pa: 'ਨਮੀ'
      },
      windSpeed: {
        en: 'Wind Speed',
        hi: 'हवा की गति',
        mr: 'वाऱ्याचा वेग',
        gu: 'પવનની ઝડપ',
        pa: 'ਹਵਾ ਦੀ ਗਤੀ'
      },
      visibility: {
        en: 'Visibility',
        hi: 'दृश्यता',
        mr: 'दृश्यता',
        gu: 'દૃશ્યતા',
        pa: 'ਦਿੱਖ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const loadWeather = async () => {
    setIsLoading(true);
    try {
      const weather = await getWeatherForecast(selectedLanguage);
      setWeatherData(weather);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [selectedLanguage]);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('बारिश')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('बादल')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Cloud className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>

        {weatherData ? (
          <div className="space-y-4">
            {/* Current Weather */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Today</h4>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.current?.temperature || '25°C'}</p>
                  <p className="text-sm text-gray-600">{weatherData.current?.condition || 'Partly Cloudy'}</p>
                </div>
                {getWeatherIcon(weatherData.current?.condition || 'sunny')}
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium">{getLocalizedText('temperature')}</span>
                </div>
                <p className="text-sm font-bold mt-1">{weatherData.current?.temperature || '25°C'}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium">{getLocalizedText('humidity')}</span>
                </div>
                <p className="text-sm font-bold mt-1">{weatherData.current?.humidity || '65%'}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium">{getLocalizedText('windSpeed')}</span>
                </div>
                <p className="text-sm font-bold mt-1">{weatherData.current?.windSpeed || '12 km/h'}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium">{getLocalizedText('visibility')}</span>
                </div>
                <p className="text-sm font-bold mt-1">{weatherData.current?.visibility || '10 km'}</p>
              </div>
            </div>

            {/* Farming Advice */}
            {weatherData.farmingAdvice && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Farming Advice:</h4>
                <p className="text-sm text-green-700">{weatherData.farmingAdvice}</p>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={loadWeather}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Cloud className="h-4 w-4" />
            )}
            <span>{isLoading ? getLocalizedText('loading') : getLocalizedText('getWeather')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;