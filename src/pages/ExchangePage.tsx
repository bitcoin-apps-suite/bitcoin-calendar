// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Coins, 
  Activity, 
  Clock, 
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';
import './ExchangePage.css';

interface TokenPair {
  from: string;
  to: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdate: string;
}

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  user: string;
}

interface ExchangePageProps {
  isAuthenticated: boolean;
  currentUser: any;
}

const ExchangePage: React.FC<ExchangePageProps> = ({ isAuthenticated, currentUser }) => {
  const [selectedPair, setSelectedPair] = useState('BCAL/BSV');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const tokenPairs: TokenPair[] = [
    {
      from: 'BCAL',
      to: 'BSV',
      price: 0.00024,
      change24h: 15.7,
      volume24h: 1250.5,
      lastUpdate: new Date().toISOString()
    },
    {
      from: 'BCAL',
      to: 'USD',
      price: 0.15,
      change24h: 12.3,
      volume24h: 890.2,
      lastUpdate: new Date().toISOString()
    },
    {
      from: 'BSV',
      to: 'USD',
      price: 65.40,
      change24h: -2.1,
      volume24h: 45230.8,
      lastUpdate: new Date().toISOString()
    }
  ];

  const recentTrades: Trade[] = [
    {
      id: '1',
      type: 'buy',
      pair: 'BCAL/BSV',
      amount: 1000,
      price: 0.00024,
      total: 0.24,
      timestamp: '2 min ago',
      user: 'alice.bsv'
    },
    {
      id: '2',
      type: 'sell',
      pair: 'BCAL/BSV',
      amount: 500,
      price: 0.00023,
      total: 0.115,
      timestamp: '5 min ago',
      user: 'bob.handcash'
    },
    {
      id: '3',
      type: 'buy',
      pair: 'BCAL/BSV',
      amount: 2500,
      price: 0.00024,
      total: 0.60,
      timestamp: '8 min ago',
      user: 'charlie.bsv'
    }
  ];

  const orderBook = {
    buys: [
      { price: 0.00023, amount: 1500, total: 0.345 },
      { price: 0.00022, amount: 2000, total: 0.44 },
      { price: 0.00021, amount: 3500, total: 0.735 }
    ],
    sells: [
      { price: 0.00024, amount: 1200, total: 0.288 },
      { price: 0.00025, amount: 1800, total: 0.45 },
      { price: 0.00026, amount: 2200, total: 0.572 }
    ]
  };

  const currentPair = tokenPairs.find(pair => `${pair.from}/${pair.to}` === selectedPair) || tokenPairs[0];

  const handleTrade = () => {
    if (!isAuthenticated) {
      alert('Please connect your wallet to trade');
      return;
    }

    if (!amount || !price) {
      alert('Please enter both amount and price');
      return;
    }

    const total = parseFloat(amount) * parseFloat(price);
    alert(`${tradeType.toUpperCase()} order placed:\n${amount} BCAL @ ${price} BSV\nTotal: ${total.toFixed(8)} BSV`);
    
    setAmount('');
    setPrice('');
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num: number, currency: string): string => {
    if (currency === 'BSV') {
      return `${formatNumber(num, 8)} BSV`;
    }
    return `$${formatNumber(num, 2)}`;
  };

  return (
    <div className="exchange-page">
      <div className="exchange-header">
        <div className="title-section">
          <DollarSign className="page-icon" size={32} />
          <div>
            <h1 className="page-title">$BCAL Exchange</h1>
            <p className="page-subtitle">
              Trade $BCAL tokens and calendar NFT shares on Bitcoin SV
              <span className="status-live">🟢 LIVE</span>
            </p>
          </div>
        </div>

        <div className="market-stats">
          <div className="stat-item">
            <div className="stat-label">24h Volume</div>
            <div className="stat-value">{formatNumber(currentPair.volume24h)} BSV</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Price</div>
            <div className="stat-value">
              {formatNumber(currentPair.price, 8)} BSV
              <span className={`change ${currentPair.change24h >= 0 ? 'positive' : 'negative'}`}>
                {currentPair.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(currentPair.change24h).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="exchange-content">
        {/* Trading Interface */}
        <div className="trading-section">
          <div className="pair-selector">
            <h3>Trading Pair</h3>
            <div className="pair-buttons">
              {tokenPairs.map(pair => {
                const pairString = `${pair.from}/${pair.to}`;
                return (
                  <button
                    key={pairString}
                    className={`pair-btn ${selectedPair === pairString ? 'active' : ''}`}
                    onClick={() => setSelectedPair(pairString)}
                  >
                    <div className="pair-name">{pairString}</div>
                    <div className="pair-price">
                      {pair.to === 'BSV' ? formatNumber(pair.price, 8) : `$${formatNumber(pair.price, 4)}`}
                    </div>
                    <div className={`pair-change ${pair.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(1)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="trade-form">
            <div className="trade-type-selector">
              <button
                className={`type-btn ${tradeType === 'buy' ? 'active buy' : ''}`}
                onClick={() => setTradeType('buy')}
              >
                <TrendingUp size={16} />
                BUY
              </button>
              <button
                className={`type-btn ${tradeType === 'sell' ? 'active sell' : ''}`}
                onClick={() => setTradeType('sell')}
              >
                <TrendingDown size={16} />
                SELL
              </button>
            </div>

            <div className="form-group">
              <label>Amount (BCAL)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00000000"
                step="0.00000001"
              />
            </div>

            <div className="form-group">
              <label>Price (BSV)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00000000"
                step="0.00000001"
              />
            </div>

            <div className="form-group">
              <label>Total (BSV)</label>
              <div className="total-display">
                {amount && price ? formatNumber(parseFloat(amount) * parseFloat(price), 8) : '0.00000000'}
              </div>
            </div>

            <button
              className={`trade-btn ${tradeType}`}
              onClick={handleTrade}
              disabled={!isAuthenticated || !amount || !price}
            >
              {!isAuthenticated ? (
                'Connect Wallet to Trade'
              ) : (
                <>
                  <Zap size={16} />
                  {tradeType === 'buy' ? 'BUY BCAL' : 'SELL BCAL'}
                </>
              )}
            </button>

            {isAuthenticated && (
              <div className="wallet-info">
                <div className="balance-item">
                  <span>BCAL Balance:</span>
                  <span>1,245.67890123</span>
                </div>
                <div className="balance-item">
                  <span>BSV Balance:</span>
                  <span>0.12345678</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Book */}
        <div className="orderbook-section">
          <h3>Order Book</h3>
          <div className="orderbook">
            <div className="orderbook-header">
              <span>Price (BSV)</span>
              <span>Amount (BCAL)</span>
              <span>Total (BSV)</span>
            </div>
            
            <div className="sells-section">
              {orderBook.sells.map((order, index) => (
                <div key={`sell-${index}`} className="order-row sell">
                  <span className="price">{formatNumber(order.price, 8)}</span>
                  <span className="amount">{formatNumber(order.amount, 2)}</span>
                  <span className="total">{formatNumber(order.total, 6)}</span>
                </div>
              ))}
            </div>

            <div className="spread-indicator">
              <div className="current-price">
                {formatNumber(currentPair.price, 8)} BSV
                <span className="spread">Spread: 0.00000001</span>
              </div>
            </div>

            <div className="buys-section">
              {orderBook.buys.map((order, index) => (
                <div key={`buy-${index}`} className="order-row buy">
                  <span className="price">{formatNumber(order.price, 8)}</span>
                  <span className="amount">{formatNumber(order.amount, 2)}</span>
                  <span className="total">{formatNumber(order.total, 6)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="trades-section">
          <div className="section-header">
            <h3>Recent Trades</h3>
            <button className="refresh-btn">
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div className="trades-list">
            <div className="trades-header">
              <span>Time</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            
            {recentTrades.map(trade => (
              <div key={trade.id} className="trade-row">
                <span className="time">{trade.timestamp}</span>
                <span className={`type ${trade.type}`}>
                  {trade.type.toUpperCase()}
                </span>
                <span className="amount">{formatNumber(trade.amount, 0)}</span>
                <span className="price">{formatNumber(trade.price, 8)}</span>
                <span className="total">{formatNumber(trade.total, 6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exchange-footer">
        <div className="market-info">
          <div className="info-card">
            <Activity className="info-icon" />
            <div className="info-content">
              <div className="info-title">24h Volume</div>
              <div className="info-value">{formatNumber(currentPair.volume24h)} BSV</div>
            </div>
          </div>

          <div className="info-card">
            <Users className="info-icon" />
            <div className="info-content">
              <div className="info-title">Active Traders</div>
              <div className="info-value">24</div>
            </div>
          </div>

          <div className="info-card">
            <Clock className="info-icon" />
            <div className="info-content">
              <div className="info-title">Last Trade</div>
              <div className="info-value">2 min ago</div>
            </div>
          </div>

          <div className="info-card">
            <Coins className="info-icon" />
            <div className="info-content">
              <div className="info-title">Market Cap</div>
              <div className="info-value">$150,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;