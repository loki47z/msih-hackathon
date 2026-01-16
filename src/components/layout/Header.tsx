import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  LayoutDashboard,
  Users,
  MessageCircle,
  Plus,
  LogOut,
  LogIn,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmartSearch } from '@/components/search/SmartSearch';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';

export function Header() {
  const { user, logout, isAuthenticated, isBusiness } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (query: string) => {
    // If we're on the home page, update the filter directly
    if (location.pathname === '/') {
      // Dispatch a custom event to update the search filter
      window.dispatchEvent(new CustomEvent('searchUpdate', { detail: query }));
    } else {
      // Navigate to home page with search query
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold hidden md:inline">
              Malawi<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Search Bar - Mobile */}
          <div className="md:hidden flex flex-1 max-w-md mx-2">
            <SmartSearch
              onSearch={handleSearch}
              placeholder={t('search.placeholder')}
            />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SmartSearch
              onSearch={handleSearch}
              placeholder={t('search.placeholder')}
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center p-1 bg-muted rounded-lg mr-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ny')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'ny' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
              >
                NY
              </button>
            </div>

            <Link to="/" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              <Home className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </Link>

            <Link to="/map" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
              <MapPin className="w-4 h-4" />
              <span>{t('nav.map')}</span>
            </Link>

            {isBusiness && (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <Link to="/community" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  <span>{t('nav.community')}</span>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <Link to="/messages" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{t('nav.messages')}</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-lg"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-card border border-border rounded-lg shadow-lg z-50">
                    {isBusiness && (
                      <Link
                        to="/add-product"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('nav.add_product')}</span>
                      </Link>
                    )}
                    <Link
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted"
                    >
                      <span>❤️</span>
                      <span>My Favourites</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setChangePasswordOpen(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{t('nav.change_password')}</span>
                    </button>
                    <hr className="border-border" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                <LogIn className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {/* Language Toggle */}
              <div className="flex items-center p-1 bg-muted rounded-lg w-fit mb-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ny')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'ny' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                >
                  NY
                </button>
              </div>

              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                <Home className="w-5 h-5" />
                <span>{t('nav.home')}</span>
              </Link>
              <Link to="/map" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                <MapPin className="w-5 h-5" />
                <span>{t('nav.map')}</span>
              </Link>
              {isBusiness && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                  <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                    <Users className="w-5 h-5" />
                    <span>{t('nav.community')}</span>
                  </Link>
                  <Link to="/add-product" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                    <Plus className="w-5 h-5" />
                    <span>{t('nav.add_product')}</span>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('nav.messages')}</span>
                </Link>
              )}
              {isAuthenticated && (
                <button onClick={() => { setMobileMenuOpen(false); setChangePasswordOpen(true); }} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg w-full text-left">
                  <Lock className="w-5 h-5" />
                  <span>{t('nav.change_password')}</span>
                </button>
              )}
              {isAuthenticated ? (
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg w-full text-left">
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-muted rounded-lg">
                  <LogIn className="w-5 h-5" />
                  <span>{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </header>
  );
}
