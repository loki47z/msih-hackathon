import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, cities } from '@/data/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

function LocationPicker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export function AddProductPage() {
  const { isAuthenticated, isBusiness, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    city: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    lat: null as number | null,
    lng: null as number | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isBusiness) {
    return <Navigate to="/" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const files = Array.from(fileList) as File[];
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newPreviews = prev.imagePreviews.filter((_, i) => i !== index);
      
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev.imagePreviews[index]);
      
      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.city || !formData.lat || !formData.lng || formData.images.length === 0) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields, including at least one product image and location pin.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Create new product object
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: formData.images.map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        productId: Date.now().toString(),
        image: URL.createObjectURL(file), // In real app, this would be uploaded to server
        imageMimeType: file.type,
        order: index,
        createdAt: new Date().toISOString()
      })),
      businessName: user?.businessName || 'Business Name',
      businessId: user?.id || 'business-id',
      location: {
        city: formData.city,
        lat: formData.lat!,
        lng: formData.lng!
      },
      rating: 0,
      reviewCount: 0,
      dateAdded: new Date().toISOString()
    };

    // Save to localStorage
    const existingProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
    localStorage.setItem("mw_products", JSON.stringify([...existingProducts, newProduct]));

    toast({
      title: 'Product added!',
      description: 'Your product has been listed successfully.',
    });

    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{t('add_product.title')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images *</Label>
                {formData.imagePreviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                      {formData.imagePreviews.length < 6 && (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer bg-muted/50 transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground text-center">Add More</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.imagePreviews.length} image{formData.imagePreviews.length !== 1 ? 's' : ''} uploaded (max 6)
                    </p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer bg-muted/50 transition-colors">
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload product images</span>
                    <span className="text-xs text-muted-foreground mt-1">You can upload multiple images at once (max 6)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Fresh Organic Mangoes"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (MK) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 5000"
                  min="0"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All Categories').map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>City *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Map Location */}
              <div className="space-y-2">
                <Label>Pin Location *</Label>
                <div className="h-[300px] w-full rounded-md border overflow-hidden relative">
                  <MapContainer
                    center={MALAWI_CENTER}
                    zoom={6}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      position={formData.lat && formData.lng ? [formData.lat, formData.lng] : null}
                      setPosition={(pos) => setFormData(prev => ({ ...prev, lat: pos[0], lng: pos[1] }))}
                    />
                  </MapContainer>
                  {(!formData.lat || !formData.lng) && (
                    <div className="absolute top-2 right-2 bg-background/90 px-3 py-1 rounded text-sm shadow-sm z-[1000] pointer-events-none">
                      Click map to pin location
                    </div>
                  )}
                </div>
                {formData.lat && formData.lng && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Selected: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
