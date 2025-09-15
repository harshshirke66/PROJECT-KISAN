import { model, visionModel } from '../config/gemini';
import { formatGeminiResponse } from '../utils/textFormatter';

// Cache for storing API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds - Extended to reduce API calls and conserve quota
const CACHE_TTL = {
  alerts: 24 * 60 * 60 * 1000, // 24 hours (was 30 minutes)
  market: 6 * 60 * 60 * 1000, // 6 hours (was 60 minutes)
  schemes: 24 * 60 * 60 * 1000, // 24 hours (was 60 minutes)
  analysis: 6 * 60 * 60 * 1000, // 6 hours (was 60 minutes)
  cropSearch: 6 * 60 * 60 * 1000, // 6 hours (was 60 minutes)
};

// Get cached data if available and not expired
const getCachedData = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key); // Remove expired cache
  }
  return null;
};

// Set cache data
const setCachedData = (key: string, data: any, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Retry mechanism with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error (429)
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        if (attempt < maxRetries) {
          // Calculate delay with exponential backoff and jitter
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(`Rate limit hit, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      } else {
        // For non-rate-limit errors, don't retry
        throw error;
      }
    }
  }
  
  throw lastError;
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.onerror = error => reject(error);
  });
};

// Get language-specific prompts
const getLanguagePrompt = (language: string, basePrompt: string): string => {
  const languageMap: { [key: string]: string } = {
    'en': 'Please respond in English in plain text without any markdown formatting, bold text, or special characters.',
    'hi': 'कृपया हिंदी में सादे टेक्स्ट में उत्तर दें, बिना किसी मार्कडाउन फॉर्मेटिंग या विशेष चिह्नों के।',
    'mr': 'कृपया मराठी में सादे टेक्स्ट में उत्तर दें, बिना किसी मार्कडाउन फॉर्मेटिंग या विशेष चिह्नों के।',
    'gu': 'કૃપા કરીને ગુજરાતીમાં સાદા ટેક્સ્ટમાં જવાબ આપો, કોઈ માર્કડાઉન ફોર્મેટિંગ અથવા વિશેષ ચિહ્નો વિના.',
    'pa': 'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਸਾਦੇ ਟੈਕਸਟ ਵਿੱਚ ਜਵਾਬ ਦਿਓ, ਬਿਨਾਂ ਕਿਸੇ ਮਾਰਕਡਾਉਨ ਫਾਰਮੈਟਿੰਗ ਜਾਂ ਵਿਸ਼ੇਸ਼ ਚਿੰਨ੍ਹਾਂ ਦੇ।'
  };
  
  return `${basePrompt} ${languageMap[language] || languageMap['en']}`;
};

// Get real-time alerts
export const getRealTimeAlerts = async (language: string): Promise<any[]> => {
  const cacheKey = `alerts_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate 3 realistic agricultural alerts for Indian farmers based on current season and common farming issues. 
      Return as JSON array with format: [{"id": number, "type": "warning|info|success", "message": "alert text", "time": "relative time", "severity": "high|medium|low"}].
      Make alerts relevant to current farming conditions in India. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        // Clean message text
        data.forEach((alert: any) => {
          if (alert.message) {
            alert.message = formatGeminiResponse(alert.message);
          }
        });
        setCachedData(cacheKey, data, CACHE_TTL.alerts);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing alerts JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = [
      {
        id: 1,
        type: 'warning',
        message: language === 'en' ? 'Weather alert: Heavy rain expected' : 'मौसम चेतावनी: भारी बारिश की संभावना',
        time: language === 'en' ? '2 hours ago' : '2 घंटे पहले',
        severity: 'high'
      },
      {
        id: 2,
        type: 'info',
        message: language === 'en' ? 'Market prices updated' : 'बाजार भाव अपडेट',
        time: language === 'en' ? '1 hour ago' : '1 घंटे पहले',
        severity: 'medium'
      }
    ];
    setCachedData(cacheKey, fallbackData, CACHE_TTL.alerts);
    return fallbackData;
  } catch (error) {
    console.error('Error getting real-time alerts:', error);
    
    // Return fallback data on error
    const fallbackData = [
      {
        id: 1,
        type: 'info',
        message: language === 'en' ? 'Service temporarily unavailable' : 'सेवा अस्थायी रूप से अनुपलब्ध',
        time: language === 'en' ? 'Now' : 'अभी',
        severity: 'low'
      }
    ];
    return fallbackData;
  }
};

// Get real-time market data
export const getRealTimeMarketData = async (language: string): Promise<any[]> => {
  const cacheKey = `market_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate current market prices for 4 major crops in India (rice, wheat, tomato, onion, potato). 
      Return as JSON array with format: [{"crop": "crop name", "price": "₹XX/kg or ₹XX/quintal", "change": "+/-X%", "trend": "up|down"}].
      Use realistic current market prices for Indian agricultural markets. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        // Clean crop names
        data.forEach((item: any) => {
          if (item.crop) {
            item.crop = formatGeminiResponse(item.crop);
          }
        });
        setCachedData(cacheKey, data, CACHE_TTL.market);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing market data JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = [
      {
        crop: language === 'en' ? 'Rice' : 'चावल',
        price: '₹25/kg',
        change: '+2%',
        trend: 'up'
      },
      {
        crop: language === 'en' ? 'Wheat' : 'गेहूं',
        price: '₹22/kg',
        change: '-1%',
        trend: 'down'
      },
      {
        crop: language === 'en' ? 'Tomato' : 'टमाटर',
        price: '₹30/kg',
        change: '+5%',
        trend: 'up'
      }
    ];
    setCachedData(cacheKey, fallbackData, CACHE_TTL.market);
    return fallbackData;
  } catch (error) {
    console.error('Error getting real-time market data:', error);
    
    // Return fallback data on error
    const fallbackData = [
      {
        crop: language === 'en' ? 'Data unavailable' : 'डेटा अनुपलब्ध',
        price: '---',
        change: '0%',
        trend: 'up'
      }
    ];
    return fallbackData;
  }
};

// Get real-time government schemes
export const getRealTimeSchemes = async (language: string): Promise<any[]> => {
  const cacheKey = `schemes_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate information about 3 current government schemes for Indian farmers. 
      Return as JSON array with format: [{"name": "scheme name", "amount": "benefit amount", "status": "Active|Available|Apply Now", "description": "brief description"}].
      Include schemes like PM-Kisan, crop insurance, irrigation subsidies etc. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        // Clean text fields
        data.forEach((scheme: any) => {
          if (scheme.name) scheme.name = formatGeminiResponse(scheme.name);
          if (scheme.description) scheme.description = formatGeminiResponse(scheme.description);
        });
        setCachedData(cacheKey, data, CACHE_TTL.schemes);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing schemes JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = [
      {
        name: language === 'en' ? 'PM-Kisan Scheme' : 'पीएम-किसान योजना',
        amount: '₹6,000/year',
        status: 'Active',
        description: language === 'en' ? 'Direct income support to farmers' : 'किसानों को प्रत्यक्ष आय सहायता'
      },
      {
        name: language === 'en' ? 'Crop Insurance' : 'फसल बीमा',
        amount: language === 'en' ? 'Up to ₹2 lakh' : '₹2 लाख तक',
        status: 'Available',
        description: language === 'en' ? 'Protection against crop loss' : 'फसल नुकसान से सुरक्षा'
      }
    ];
    setCachedData(cacheKey, fallbackData, CACHE_TTL.schemes);
    return fallbackData;
  } catch (error) {
    console.error('Error getting real-time schemes:', error);
    
    // Return fallback data on error
    const fallbackData = [
      {
        name: language === 'en' ? 'Service unavailable' : 'सेवा अनुपलब्ध',
        amount: '---',
        status: 'Pending',
        description: language === 'en' ? 'Please try again later' : 'कृपया बाद में पुनः प्रयास करें'
      }
    ];
    return fallbackData;
  }
};

