import { useState, useMemo, useEffect } from 'react';
import { Product, FilterState } from '@/types';
import { mockProducts } from '@/data/products';
import { AIServices } from '@/services/ai';
import { haversineDistance } from '@/lib/utils';

export function useProducts() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All Categories',
    city: 'All Cities',
    priceRange: [null, null],
    sortBy: 'newest',
    maxDistance: null,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // When maxDistance is set, attempt to get user's geolocation (once)
  useEffect(() => {
    if (filters.maxDistance === null) return;
    if (!navigator || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn('Geolocation unavailable or denied:', err.message);
        setUserLocation(null);
      },
      { enableHighAccuracy: false, maximumAge: 1000 * 60 * 5, timeout: 5000 }
    );
  }, [filters.maxDistance]);
  
  // Initialize AI services
  const aiServices = useMemo(() => new AIServices(), []);

  const allProducts = useMemo(() => {
    const userProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
    const products = [...mockProducts, ...userProducts];
    return products;
  }, [mockProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // AI-enhanced search filter
    if (filters.search && filters.search.trim()) {
      const search = filters.search.toLowerCase();
      
      // Use AI services for enhanced search
      const performAISearch = async () => {
        try {
          const aiResults = await aiServices.search(search, {
            timestamp: new Date().toISOString(),
            sessionId: 'filter_' + Date.now(),
            productContext: {
              totalProducts: allProducts.length,
              categories: [...new Set(allProducts.map(p => p.category))],
              cities: [...new Set(allProducts.map(p => p.location.city))]
            }
          });
          
          // Apply AI-generated filters if available
          if (aiResults.filters) {
            // Apply AI-recommended category filter
            if (aiResults.filters.category) {
              result = result.filter((p) => p.category === aiResults.filters.category);
            }
            
            // Apply AI-recommended city filter
            if (aiResults.filters.city) {
              result = result.filter((p) => p.location.city === aiResults.filters.city);
            }
            
            // Apply AI-recommended price range
            if (aiResults.filters.priceRange) {
              const [minPrice, maxPrice] = aiResults.filters.priceRange;
              if (minPrice !== null || maxPrice !== null) {
                result = result.filter(
                  (p) => (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice)
                );
              }
            }
          }
          
          // Use AI semantic search results for enhanced matching
          if (aiResults.results && aiResults.results.length > 0) {
            const aiProductIds = new Set(aiResults.results.map((r: any) => r.id));
            // Prioritize AI-recommended products
            result = [
              ...result.filter(p => aiProductIds.has(p.id)),
              ...result.filter(p => !aiProductIds.has(p.id))
            ];
          }
          
        } catch (error) {
          console.error('AI filtering failed, using fallback:', error);
        }
      };
      
      // Fallback to traditional search
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.businessName.toLowerCase().includes(search)
      );
      
      // Perform AI search asynchronously
      performAISearch();
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      result = result.filter((p) => p.category === filters.category);
    }

    // City filter
    if (filters.city !== 'All Cities') {
      result = result.filter((p) => p.location.city === filters.city);
    }

    // Price filter
    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice !== null || maxPrice !== null) {
      result = result.filter(
        (p) => (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
    // Distance filter (requires userLocation)
    if (filters.maxDistance !== null) {
      // If we have a user location, filter by Haversine distance
      if (userLocation) {
        result = result.filter((p) => {
          const d = haversineDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng);
          return d <= (filters.maxDistance as number);
        });
      } else {
        // If no user location, don't filter (user likely denied geolocation)
        // Alternatively, you could infer from city but we'll skip for now.
      }
    }

    return result;
  }, [allProducts, filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      city: 'All Cities',
      priceRange: [null, null],
      sortBy: 'newest',
      maxDistance: null,
    });
  };

  const getProductById = (id: string): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  // Get AI-powered product recommendations
  const getRecommendations = async (productId: string, limit = 5) => {
    try {
      const recommendations = await aiServices.getRecommendations(productId, limit);
      return recommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return [];
    }
  };

  // Get AI cache statistics
  const getCacheStats = () => {
    return aiServices.getCacheStats();
  };

  // Clear AI cache
  const clearCache = () => {
    aiServices.clearCache();
  };

  return {
    products: filteredProducts,
    allProducts,
    filters,
    updateFilter,
    clearFilters,
    getProductById,
    getRecommendations,
    getCacheStats,
    clearCache,
  };
}
