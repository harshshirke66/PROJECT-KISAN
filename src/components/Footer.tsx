import React from 'react';

interface FooterProps {
  selectedLanguage: string;
}

const Footer: React.FC<FooterProps> = ({ selectedLanguage }) => {
  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      copyright: {
        en: '© 2024 Project KISAN - AI Assistant for Indian Farmers',
        hi: '© 2024 Project KISAN - भारतीय किसानों के लिए AI सहायक',
        mr: '© 2024 Project KISAN - भारतीय शेतकऱ्यांसाठी AI सहाय्यक',
        gu: '© 2024 Project KISAN - ભારતીય ખેડૂતો માટે AI સહાયક',
        pa: '© 2024 Project KISAN - ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ AI ਸਹਾਇਕ'
      },
      availability: {
        en: 'Available in all Indian languages • 24/7 support available',
        hi: 'सभी भारतीय भाषाओं में उपलब्ध • 24/7 सहायता उपलब्ध',
        mr: 'सर्व भारतीय भाषांमध्ये उपलब्ध • 24/7 सहाय्य उपलब्ध',
        gu: 'તમામ ભારતીય ભાષાઓમાં ઉપલબ્ધ • 24/7 સહાય ઉપલબ્ધ',
        pa: 'ਸਾਰੀਆਂ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ • 24/7 ਸਹਾਇਤਾ ਉਪਲਬਧ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  return (
    <footer className="bg-green-800 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm">
            {getLocalizedText('copyright')}
          </p>
          <p className="text-xs mt-2 text-green-200">
            {getLocalizedText('availability')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;