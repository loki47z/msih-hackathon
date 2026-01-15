import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, Users, MessageSquare, TrendingUp, HelpCircle, Lightbulb, Settings, Grid, BarChart3, MapPin, Image, Plus, Star, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockPosts } from '@/data/products';
import { getRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const tagColors: Record<string, string> = {
  Wholesale: 'bg-blue-100 text-blue-700',
  Suppliers: 'bg-purple-100 text-purple-700',
  Opportunity: 'bg-green-100 text-green-700',
  Question: 'bg-orange-100 text-orange-700',
  Success: 'bg-pink-100 text-pink-700',
  Tips: 'bg-yellow-100 text-yellow-700',
};

export function CommunityPage() {
  const { user, isAuthenticated, isBusiness } = useAuth();
  const { t } = useLanguage();
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isBusiness) {
    return <Navigate to="/" replace />;
  }

  const toggleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    // In a real app, this would create a new post
    setNewPost('');
  };

  const filteredPosts = mockPosts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return post.likes > 20;
    if (activeTab === 'questions') return post.tag === 'Question';
    if (activeTab === 'opportunities') return post.tag === 'Opportunity';
    return true;
  });

  const topContributors = [
    { name: 'Salima Fresh Farms', avatar: 'S', posts: 48, badge: '🏆', color: 'bg-green-500' },
    { name: 'Lilongwe Crafts', avatar: 'L', posts: 35, badge: '', color: 'bg-blue-500' },
    { name: 'Green Tech MW', avatar: 'G', posts: 29, badge: '', color: 'bg-orange-500' },
  ];

  const popularTopics = [
    '# pricing-tips',
    '# suppliers',
    '# wholesale',
    '# marketing',
    '# farming',
    '# export',
    '# delivery',
    '# success-stories',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Community Hero */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Users className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">{t('community.title') || 'Business Community'}</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('community.subtitle') || 'Connect, collaborate, and grow with fellow Malawian business owners'}
          </p>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">248</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">1.2K</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>

        {/* Community Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-2">
            {/* Post Composer */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">Business Owner</div>
                  </div>
                </div>
                <Textarea
                  placeholder="Share insights, ask questions, or announce something..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Add Image"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Add Poll"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Tag Location"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                  <Button onClick={handlePost} className="gap-2">
                    <Send className="w-4 h-4" />
                    {t('Post') || 'Post'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'all'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
              >
                <Grid className="w-4 h-4" />
                All Posts
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'trending'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'questions'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
              >
                <HelpCircle className="w-4 h-4" />
                Questions
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'opportunities'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
              >
                <Lightbulb className="w-4 h-4" />
                Opportunities
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map(post => {
                const isLiked = likedPosts.includes(post.id);
                return (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      {/* Author */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                          {post.authorAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{post.authorName}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagColors[post.tag] || 'bg-gray-100 text-gray-700'}`}>
                              {post.tag}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getRelativeTime(post.timestamp)}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-6 pt-4 border-t border-border">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                          <Share2 className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Topics Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Hash className="w-4 h-4" />
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Star className="w-4 h-4" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${contributor.color} text-white flex items-center justify-center font-semibold text-sm`}>
                        {contributor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.posts} posts</div>
                      </div>
                      {contributor.badge && (
                        <span className="text-sm">{contributor.badge}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Tips Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Lightbulb className="w-4 h-4" />
                  Business Tip of the Day
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm mb-2 italic">
                    "Quality photos increase sales by up to 40%. Invest time in taking clear, well-lit images of your products."
                  </p>
                  <span className="text-xs text-muted-foreground">— MalawiMarket Insights</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Settings className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link to="/add-product">
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link to="/dashboard">
                      <Grid className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
