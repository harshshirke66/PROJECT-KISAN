import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

interface AlertsSectionProps {
  alerts: Alert[];
  selectedLanguage: string;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, selectedLanguage }) => {
  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      alertsTitle: {
        en: 'Alerts and Notifications',
        hi: 'अलर्ट और सूचनाएं',
        mr: 'अलर्ट आणि सूचना',
        gu: 'અલર્ટ અને સૂચનાઓ',
        pa: 'ਅਲਰਟ ਅਤੇ ਸੂਚਨਾਵਾਂ'
      },
      noAlerts: {
        en: 'No alerts at the moment. Your crops are looking good!',
        hi: 'फिलहाल कोई अलर्ट नहीं। आपकी फसलें अच्छी दिख रही हैं!',
        mr: 'सध्या कोणतेही अलर्ट नाहीत. तुमची पिके चांगली दिसत आहेत!',
        gu: 'હાલમાં કોઈ અલર્ટ નથી. તમારા પાકો સારા દેખાઈ રહ્યા છે!',
        pa: 'ਫਿਲਹਾਲ ਕੋਈ ਅਲਰਟ ਨਹੀਂ। ਤੁਹਾਡੀਆਂ ਫਸਲਾਂ ਚੰਗੀਆਂ ਲੱਗ ਰਹੀਆਂ ਹਨ!'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
          {getLocalizedText('alertsTitle')}
        </h2>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-center">{getLocalizedText('noAlerts')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
        {getLocalizedText('alertsTitle')}
      </h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'high' 
                ? 'bg-red-50 border-red-400' 
                : alert.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-green-50 border-green-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-800">{alert.message}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {alert.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;