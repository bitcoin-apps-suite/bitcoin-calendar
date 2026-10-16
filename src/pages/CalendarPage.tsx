// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Upload, Lock, Clock } from 'lucide-react';
import { Utils } from '@bsv/sdk';
import { useWallet, wallet, publishRecord } from '../lib/bwallet';
import Footer from '../components/Footer';
import './CalendarPage.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  creator?: string;
  txid?: string;
}

interface CalendarPageProps {
  devSidebarCollapsed?: boolean;
  isMobile?: boolean;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ devSidebarCollapsed = false, isMobile = false }) => {
  const { user, connect, connecting } = useWallet();
  const isAuthenticated = !!user;
  const storeKey = `bcal:events:${user?.identityKey ?? 'guest'}`;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Events live on this device (per wallet identity) until you save them on-chain.
  useEffect(() => {
    try { setEvents(JSON.parse(localStorage.getItem(storeKey) || '[]')); } catch { setEvents([]); }
  }, [storeKey]);
  const persist = (next: CalendarEvent[]) => {
    setEvents(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
  };

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        creator: user?.name,
        description: ''
      };
      persist([...events, newEvent]);
    }
  };

  const icsDate = (d: string) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsText = (t: string) => t.replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
  const handleExportCalendar = () => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bitcoin Calendar//EN'];
    for (const e of events) {
      lines.push('BEGIN:VEVENT', `UID:${e.id}@bitcoin-calendar`, `DTSTAMP:${icsDate(new Date().toISOString())}`, `DTSTART:${icsDate(e.start)}`);
      if (e.end) lines.push(`DTEND:${icsDate(e.end)}`);
      lines.push(`SUMMARY:${icsText(e.title)}`);
      if (e.description) lines.push(`DESCRIPTION:${icsText(e.description)}`);
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitcoin-calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Encrypt the event to your own wallet key, then write it on-chain. Your wallet shows the fee before you approve.
  const handleSaveOnChain = async (event: CalendarEvent) => {
    if (!user) { await connect(); return; }
    setSaving(true);
    setSaveError('');
    try {
      const plaintext = Utils.toArray(JSON.stringify({ title: event.title, start: event.start, end: event.end, description: event.description }), 'utf8');
      const { ciphertext } = await wallet().encrypt({ plaintext, protocolID: [1, 'bitcoin calendar'], keyID: event.id });
      const r = await publishRecord(['bCal', 'event', user.identityKey, event.id, Utils.toHex(ciphertext)], 'Bitcoin Calendar event');
      const next = events.map((e) => (e.id === event.id ? { ...e, txid: r.txid } : e));
      persist(next);
      setSelectedEvent({ ...event, txid: r.txid });
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'The wallet did not sign.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    persist(events.filter((e) => e.id !== eventId));
    setShowEventModal(false);
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: (event.txid ? '🔒 ' : '') + event.title,
    start: event.start,
    end: event.end,
    backgroundColor: event.txid ? '#b8860b' : '#3498db',
    borderColor: event.txid ? '#F5B800' : '#2980b9'
  }));

  return (
    <div className={`calendar-page ${!isMobile && !devSidebarCollapsed ? 'sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="App-header">
        {/* Desktop header layout */}
        <div className="desktop-header-wrapper">
          <h1
            onClick={() => window.location.href = '/'}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src="/logo.svg" 
              alt="Bitcoin Calendar Logo" 
              className="app-logo"
              style={{ width: '32px', height: '32px', marginRight: '12px', verticalAlign: 'middle' }}
            />
            <span style={{color: '#8b5cf6'}}>Bitcoin</span> Calendar
          </h1>
          <p className="app-subtitle">Mint your calendar on the blockchain, charge for access, securitize its revenue flow and trade calendar shares on the $BCAL exchange</p>
        </div>
        
        {/* User info (top right) */}
        <div className="user-info desktop-user-info">
          {user ? (
            <span className="user-handle" title={user.identityKey}>{user.name}</span>
          ) : (
            <button className="connect-btn" onClick={() => void connect()} disabled={connecting}>
              {connecting ? 'Connecting…' : 'Sign in with bWalletX'}
            </button>
          )}
        </div>
      </header>
      
      <div className="calendar-header">
        <div className="calendar-title-section">
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {events.length} events
            {user && <span className="user-info"> • Signed in as {user.name}</span>}
            {events.length === 0 && <span> • No events yet. Click a day to add one.</span>}
          </div>
        </div>

        <div className="calendar-actions">
          <button 
            className="action-btn primary"
            onClick={() => handleDateSelect({ startStr: new Date().toISOString() })}
            title="Create new event"
          >
            <Plus size={20} />
            <span>New Event</span>
          </button>

          <button 
            className="action-btn secondary"
            onClick={handleExportCalendar}
            title="Download your events as an .ics file"
          >
            <Upload size={20} />
            <span>Export</span>
          </button>

          <div className="view-selector">
            <button 
              className={`view-btn ${calendarView === 'dayGridMonth' ? 'active' : ''}`}
              onClick={() => setCalendarView('dayGridMonth')}
            >
              Month
            </button>
            <button 
              className={`view-btn ${calendarView === 'timeGridWeek' ? 'active' : ''}`}
              onClick={() => setCalendarView('timeGridWeek')}
            >
              Week
            </button>
            <button 
              className={`view-btn ${calendarView === 'timeGridDay' ? 'active' : ''}`}
              onClick={() => setCalendarView('timeGridDay')}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            events={calendarEvents}
            eventClick={handleEventClick}
            select={handleDateSelect}
            selectable={true}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'prev,next today'
            }}
            height="auto"
            dayMaxEvents={3}
            eventDisplay="block"
            displayEventTime={true}
            allDaySlot={true}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            nowIndicator={true}
            weekNumbers={true}
          />
        </div>

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedEvent.title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowEventModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="event-details">
                  <div className="event-time">
                    <Clock size={16} />
                    <span>
                      {new Date(selectedEvent.start).toLocaleString()}
                      {selectedEvent.end && ` - ${new Date(selectedEvent.end).toLocaleString()}`}
                    </span>
                  </div>

                  {selectedEvent.description && (
                    <div className="event-description">
                      <p>{selectedEvent.description}</p>
                    </div>
                  )}

                  {selectedEvent.creator && (
                    <div className="event-creator">
                      <strong>Created by:</strong> {selectedEvent.creator}
                    </div>
                  )}

                  {selectedEvent.txid && (
                    <div className="event-status">
                      <span className="status-badge encrypted">
                        🔒 Saved on-chain (encrypted):{' '}
                        <a href={`https://whatsonchain.com/tx/${selectedEvent.txid}`} target="_blank" rel="noopener noreferrer">{selectedEvent.txid.slice(0, 12)}…</a>
                      </span>
                    </div>
                  )}
                  {saveError && <p style={{ color: '#f87171' }}>{saveError}</p>}
                </div>

                <div className="modal-actions">
                  <button className="action-btn primary" onClick={() => void handleSaveOnChain(selectedEvent)} disabled={saving || !!selectedEvent.txid}>
                    <Lock size={16} />
                    <span>{selectedEvent.txid ? 'Saved on-chain' : saving ? 'Waiting for wallet…' : user ? 'Save on-chain (private)' : 'Sign in to save on-chain'}</span>
                  </button>
                  <button className="action-btn secondary" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                    <span>Remove from this device</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="calendar-stats">
        <div className="stat-card">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{events.filter(e => e.txid).length}</div>
          <div className="stat-label">Saved on-chain</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{isAuthenticated ? 'Signed in' : 'Not signed in'}</div>
          <div className="stat-label">Wallet</div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CalendarPage;