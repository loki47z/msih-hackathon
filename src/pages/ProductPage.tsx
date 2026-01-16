import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/products/ProductCard';
import { ExternalLink } from '@/components/ui/ExternalLink';

interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Amina Banda',
    rating: 5,
    comment: 'Excellent quality mangoes! Very fresh and sweet. Will definitely order again.',
    timestamp: '2024-01-15T10:30:00',
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'John Phiri',
    rating: 4,
    comment: 'Good quality and fast delivery. The mangoes were well packaged.',
    timestamp: '2024-01-14T15:45:00',
  },
  {
    id: 'r3',
    productId: '1',
    userName: 'Maria Chikwanda',
    rating: 5,
    comment: 'Best mangoes I\'ve had this season! Highly recommend Salima Fresh Farms.',
    timestamp: '2024-01-13T09:20:00',
  },
];

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews.filter(r => r.productId === id));
  const [_showPopup, setShowPopup] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const userProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
  const allProducts = [...mockProducts, ...userProducts];
  const product = allProducts.find(p => p.id === id);

  // Fix for default icon not showing in Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const liked = isFavorite(product.id);
  const similarProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const sellerId = product.businessId;
    const sellerName = encodeURIComponent(product.businessName);
    const sellerAvatar = encodeURIComponent((product.businessName || '').charAt(0).toUpperCase());
    navigate(`/messages?sellerId=${sellerId}&sellerName=${sellerName}&sellerAvatar=${sellerAvatar}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating || !reviewText.trim()) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userName: user?.name || 'Anonymous',
      rating: selectedRating,
      comment: reviewText,
      timestamp: new Date().toISOString(),
    };
    
    setReviews(prev => [newReview, ...prev]);
    setSelectedRating(0);
    setReviewText('');
  };

  const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (rate: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'hover:scale-110' : ''} transition-transform`}
            disabled={!interactive}
            aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : `Rated ${star} star${star > 1 ? 's' : ''}`}
            title={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : `Rated ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('product.back') || 'Back to Products'}</span>
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images?.[selectedImageIndex]?.image || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  liked ? 'bg-red-50 text-red-500' : 'bg-white/90 hover:bg-white text-gray-600'
                }`}
                aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                title={liked ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
              </button>
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-primary scale-105' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full w-fit mb-4">
              {product.category}
            </span>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(parseFloat(averageRating))} />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{product.location.city}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{product.description}</p>

            <div className="text-4xl font-bold text-primary mb-8">
              {formatPrice(product.price)}
            </div>

            {/* Seller Info */}
            <div className="bg-muted rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Sold by</p>
              <p className="font-semibold text-xl mb-1">{product.businessName}</p>
              <p className="text-sm text-muted-foreground">{product.location.city}, Malawi</p>
            </div>

            {/* Map Container */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <MapContainer
                center={[product.location.lat, product.location.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[product.location.lat, product.location.lng]} eventHandlers={{
                    click: () => setShowPopup(true),
                  }}>
                  <Popup>
                    <div className="font-semibold mb-2">{product.businessName}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <ExternalLink
                        href={`https://www.google.com/maps/dir/?api=1&destination=${product.location.lat},${product.location.lng}&destination_place_id=${product.businessName.replace(/\s+/g, '+')}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Send className="w-4 h-4" />
                        Get Directions
                      </ExternalLink>
                    </div>
                    <div className="text-center">
                      <button
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Like this place"
                        title="Like this place"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Like this place</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button 
                onClick={handleContactSeller}
                className="flex-1 gap-2"
                size="lg"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Seller
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t('product.reviews') || 'Customer Reviews'}</h2>
            <span className="text-muted-foreground">({reviews.length})</span>
          </div>

          {/* Average Rating Display */}
          <div className="bg-muted rounded-xl p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating}</div>
                <StarRating rating={Math.round(parseFloat(averageRating))} />
                <div className="text-sm text-muted-foreground mt-2">
                  {reviews.length > 0 ? `${reviews.length} reviews` : 'No reviews yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {isAuthenticated ? (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Rating:</label>
                    <StarRating 
                      rating={selectedRating} 
                      interactive 
                      onRate={setSelectedRating}
                    />
                  </div>
                  <div className="mb-4">
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="gap-2">
                    <Send className="w-4 h-4" />
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Please <Link to="/login" className="text-primary hover:underline">login</Link> to write a review
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">{t('product.similar') || 'Similar Products'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
