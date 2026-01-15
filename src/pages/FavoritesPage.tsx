import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Search, Mic, Camera, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/useFavorites';
import { mockProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  useLanguage(); // Keep for potential future translations
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIBanner, setShowAIBanner] = useState(false);
  const [isListening, setIsListening] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const favoriteProducts = mockProducts.filter(p => favorites.includes(p.id));
  
  const filteredProducts = favoriteProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setShowAIBanner(true);
      };
      
      recognition.start();
    }
  };

  const handleImageSearch = () => {
    // Placeholder for image search functionality
  };

  const clearAISearch = () => {
    setSearchQuery('');
    setShowAIBanner(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">My Favourites</h2>
          <p className="text-muted-foreground text-lg">Your personal collection of saved items</p>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setShowAIBanner(true);
              }}
              className="pl-10 pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-100 text-red-600' : 'hover:bg-muted'
                }`}
                title="Search by voice"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleImageSearch}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Search by photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Search Banner */}
        {showAIBanner && searchQuery && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">
                AI found {filteredProducts.length} products matching "{searchQuery}"
              </span>
            </div>
            <button
              onClick={clearAISearch}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              title="Clear AI search"
            >
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={product.id}>
                <ProductCard product={product} index={index} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-muted rounded-full">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              {searchQuery ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">No products found</h2>
                  <p className="text-muted-foreground mb-6">
                    No favourites match your search for "{searchQuery}"
                  </p>
                  <Button onClick={clearAISearch} variant="outline">
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">No favourites yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Start exploring and save products you love!
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Browse Products
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
