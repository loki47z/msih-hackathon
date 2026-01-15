import { mockProducts, categories, cities } from '@/data/products';
import { Product } from '@/types';

interface SearchOptions {
  timestamp?: string;
  sessionId?: string;
  imageData?: string | null;
  analysisType?: string;
  productContext?: {
    totalProducts: number;
    categories: string[];
    cities: string[];
  };
}

interface SearchFilters {
  category?: string;
  city?: string;
  priceRange?: [number | null, number | null];
}

interface SearchResult {
  results: Product[];
  filters?: SearchFilters;
  suggestions?: string[];
  imageAnalysis?: ImageAnalysisResult;
}

interface ImageAnalysisResult {
  labels: string[];
  colors: string[];
  objects: string[];
  confidence: number;
}

// MobileNet model singleton
let mobilenetModel: any = null;
let modelLoadingPromise: Promise<any> | null = null;

// Load MobileNet model (lazy loading)
async function loadMobileNetModel(): Promise<any> {
  if (mobilenetModel) return mobilenetModel;
  
  if (modelLoadingPromise) return modelLoadingPromise;
  
  modelLoadingPromise = (async () => {
    try {
      // Wait for TensorFlow.js and MobileNet to be available
      const tf = (window as any).tf;
      const mobilenet = (window as any).mobilenet;
      
      if (!tf || !mobilenet) {
        return null;
      }
      
      try {
        mobilenetModel = await mobilenet.load();
        return mobilenetModel;
      } catch (error) {
        console.error('Failed to load MobileNet model:', error);
        return null;
      }
    } catch (error) {
      console.error('Failed to load MobileNet model:', error);
      modelLoadingPromise = null;
      return null;
    }
  })();
  
  return modelLoadingPromise;
}

// Real image analysis using MobileNet (Google Lens-like)
async function analyzeImageWithMobileNet(imageData: string): Promise<ImageAnalysisResult> {
  try {
    const model = await loadMobileNetModel();
    
    if (!model) {
      console.warn('MobileNet not available, using color-based analysis');
      return await analyzeImageByColors(imageData);
    }
    
    // Create an image element from the data URL
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageData;
    });
    
    // Get predictions from MobileNet
    const predictions = await model.classify(img);
    
    // Extract the raw object names from predictions
    const objects = predictions.slice(0, 5).map((p: any) => {
      // Clean up MobileNet labels (they often have format "label, sublabel")
      return p.className.split(',')[0].trim();
    });
    
    // Map to product-relevant categories
    const labels = predictions.map((p: any) => {
      const label = p.className.toLowerCase();
      return mapToProductCategory(label);
    }).filter((l: string) => l !== 'unknown');
    
    // Get unique labels
    const uniqueLabels = [...new Set(labels)] as string[];
    
    // Extract colors from image
    const colors = await extractDominantColors(img);
    
    // Get the highest confidence
    const confidence = predictions.length > 0 ? predictions[0].probability : 0.5;
    
    return {
      labels: uniqueLabels.length > 0 ? uniqueLabels : objects.map(o => o.toLowerCase()),
      colors,
      objects,
      confidence
    };
  } catch (error) {
    console.error('MobileNet analysis failed:', error);
    return await analyzeImageByColors(imageData);
  }
}

// Analyze image by dominant colors when MobileNet is not available
async function analyzeImageByColors(imageData: string): Promise<ImageAnalysisResult> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageData;
    });
    
    const colors = await extractDominantColors(img);
    
    // Map colors to likely product categories
    const colorToCategory: Record<string, string[]> = {
      'green': ['Fresh Produce', 'vegetable', 'fruit'],
      'red': ['Fresh Produce', 'tomato', 'fruit'],
      'orange': ['Fresh Produce', 'fruit', 'mango', 'orange'],
      'yellow': ['Fresh Produce', 'banana', 'fruit'],
      'brown': ['Food & Beverages', 'Handcrafts', 'wood', 'coffee'],
      'blue': ['Electronics', 'Clothing & Textiles'],
      'purple': ['Clothing & Textiles', 'fabric'],
      'white': ['Food & Beverages', 'Clothing & Textiles'],
      'black': ['Electronics', 'Clothing & Textiles']
    };
    
    const labels: string[] = [];
    for (const color of colors) {
      if (colorToCategory[color]) {
        labels.push(...colorToCategory[color]);
      }
    }
    
    return {
      labels: [...new Set(labels)].slice(0, 3),
      colors,
      objects: ['Product detected by color'],
      confidence: 0.4
    };
  } catch (error) {
    console.error('Color analysis failed:', error);
    return {
      labels: ['product'],
      colors: ['unknown'],
      objects: ['Unknown product'],
      confidence: 0.2
    };
  }
}

