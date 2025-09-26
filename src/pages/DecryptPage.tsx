// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState } from 'react';
import { Unlock, Shield, Key, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import './DecryptPage.css';

interface DecryptPageProps {
  isAuthenticated: boolean;
  currentUser: any;
}

const DecryptPage: React.FC<DecryptPageProps> = ({ isAuthenticated, currentUser }) => {
  const [encryptedData, setEncryptedData] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDecrypt = async () => {
    if (!encryptedData || !privateKey) {
      setError('Please provide both encrypted data and private key');
      return;
    }

    setIsDecrypting(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate decryption process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock decrypted calendar event
      const mockDecryptedData = {
        title: 'Confidential Bitcoin Calendar Meeting',
        description: 'Private discussion about upcoming $BCALENDAR features and roadmap',
        start: '2025-09-27T14:00:00Z',
        end: '2025-09-27T15:30:00Z',
        attendees: ['alice@bitcoincorp.com', 'bob@bitcoincorp.com'],
        location: 'Virtual Meeting Room',
        encrypted: true,
        owner: currentUser?.handle || 'anonymous'
      };

      setDecryptedContent(JSON.stringify(mockDecryptedData, null, 2));
      setSuccess(true);
    } catch (err) {
      setError('Decryption failed. Please check your private key and try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleClear = () => {
    setEncryptedData('');
    setPrivateKey('');
    setDecryptedContent('');
    setError('');
    setSuccess(false);
  };

  return (
    <div className="decrypt-page">
      <div className="decrypt-header">
        <div className="title-section">
          <Unlock className="page-icon" size={32} />
          <div>
            <h1 className="page-title">Decrypt Calendar Events</h1>
            <p className="page-subtitle">
              Decrypt your encrypted calendar events using your private key
              {isAuthenticated && <span className="auth-status">🔒 Authenticated</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="decrypt-content">
        <div className="decrypt-form">
          <div className="form-section">
            <h3>
              <Shield size={20} />
              Encrypted Calendar Data
            </h3>
            <textarea
              value={encryptedData}
              onChange={(e) => setEncryptedData(e.target.value)}
              placeholder="Paste your encrypted calendar data here..."
              className="encrypted-input"
              rows={8}
            />
          </div>

          <div className="form-section">
            <h3>
              <Key size={20} />
              Private Key
            </h3>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter your private key"
              className="key-input"
            />
            <div className="key-info">
              <AlertCircle size={16} />
              <span>Your private key is never stored or transmitted. Decryption happens locally.</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="decrypt-btn"
              onClick={handleDecrypt}
              disabled={!encryptedData || !privateKey || isDecrypting}
            >
              {isDecrypting ? (
                <>
                  <div className="spinner" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Decrypt Calendar Data
                </>
              )}
            </button>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={isDecrypting}
            >
              Clear All
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle size={16} />
              <span>Calendar data decrypted successfully!</span>
            </div>
          )}
        </div>

        {decryptedContent && (
          <div className="decrypted-section">
            <h3>
              <Calendar size={20} />
              Decrypted Calendar Event
            </h3>
            <div className="decrypted-content">
              <pre>{decryptedContent}</pre>
            </div>
            
            <div className="event-preview">
              <div className="preview-card">
                <div className="event-header">
                  <h4>Confidential Bitcoin Calendar Meeting</h4>
                  <span className="encrypted-badge">🔓 Decrypted</span>
                </div>
                
                <div className="event-details">
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>September 27, 2025 • 2:00 PM - 3:30 PM</span>
                  </div>
                  
                  <div className="detail-row">
                    <span>📍 Virtual Meeting Room</span>
                  </div>
                  
                  <div className="detail-row">
                    <span>👥 2 attendees</span>
                  </div>
                </div>
                
                <p className="event-description">
                  Private discussion about upcoming $BCALENDAR features and roadmap
                </p>
                
                <div className="event-actions">
                  <button className="action-btn primary">Add to Calendar</button>
                  <button className="action-btn secondary">Export Event</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>How Calendar Decryption Works</h3>
          <div className="info-grid">
            <div className="info-card">
              <Shield className="info-icon" />
              <div className="info-content">
                <h4>End-to-End Encryption</h4>
                <p>Your calendar events are encrypted using industry-standard encryption before being stored on the blockchain.</p>
              </div>
            </div>

            <div className="info-card">
              <Key className="info-icon" />
              <div className="info-content">
                <h4>Private Key Required</h4>
                <p>Only you have the private key needed to decrypt your calendar events. Your key never leaves your device.</p>
              </div>
            </div>

            <div className="info-card">
              <Calendar className="info-icon" />
              <div className="info-content">
                <h4>Calendar Integration</h4>
                <p>Decrypted events can be imported into your favorite calendar applications or viewed in Bitcoin Calendar.</p>
              </div>
            </div>
          </div>

          <div className="security-notice">
            <AlertCircle className="notice-icon" />
            <div className="notice-content">
              <h4>Security Notice</h4>
              <p>
                Never share your private key with anyone. Bitcoin Calendar processes decryption locally in your browser 
                and never transmits your private key over the network. Your encrypted data remains secure on the Bitcoin blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecryptPage;