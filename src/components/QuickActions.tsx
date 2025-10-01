import React from 'react';
import { Leaf, DollarSign, Book, AlertTriangle } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  selectedLanguage: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, selectedLanguage }) => {
  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Quick Ask',
        hi: 'तुरंत पूछें',
        mr: 'त्वरित विचारा',
        gu: 'ઝડપથી પૂછો',
        pa: 'ਤੁਰੰਤ ਪੁੱਛੋ'
      },
      weather: {
        en: 'How\'s the weather today?',
        hi: 'आज कैसा मौसम है?',
        mr: 'आज हवामान कसे आहे?',
        gu: 'આજે હવામાન કેવું છે?',
        pa: 'ਅੱਜ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੈ?'
      },
      price: {
        en: 'What\'s the rice price?',
        hi: 'धान का भाव क्या है?',
        mr: 'तांदळाचा भाव काय आहे?',
        gu: 'ચોખાનો ભાવ શું છે?',
        pa: 'ਚਾਵਲ ਦਾ ਰੇਟ ਕੀ ਹੈ?'
      },
      scheme: {
        en: 'Any new schemes?',
        hi: 'नई योजना है क्या?',
        mr: 'नवीन योजना आहे का?',
        gu: 'કોઈ નવી યોજના છે?',
        pa: 'ਕੋਈ ਨਵੀਂ ਯੋਜਨਾ ਹੈ?'
      },
      pest: {
        en: 'Pest problem',
        hi: 'कीट की समस्या है',
        mr: 'कीटकांची समस्या आहे',
        gu: 'જંતુની સમસ્યા છે',
        pa: 'ਕੀੜੇ ਦੀ ਸਮੱਸਿਆ ਹੈ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const actions = [
    {
      icon: Leaf,
      text: getLocalizedText('weather'),
      action: 'weather',
      color: 'green'
    },
    {
      icon: DollarSign,
      text: getLocalizedText('price'),
      action: 'price',
      color: 'yellow'
    },
    {
      icon: Book,
      text: getLocalizedText('scheme'),
      action: 'scheme',
      color: 'blue'
    },
    {
      icon: AlertTriangle,
      text: getLocalizedText('pest'),
      action: 'pest',
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{getLocalizedText('title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button 
              key={index}
              onClick={() => onActionClick(action.action)}
              className={`flex flex-col items-center space-y-2 p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors`}
            >
              <Icon className={`h-6 w-6 text-${action.color}-600`} />
              <span className="text-sm font-medium text-gray-800 text-center">{action.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;