// Map MobileNet labels to product categories
function mapToProductCategory(label: string): string {
  const categoryMappings: Record<string, string[]> = {
    'fruit': ['banana', 'orange', 'apple', 'lemon', 'pineapple', 'strawberry', 'fig', 'pomegranate', 'custard apple', 'jackfruit', 'granny smith'],
    'vegetable': ['cucumber', 'bell pepper', 'zucchini', 'artichoke', 'broccoli', 'cauliflower', 'mushroom', 'head cabbage', 'corn', 'acorn squash', 'butternut squash', 'spaghetti squash', 'cardoon'],
    'food': ['pizza', 'hamburger', 'hotdog', 'pretzel', 'bagel', 'cheeseburger', 'meat loaf', 'burrito', 'ice cream', 'chocolate', 'espresso', 'ice lolly', 'french loaf', 'consomme'],
    'fish': ['tench', 'goldfish', 'shark', 'gar', 'coho', 'barracouta', 'eel', 'anemone fish', 'sturgeon', 'puffer', 'rock beauty'],
    'clothing': ['jersey', 'cardigan', 'sweatshirt', 'jean', 'sock', 'miniskirt', 'bikini', 'kimono', 'abaya', 'academic gown', 'poncho', 'cloak', 'brassiere', 'vestment', 'pajama', 'bathing cap', 'wool', 'suit'],
    'electronics': ['laptop', 'notebook', 'desktop computer', 'monitor', 'mouse', 'keyboard', 'cellular telephone', 'ipod', 'remote control', 'screen', 'television', 'modem', 'hard disc', 'cd player', 'tape player', 'radio', 'speaker'],
    'handcraft': ['basket', 'crate', 'hamper', 'wicker basket', 'container', 'pot', 'vase', 'earthenware', 'clay', 'wooden spoon', 'mortar'],
    'jewelry': ['necklace', 'ring', 'chain', 'bangle', 'pendant'],
    'produce': ['grocery store', 'greengrocer', 'grocery', 'market', 'stall'],
    'poultry': ['hen', 'cock', 'rooster', 'chick', 'peacock', 'quail', 'partridge', 'goose', 'duck']
  };
  
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    if (keywords.some(keyword => label.includes(keyword) || keyword.includes(label))) {
      return category;
    }
  }
  
  // Check for broader matches
  if (label.includes('fruit') || label.includes('banana') || label.includes('orange') || label.includes('apple') || label.includes('mango')) {
    return 'fruit';
  }
  if (label.includes('vegetable') || label.includes('tomato') || label.includes('onion') || label.includes('carrot')) {
    return 'vegetable';
  }
  if (label.includes('cloth') || label.includes('shirt') || label.includes('dress') || label.includes('fabric')) {
    return 'clothing';
  }
  if (label.includes('phone') || label.includes('computer') || label.includes('electronic')) {
    return 'electronics';
  }
  if (label.includes('basket') || label.includes('craft') || label.includes('wood')) {
    return 'handcraft';
  }
  if (label.includes('food') || label.includes('bread') || label.includes('cake') || label.includes('meal')) {
    return 'food';
  }
  
  return 'unknown';
}

// Extract dominant colors from image
async function extractDominantColors(img: HTMLImageElement): Promise<string[]> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['unknown'];
    
    // Use a small size for faster processing
    const size = 50;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);
    
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // Simple color counting
    const colorCounts: Record<string, number> = {};
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const colorName = getColorName(r, g, b);
      colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
    }
    
    // Sort by frequency and return top 3
    return Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);
  } catch (error) {
    return ['unknown'];
  }
}