// Get specific crop analysis - NEW FUNCTION
export const getSpecificCropAnalysis = async (cropName: string, language: string): Promise<string> => {
  const cacheKey = `crop_search_${cropName.toLowerCase()}_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `You are an agricultural market expert. Provide detailed market analysis for "${cropName}" crop in India:
      
      1. Current market price and recent price trends
      2. Best markets/mandis where this crop gets good prices
      3. Seasonal price patterns for this crop
      4. Quality factors that affect pricing
      5. Storage and transportation tips
      6. Best time to sell for maximum profit
      7. Market demand forecast for next month
      8. Comparison with similar crops
      
      Please provide practical, actionable information that will help farmers make informed decisions about selling their ${cropName} crop. Use plain text only, no markdown formatting, no bold text, no special characters.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const rawText = response.text();
    const data = formatGeminiResponse(rawText);
    setCachedData(cacheKey, data, CACHE_TTL.cropSearch);
    return data;
  } catch (error) {
    console.error('Error getting specific crop analysis:', error);
    const errorMessage = language === 'en' 
      ? `Market analysis for ${cropName} is temporarily unavailable. Please try again later.`
      : `${cropName} के लिए बाजार विश्लेषण अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।`;
    return errorMessage;
  }
};

// Analyze crop image for disease detection
export const analyzeCropImage = async (file: File, language: string): Promise<string> => {
  try {
    const base64Image = await fileToBase64(file);
    
    const prompt = getLanguagePrompt(
      language,
      `You are an agricultural expert. Analyze this crop image and provide:
      1. Is there any disease or pest problem visible?
      2. If yes, what is the name of the disease/pest?
      3. What is the treatment? (Suggest affordable local remedies)
      4. What are the prevention measures for the future?
      
      Please respond in simple language that a farmer can easily understand. Use plain text only, no markdown formatting, no bold text, no special characters.`
    );

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type
      }
    };

    const result = await retryWithBackoff(async () => {
      return await visionModel.generateContent([prompt, imagePart]);
    });
    
    const response = await result.response;
    const rawText = response.text();
    return formatGeminiResponse(rawText);
  } catch (error) {
    console.error('Error analyzing crop image:', error);
    const errorMessage = language === 'en' 
      ? 'Image analysis is temporarily unavailable. Please try again later.'
      : 'छवि विश्लेषण अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।';
    return errorMessage;
  }
};

