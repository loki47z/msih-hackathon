import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, TrendingUp, Eye, MessageCircle, Plus, ChevronRight, Sparkles, Lightbulb, BarChart3, Bot, Send, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AIServices } from '@/services/ai';

// AI Insights Component
function AIInsights({ products }: { products: typeof mockProducts }) {
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
  const topCategory = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const insights = [
    {
      title: 'Revenue Opportunity',
      description: `Your products in "${mostPopularCategory}" category are performing well. Consider adding more items in this category.`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Price Optimization',
      description: `Your average product price is ${formatPrice(totalValue / products.length)}. Products priced 10-20% below average often sell faster.`,
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Rating Improvement',
      description: avgRating >= 4.5 
        ? 'Great job! Your products have excellent ratings. Keep up the quality!'
        : 'Consider improving product descriptions and photos to boost ratings.',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg border border-border/50">
          <div className={`p-2 rounded-lg ${insight.color} flex-shrink-0`}>
            <insight.icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{insight.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// AI Chat Assistant Component
function AIAssistant() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI business assistant. Ask me about pricing strategies, market trends, or how to improve your product listings!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const aiServices = new AIServices();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response with smart suggestions
    setTimeout(async () => {
      let response = '';
      const query = userMessage.toLowerCase();
      
      if (query.includes('price') || query.includes('pricing')) {
        response = 'Based on market analysis, competitive pricing in Malawi typically follows these guidelines:\n\n• Fresh produce: 10-20% below supermarket prices\n• Handcrafts: Premium pricing (20-30% above) for quality items\n• Electronics: Match or slightly undercut urban retail prices\n\nWould you like me to analyze your specific product pricing?';
      } else if (query.includes('trend') || query.includes('popular')) {
        const suggestions = await aiServices.getSuggestions('popular products');
        response = `Current market trends show high demand for:\n\n• Fresh organic produce (especially from local farms)\n• Solar-powered electronics\n• Traditional handcrafted items\n• Locally-made textiles\n\nYour "${suggestions[0] || 'products'}" category is trending! Consider expanding your inventory.`;
      } else if (query.includes('improve') || query.includes('better') || query.includes('tips')) {
        response = 'Here are AI-powered tips to improve your listings:\n\n1. **Use high-quality photos** - Natural lighting works best\n2. **Detailed descriptions** - Include size, material, and origin\n3. **Competitive pricing** - Research similar products\n4. **Quick responses** - Reply to inquiries within 2 hours\n5. **Regular updates** - Keep stock levels accurate\n\nWant me to analyze a specific product for improvements?';
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        response = 'Hello! I\'m here to help you grow your business. I can assist with:\n\n• Pricing strategies\n• Market trends analysis\n• Product listing optimization\n• Customer engagement tips\n\nWhat would you like to explore?';
      } else {
        response = `I understand you're asking about "${userMessage}". Here's what I can help with:\n\n• Analyze your product performance\n• Suggest pricing optimizations\n• Identify market opportunities\n• Provide listing improvement tips\n\nTry asking about "pricing tips", "market trends", or "how to improve my listings"!`;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-line ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <Bot className="w-3 h-3" />
                  <span>AI Assistant</span>
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Ask about pricing, trends, or tips..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Product Recommendations Component
function AIRecommendations({ products }: { products: typeof mockProducts }) {
  const recommendations = [
    { action: 'Add seasonal products', impact: 'High', reason: 'Holiday season approaching - 40% increase in gift searches' },
    { action: 'Update product photos', impact: 'Medium', reason: 'Products with multiple photos get 2x more views' },
    { action: 'Lower shipping costs', impact: 'High', reason: 'Free shipping increases conversion by 30%' },
    { action: 'Bundle related items', impact: 'Medium', reason: 'Product bundles increase average order value by 25%' },
  ];

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <div>
              <p className="font-medium text-sm">{rec.action}</p>
              <p className="text-xs text-muted-foreground">{rec.reason}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            rec.impact === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {rec.impact} Impact
          </span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { user, isAuthenticated, isBusiness } = useAuth();
  const { t } = useLanguage();
  const [myProducts, setMyProducts] = useState([]);

  // Load products on mount and when localStorage changes
  React.useEffect(() => {
    const loadProducts = () => {
      const userProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
      const products = [
        ...mockProducts.slice(0, 2), // Keep some hardcoded products
        ...userProducts.filter((p: any) => p.businessId === user?.id)
      ].slice(0, 4);
      setMyProducts(products);
    };

    loadProducts();

    // Listen for storage changes
    const handleStorageChange = () => loadProducts();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user?.id]);

  const handleDeleteProduct = (productId: string) => {
    // Remove from localStorage
    const userProducts = JSON.parse(localStorage.getItem("mw_products") || "[]");
    const updatedProducts = userProducts.filter((p: any) => p.id !== productId);
    localStorage.setItem("mw_products", JSON.stringify(updatedProducts));
    
    // Update state immediately for instant UI update
    const newProducts = [
      ...mockProducts.slice(0, 2),
      ...updatedProducts.filter((p: any) => p.businessId === user?.id)
    ].slice(0, 4);
    setMyProducts(newProducts);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isBusiness) {
    return <Navigate to="/" replace />;
  }

  // Mock business stats
  const stats = {
    totalProducts: 12,
    totalViews: 1247,
    totalMessages: 23,
    totalSales: 89500,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">Welcome back, {user?.businessName || user?.name}</p>
          </div>
          <Link to="/add-product">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalSales)}</p>
                  <p className="text-sm text-muted-foreground">Est. Sales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Business Insights</CardTitle>
                  <CardDescription>Personalized recommendations for your business</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AIInsights products={myProducts} />
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Smart Recommendations</CardTitle>
                  <CardDescription>Actions to grow your sales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AIRecommendations products={myProducts} />
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Assistant */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Business Assistant</CardTitle>
                <CardDescription>Ask questions about pricing, trends, and business tips</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AIAssistant />
          </CardContent>
        </Card>

        {/* My Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Products</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {myProducts.map(product => (
                <div key={product.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={product.images?.[0]?.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                    <p className="text-sm text-muted-foreground">{product.reviewCount} views</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