// Map RGB to color name
function getColorName(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2 / 255;
  
  if (lightness < 0.15) return 'black';
  if (lightness > 0.85) return 'white';
  
  const saturation = (max - min) / (255 - Math.abs(2 * lightness * 255 - 255));
  if (saturation < 0.15) return lightness > 0.5 ? 'gray' : 'dark gray';
  
  // Determine hue
  if (r > g && r > b) {
    if (g > b) return 'orange';
    return 'red';
  }
  if (g > r && g > b) {
    return 'green';
  }
  if (b > r && b > g) {
    return 'blue';
  }
  if (r > 200 && g > 200 && b < 100) return 'yellow';
  if (r > 150 && b > 150 && g < 100) return 'purple';
  if (r < 100 && g > 150 && b > 150) return 'cyan';
  
  return 'brown';
}

// Simple fuzzy matching function
function fuzzyMatch(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower.includes(queryLower)) return 1;
  
  // Word-by-word match
  const queryWords = queryLower.split(/\s+/);
  const matchedWords = queryWords.filter(word => textLower.includes(word));
  if (matchedWords.length > 0) {
    return matchedWords.length / queryWords.length;
  }
  
  return 0;
}

// Natural language query parser
function parseNaturalLanguageQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  const queryLower = query.toLowerCase();
  
  // Detect category mentions
  for (const category of categories) {
    if (queryLower.includes(category.toLowerCase())) {
      filters.category = category;
      break;
    }
  }
  
  // Detect city mentions
  for (const city of cities) {
    if (queryLower.includes(city.toLowerCase())) {
      filters.city = city;
      break;
    }
  }
  
  // Detect price range keywords
  if (queryLower.includes('cheap') || queryLower.includes('affordable') || queryLower.includes('budget')) {
    filters.priceRange = [null, 5000];
  } else if (queryLower.includes('expensive') || queryLower.includes('premium') || queryLower.includes('luxury')) {
    filters.priceRange = [10000, null];
  }
  
  // Detect specific price mentions
  const priceMatch = query.match(/under\s*(\d+)/i) || query.match(/below\s*(\d+)/i);
  if (priceMatch) {
    filters.priceRange = [null, parseInt(priceMatch[1])];
  }
  
  const aboveMatch = query.match(/above\s*(\d+)/i) || query.match(/over\s*(\d+)/i);
  if (aboveMatch) {
    filters.priceRange = [parseInt(aboveMatch[1]), null];
  }
  
  return filters;
}

// Generate smart suggestions based on query
function generateSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Category-based suggestions
  for (const category of categories) {
    if (category.toLowerCase().includes(queryLower) || queryLower.includes(category.toLowerCase().split(' ')[0])) {
      suggestions.push(`${category} products`);
    }
  }
  
  // City-based suggestions
  for (const city of cities) {
    if (queryLower.includes(city.toLowerCase().substring(0, 3))) {
      suggestions.push(`Products in ${city}`);
    }
  }
  
  // Product name suggestions
  for (const product of mockProducts.slice(0, 20)) {
    if (fuzzyMatch(product.name, query) > 0.3) {
      suggestions.push(product.name);
    }
  }
  
  // Common search patterns
  if (queryLower.includes('fresh')) {
    suggestions.push('Fresh produce near me');
    suggestions.push('Fresh vegetables in Lilongwe');
  }
  
  if (queryLower.includes('cheap') || queryLower.includes('affordable')) {
    suggestions.push('Affordable products under 5000 MWK');
  }
  
  return suggestions.slice(0, 5);
}

