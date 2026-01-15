import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  index?: number;
  key?: string | number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const liked = isFavorite(product.id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div 
      className="group bg-card rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in"
      style={{ animationDelay: `${(index % 8) * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images?.[0]?.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded-lg">
            +{product.images.length - 1} more
          </span>
        )}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-lg">
          {product.category}
        </span>
        <button
          onClick={handleLikeClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10
            ${liked 
              ? 'bg-red-50 opacity-100 scale-100' 
              : 'bg-card opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
            }`}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{product.location.city}</span>
          <span>•</span>
          <span className="truncate">{product.businessName}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
          >
            {t('products.view')}
          </Link>
        </div>
      </div>
    </div>
  );
}
