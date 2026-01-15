import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, Package, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-12 pb-12 border-b border-white/10">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">500+</div>
            <div className="text-sm text-white/60">{t('footer.products')}</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">120+</div>
            <div className="text-sm text-white/60">{t('footer.businesses')}</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-lg bg-accent/20 text-accent">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">28</div>
            <div className="text-sm text-white/60">{t('footer.districts')}</div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">
                Malawi<span className="text-primary">Market</span>
              </span>
            </div>
            <p className="text-white/70 mb-4 leading-relaxed">
              Connecting local businesses with customers across Malawi. Supporting the warm heart of Africa's commerce.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="w-4 h-4" />
              <span>Lilongwe, Malawi</span>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 text-sm hover:text-primary transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-white/70 text-sm hover:text-primary transition-colors">
                  View Map
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-white/70 text-sm hover:text-primary transition-colors">
                  Register Business
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="text-white/70 text-sm hover:text-primary transition-colors">
                  List Products
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-white/70 text-sm hover:text-primary transition-colors">
                  Business Community
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 text-sm hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60">{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">{t('footer.terms')}</a>
            <a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">{t('footer.contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