// Get market analysis
export const getMarketAnalysis = async (language: string): Promise<string> => {
  const cacheKey = `analysis_market_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `You are an agricultural market expert. Provide current Indian agricultural market analysis:
      1. Price trends for major crops (rice, wheat, tomato, onion, potato)
      2. Which crops would be profitable to sell this week?
      3. What price changes are expected in the coming month?
      4. Suggestions for farmers
      
      Please provide practical and useful information based on current market conditions. Use plain text only, no markdown formatting, no bold text, no special characters.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const rawText = response.text();
    const data = formatGeminiResponse(rawText);
    setCachedData(cacheKey, data, CACHE_TTL.analysis);
    return data;
  } catch (error) {
    console.error('Error getting market analysis:', error);
    const errorMessage = language === 'en' 
      ? 'Market analysis is temporarily unavailable. Please try again later.'
      : 'बाजार विश्लेषण अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।';
    return errorMessage;
  }
};

// Get government scheme information
export const getSchemeInformation = async (language: string): Promise<string> => {
  const cacheKey = `analysis_schemes_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `You are a government scheme advisor. Provide information about major government schemes for Indian farmers:
      1. Detailed information about PM-Kisan scheme
      2. How to get drip irrigation subsidy?
      3. Application process for Kisan Credit Card
      4. Benefits of crop insurance scheme
      5. Required documents for applications
      
      Please provide step-by-step information in simple language. Use plain text only, no markdown formatting, no bold text, no special characters.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const rawText = response.text();
    const data = formatGeminiResponse(rawText);
    setCachedData(cacheKey, data, CACHE_TTL.analysis);
    return data;
  } catch (error) {
    console.error('Error getting scheme information:', error);
    const errorMessage = language === 'en' 
      ? 'Scheme information is temporarily unavailable. Please try again later.'
      : 'योजना की जानकारी अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।';
    return errorMessage;
  }
};