export class AIServices {
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new Map();
  }

  async warmUpCache(): Promise<void> {
    // Warm up cache with common queries
    const commonQueries = ['fresh produce', 'electronics', 'clothing', 'handcrafts'];
    for (const query of commonQueries) {
      await this.search(query, { sessionId: 'warmup' });
    }
  }

  private getCacheKey(query: string, opts?: SearchOptions): string {
    return `${query}_${opts?.analysisType || 'search'}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.cacheHits++;
      return cached.data;
    }
    this.cacheMisses++;
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async search(query: string, opts?: SearchOptions): Promise<SearchResult> {
    const cacheKey = this.getCacheKey(query, opts);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Handle image analysis with real MobileNet recognition
    if (opts?.analysisType === 'image_recognition' && opts?.imageData) {
      const imageAnalysis = await analyzeImageWithMobileNet(opts.imageData);
      
      // Score products based on how well they match the detected objects and categories
      const scoredProducts = mockProducts.map(product => {
        const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        let score = 0;
        
        // Check detected objects (raw MobileNet output)
        for (const obj of imageAnalysis.objects) {
          const objLower = obj.toLowerCase();
          // Check for partial word matches
          const words = objLower.split(/[\s,]+/);
          for (const word of words) {
            if (word.length > 2 && productText.includes(word)) {
              score += 5;
            }
          }
        }
        
        // Check mapped category labels
        for (const label of imageAnalysis.labels) {
          if (productText.includes(label.toLowerCase())) {
            score += 3;
          }
          // Also match category name
          if (product.category.toLowerCase().includes(label.toLowerCase())) {
            score += 4;
          }
        }
        
        // Check color matches in product description
        for (const color of imageAnalysis.colors) {
          if (productText.includes(color)) {
            score += 1;
          }
        }
        
        return { product, score };
      });

      // Sort by score and filter out zero scores
      const matchingProducts = scoredProducts
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ product }) => product);

      // If no matches, show all products (let user browse)
      const finalProducts = matchingProducts.length > 0 
        ? matchingProducts 
        : mockProducts.slice(0, 10);

      // Build suggestions from detected objects (the actual things detected)
      const suggestions = imageAnalysis.objects.slice(0, 3).map(o => 
        `Search for ${o.split(',')[0].trim()}`
      );

      const result: SearchResult = {
        results: finalProducts.slice(0, 10),
        filters: {},
        suggestions: [...new Set(suggestions)].slice(0, 5),
        imageAnalysis // Include analysis data for UI display
      };
      
      this.setCache(cacheKey, result);
      return result;
    }

    // Parse natural language query
    const filters = parseNaturalLanguageQuery(query);
    
    // Score and rank products
    const scoredProducts = mockProducts.map(product => {
      let score = 0;
      
      // Name match (highest weight)
      score += fuzzyMatch(product.name, query) * 10;
      
      // Description match
      score += fuzzyMatch(product.description, query) * 5;
      
      // Category match
      score += fuzzyMatch(product.category, query) * 3;
      
      // Business name match
      score += fuzzyMatch(product.businessName, query) * 2;
      
      // Location match
      score += fuzzyMatch(product.location.city, query) * 2;
      
      // Boost high-rated products
      score += product.rating * 0.5;
      
      return { product, score };
    });

    // Filter and sort by score
    let results = scoredProducts
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    // Apply parsed filters
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.city) {
      results = results.filter(p => p.location.city === filters.city);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      results = results.filter(p => 
        (min === null || p.price >= min) && 
        (max === null || p.price <= max)
      );
    }

    const suggestions = generateSuggestions(query);
    
    const result: SearchResult = {
      results: results.slice(0, 20),
      filters,
      suggestions
    };
    
    this.setCache(cacheKey, result);
    return result;
  }

  async getRecommendations(productId: string | number, limit = 5): Promise<Product[]> {
    const product = mockProducts.find(p => p.id === String(productId));
    if (!product) return [];

    // Find similar products based on category and price range
    const recommendations = mockProducts
      .filter(p => p.id !== String(productId))
      .map(p => {
        let score = 0;
        
        // Same category (high weight)
        if (p.category === product.category) score += 10;
        
        // Similar price (within 50%)
        const priceDiff = Math.abs(p.price - product.price) / product.price;
        if (priceDiff < 0.5) score += 5 * (1 - priceDiff);
        
        // Same city
        if (p.location.city === product.location.city) score += 3;
        
        // High rating
        score += p.rating;
        
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ product }) => product);

    return recommendations;
  }

  async getSuggestions(query: string): Promise<string[]> {
    return generateSuggestions(query);
  }

  // Alias for getSuggestions (for backwards compatibility)
  async GetSuggestions(query: string): Promise<string[]> {
    return this.getSuggestions(query);
  }

  getCacheStats(): { hits: number; misses: number } {
    return { hits: this.cacheHits, misses: this.cacheMisses };
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}
