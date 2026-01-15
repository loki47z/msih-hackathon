import { useState, useMemo } from 'react';
import { Product, FilterState } from '@/types';
import { mockProducts } from '@/data/products';
import { AIServices } from '@/services/ai';

export function useProducts() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All Categories',
    city: 'All Cities',
    priceRange: [null, null],
    sortBy: 'newest',
    maxDistance: null,
  });
  
  // Initialize AI services
  const aiServices = useMemo(() => new AIServices(), []);

  const allProducts = useMemo(() => {
    const userProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
    const products = [...mockProducts, ...userProducts];
    console.log('All products loaded:', products.length);
    return products;
  }, [mockProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    console.log('Filtering products with filters:', filters);
    console.log('Starting with products:', result.length);

    // AI-enhanced search filter
    if (filters.search && filters.search.trim()) {
      const search = filters.search.toLowerCase();
      
      // Use AI services for enhanced search
      const performAISearch = async () => {
        try {
          console.log('Using AI services for product filtering...');
          const aiResults = await aiServices.search(search, {
            timestamp: new Date().toISOString(),
            sessionId: 'filter_' + Date.now(),
            productContext: {
              totalProducts: allProducts.length,
              categories: [...new Set(allProducts.map(p => p.category))],
              cities: [...new Set(allProducts.map(p => p.location.city))]
            }
          });
          
          console.log('AI search results for filtering:', aiResults);
          
          // Apply AI-generated filters if available
          if (aiResults.filters) {
            // Apply AI-recommended category filter
            if (aiResults.filters.category) {
              result = result.filter((p) => p.category === aiResults.filters.category);
              console.log('Applied AI category filter:', aiResults.filters.category);
            }
            
            // Apply AI-recommended city filter
            if (aiResults.filters.city) {
              result = result.filter((p) => p.location.city === aiResults.filters.city);
              console.log('Applied AI city filter:', aiResults.filters.city);
            }
            
            // Apply AI-recommended price range
            if (aiResults.filters.priceRange) {
              const [minPrice, maxPrice] = aiResults.filters.priceRange;
              if (minPrice !== null || maxPrice !== null) {
                result = result.filter(
                  (p) => (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice)
                );
                console.log('Applied AI price filter:', minPrice, '-', maxPrice);
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
            console.log('Applied AI semantic ranking');
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
      console.log('After search filter:', result.length);
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      result = result.filter((p) => p.category === filters.category);
      console.log('After category filter:', result.length);
    }

    // City filter
    if (filters.city !== 'All Cities') {
      result = result.filter((p) => p.location.city === filters.city);
      console.log('After city filter:', result.length);
    }

    // Price filter
    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice !== null || maxPrice !== null) {
      result = result.filter(
        (p) => (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice)
      );
      console.log('After price filter:', result.length);
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

    console.log('Final filtered products:', result.length);
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
      console.log('Getting AI recommendations for product:', productId);
      const recommendations = await aiServices.getRecommendations(productId, limit);
      console.log('AI recommendations:', recommendations);
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
    console.log('Clearing AI cache');
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