// Handle voice queries
export const handleVoiceQuery = async (query: string, language: string): Promise<string> => {
  try {
    const prompt = getLanguagePrompt(
      language,
      `You are an AI agricultural assistant. Farmer's question: "${query}"
      
      Please answer this question and if necessary:
      1. Provide practical suggestions
      2. Suggest local solutions
      3. Explain in simple language
      4. If technical information is needed, explain with examples
      
      Your main goal is to help the farmer with accurate, practical information. Use plain text only, no markdown formatting, no bold text, no special characters.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const rawText = response.text();
    return formatGeminiResponse(rawText);
  } catch (error) {
    console.error('Error handling voice query:', error);
    const errorMessage = language === 'en' 
      ? 'Voice assistant is temporarily unavailable. Please try again later.'
      : 'वॉइस असिस्टेंट अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।';
    return errorMessage;
  }
};

// Get weather forecast
export const getWeatherForecast = async (language: string): Promise<any> => {
  const cacheKey = `weather_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate current weather forecast for farming in Punjab, India. 
      Return as JSON with format: {
        "current": {
          "temperature": "25°C",
          "condition": "Partly Cloudy",
          "humidity": "65%",
          "windSpeed": "12 km/h",
          "visibility": "10 km"
        },
        "farmingAdvice": "Brief farming advice based on current weather"
      }.
      Use realistic weather data for Punjab region. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setCachedData(cacheKey, data, CACHE_TTL.analysis);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing weather JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = {
      current: {
        temperature: '25°C',
        condition: language === 'en' ? 'Partly Cloudy' : 'आंशिक बादल',
        humidity: '65%',
        windSpeed: '12 km/h',
        visibility: '10 km'
      },
      farmingAdvice: language === 'en' 
        ? 'Good weather for irrigation. Consider watering crops in the evening.'
        : 'सिंचाई के लिए अच्छा मौसम। शाम को फसलों को पानी देने पर विचार करें।'
    };
    setCachedData(cacheKey, fallbackData, CACHE_TTL.analysis);
    return fallbackData;
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    return null;
  }
};

// Get crop recommendations
export const getCropRecommendations = async (season: string, language: string): Promise<any[]> => {
  const cacheKey = `crop_recommendations_${season}_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate crop recommendations for ${season} season in Punjab, India. 
      Return as JSON array with format: [
        {
          "name": "crop name",
          "profitability": "High/Medium/Low",
          "growthTime": "X months",
          "waterRequirement": "High/Medium/Low",
          "tips": "brief growing tip"
        }
      ].
      Include 4-5 suitable crops for the season. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setCachedData(cacheKey, data, CACHE_TTL.analysis);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing crop recommendations JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = [
      {
        name: language === 'en' ? 'Wheat' : 'गेहूं',
        profitability: language === 'en' ? 'High' : 'उच्च',
        growthTime: language === 'en' ? '4-5 months' : '4-5 महीने',
        waterRequirement: language === 'en' ? 'Medium' : 'मध्यम',
        tips: language === 'en' ? 'Plant in November for best results' : 'सर्वोत्तम परिणामों के लिए नवंबर में बोएं'
      },
      {
        name: language === 'en' ? 'Rice' : 'चावल',
        profitability: language === 'en' ? 'Medium' : 'मध्यम',
        growthTime: language === 'en' ? '3-4 months' : '3-4 महीने',
        waterRequirement: language === 'en' ? 'High' : 'उच्च',
        tips: language === 'en' ? 'Ensure proper water management' : 'उचित जल प्रबंधन सुनिश्चित करें'
      }
    ];
    setCachedData(cacheKey, fallbackData, CACHE_TTL.analysis);
    return fallbackData;
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    return [];
  }
};

// Get farming tips
export const getFarmingTips = async (category: string, language: string): Promise<any[]> => {
  const cacheKey = `farming_tips_${category}_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate farming tips for ${category} category. 
      Return as JSON array with format: [
        {
          "title": "tip title",
          "description": "detailed description",
          "difficulty": "Easy/Medium/Hard",
          "benefits": "expected benefits"
        }
      ].
      Include 4-5 practical tips. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setCachedData(cacheKey, data, CACHE_TTL.analysis);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing farming tips JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = [
      {
        title: language === 'en' ? 'Soil Testing' : 'मिट्टी परीक्षण',
        description: language === 'en' ? 'Test your soil pH and nutrients regularly' : 'नियमित रूप से अपनी मिट्टी का pH और पोषक तत्व परीक्षण करें',
        difficulty: language === 'en' ? 'Easy' : 'आसान',
        benefits: language === 'en' ? 'Better crop yield and soil health' : 'बेहतर फसल उत्पादन और मिट्टी का स्वास्थ्य'
      },
      {
        title: language === 'en' ? 'Crop Rotation' : 'फसल चक्र',
        description: language === 'en' ? 'Rotate different crops to maintain soil fertility' : 'मिट्टी की उर्वरता बनाए रखने के लिए विभिन्न फसलों का चक्र करें',
        difficulty: language === 'en' ? 'Medium' : 'मध्यम',
        benefits: language === 'en' ? 'Improved soil health and pest control' : 'बेहतर मिट्टी स्वास्थ्य और कीट नियंत्रण'
      }
    ];
    setCachedData(cacheKey, fallbackData, CACHE_TTL.analysis);
    return fallbackData;
  } catch (error) {
    console.error('Error getting farming tips:', error);
    return [];
  }
};

