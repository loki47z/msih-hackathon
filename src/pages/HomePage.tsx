import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SmartSearch } from '@/components/search/SmartSearch';
import { Package } from 'lucide-react';
import { useEffect } from 'react';

export function HomePage() {
  const { products, filters, updateFilter, clearFilters } = useProducts();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  // Handle search from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchQuery !== filters.search) {
      updateFilter('search', searchQuery);
    }
  }, [searchParams, filters.search, updateFilter]);

  // Handle search updates from Header component
  useEffect(() => {
    const handleSearchUpdate = (event: CustomEvent) => {
      updateFilter('search', event.detail);
    };

    window.addEventListener('searchUpdate', handleSearchUpdate as EventListener);
    
    return () => {
      window.removeEventListener('searchUpdate', handleSearchUpdate as EventListener);
    };
  }, [updateFilter]);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Update the search filter directly
    updateFilter('search', query);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero animate-fade-in relative py-16 md:py-24 overflow-hidden">
        <div className="hero-bg absolute inset-0">
          <img 
            src="/prod/1-Blantyre_market.jpg" 
            alt="Blantyre Market" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        </div>
        <div className="container relative z-10">
          <div className="hero-content text-center">
            <h1 className="hero-title text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in animate-delay-1">
              Discover Local Treasures
            </h1>
            <p className="hero-subtitle text-lg md:text-xl text-white/90 mb-8 drop-shadow-md animate-fade-in animate-delay-2">
              Connect with best businesses and products across Malawi.
              Support local commerce today.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-3">
              <a href="#products" className="btn btn-primary btn-lg btn-hero px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-transform">
                Start Exploration
              </a>
              <Link to="/map" className="btn btn-outline btn-lg px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-2xl hover:bg-white/10 transition-colors">
                View Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">{t('products.title')}</h2>
            <p className="text-muted-foreground mt-1">{t('products.subtitle')}</p>
          </div>

          
          <ProductFilters 
            filters={filters} 
            onFilterChange={updateFilter} 
            onClear={clearFilters} 
          />

          
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-full">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('products.no_results')}</h3>
              <p className="text-muted-foreground">{t('products.clear_filters')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
