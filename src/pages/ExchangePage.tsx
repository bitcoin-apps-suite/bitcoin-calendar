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
  Globe
} from 'lucide-react';
import './ExchangePage.css';

interface CalendarListing {
  id: string;
  rank: number;
  title: string;
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
  const [sortBy, setSortBy] = useState<'rank' | 'revenue' | 'subscribers' | 'price'>('rank');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'All', icon: Globe, count: 156 },
    { name: 'Entertainment', icon: Film, count: 28 },
    { name: 'Finance', icon: DollarSign, count: 34 },
    { name: 'Sports', icon: Award, count: 22 },
    { name: 'Corporate', icon: Briefcase, count: 18 },
    { name: 'Healthcare', icon: Heart, count: 15 },
    { name: 'Education', icon: GraduationCap, count: 12 },
    { name: 'Travel', icon: Plane, count: 10 },
    { name: 'Government', icon: Building, count: 8 },
    { name: 'Supply Chain', icon: ShoppingCart, count: 5 },
    { name: 'Music', icon: Music, count: 4 }
  ];

  // Sample calendar listings - 30+ different types
  const calendarListings: CalendarListing[] = [
    // Entertainment
    {
      id: '1',
      rank: 1,
      title: 'Taylor Swift World Tour 2025',
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
      title: 'Marvel Studios Release Calendar',
      description: 'Complete MCU Phase 6 & 7 release dates, premiere events, and D23 schedules',
      creator: 'MCU Insider',
      creatorHandle: '@mcuinsider',
      category: 'Entertainment',
      subcategory: 'Movies',
      publishDate: '2025-01-15',
      eventCount: 28,
      subscribers: 89000,
      revenue: 420000,
      sharesAvailable: 500,
      totalShares: 5000,
      currentPrice: 8.40,
      priceChange24h: 8.3,
      marketCap: 42000,
      volume24h: 12000,
      rating: 4.8,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },
    {
      id: '3',
      rank: 3,
      title: 'Hollywood Celebrity Appearances',
      description: 'Red carpet events, talk show bookings, and public appearances of A-list stars',
      creator: 'StarTracker',
      creatorHandle: '@startracker',
      category: 'Entertainment',
      subcategory: 'Celebrity',
      publishDate: '2024-12-01',
      eventCount: 450,
      subscribers: 67000,
      revenue: 280000,
      sharesAvailable: 2000,
      totalShares: 8000,
      currentPrice: 5.60,
      priceChange24h: -2.1,
      marketCap: 44800,
      volume24h: 8900,
      rating: 4.5,
      verified: true,
      updateFrequency: 'realtime'
    },

    // Finance
    {
      id: '4',
      rank: 4,
      title: 'S&P 500 Earnings Calendar',
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
      marketCap: 250000,
      volume24h: 78000,
      rating: 4.9,
      verified: true,
      featured: true,
      trending: true,
      updateFrequency: 'realtime'
    },
    {
      id: '5',
      rank: 5,
      title: 'Fed Meeting & Economic Data',
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
      marketCap: 111000,
      volume24h: 34000,
      rating: 4.8,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '6',
      rank: 6,
      title: 'IPO & SPAC Calendar',
      description: 'Upcoming IPOs, SPAC mergers, lockup expirations, and roadshow dates',
      creator: 'IPOTracker',
      creatorHandle: '@ipotracker',
      category: 'Finance',
      subcategory: 'IPO',
      publishDate: '2024-11-15',
      eventCount: 89,
      subscribers: 56000,
      revenue: 340000,
      sharesAvailable: 1500,
      totalShares: 5000,
      currentPrice: 9.80,
      priceChange24h: 18.9,
      marketCap: 49000,
      volume24h: 15600,
      rating: 4.6,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },

    // Sports
    {
      id: '7',
      rank: 7,
      title: 'NFL Complete Season Schedule',
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
      marketCap: 150000,
      volume24h: 67000,
      rating: 4.9,
      verified: true,
      featured: true,
      updateFrequency: 'daily'
    },
    {
      id: '8',
      rank: 8,
      title: 'Premier League Complete',
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
      marketCap: 89600,
      volume24h: 34500,
      rating: 4.7,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '9',
      rank: 9,
      title: 'F1 Race Calendar & Testing',
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
      marketCap: 63000,
      volume24h: 23000,
      rating: 4.8,
      verified: true,
      updateFrequency: 'realtime'
    },

    // Corporate
    {
      id: '10',
      rank: 10,
      title: 'Apple Product Launch Calendar',
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
      marketCap: 110000,
      volume24h: 45000,
      rating: 4.9,
      verified: true,
      featured: true,
      updateFrequency: 'daily'
    },
    {
      id: '11',
      rank: 11,
      title: 'Fortune 500 Board Meetings',
      description: 'Annual meetings, proxy votes, and shareholder events',
      creator: 'CorpGov',
      creatorHandle: '@corpgov',
      category: 'Corporate',
      subcategory: 'Governance',
      publishDate: '2024-12-15',
      eventCount: 500,
      subscribers: 45000,
      revenue: 340000,
      sharesAvailable: 1000,
      totalShares: 4000,
      currentPrice: 13.50,
      priceChange24h: 3.2,
      marketCap: 54000,
      volume24h: 12300,
      rating: 4.5,
      verified: true,
      updateFrequency: 'weekly'
    },
    {
      id: '12',
      rank: 12,
      title: 'Tech Conference Master Calendar',
      description: 'CES, E3, Google I/O, Build, re:Invent, and 50+ major tech conferences',
      creator: 'TechEvents',
      creatorHandle: '@techevents',
      category: 'Corporate',
      subcategory: 'Conferences',
      publishDate: '2025-01-01',
      eventCount: 245,
      subscribers: 78000,
      revenue: 450000,
      sharesAvailable: 600,
      totalShares: 6000,
      currentPrice: 12.00,
      priceChange24h: 5.6,
      marketCap: 72000,
      volume24h: 28900,
      rating: 4.7,
      verified: true,
      updateFrequency: 'daily'
    },

    // Healthcare
    {
      id: '13',
      rank: 13,
      title: 'Mayo Clinic Surgery Schedule',
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
      marketCap: 70000,
      volume24h: 8900,
      rating: 4.9,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '14',
      rank: 14,
      title: 'FDA Approval Calendar',
      description: 'PDUFA dates, advisory committees, and drug approval timelines',
      creator: 'FDAWatch',
      creatorHandle: '@fdawatch',
      category: 'Healthcare',
      subcategory: 'Regulatory',
      publishDate: '2024-12-28',
      eventCount: 156,
      subscribers: 34000,
      revenue: 280000,
      sharesAvailable: 800,
      totalShares: 4000,
      currentPrice: 14.00,
      priceChange24h: 11.3,
      marketCap: 56000,
      volume24h: 18700,
      rating: 4.6,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },
    {
      id: '15',
      rank: 15,
      title: 'Medical Conference Calendar',
      description: 'Major medical conferences, symposiums, and CME events worldwide',
      creator: 'MedEvents',
      creatorHandle: '@medevents',
      category: 'Healthcare',
      subcategory: 'Education',
      publishDate: '2025-01-05',
      eventCount: 890,
      subscribers: 23000,
      revenue: 180000,
      sharesAvailable: 1500,
      totalShares: 5000,
      currentPrice: 7.50,
      priceChange24h: -0.8,
      marketCap: 37500,
      volume24h: 6700,
      rating: 4.4,
      verified: true,
      updateFrequency: 'weekly'
    },

    // Education
    {
      id: '16',
      rank: 16,
      title: 'Harvard Academic Calendar',
      description: 'Classes, exams, breaks, commencement, and special lectures',
      creator: 'IvySchedule',
      creatorHandle: '@ivyschedule',
      category: 'Education',
      subcategory: 'University',
      publishDate: '2025-01-02',
      eventCount: 245,
      subscribers: 45000,
      revenue: 120000,
      sharesAvailable: 2000,
      totalShares: 5000,
      currentPrice: 4.80,
      priceChange24h: 3.4,
      marketCap: 24000,
      volume24h: 5600,
      rating: 4.7,
      verified: true,
      updateFrequency: 'monthly'
    },
    {
      id: '17',
      rank: 17,
      title: 'SAT/ACT Test Dates Global',
      description: 'All test dates, registration deadlines, and score release dates',
      creator: 'TestPrep',
      creatorHandle: '@testprep',
      category: 'Education',
      subcategory: 'Testing',
      publishDate: '2024-12-10',
      eventCount: 48,
      subscribers: 67000,
      revenue: 89000,
      sharesAvailable: 3000,
      totalShares: 6000,
      currentPrice: 3.50,
      priceChange24h: 1.2,
      marketCap: 21000,
      volume24h: 3400,
      rating: 4.5,
      verified: true,
      updateFrequency: 'monthly'
    },
    {
      id: '18',
      rank: 18,
      title: 'K-12 School District Calendar',
      description: 'School days, holidays, PTA meetings, and testing schedules',
      creator: 'SchoolCal',
      creatorHandle: '@schoolcal',
      category: 'Education',
      subcategory: 'K-12',
      publishDate: '2025-01-15',
      eventCount: 186,
      subscribers: 28000,
      revenue: 45000,
      sharesAvailable: 4000,
      totalShares: 8000,
      currentPrice: 2.25,
      priceChange24h: 0.5,
      marketCap: 18000,
      volume24h: 2100,
      rating: 4.3,
      verified: false,
      updateFrequency: 'monthly'
    },

    // Travel
    {
      id: '19',
      rank: 19,
      title: 'Global Flight Deal Calendar',
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
      marketCap: 68000,
      volume24h: 23400,
      rating: 4.8,
      verified: true,
      trending: true,
      updateFrequency: 'realtime'
    },
    {
      id: '20',
      rank: 20,
      title: 'Cruise Ship Departure Calendar',
      description: 'All major cruise lines, ports, and itinerary schedules',
      creator: 'CruiseTracker',
      creatorHandle: '@cruisetrack',
      category: 'Travel',
      subcategory: 'Cruises',
      publishDate: '2024-12-20',
      eventCount: 1200,
      subscribers: 34000,
      revenue: 120000,
      sharesAvailable: 1000,
      totalShares: 4000,
      currentPrice: 6.00,
      priceChange24h: -1.2,
      marketCap: 24000,
      volume24h: 5600,
      rating: 4.4,
      verified: true,
      updateFrequency: 'daily'
    },
    {
      id: '21',
      rank: 21,
      title: 'Hotel Deal Seasons',
      description: 'Peak/off-peak pricing, convention dates, and special event impacts',
      creator: 'HotelCal',
      creatorHandle: '@hotelcal',
      category: 'Travel',
      subcategory: 'Hotels',
      publishDate: '2025-01-10',
      eventCount: 730,
      subscribers: 23000,
      revenue: 67000,
      sharesAvailable: 2000,
      totalShares: 5000,
      currentPrice: 3.35,
      priceChange24h: 2.3,
      marketCap: 16750,
      volume24h: 3200,
      rating: 4.2,
      verified: false,
      updateFrequency: 'weekly'
    },

    // Government
    {
      id: '22',
      rank: 22,
      title: 'US Congress Session Calendar',
      description: 'House and Senate sessions, committee hearings, and recess periods',
      creator: 'GovTrack',
      creatorHandle: '@govtrack',
      category: 'Government',
      subcategory: 'Legislative',
      publishDate: '2025-01-01',
      eventCount: 245,
      subscribers: 56000,
      revenue: 89000,
      sharesAvailable: 3000,
      totalShares: 6000,
      currentPrice: 3.50,
      priceChange24h: 1.8,
      marketCap: 21000,
      volume24h: 4500,
      rating: 4.6,
      verified: true,
      updateFrequency: 'daily'
    },
    {
      id: '23',
      rank: 23,
      title: 'Supreme Court Calendar',
      description: 'Oral arguments, opinion releases, and conference dates',
      creator: 'SCOTUS_Cal',
      creatorHandle: '@scotuscal',
      category: 'Government',
      subcategory: 'Judicial',
      publishDate: '2024-12-01',
      eventCount: 89,
      subscribers: 34000,
      revenue: 56000,
      sharesAvailable: 2500,
      totalShares: 5000,
      currentPrice: 2.80,
      priceChange24h: 0.7,
      marketCap: 14000,
      volume24h: 2300,
      rating: 4.5,
      verified: true,
      updateFrequency: 'weekly'
    },
    {
      id: '24',
      rank: 24,
      title: 'Election Calendar 2025-2026',
      description: 'Primaries, general elections, debates, and filing deadlines',
      creator: 'ElectionWatch',
      creatorHandle: '@electionwatch',
      category: 'Government',
      subcategory: 'Elections',
      publishDate: '2025-01-02',
      eventCount: 156,
      subscribers: 78000,
      revenue: 120000,
      sharesAvailable: 1000,
      totalShares: 5000,
      currentPrice: 4.80,
      priceChange24h: 12.4,
      marketCap: 24000,
      volume24h: 8900,
      rating: 4.7,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },

    // Supply Chain
    {
      id: '25',
      rank: 25,
      title: 'Global Shipping Schedule',
      description: 'Major shipping lines, port calls, and container availability',
      creator: 'ShipTracker',
      creatorHandle: '@shiptracker',
      category: 'Supply Chain',
      subcategory: 'Shipping',
      publishDate: '2025-01-05',
      eventCount: 5600,
      subscribers: 12000,
      revenue: 450000,
      sharesAvailable: 200,
      totalShares: 2000,
      currentPrice: 28.00,
      priceChange24h: 6.7,
      marketCap: 56000,
      volume24h: 18900,
      rating: 4.8,
      verified: true,
      updateFrequency: 'realtime'
    },
    {
      id: '26',
      rank: 26,
      title: 'Manufacturing Plant Schedules',
      description: 'Production runs, maintenance windows, and shift patterns',
      creator: 'MfgSchedule',
      creatorHandle: '@mfgschedule',
      category: 'Supply Chain',
      subcategory: 'Manufacturing',
      publishDate: '2024-12-15',
      eventCount: 2400,
      subscribers: 8900,
      revenue: 230000,
      sharesAvailable: 500,
      totalShares: 2500,
      currentPrice: 18.40,
      priceChange24h: 3.2,
      marketCap: 46000,
      volume24h: 7800,
      rating: 4.5,
      verified: true,
      updateFrequency: 'daily'
    },
    {
      id: '27',
      rank: 27,
      title: 'Warehouse Inventory Cycles',
      description: 'Stock rotation, receiving schedules, and inventory counts',
      creator: 'InvControl',
      creatorHandle: '@invcontrol',
      category: 'Supply Chain',
      subcategory: 'Warehousing',
      publishDate: '2025-01-08',
      eventCount: 1200,
      subscribers: 5600,
      revenue: 89000,
      sharesAvailable: 1500,
      totalShares: 3000,
      currentPrice: 6.50,
      priceChange24h: -0.5,
      marketCap: 19500,
      volume24h: 3400,
      rating: 4.2,
      verified: false,
      updateFrequency: 'weekly'
    },

    // Music
    {
      id: '28',
      rank: 28,
      title: 'Music Festival Calendar 2025',
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
      marketCap: 100800,
      volume24h: 34500,
      rating: 4.9,
      verified: true,
      trending: true,
      updateFrequency: 'daily'
    },
    {
      id: '29',
      rank: 29,
      title: 'Album Release Calendar',
      description: 'Major label releases, indie drops, and surprise album schedules',
      creator: 'MusicDrops',
      creatorHandle: '@musicdrops',
      category: 'Music',
      subcategory: 'Releases',
      publishDate: '2024-12-20',
      eventCount: 890,
      subscribers: 67000,
      revenue: 120000,
      sharesAvailable: 2000,
      totalShares: 5000,
      currentPrice: 4.80,
      priceChange24h: 4.5,
      marketCap: 24000,
      volume24h: 8900,
      rating: 4.6,
      verified: true,
      updateFrequency: 'daily'
    },
    {
      id: '30',
      rank: 30,
      title: 'Recording Studio Availability',
      description: 'Abbey Road, Electric Lady, and top studios booking windows',
      creator: 'StudioBook',
      creatorHandle: '@studiobook',
      category: 'Music',
      subcategory: 'Studios',
      publishDate: '2025-01-10',
      eventCount: 365,
      subscribers: 12000,
      revenue: 78000,
      sharesAvailable: 1000,
      totalShares: 2000,
      currentPrice: 7.80,
      priceChange24h: 2.1,
      marketCap: 15600,
      volume24h: 3400,
      rating: 4.4,
      verified: false,
      updateFrequency: 'realtime'
    }
  ];

  const filteredCalendars = calendarListings.filter(calendar => {
    const matchesCategory = selectedCategory === 'All' || calendar.category === selectedCategory;
    const matchesSearch = calendar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      default:
        return a.rank - b.rank;
    }
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
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
      <div className="exchange-header">
        <div className="title-section">
          <Calendar className="page-icon" size={32} />
          <div>
            <h1 className="page-title">Calendar Exchange</h1>
            <p className="page-subtitle">
              Trade calendar shares • {calendarListings.length} calendars listed
              <span className="status-live" style={{ color: '#10b981', marginLeft: '12px' }}>
                ● LIVE
              </span>
            </p>
          </div>
        </div>

        <div className="header-controls">
          <input
            type="text"
            placeholder="Search calendars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="rank">Top Ranked</option>
            <option value="revenue">Highest Revenue</option>
            <option value="subscribers">Most Subscribers</option>
            <option value="price">Highest Price</option>
          </select>
        </div>
      </div>

      <div className="exchange-content">
        <div className="category-sidebar">
          <h3>Categories</h3>
          {categories.map(category => (
            <button
              key={category.name}
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <category.icon size={18} />
              <span>{category.name}</span>
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>

        <div className="calendars-grid">
          {filteredCalendars.map(calendar => (
            <div key={calendar.id} className={`calendar-card ${calendar.featured ? 'featured' : ''} ${calendar.trending ? 'trending' : ''}`}>
              {calendar.trending && <div className="trending-badge">🔥 Trending</div>}
              {calendar.featured && <div className="featured-badge">⭐ Featured</div>}
              
              <div className="calendar-rank">#{calendar.rank}</div>
              
              <div className="calendar-header-info">
                <h3 className="calendar-title">{calendar.title}</h3>
                <div className="calendar-meta">
                  <span className="creator">by {calendar.creatorHandle}</span>
                  {calendar.verified && <span className="verified-badge">✓</span>}
                </div>
              </div>

              <p className="calendar-description">{calendar.description}</p>

              <div className="calendar-stats">
                <div className="stat">
                  <Calendar size={14} />
                  <span>{calendar.eventCount} events</span>
                </div>
                <div className="stat">
                  <Users size={14} />
                  <span>{formatNumber(calendar.subscribers)} subscribers</span>
                </div>
                <div className="stat">
                  <Clock size={14} />
                  <span>{calendar.updateFrequency}</span>
                </div>
                <div className="stat">
                  <Star size={14} />
                  <span>{calendar.rating}/5.0</span>
                </div>
              </div>

              <div className="calendar-financials">
                <div className="price-section">
                  <div className="current-price">
                    {formatPrice(calendar.currentPrice)}
                    <span className={`price-change ${calendar.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                      {calendar.priceChange24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(calendar.priceChange24h)}%
                    </span>
                  </div>
                  <div className="shares-info">
                    {calendar.sharesAvailable}/{calendar.totalShares} shares
                  </div>
                </div>

                <div className="financial-stats">
                  <div className="fin-stat">
                    <span className="label">Revenue</span>
                    <span className="value">{formatPrice(calendar.revenue)}</span>
                  </div>
                  <div className="fin-stat">
                    <span className="label">Market Cap</span>
                    <span className="value">{formatPrice(calendar.marketCap)}</span>
                  </div>
                  <div className="fin-stat">
                    <span className="label">24h Vol</span>
                    <span className="value">{formatPrice(calendar.volume24h)}</span>
                  </div>
                </div>
              </div>

              <div className="calendar-actions">
                <button className="action-btn buy">
                  Buy Shares
                </button>
                <button className="action-btn subscribe">
                  Subscribe
                </button>
                <button className="action-btn view">
                  View Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="exchange-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="label">Total Market Cap</span>
            <span className="value">$2.4M</span>
          </div>
          <div className="footer-stat">
            <span className="label">24h Volume</span>
            <span className="value">$567K</span>
          </div>
          <div className="footer-stat">
            <span className="label">Active Traders</span>
            <span className="value">12,456</span>
          </div>
          <div className="footer-stat">
            <span className="label">Total Calendars</span>
            <span className="value">156</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;