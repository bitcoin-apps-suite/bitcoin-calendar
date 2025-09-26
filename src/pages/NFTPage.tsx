// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState } from 'react';
import { Package, Calendar, Clock, DollarSign, Share2, Download, Eye, Zap } from 'lucide-react';
import './NFTPage.css';

interface CalendarNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  eventCount: number;
  creator: string;
  price?: number;
  currency: string;
  minted: boolean;
  tokenId?: string;
  blockchain: 'BSV' | 'Bitcoin SV';
  createdAt: string;
  category: 'event' | 'calendar' | 'schedule';
}

interface NFTPageProps {
  isAuthenticated: boolean;
  currentUser: any;
}

const NFTPage: React.FC<NFTPageProps> = ({ isAuthenticated, currentUser }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'event' | 'calendar' | 'schedule'>('all');
  const [showMintModal, setShowMintModal] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    description: '',
    category: 'calendar' as 'event' | 'calendar' | 'schedule',
    price: 0,
    events: [] as string[]
  });

  const [nfts, setNFTs] = useState<CalendarNFT[]>([
    {
      id: '1',
      name: 'Bitcoin Calendar Genesis',
      description: 'The first calendar NFT created on Bitcoin Calendar platform. Contains 30 events from Q4 2024.',
      image: '/api/placeholder/300/300',
      eventCount: 30,
      creator: 'bitcoincorp.bsv',
      price: 0.001,
      currency: 'BSV',
      minted: true,
      tokenId: 'nft_bcal_genesis_001',
      blockchain: 'BSV',
      createdAt: '2024-10-01',
      category: 'calendar'
    },
    {
      id: '2',
      name: 'Developer Meetup Series',
      description: 'Collection of 12 monthly developer meetup events for 2025.',
      image: '/api/placeholder/300/300',
      eventCount: 12,
      creator: 'devteam.bsv',
      price: 0.0005,
      currency: 'BSV',
      minted: true,
      tokenId: 'nft_bcal_meetup_002',
      blockchain: 'BSV',
      createdAt: '2024-11-15',
      category: 'event'
    },
    {
      id: '3',
      name: '$BCALENDAR Launch Schedule',
      description: 'Official launch schedule for the $BCALENDAR token including all events and milestones.',
      image: '/api/placeholder/300/300',
      eventCount: 8,
      creator: 'team.bitcoincalendar',
      price: 0.002,
      currency: 'BSV',
      minted: true,
      tokenId: 'nft_bcal_launch_003',
      blockchain: 'BSV',
      createdAt: '2024-12-01',
      category: 'schedule'
    }
  ]);

  const filteredNFTs = selectedCategory === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.category === selectedCategory);

  const handleMintNFT = () => {
    if (!isAuthenticated) {
      alert('Please connect your wallet to mint NFTs');
      return;
    }

    const tokenId = `nft_bcal_${Date.now()}`;
    const newCalendarNFT: CalendarNFT = {
      id: Date.now().toString(),
      name: newNFT.name,
      description: newNFT.description,
      image: '/api/placeholder/300/300',
      eventCount: newNFT.events.length,
      creator: currentUser?.handle || 'anonymous',
      price: newNFT.price,
      currency: 'BSV',
      minted: true,
      tokenId,
      blockchain: 'BSV',
      createdAt: new Date().toISOString().split('T')[0],
      category: newNFT.category
    };

    setNFTs([...nfts, newCalendarNFT]);
    setShowMintModal(false);
    setNewNFT({
      name: '',
      description: '',
      category: 'calendar',
      price: 0,
      events: []
    });
    
    alert(`NFT minted successfully! Token ID: ${tokenId}`);
  };

  const handleBuyNFT = (nft: CalendarNFT) => {
    if (!isAuthenticated) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }
    
    alert(`Purchase functionality for ${nft.name} (${nft.price} ${nft.currency}) will be available soon!`);
  };

  return (
    <div className="nft-page">
      <div className="nft-header">
        <div className="header-content">
          <div className="title-section">
            <Package className="page-icon" size={32} />
            <div>
              <h1 className="page-title">Calendar NFTs</h1>
              <p className="page-subtitle">
                Mint, trade, and collect unique calendar events on Bitcoin SV
                <span className="stats-text"> • {nfts.length} NFTs available • {nfts.reduce((acc, nft) => acc + nft.eventCount, 0)} events</span>
              </p>
            </div>
          </div>

          <div className="header-actions">
            {isAuthenticated && (
              <button 
                className="mint-btn primary"
                onClick={() => setShowMintModal(true)}
              >
                <Zap size={20} />
                <span>Mint NFT</span>
              </button>
            )}
          </div>
        </div>

        <div className="category-filters">
          {(['all', 'event', 'calendar', 'schedule'] as const).map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All NFTs' : 
               category === 'event' ? 'Single Events' :
               category === 'calendar' ? 'Full Calendars' :
               'Schedules'}
              <span className="count">
                {category === 'all' ? nfts.length : nfts.filter(n => n.category === category).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="nft-grid">
        {filteredNFTs.map(nft => (
          <div key={nft.id} className="nft-card">
            <div className="nft-image-container">
              <div className="nft-image-placeholder">
                <Calendar size={48} />
                <div className="nft-category-badge">{nft.category}</div>
            </div>
            </div>

            <div className="nft-content">
              <div className="nft-header-info">
                <h3 className="nft-title">{nft.name}</h3>
                <div className="nft-token-id">#{nft.tokenId}</div>
              </div>

              <p className="nft-description">{nft.description}</p>

              <div className="nft-stats">
                <div className="stat">
                  <Clock size={16} />
                  <span>{nft.eventCount} events</span>
                </div>
                <div className="stat">
                  <span className="creator">by {nft.creator}</span>
                </div>
              </div>

              <div className="nft-price-section">
                <div className="price-info">
                  <DollarSign size={16} />
                  <span className="price">{nft.price} {nft.currency}</span>
                  <span className="blockchain-badge">{nft.blockchain}</span>
                </div>
              </div>

              <div className="nft-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleBuyNFT(nft)}
                >
                  <DollarSign size={16} />
                  <span>Buy Now</span>
                </button>
                
                <button className="action-btn secondary">
                  <Eye size={16} />
                  <span>Preview</span>
                </button>

                <button className="action-btn secondary">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="empty-state">
          <Package size={64} />
          <h3>No NFTs found</h3>
          <p>No calendar NFTs found in this category. {isAuthenticated ? 'Create your first NFT!' : 'Connect your wallet to get started.'}</p>
          {isAuthenticated && (
            <button 
              className="mint-btn primary"
              onClick={() => setShowMintModal(true)}
            >
              <Zap size={20} />
              <span>Mint Your First NFT</span>
            </button>
          )}
        </div>
      )}

      {/* Mint NFT Modal */}
      {showMintModal && (
        <div className="modal-overlay" onClick={() => setShowMintModal(false)}>
          <div className="mint-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mint Calendar NFT</h3>
              <button className="close-btn" onClick={() => setShowMintModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>NFT Name</label>
                <input
                  type="text"
                  value={newNFT.name}
                  onChange={(e) => setNewNFT({...newNFT, name: e.target.value})}
                  placeholder="Enter NFT name"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newNFT.description}
                  onChange={(e) => setNewNFT({...newNFT, description: e.target.value})}
                  placeholder="Describe your calendar NFT"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newNFT.category}
                    onChange={(e) => setNewNFT({...newNFT, category: e.target.value as any})}
                  >
                    <option value="event">Single Event</option>
                    <option value="calendar">Full Calendar</option>
                    <option value="schedule">Schedule</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (BSV)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newNFT.price}
                    onChange={(e) => setNewNFT({...newNFT, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.001"
                  />
                </div>
              </div>

              <div className="form-info">
                <div className="info-item">
                  <strong>Blockchain:</strong> Bitcoin SV (BSV)
                </div>
                <div className="info-item">
                  <strong>Minting Fee:</strong> ~0.00001 BSV
                </div>
                <div className="info-item">
                  <strong>Creator:</strong> {currentUser?.handle || 'anonymous'}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => setShowMintModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="action-btn primary"
                  onClick={handleMintNFT}
                  disabled={!newNFT.name || !newNFT.description}
                >
                  <Zap size={16} />
                  <span>Mint NFT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTPage;