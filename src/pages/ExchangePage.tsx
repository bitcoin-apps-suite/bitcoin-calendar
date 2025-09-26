// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp, 
  TrendingDown,
  Star,
  Users,
  Clock,
  DollarSign,
  Award,
  Briefcase,
  Heart,
  GraduationCap,
  Plane,
  Building,
  ShoppingCart,
  Music,
  Film,
  Globe,
  Filter,
  ChevronDown,
  BarChart3,
  Activity
} from 'lucide-react';
import Footer from '../components/Footer';
import './ExchangePage.css';

interface CalendarListing {
  id: string;
  rank: number;
  title: string;
  symbol: string;
  description: string;
  creator: string;
  creatorHandle: string;
  category: string;
  subcategory: string;
  publishDate: string;
  eventCount: number;
  subscribers: number;
  revenue: number;
  sharesAvailable: number;
  totalShares: number;
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  rating: number;
  verified: boolean;
  trending?: boolean;
  featured?: boolean;
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
}

interface ExchangePageProps {
  isAuthenticated: boolean;
  currentUser: any;
  devSidebarCollapsed?: boolean;
  isMobile?: boolean;
}

const ExchangePage: React.FC<ExchangePageProps> = ({ isAuthenticated, currentUser, devSidebarCollapsed = false, isMobile = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rank' | 'revenue' | 'subscribers' | 'price' | 'marketcap' | 'volume'>('marketcap');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All', 'Entertainment', 'Finance', 'Sports', 'Corporate', 
    'Healthcare', 'Education', 'Travel', 'Government', 'Supply Chain', 'Music'
  ];

  // Sample calendar listings - 30+ different types
  const calendarListings: CalendarListing[] = [
    {
      id: '1',
      rank: 1,
      title: 'Taylor Swift World Tour 2025',
      symbol: 'SWIFT',
      description: 'Official Eras Tour dates, VIP access windows, and backstage schedules',
      creator: 'SwiftNation',
      creatorHandle: '@swiftnation',
      category: 'Entertainment',
      subcategory: 'Concert Tours',
      publishDate: '2025-01-01',
      eventCount: 52,
      subscribers: 125000,
      revenue: 850000,
      sharesAvailable: 1000,
      totalShares: 10000,
      currentPrice: 12.50,
      priceChange24h: 15.7,
      priceChange7d: 28.3,
      marketCap: 125000,
      volume24h: 45000,
      rating: 4.9,
      verified: true,
      trending: true,
      featured: true,
      updateFrequency: 'realtime'
    },
    {
      id: '2',
      rank: 2,
      title: 'S&P 500 Earnings Calendar',
      symbol: 'SP500',
      description: 'Comprehensive earnings dates, conference calls, and guidance updates',
      creator: 'MarketPro',
      creatorHandle: '@marketpro',
      category: 'Finance',
      subcategory: 'Earnings',
      publishDate: '2025-01-02',
      eventCount: 2000,
      subscribers: 145000,
      revenue: 1200000,
      sharesAvailable: 100,
      totalShares: 10000,
      currentPrice: 25.00,
      priceChange24h: 12.4,
      priceChange7d: 18.9,
      marketCap: 250000,
      volume24h: 78000,
      rating: 4.9,
      verified: true,
      featured: true,
      trending: true,
      updateFrequency: 'realtime'
    },
    {
      id: '3',
      rank: 3,
      title: 'NFL Complete Season Schedule',
      symbol: 'NFL',
      description: 'All games, playoffs, Super Bowl, draft dates, and combine schedules',
      creator: 'GridironCal',
      creatorHandle: '@gridironcal',
      category: 'Sports',
      subcategory: 'Football',
      publishDate: '2025-01-10',
      eventCount: 285,
      subscribers: 234000,
      revenue: 890000,
      sharesAvailable: 500,
      totalShares: 10000,
      currentPrice: 15.00,
      priceChange24h: 4.2,
      priceChange7d: 9.8,
      marketCap: 150000,
      volume24h: 67000,
      rating: 4.9,
      verified: true,
      featured: true,
      updateFrequency: 'daily'
    },
    {
      id: '4',
      rank: 4,
      title: 'Apple Product Launch Calendar',
      symbol: 'AAPL-CAL',
      description: 'WWDC, iPhone events, product releases, and keynote schedules',
      creator: 'AppleEvents',
      creatorHandle: '@appleevents',
      category: 'Corporate',
      subcategory: 'Tech',
      publishDate: '2025-01-03',
      eventCount: 24,
      subscribers: 156000,
      revenue: 680000,
      sharesAvailable: 200,
      totalShares: 5000,
      currentPrice: 22.00,
      priceChange24h: 7.8,
      priceChange7d: 12.3,
      marketCap: 110000,
      volume24h: 45000,
      rating: 4.9,
      verified: true,
      featured: true,
      updateFrequency: 'daily'
    },
    {
      id: '5',
      rank: 5,
      title: 'Music Festival Calendar 2025',
      symbol: 'FEST',
      description: 'Coachella, Glastonbury, Lollapalooza, and 200+ festivals worldwide',
      creator: 'FestTracker',
      creatorHandle: '@festtracker',
      category: 'Music',
      subcategory: 'Festivals',
      publishDate: '2025-01-01',
      eventCount: 234,
      subscribers: 145000,
      revenue: 560000,
      sharesAvailable: 300,
      totalShares: 6000,
      currentPrice: 16.80,
      priceChange24h: 9.8,
      priceChange7d: 15.2,
      marketCap: 100800,
      volume24h: 34500,
      rating: 4.9,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },
    {
      id: '6',
      rank: 6,
      title: 'Fed Meeting & Economic Data',
      symbol: 'FED',
      description: 'FOMC meetings, CPI releases, jobs reports, and central bank schedules',
      creator: 'EconWatch',
      creatorHandle: '@econwatch',
      category: 'Finance',
      subcategory: 'Economic',
      publishDate: '2025-01-05',
      eventCount: 156,
      subscribers: 98000,
      revenue: 780000,
      sharesAvailable: 300,
      totalShares: 6000,
      currentPrice: 18.50,
      priceChange24h: 6.7,
      priceChange7d: -2.1,
      marketCap: 111000,
      volume24h: 34000,
      rating: 4.8,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '7',
      rank: 7,
      title: 'Premier League Complete',
      symbol: 'EPL',
      description: 'All matches, transfer windows, cup fixtures, and training schedules',
      creator: 'FootySchedule',
      creatorHandle: '@footyschedule',
      category: 'Sports',
      subcategory: 'Soccer',
      publishDate: '2024-12-20',
      eventCount: 380,
      subscribers: 178000,
      revenue: 560000,
      sharesAvailable: 800,
      totalShares: 8000,
      currentPrice: 11.20,
      priceChange24h: -1.8,
      priceChange7d: 3.4,
      marketCap: 89600,
      volume24h: 34500,
      rating: 4.7,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '8',
      rank: 8,
      title: 'Global Flight Deal Calendar',
      symbol: 'FLIGHT',
      description: 'Error fares, flash sales, and airline promotional periods',
      creator: 'FlightDeals',
      creatorHandle: '@flightdeals',
      category: 'Travel',
      subcategory: 'Flights',
      publishDate: '2025-01-08',
      eventCount: 365,
      subscribers: 89000,
      revenue: 340000,
      sharesAvailable: 500,
      totalShares: 5000,
      currentPrice: 13.60,
      priceChange24h: 8.9,
      priceChange7d: 11.2,
      marketCap: 68000,
      volume24h: 23400,
      rating: 4.8,
      verified: true,
      trending: true,
      updateFrequency: 'realtime'
    },
    {
      id: '9',
      rank: 9,
      title: 'Mayo Clinic Surgery Schedule',
      symbol: 'MAYO',
      description: 'Operating room schedules, specialist availability, and procedure windows',
      creator: 'MayoScheduling',
      creatorHandle: '@mayosched',
      category: 'Healthcare',
      subcategory: 'Hospital',
      publishDate: '2025-01-12',
      eventCount: 3650,
      subscribers: 12000,
      revenue: 890000,
      sharesAvailable: 100,
      totalShares: 2000,
      currentPrice: 35.00,
      priceChange24h: 2.1,
      priceChange7d: 5.6,
      marketCap: 70000,
      volume24h: 8900,
      rating: 4.9,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '10',
      rank: 10,
      title: 'F1 Race Calendar & Testing',
      symbol: 'F1',
      description: 'Race weekends, practice sessions, qualifying, and pre-season testing',
      creator: 'F1Schedule',
      creatorHandle: '@f1schedule',
      category: 'Sports',
      subcategory: 'Racing',
      publishDate: '2025-01-08',
      eventCount: 96,
      subscribers: 89000,
      revenue: 420000,
      sharesAvailable: 1200,
      totalShares: 6000,
      currentPrice: 10.50,
      priceChange24h: 9.4,
      priceChange7d: 14.7,
      marketCap: 63000,
      volume24h: 23000,
      rating: 4.8,
      verified: true,
      updateFrequency: 'realtime'
    },
    // Add more calendars as needed...
  ];

  const filteredCalendars = calendarListings.filter(calendar => {
    const matchesCategory = selectedCategory === 'All' || calendar.category === selectedCategory;
    const matchesSearch = calendar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          calendar.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          calendar.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'subscribers':
        return b.subscribers - a.subscribers;
      case 'price':
        return b.currentPrice - a.currentPrice;
      case 'marketcap':
        return b.marketCap - a.marketCap;
      case 'volume':
        return b.volume24h - a.volume24h;
      default:
        return a.rank - b.rank;
    }
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className={`exchange-page ${!isMobile && !devSidebarCollapsed ? 'sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="App-header">
        <div className="desktop-header-wrapper">
          <h1
            className="app-title"
            style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            <span style={{color: '#8b5cf6'}}>Bitcoin</span> Calendar
          </h1>
          <p className="app-subtitle" style={{ color: '#999', fontSize: '1rem' }}>
            Mint your calendar on the blockchain, charge for access, securitize its revenue flow and trade calendar shares on the $BCAL exchange
          </p>
        </div>
      </header>

      <div className="exchange-container">
        <div className="exchange-controls">
          <div className="control-section">
            <h2 className="exchange-title">
              <BarChart3 size={24} />
              Calendar Exchange
            </h2>
            <span className="live-indicator">
              <Activity size={14} />
              LIVE
            </span>
          </div>

          <div className="filter-controls">
            <div className="category-filter">
              <Filter size={16} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search calendars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              Filters
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="market-stats">
          <div className="stat-item">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">$2.4M</span>
            <span className="stat-change positive">+12.5%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">24h Volume</span>
            <span className="stat-value">$567K</span>
            <span className="stat-change positive">+8.3%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Calendars</span>
            <span className="stat-value">156</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Subscribers</span>
            <span className="stat-value">1.2M</span>
          </div>
        </div>

        <div className="exchange-table-container">
          <table className="exchange-table">
            <thead>
              <tr>
                <th className="sticky-col">#</th>
                <th className="name-col">Name</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>24h %</th>
                <th>7d %</th>
                <th>Market Cap</th>
                <th>Volume(24h)</th>
                <th>Subscribers</th>
                <th>Events</th>
                <th className="action-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalendars.map(calendar => (
                <tr key={calendar.id} className={calendar.featured ? 'featured-row' : ''}>
                  <td className="sticky-col rank-cell">
                    {calendar.rank}
                    {calendar.trending && <span className="trending-badge">🔥</span>}
                  </td>
                  <td className="name-col">
                    <div className="calendar-name-cell">
                      <div className="calendar-info">
                        <span className="calendar-title">
                          {calendar.title}
                          {calendar.verified && <span className="verified">✓</span>}
                        </span>
                        <span className="calendar-creator">{calendar.creatorHandle}</span>
                      </div>
                    </div>
                  </td>
                  <td className="symbol-cell">{calendar.symbol}</td>
                  <td className="price-cell">{formatPrice(calendar.currentPrice)}</td>
                  <td className={`change-cell ${calendar.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                    {calendar.priceChange24h >= 0 ? '+' : ''}{calendar.priceChange24h.toFixed(2)}%
                  </td>
                  <td className={`change-cell ${calendar.priceChange7d >= 0 ? 'positive' : 'negative'}`}>
                    {calendar.priceChange7d >= 0 ? '+' : ''}{calendar.priceChange7d.toFixed(2)}%
                  </td>
                  <td>{formatPrice(calendar.marketCap)}</td>
                  <td>{formatPrice(calendar.volume24h)}</td>
                  <td>{formatNumber(calendar.subscribers)}</td>
                  <td>{calendar.eventCount}</td>
                  <td className="action-col">
                    <button className="trade-btn">Trade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="page-btn">Previous</button>
          <span className="page-info">1 of 3</span>
          <button className="page-btn">Next</button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExchangePage;