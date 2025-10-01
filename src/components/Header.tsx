import React from 'react';
import { User, MapPin, ChevronDown } from 'lucide-react';

interface HeaderProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, setSelectedLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Project KISAN',
        hi: 'Project KISAN',
        mr: 'Project KISAN',
        gu: 'Project KISAN',
        pa: 'Project KISAN'
      },
      subtitle: {
        en: 'Your Digital Agriculture Assistant',
        hi: 'आपका डिजिटल कृषि सहायक',
        mr: 'तुमचा डिजिटल कृषी सहायक',
        gu: 'તમારો ડિજિટલ કૃષિ સહાયક',
        pa: 'ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀ ਸਹਾਇਕ'
      },
      location: {
        en: 'Punjab, India',
        hi: 'पंजाब, भारत',
        mr: 'पंजाब, भारत',
        gu: 'પંજાબ, ભારત',
        pa: 'ਪੰਜਾਬ, ਭਾਰਤ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  return (
    <header className="bg-white shadow-sm border-b-2 border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-800">{getLocalizedText('title')}</h1>
              <p className="text-xs text-green-600">{getLocalizedText('subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none bg-green-50 border border-green-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
            </div>
            
            <div className="flex items-center text-sm text-green-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{getLocalizedText('location')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;