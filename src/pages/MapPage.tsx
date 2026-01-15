import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Search, Building } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Malawi center coordinates
const MALAWI_CENTER: [number, number] = [-13.2543, 34.3015];
const MALAWI_ZOOM = 7;

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 10, { duration: 1 });
  }, [center, map]);

  return null;
}

export function MapPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MALAWI_CENTER);

  // Get unique cities from products
  const cities = Array.from(new Set(mockProducts.map(p => p.location.city))).sort();

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || product.location.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleProductClick = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product.id);
    setMapCenter([product.location.lat, product.location.lng]);
  };

  return (
    <div className="bg-background">
      {/* Page Header */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">{t('map.title') || 'Find Businesses Near You'}</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
              {/* Search */}
              <div className="bg-card rounded-lg border p-4">
                <label className="block text-sm font-medium mb-2">
                  {t('filter.search') || 'Search businesses...'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses or products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className="bg-card rounded-lg border p-4">
                <label className="block text-sm font-medium mb-2">
                  {t('map.city') || 'Select City'}
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Businesses List */}
              <div className="bg-card rounded-lg border p-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Businesses ({filteredProducts.length})
                </h3>
                <div className="space-y-3">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedProduct === product.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={product.images?.[0]?.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{product.businessName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{product.location.city}</p>
                          </div>
                          <p className="font-bold text-primary text-sm mt-1">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Area - Fixed z-index to stay below nav */}
            <div className="flex-1 relative z-0">
              <div className="bg-card rounded-lg border overflow-hidden min-h-[500px] lg:min-h-[600px] relative z-0">
                <MapContainer
                  center={MALAWI_CENTER}
                  zoom={MALAWI_ZOOM}
                  className="w-full min-h-[500px] lg:min-h-[600px]"
                  scrollWheelZoom={true}
                  style={{ zIndex: 0 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapController center={mapCenter} />

                  {filteredProducts.map(product => (
                    <Marker
                      key={product.id}
                      position={[product.location.lat, product.location.lng]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <img
                            src={product.images?.[0]?.image || 'https://via.placeholder.com/200x96?text=No+Image'}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <h3 className="font-semibold text-sm">{product.name}</h3>
                          <p className="text-xs text-gray-600">{product.businessName}</p>
                          <p className="font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                          <Link
                            to={`/product/${product.id}`}
                            className="block mt-2 text-center py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90"
                          >
                            View Product
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
