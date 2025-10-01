// Utility function to clean and format text from Gemini responses
export const formatGeminiResponse = (text: string): string => {
  if (!text) return '';
  
  // Remove markdown formatting characters
  let cleanText = text
    // Remove bold markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic markdown
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Remove headers
    .replace(/#{1,6}\s*(.*)/g, '$1')
    // Remove bullet points
    .replace(/^\s*[-*+]\s*/gm, '• ')
    // Remove numbered lists
    .replace(/^\s*\d+\.\s*/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    // Remove any remaining markdown characters
    .replace(/[_~`]/g, '');

  return cleanText;
};

// Format text for display with proper line breaks
export const formatForDisplay = (text: string): string => {
  const cleanText = formatGeminiResponse(text);
  
  // Ensure proper spacing between sentences
  return cleanText
    .replace(/\.\s*([A-Z])/g, '. $1')
    .replace(/\?\s*([A-Z])/g, '? $1')
    .replace(/!\s*([A-Z])/g, '! $1');
};