// Get farm analytics
export const getFarmAnalytics = async (period: string, language: string): Promise<any> => {
  const cacheKey = `farm_analytics_${period}_${language}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = getLanguagePrompt(
      language,
      `Generate farm analytics data for ${period} period. 
      Return as JSON with format: {
        "revenue": "₹45,000",
        "expenses": "₹28,000",
        "profit": "₹17,000",
        "profitMargin": "38%",
        "revenueChange": "+12%",
        "expensesChange": "+5%",
        "profitChange": "+18%",
        "marginChange": "+3%",
        "recommendations": "brief recommendations for improvement"
      }.
      Use realistic Indian farming financial data. Use plain text only, no markdown formatting.`
    );

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setCachedData(cacheKey, data, CACHE_TTL.analysis);
        return data;
      }
    } catch (parseError) {
      console.error('Error parsing farm analytics JSON:', parseError);
    }
    
    // Fallback data
    const fallbackData = {
      revenue: '₹45,000',
      expenses: '₹28,000',
      profit: '₹17,000',
      profitMargin: '38%',
      revenueChange: '+12%',
      expensesChange: '+5%',
      profitChange: '+18%',
      marginChange: '+3%',
      recommendations: language === 'en' 
        ? 'Consider reducing fertilizer costs and exploring organic alternatives for better profit margins.'
        : 'बेहतर लाभ मार्जिन के लिए उर्वरक लागत कम करने और जैविक विकल्पों की खोज करने पर विचार करें।'
    };
    setCachedData(cacheKey, fallbackData, CACHE_TTL.analysis);
    return fallbackData;
  } catch (error) {
    console.error('Error getting farm analytics:', error);
    return null;
  }
};

// Handle quick actions
export const handleQuickAction = async (action: string, language: string): Promise<string> => {
  const actionPrompts: { [key: string]: string } = {
    weather: 'Provide today\'s weather information and crop suggestions based on current weather conditions in India',
    price: 'Provide current prices for rice and other major crops in Indian markets',
    scheme: 'Provide information about new government schemes for farmers',
    pest: 'Provide information about common pest problems and their solutions for Indian crops'
  };

  try {
    const basePrompt = actionPrompts[action] || 'Answer the farmer\'s question';
    const prompt = getLanguagePrompt(language, `You are an AI agricultural assistant. ${basePrompt}. Please provide practical and useful information. Use plain text only, no markdown formatting, no bold text, no special characters.`);

    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    const rawText = response.text();
    return formatGeminiResponse(rawText);
  } catch (error) {
    console.error('Error handling quick action:', error);
    const errorMessage = language === 'en' 
      ? 'Quick action is temporarily unavailable. Please try again later.'
      : 'त्वरित कार्रवाई अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।';
    return errorMessage;
  }
};