import React from 'react';
import { FilterState } from '@/types';
import { categories, cities } from '@/data/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
}

export function ProductFilters({ filters, onFilterChange, onClear }: ProductFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 bg-card/80 backdrop-blur-md border border-border rounded-xl mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Category */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-muted-foreground mb-1">{t('filter.category')}</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All Categories' ? t('filter.all_categories') : cat}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-muted-foreground mb-1">{t('filter.location')}</label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="All Cities">{t('filter.all_locations')}</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Price Min */}
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs text-muted-foreground mb-1">Min Price</label>
          <input
            type="number"
            placeholder="0"
            value={filters.priceRange[0] ?? ''}
            onChange={(e) => onFilterChange('priceRange', [e.target.value ? parseInt(e.target.value) : null, filters.priceRange[1]])}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Price Max */}
        <div className="flex-1 min-w-[100px]">
          <label className="block text-xs text-muted-foreground mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Any"
            value={filters.priceRange[1] ?? ''}
            onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], e.target.value ? parseInt(e.target.value) : null])}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-muted-foreground mb-1">{t('filter.sort')}</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="newest">{t('filter.newest')}</option>
            <option value="price-low">{t('filter.price_low')}</option>
            <option value="price-high">{t('filter.price_high')}</option>
            <option value="rating">{t('filter.rating')}</option>
          </select>
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          {t('filter.clear')}
        </button>
      </div>
    </div>
  );
}
