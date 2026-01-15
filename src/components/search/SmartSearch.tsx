import React, { useState, useRef, useEffect } from 'react';
import { AIServices } from '@/services/ai';

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  text: string;
  type: 'product' | 'category' | 'location';
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ 
  onSearch, 
  placeholder = "Search products, e.g. \"cheap tomatoes near me\"",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize AI services
  const aiServices = useRef<AIServices | null>(null);
  
  useEffect(() => {
    aiServices.current = new AIServices();
    // Warm up AI services
    aiServices.current.warmUpCache();
  }, []);

  const mockSuggestions: Suggestion[] = [
    { text: 'fresh tomatoes in Lilongwe', type: 'product' },
    { text: 'vegetables under 500 MWK', type: 'category' },
    { text: 'electronics near me', type: 'location' },
    { text: 'cheap phone accessories', type: 'product' },
  ];

  // AI-powered suggestions
  useEffect(() => {
    if (query.length > 2 && aiServices.current) {
      const getSuggestions = async () => {
        try {
          const aiSuggestions = await aiServices.current.GetSuggestions(query);
          const formattedSuggestions = aiSuggestions.map((text, index) => ({
            text,
            type: index % 3 === 0 ? 'product' : index % 3 === 1 ? 'category' : 'location'
          }));
          setSuggestions(formattedSuggestions);
          setShowDropdown(true);
        } catch (error) {
          console.error('AI suggestions failed:', error);
          // Fallback to mock suggestions
          const filtered = mockSuggestions.filter(s => 
            s.text.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
        }
      };
      
      getSuggestions();
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      console.log('AI search triggered:', query);
      // Use AI services for enhanced search
      performAISearch(query);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowDropdown(false);
    if (onSearch && aiServices.current) {
      console.log('AI suggestion selected:', suggestion.text);
      // Use AI services for enhanced search
      performAISearch(suggestion.text);
    }
  };
  
  // AI-powered search
  const performAISearch = async (searchQuery: string) => {
    if (!aiServices.current) return;
    
    try {
      console.log('Performing AI search for:', searchQuery);
      const aiResults = await aiServices.current.search(searchQuery, {
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
      });
      
      console.log('AI search results:', aiResults);
      
      // Apply AI filters to the search
      if (aiResults.filters) {
        // The AI service returns structured filters that we can apply
        console.log('AI generated filters:', aiResults.filters);
      }
      
      onSearch(searchQuery);
    } catch (error) {
      console.error('AI search failed:', error);
      // Fallback to regular search
      onSearch(searchQuery);
    }
  };
  
  // Generate session ID for tracking
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice result:', transcript);
        setQuery(transcript);
        if (onSearch) {
          onSearch(transcript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Handle different error types
        switch (event.error) {
          case 'no-speech':
            console.log('No speech detected');
            break;
          case 'audio-capture':
            console.log('Microphone not available');
            break;
          case 'not-allowed':
            console.log('Microphone permission denied');
            break;
          default:
            console.log('Speech recognition error:', event.error);
        }
      };
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    } else {
      console.log('Speech recognition not supported in this browser');
      // Fallback: show a message or use text input
      alert('Voice search is not supported in your browser. Please use the text search instead.');
    }
  };

  const handleImageSearch = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setShowImagePanel(true);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!aiServices.current) return;
    
    setIsAnalyzing(true);
    try {
      console.log('Starting AI image analysis...');
      
      // Use AI services for image recognition
      const imageResults = await aiServices.current.search(`image_analysis_${Date.now()}`, {
        imageData: selectedImage,
        analysisType: 'image_recognition',
        timestamp: new Date().toISOString()
      });
      
      console.log('AI image analysis results:', imageResults);
      
      // Extract meaningful search terms from AI results
      if (imageResults.results && imageResults.results.length > 0) {
        const searchTerms = imageResults.results
          .slice(0, 3)
          .map((result: any) => result.name || result.description || 'image product')
          .join(' ');
        
        // Update search query with AI results
        setQuery(searchTerms);
        if (onSearch) {
          onSearch(searchTerms);
        }
      } else {
        // Fallback search
        const fallbackTerms = 'image search results';
        setQuery(fallbackTerms);
        if (onSearch) {
          onSearch(fallbackTerms);
        }
      }
    } catch (error) {
      console.error('AI image analysis failed:', error);
      // Fallback search on error
      const fallbackTerms = 'image search results';
      setQuery(fallbackTerms);
      if (onSearch) {
        onSearch(fallbackTerms);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`smart-search-container relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="form-input-icon relative">
          <svg className="icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="form-input w-full pl-10 pr-24 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          
          {/* Voice Search Button */}
          <button 
            type="button" 
            onClick={handleVoiceSearch}
            className={`voice-search-btn absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors ${isListening ? 'listening text-red-500' : 'text-muted-foreground'}`}
            title="Search by voice"
          >
            <svg className="mic-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            {isListening && <div className="voice-pulse absolute inset-0 rounded-md border-2 border-red-500 animate-pulse"></div>}
          </button>
          
          {/* Image Search Button */}
          <button 
            type="button" 
            onClick={handleImageSearch}
            className="image-search-btn absolute right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="Search by photo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-label="Upload image for image search"
          />
          
          {/* AI Badge */}
          <div className="ai-badge absolute right-1 top-1/2 -translate-y-1/2 px-1.5 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-semibold" title="AI-Powered Search">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
      </form>
      
      {/* Smart Search Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="smart-search-dropdown absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="smart-search-suggestions p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground capitalize">{suggestion.type}</span>
                <span className="text-sm">{suggestion.text}</span>
              </button>
            ))}
          </div>
          <div className="smart-search-footer px-3 py-2 border-t border-border bg-muted/50">
            <span className="ai-hint text-xs text-muted-foreground">✨ AI understands natural language</span>
          </div>
        </div>
      )}
      
      {/* Image Search Results Panel (compact, anchored) */}
      {showImagePanel && (
        <div className="image-search-panel absolute top-full right-0 mt-2 z-50">
          <div className="bg-card rounded-md shadow-lg w-80 max-h-96 overflow-hidden border border-border">
            <div className="image-search-header flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="image-search-title font-medium text-sm">📷 AI Image Search</span>
              <button 
                type="button" 
                onClick={() => setShowImagePanel(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                aria-label="Close image search panel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="image-search-body p-3 flex gap-3 items-start">
              <div className="image-search-preview flex-shrink-0 w-20 h-20 bg-muted rounded overflow-hidden">
                {selectedImage ? (
                  <img src={selectedImage} alt="Search preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {isAnalyzing ? (
                  <div className="image-search-loading flex items-center gap-2">
                    <div className="spinner w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-sm">AI is analyzing your image...</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-sm">Image analysis complete</p>
                    <p className="text-xs mt-1">Showing similar products and suggestions.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="image-search-actions px-3 py-2 border-t border-border flex gap-2">
              <button
                type="button"
                onClick={() => {
                  // trigger search with the current image (extract simple query)
                  const simpleQuery = selectedImage ? `image_search_${Date.now()}` : '';
                  if (simpleQuery && aiServices.current) {
                    setIsAnalyzing(true);
                    aiServices.current.search(simpleQuery, { imageData: selectedImage }).then((res: any) => {
                      // apply results (update query or notify parent)
                      if (res && res.results && res.results.length > 0) {
                        const terms = res.results.slice(0,3).map((r: any) => r.name || r.description || '').join(' ');
                        setQuery(terms);
                        if (onSearch) onSearch(terms);
                      }
                    }).catch(() => {}).finally(() => setIsAnalyzing(false));
                  }
                }}
                className="btn btn-sm flex-1 bg-primary text-white rounded"
              >
                Search with image
              </button>
              <button
                type="button"
                onClick={() => setShowImagePanel(false)}
                className="btn btn-outline btn-sm flex-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;