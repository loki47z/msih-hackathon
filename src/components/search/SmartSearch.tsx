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

interface AnalysisResult {
  labels: string[];
  objects: Array<{
    name: string;
    confidence: number;
  }>;
  confidence: number;
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Initialize AI services
  const aiServices = useRef<AIServices | null>(null);
  
  // Close camera menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCameraMenu) {
        const target = event.target as Element;
        if (!target.closest('.camera-dropdown')) {
          setShowCameraMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCameraMenu]);

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
      // Use AI services for enhanced search
      performAISearch(query);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text);
    setShowDropdown(false);
    if (onSearch && aiServices.current) {
      performAISearch(suggestion.text);
    }
  };
  
  // AI-powered search
  const performAISearch = async (searchQuery: string) => {
    if (!aiServices.current) return;
    
    try {
      const aiResults = await aiServices.current.search(searchQuery, {
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId()
      });
      
      // Apply AI filters to the search
      if (aiResults.filters) {
        // The AI service returns structured filters that we can apply
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
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        if (onSearch) {
          onSearch(transcript);
        }
      };
      
      recognition.onerror = (event: any) => {
        setIsListening(false);
        // Handle different error types
        switch (event.error) {
          case 'no-speech':
            break;
          case 'audio-capture':
            break;
          case 'not-allowed':
            break;
          default:
            break;
        }
      };
      
      try {
        recognition.start();
      } catch (error) {
        setIsListening(false);
      }
    } else {
      // Fallback: show a message or use text input
      alert('Voice search is not supported in your browser. Please use text search instead.');
    }
  };

  const handleImageSearch = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      streamRef.current = stream;
      setShowCamera(true);
      setShowImagePanel(true);
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      alert('Camera access denied. Please allow camera access or use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(imageData);
      setShowCamera(false);
      stopCamera();
      setAnalysisResult(null);
      analyzeImage(imageData);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setSelectedImage(imageData);
        setShowImagePanel(true);
        setShowCamera(false);
        setAnalysisResult(null);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    if (!aiServices.current) return;
    
    setIsAnalyzing(true);
    try {
      // Use AI services for image recognition (now using real MobileNet)
      const imageResults = await aiServices.current.search(`image_analysis_${Date.now()}`, {
        imageData: imageData,
        analysisType: 'image_recognition',
        timestamp: new Date().toISOString()
      });
      
      // Process and store analysis result for UI display
      if (imageResults.imageAnalysis) {
        // Parse objects with confidence scores
        let processedObjects: Array<{ name: string; confidence: number }> = [];
        
        if (Array.isArray(imageResults.imageAnalysis.objects)) {
          processedObjects = imageResults.imageAnalysis.objects.map((obj: any) => {
            if (typeof obj === 'string') {
              // Handle string format like "apple, 0.95"
              const [name, confidence] = obj.split(',').map(s => s.trim());
              return {
                name: name || obj,
                confidence: parseFloat(confidence) || 0.5
              };
            } else if (typeof obj === 'object' && obj !== null) {
              // Handle object format like { name: "apple", confidence: 0.95 }
              return {
                name: obj.name || obj.label || 'unknown',
                confidence: obj.confidence || obj.score || 0.5
              };
            }
            return {
              name: String(obj),
              confidence: 0.5
            };
          });
        }
        
        // Sort objects by confidence (highest first)
        processedObjects.sort((a, b) => b.confidence - a.confidence);
        
        const analysisData: AnalysisResult = {
          labels: imageResults.imageAnalysis.labels || [],
          objects: processedObjects,
          confidence: imageResults.imageAnalysis.confidence || 0.5
        };
        
        setAnalysisResult(analysisData);
        
        // Use highest scoring object for search
        if (processedObjects.length > 0) {
          const topObject = processedObjects[0];
          const searchQuery = topObject.name;
          
          setQuery(searchQuery);
          if (onSearch) {
            onSearch(searchQuery);
          }
        } else if (imageResults.imageAnalysis.labels.length > 0) {
          // Fallback to labels
          const searchTerms = imageResults.imageAnalysis.labels.slice(0, 2).join(' ');
          setQuery(searchTerms);
          if (onSearch) {
            onSearch(searchTerms);
          }
        }
      } else {
        // Fallback search if no analysis results
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
            className={`voice-search-btn absolute right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors ${isListening ? 'listening text-red-500' : 'text-muted-foreground'}`}
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
          
          {/* Single Camera Button with Dropdown */}
          <div className="camera-dropdown absolute right-12 top-1/2 -translate-y-1/2">
            <button 
              type="button" 
              onClick={() => setShowCameraMenu(!showCameraMenu)}
              className="camera-btn p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              title="Camera search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
            
            {/* Camera Dropdown Menu */}
            {showCameraMenu && (
              <div className="camera-menu absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCameraMenu(false);
                    handleCameraCapture();
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 rounded-t-md"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Take photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCameraMenu(false);
                    handleImageSearch();
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 rounded-b-md"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Upload image
                </button>
              </div>
            )}
          </div>
          
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
          <div className="bg-card rounded-md shadow-lg w-80 max-h-[28rem] overflow-hidden border border-border">
            <div className="image-search-header flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="image-search-title font-medium text-sm">
                {showCamera ? '📸 Take Photo' : '📷 AI Image Search'}
              </span>
              <button 
                type="button" 
                onClick={() => {
                  stopCamera();
                  setShowImagePanel(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                aria-label="Close image search panel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Camera View */}
            {showCamera ? (
              <div className="camera-view">
                <div className="relative bg-black">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 border-2 border-white/50 rounded-lg"></div>
                  </div>
                </div>
                <div className="p-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                    }}
                    className="btn btn-sm flex-1 bg-muted hover:bg-muted/80 text-foreground rounded text-sm py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="btn btn-sm flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    Capture
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                      <div className="image-search-loading flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="spinner w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <div className="text-sm font-medium">Analyzing image...</div>
                        </div>
                        <p className="text-xs text-muted-foreground">Using AI to identify objects</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span className="font-medium text-sm">Objects detected</span>
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {Math.round(analysisResult.confidence * 100)}% confident
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysisResult.objects.slice(0, 3).map((obj, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuery(obj.name);
                                if (onSearch) onSearch(obj.name);
                              }}
                              className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-full transition-colors flex items-center gap-1"
                            >
                              {obj.name}
                              <span className="text-muted-foreground/60">({Math.round(obj.confidence * 100)}%)</span>
                            </button>
                          ))}
                        </div>
                        {analysisResult.labels.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Categories: {analysisResult.labels.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-sm">Ready to analyze</p>
                        <p className="text-xs mt-1">Take a photo or upload an image</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="image-search-actions px-3 py-2 border-t border-border flex gap-2">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="btn btn-sm flex-1 bg-muted hover:bg-muted/80 text-foreground rounded text-sm py-1.5 flex items-center justify-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-sm flex-1 bg-muted hover:bg-muted/80 text-foreground rounded text-sm py-1.5 flex items-center justify-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImagePanel(false);
                      setAnalysisResult(null);
                    }}
                    className="btn btn-sm flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm py-1.5"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;