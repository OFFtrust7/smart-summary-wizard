import { AIModelAdapter, AIModelOptions, AIModelResponse } from './interface';
import { DefaultAIModel } from './defaultModel';
import { OpenAIModel } from './openaiModel';
import { AICache } from './cache';
import { env } from '@/config/env';

/**
 * Main AI service that handles model selection, caching, and fallbacks
 */
export class AIService {
  private static instance: AIService;
  private adapters: Map<string, AIModelAdapter>;
  private defaultAdapter: string;
  private cache: AICache;
  private apiUrl: string = '';
  private openaiApiKey: string = '';

  private constructor() {
    this.adapters = new Map();
    this.defaultAdapter = 'default';
    this.cache = new AICache(50, 1800); // Cache 50 items for 30 minutes
    
    // Register the default adapter
    this.registerAdapter('default', new DefaultAIModel(this.apiUrl));
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Configure the AI service with environment settings
   */
  public configure(apiUrl: string, openaiApiKey?: string): void {
    this.apiUrl = apiUrl;
    
    // Update the default adapter with the new API URL
    this.registerAdapter('default', new DefaultAIModel(apiUrl));
    
    // Configure OpenAI if API key is provided
    if (openaiApiKey) {
      this.openaiApiKey = openaiApiKey;
      this.registerAdapter('openai', new OpenAIModel(openaiApiKey));
      this.setDefaultAdapter('openai'); // Use OpenAI as default if configured
      console.log('OpenAI adapter configured and set as default');
    }
    
    console.log(`AI Service configured with API URL: ${apiUrl}`);
  }

  /**
   * Configure OpenAI adapter separately
   */
  public configureOpenAI(apiKey: string, model?: string): void {
    if (!apiKey) {
      console.warn("OpenAI configuration failed: No API key provided");
      return;
    }
    
    this.openaiApiKey = apiKey;
    this.registerAdapter('openai', new OpenAIModel(apiKey, model));
    this.setDefaultAdapter('openai');
    console.log(`OpenAI adapter configured with model: ${model || 'gpt-4o-mini'}`);
  }

  /**
   * Register a new AI model adapter
   */
  public registerAdapter(name: string, adapter: AIModelAdapter): void {
    this.adapters.set(name, adapter);
  }

  /**
   * Set the default adapter to use
   */
  public setDefaultAdapter(name: string): void {
    if (!this.adapters.has(name)) {
      throw new Error(`Adapter '${name}' is not registered`);
    }
    this.defaultAdapter = name;
  }

  /**
   * Generate a response using the specified or default adapter
   * With built-in caching
   */
  public async generateResponse(
    prompt: string, 
    options: AIModelOptions = {},
    adapterName?: string
  ): Promise<AIModelResponse> {
    const useCaching = options.stream !== true; // Don't cache streaming responses
    
    if (useCaching) {
      // Create a cache key from the prompt and options
      const cacheKey = this.createCacheKey(prompt, options, adapterName);
      
      // Check cache first
      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse) {
        console.log('Using cached AI response');
        return cachedResponse;
      }
    }
    
    try {
      // Get the adapter
      const adapter = this.getAdapter(adapterName);
      
      // Generate the response
      const response = await adapter.generateResponse(prompt, options);
      
      // Cache successful responses
      if (options.stream !== true && response.success && response.text) {
        const cacheKey = this.createCacheKey(prompt, options, adapterName);
        this.cache.set(cacheKey, response);
      }
      
      return response;
    } catch (error) {
      console.error('AI Service error:', error);
      
      // Always return a valid response object
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get an adapter by name, falling back to the default
   */
  private getAdapter(name?: string): AIModelAdapter {
    const adapterName = name || this.defaultAdapter;
    const adapter = this.adapters.get(adapterName);
    
    if (!adapter) {
      // Fallback to default if specified adapter doesn't exist
      return this.adapters.get(this.defaultAdapter)!;
    }
    
    return adapter;
  }

  /**
   * Create a cache key from a prompt and options
   */
  private createCacheKey(prompt: string, options: AIModelOptions, adapterName?: string): string {
    const keyParts = [
      adapterName || this.defaultAdapter,
      prompt,
      options.maxLength,
      options.temperature
    ];
    
    return keyParts.join('::');
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
