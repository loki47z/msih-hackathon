import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Mail, Lock, User, Building, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'business'>('customer');
  const [businessName, setBusinessName] = useState('');
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, password, role, businessName: role === 'business' ? businessName : undefined });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold">Malawi<span className="text-primary">Market</span></span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{t('auth.register')}</h1>
            <p className="text-muted-foreground mt-1">{t('auth.join')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required minLength={6} className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${role === 'customer' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} className="sr-only" />
                  <ShoppingBag className="w-6 h-6 mb-2" />
                  <span className="font-medium text-sm">Customer</span>
                  <span className="text-xs text-muted-foreground">Browse & buy</span>
                </label>
                <label className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${role === 'business' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="role" value="business" checked={role === 'business'} onChange={() => setRole('business')} className="sr-only" />
                  <Building className="w-6 h-6 mb-2" />
                  <span className="font-medium text-sm">Business</span>
                  <span className="text-xs text-muted-foreground">Sell products</span>
                </label>
              </div>
            </div>

            {role === 'business' && (
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter business name" className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
              </div>
            )}

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.have_account')}{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">{t('auth.login')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
