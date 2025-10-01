// Multi-API configuration with automatic failover
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Keys configuration
const API_KEYS = [
  '', // Primary API
  ''   // Backup API
];

// API Management System
class APIManager {
  private currentAPIIndex = 0;
  private apiInstances: GoogleGenerativeAI[] = [];
  private failureCounts: number[] = [];
  private lastFailureTime: number[] = [];
  private readonly MAX_FAILURES_PER_API = 3;
  private readonly FAILURE_RESET_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    // Initialize API instances
    this.apiInstances = API_KEYS.map(key => new GoogleGenerativeAI(key));
    this.failureCounts = new Array(API_KEYS.length).fill(0);
    this.lastFailureTime = new Array(API_KEYS.length).fill(0);
    
    console.log(`🚀 API Manager initialized with ${API_KEYS.length} API keys`);
  }

  // Get current working API instance
  getCurrentAPI(): GoogleGenerativeAI {
    this.resetExpiredFailures();
    return this.apiInstances[this.currentAPIIndex];
  }

  // Get current working model
  getCurrentModel() {
    const api = this.getCurrentAPI();
    return api.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
  }

  // Get current working vision model
  getCurrentVisionModel() {
    const api = this.getCurrentAPI();
    return api.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
  }

  // Handle API failure and switch to next available API
  handleAPIFailure(error: any): boolean {
    const isQuotaError = this.isQuotaLimitError(error);
    
    if (isQuotaError) {
      console.warn(`⚠️ API ${this.currentAPIIndex + 1} quota limit reached:`, error.message);
      
      // Mark current API as failed
      this.failureCounts[this.currentAPIIndex]++;
      this.lastFailureTime[this.currentAPIIndex] = Date.now();
      
      // Try to switch to next available API
      const nextAPI = this.findNextWorkingAPI();
      
      if (nextAPI !== -1) {
        const oldAPI = this.currentAPIIndex + 1;
        this.currentAPIIndex = nextAPI;
        console.log(` Switched from API ${oldAPI} to API ${this.currentAPIIndex + 1}`);
        return true; // Successfully switched
      } else {
        console.error(' All APIs have reached their limits or failed');
        // Reset all failure counts as last resort
        this.resetAllFailures();
        return false; // No working API available
      }
    }
    
    return false; // Not a quota error, don't switch
  }

  // Check if error is related to quota/rate limits
  private isQuotaLimitError(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code || error.status;
    
    return (
      errorCode === 429 ||
      errorMessage.includes('quota') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('resource_exhausted') ||
      errorMessage.includes('too many requests') ||
      errorMessage.includes('limit exceeded')
    );
  }

  // Find next working API
  private findNextWorkingAPI(): number {
    const startIndex = this.currentAPIIndex;
    
    for (let i = 1; i < API_KEYS.length; i++) {
      const nextIndex = (startIndex + i) % API_KEYS.length;
      
      if (this.failureCounts[nextIndex] < this.MAX_FAILURES_PER_API) {
        return nextIndex;
      }
    }
    
    return -1; // No working API found
  }

  // Reset failure counts for APIs that have exceeded the reset time
  private resetExpiredFailures(): void {
    const now = Date.now();
    
    for (let i = 0; i < this.failureCounts.length; i++) {
      if (this.failureCounts[i] > 0 && 
          now - this.lastFailureTime[i] > this.FAILURE_RESET_TIME) {
        console.log(`🔄 Resetting failure count for API ${i + 1} after cooldown period`);
        this.failureCounts[i] = 0;
        this.lastFailureTime[i] = 0;
      }
    }
  }

  // Reset all failure counts (emergency fallback)
  private resetAllFailures(): void {
    console.log('🔄 Emergency reset: Clearing all API failure counts');
    this.failureCounts.fill(0);
    this.lastFailureTime.fill(0);
    this.currentAPIIndex = 0;
  }

  // Get current API status for debugging
  getAPIStatus(): any {
    return {
      currentAPI: this.currentAPIIndex + 1,
      totalAPIs: API_KEYS.length,
      failureCounts: this.failureCounts,
      workingAPIs: this.failureCounts.filter(count => count < this.MAX_FAILURES_PER_API).length
    };
  }
}

// Create singleton instance
export const apiManager = new APIManager();

// Export models that automatically use the current working API
export const model = apiManager.getCurrentModel();
export const visionModel = apiManager.getCurrentVisionModel();

// Legacy exports for backward compatibility
export const genAI = apiManager.getCurrentAPI();