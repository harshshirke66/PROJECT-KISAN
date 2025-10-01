import React, { useState } from 'react';
import { Camera, Upload, Leaf, Loader } from 'lucide-react';
import { analyzeCropImage } from '../services/geminiService';

interface CropDiagnosisProps {
  selectedLanguage: string;
}

const CropDiagnosis: React.FC<CropDiagnosisProps> = ({ selectedLanguage }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getLocalizedText = (key: string) => {
    const texts: { [key: string]: { [lang: string]: string } } = {
      title: {
        en: 'Crop Disease Diagnosis',
        hi: 'फसल रोग निदान',
        mr: 'पीक रोग निदान',
        gu: 'પાક રોગ નિદાન',
        pa: 'ਫਸਲ ਰੋਗ ਨਿਦਾਨ'
      },
      subtitle: {
        en: 'Instant identification and treatment',
        hi: 'तुरंत पहचान और इलाज',
        mr: 'तत्काळ ओळख आणि उपचार',
        gu: 'તાત્કાલિક ઓળખ અને સારવાર',
        pa: 'ਤੁਰੰਤ ਪਛਾਣ ਅਤੇ ਇਲਾਜ'
      },
      analyzing: {
        en: 'Analyzing...',
        hi: 'विश्लेषण हो रहा है...',
        mr: 'विश्लेषण करत आहे...',
        gu: 'વિશ્લેષણ કરી રહ્યું છે...',
        pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...'
      },
      takePhoto: {
        en: 'Take Photo',
        hi: 'तस्वीर लें',
        mr: 'फोटो घ्या',
        gu: 'ફોટો લો',
        pa: 'ਫੋਟੋ ਲਓ'
      },
      chooseFromGallery: {
        en: 'Choose from Gallery',
        hi: 'गैलरी से चुनें',
        mr: 'गॅलरीतून निवडा',
        gu: 'ગેલેરીમાંથી પસંદ કરો',
        pa: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ'
      },
      analysisResult: {
        en: 'Analysis Result:',
        hi: 'विश्लेषण परिणाम:',
        mr: 'विश्लेषण परिणाम:',
        gu: 'વિશ્લેષણ પરિણામ:',
        pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜਾ:'
      },
      tip: {
        en: 'Tip: Take clear photos of leaves for better results',
        hi: 'टिप: पत्तियों की साफ तस्वीर लें ताकि बेहतर परिणाम मिले',
        mr: 'टीप: चांगले परिणामासाठी पानांचे स्पष्ट फोटो घ्या',
        gu: 'ટિપ: વધુ સારા પરિણામો માટે પાંદડાઓના સ્પષ્ટ ફોટા લો',
        pa: 'ਟਿੱਪ: ਬਿਹਤਰ ਨਤੀਜਿਆਂ ਲਈ ਪੱਤਿਆਂ ਦੀਆਂ ਸਾਫ਼ ਤਸਵੀਰਾਂ ਲਓ'
      }
    };
    return texts[key]?.[selectedLanguage] || texts[key]?.['en'] || '';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Analyze with Gemini
      const analysis = await analyzeCropImage(file, selectedLanguage);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage = selectedLanguage === 'en' 
        ? 'Analysis error occurred. Please try again.'
        : 'विश्लेषण में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setResult(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input for camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = handleImageUpload;
    input.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">{getLocalizedText('title')}</h3>
            <p className="text-sm text-gray-600">{getLocalizedText('subtitle')}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleCameraCapture}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <span>{isAnalyzing ? getLocalizedText('analyzing') : getLocalizedText('takePhoto')}</span>
          </button>
          
          <label className="w-full flex items-center justify-center space-x-3 bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
            <Upload className="h-5 w-5" />
            <span>{getLocalizedText('chooseFromGallery')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isAnalyzing}
            />
          </label>
        </div>
        
        {selectedImage && (
          <div className="mt-4">
            <img 
              src={selectedImage} 
              alt="Selected crop" 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">{getLocalizedText('analysisResult')}</h4>
            <p className="text-sm text-green-700 whitespace-pre-wrap">{result}</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700">
            <strong>{selectedLanguage === 'en' ? 'Tip:' : 'टिप:'}</strong> {getLocalizedText('tip')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropDiagnosis;