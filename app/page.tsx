import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="logo-text">Malawi<span>Market</span></span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="search-bar">
              <div className="smart-search-container">
                <div className="form-input-icon">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" id="smart-search-input" className="form-input"
                    placeholder='Search products, e.g. "cheap tomatoes near me"' />
                  {/* Voice Search Button */}
                  <button type="button" className="voice-search-btn" id="voice-search-btn" title="Search by voice">
                    <svg className="mic-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <div className="voice-pulse"></div>
                  </button>
                  {/* Image Search Button */}
                  <button type="button" className="image-search-btn" id="image-search-btn" title="Search by photo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </button>
                  {/* <input type="file" id="image-search-input" accept="image/*" aria-label="Upload image for image search"
                    title="Upload image for image search" /> */}
                  <div className="ai-badge" title="AI-Powered Search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="desktop-nav">
              <div className="lang-toggle">
                <button className="lang-btn active" data-lang="en">EN</button>
                <button className="lang-btn" data-lang="ny">NY</button>
              </div>

              <Link href="/" className="btn btn-ghost btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span data-t="nav.home">Home</span>
              </Link>

              <Link href="/map" className="btn btn-ghost btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span data-t="nav.map">Map</span>
              </Link>

              <Link href="/dashboard" className="btn btn-ghost btn-sm" data-auth="business">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                <span data-t="nav.dashboard">Dashboard</span>
              </Link>

              <Link href="/community" className="btn btn-ghost btn-sm" data-auth="business">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span data-t="nav.community">Community</span>
              </Link>

              <Link href="/messages" className="btn btn-ghost btn-sm" data-auth="user">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span data-t="nav.messages">Messages</span>
              </Link>

              {/* User Menu simulated */}
              <div className="user-menu" data-auth="user">
                <button className="user-btn" id="user-menu-btn">
                  <div className="user-avatar" data-user="avatar">U</div>
                  <span data-user="name">User</span>
                </button>
              </div>

              <Link href="/login" className="btn btn-primary btn-sm" data-auth="guest">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span data-t="nav.login">Login</span>
              </Link>
            </nav>

            <button className="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero animate-fade-in">
          <div className="hero-bg">
            <img src="/prod/1-Blantyre_market.jpg" alt="Market" className="w-full h-full object-cover" />
          </div>
          <div className="container relative z-10">
            <div className="hero-content text-center">
              <h1 className="hero-title animate-fade-in animate-delay-1">Discover Local Treasures</h1>
              <p className="hero-subtitle animate-fade-in animate-delay-2" style={{ color: "white" }}>
                Connect with the best businesses and products across Malawi.
                Support local commerce today.
              </p>
              <div className="hero-buttons animate-fade-in animate-delay-3">
                <Link href="#products" className="btn btn-primary btn-lg btn-hero">Start Exploration</Link>
                <Link href="/map" className="btn btn-outline btn-lg" style={{ color: "white" }}>View Map</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title reveal-on-scroll" data-t="products.title">Featured Products</h2>
              <p className="section-subtitle reveal-on-scroll" data-t="products.subtitle">Discover amazing products from local
                businesses
                across Malawi</p>
            </div>

            {/* Filters (Simplified for view) */}
            <div className="filters-section filters-compact">
              <div className="filters-bar active" id="filters-bar">
                <div className="filters-grid filters-inline">
                  <div className="filter-group">
                    <label className="form-label form-label-sm" htmlFor="filter-category"
                      data-t="filter.category">Category</label>
                    <select id="filter-category" className="form-select" title="Select category">
                      <option>All Categories</option>
                      <option>Agriculture</option>
                      <option>Technology</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label className="form-label form-label-sm" htmlFor="filter-city" data-t="filter.location">Location</label>
                    <select id="filter-city" className="form-select" title="Select location">
                      <option>All Locations</option>
                      <option>Lilongwe</option>
                      <option>Blantyre</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Simulated Items */}
            <div className="products-grid" id="products-grid">
              {/* Product 1 */}
              <div className="product-card">
                <div className="product-image">
                  {/* Placeholder image since we might not have all assets set up perfectly yet */}
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>Image Placeholder</span>
                  </div>
                  <span className="product-badge">New</span>
                  <button className="like-btn" aria-label="Like product">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="product-content">
                  <h3 className="product-title">Fresh Tomatoes</h3>
                  <div className="product-rating">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>4.8</span>
                  </div>
                  <p className="product-description">Freshly picked tomatoes from local farm.</p>
                  <div className="product-footer">
                    <span className="product-price">MWK 500/kg</span>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="product-card">
                <div className="product-image">
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>Image Placeholder</span>
                  </div>
                  <span className="product-badge">Hot</span>
                </div>
                <div className="product-content">
                  <h3 className="product-title">Handmade Basket</h3>
                  <div className="product-rating">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>5.0</span>
                  </div>
                  <p className="product-description">Beautifully woven baskets using traditional methods.</p>
                  <div className="product-footer">
                    <span className="product-price">MWK 3,500</span>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="product-card">
                <div className="product-image">
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>Image Placeholder</span>
                  </div>
                </div>
                <div className="product-content">
                  <h3 className="product-title">Maize Flour (20kg)</h3>
                  <div className="product-rating">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span>4.5</span>
                  </div>
                  <p className="product-description">High quality maize flour for your daily nsima.</p>
                  <div className="product-footer">
                    <span className="product-price">MWK 15,000</span>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <span className="logo-text">Malawi<span>Market</span></span>
              </div>
              <p className="footer-description" data-t="footer.description">
                Connecting local businesses with customers across Malawi. Supporting the warm heart of Africa&apos;s commerce.
              </p>
            </div>

            <div className="footer-links">
              <h4 data-t="footer.for_buyers">For Buyers</h4>
              <ul>
                <li><Link href="/" data-t="footer.browse_products">Browse Products</Link></li>
                <li><Link href="/map" data-t="footer.view_map">View Map</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p data-t="footer.copyright">© 2024 MalawiMarket. Supporting local businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
