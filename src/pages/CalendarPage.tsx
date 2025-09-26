// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, Plus, Download, Upload, Lock, Unlock, Share2, Clock } from 'lucide-react';
import './CalendarPage.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
  encrypted?: boolean;
  nftTokenId?: string;
  creator?: string;
  attendees?: string[];
}

interface CalendarPageProps {
  isAuthenticated: boolean;
  currentUser: any;
  devSidebarCollapsed?: boolean;
  isMobile?: boolean;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ isAuthenticated, currentUser, devSidebarCollapsed = false, isMobile = false }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Bitcoin Calendar Development Meeting',
      start: '2025-09-26T10:00:00',
      end: '2025-09-26T11:30:00',
      description: 'Weekly development sync for Bitcoin Calendar app',
      creator: 'team@bitcoincorp.com',
      attendees: ['dev1@bitcoincorp.com', 'dev2@bitcoincorp.com']
    },
    {
      id: '2',
      title: '$BCALENDAR Token Launch',
      start: '2025-10-01T14:00:00',
      end: '2025-10-01T16:00:00',
      description: 'Official launch of the $BCALENDAR token',
      nftTokenId: 'nft_bcal_001'
    },
    {
      id: '3',
      title: 'Encrypted Private Meeting',
      start: '2025-09-27T15:00:00',
      end: '2025-09-27T16:00:00',
      description: 'This event is encrypted',
      encrypted: true
    }
  ]);

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
        creator: currentUser?.handle || 'anonymous',
        description: ''
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleImportCalendar = () => {
    // Placeholder for calendar import functionality
    alert('Import functionality will support Google Calendar, Outlook, iCal, and other formats');
  };

  const handleExportCalendar = () => {
    // Placeholder for calendar export functionality
    alert('Export functionality will support iCal, CSV, and other formats');
  };

  const handleEncryptEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, encrypted: !event.encrypted }
        : event
    ));
  };

  const handleCreateNFT = (eventId: string) => {
    // Placeholder for NFT creation
    const tokenId = `nft_bcal_${Date.now()}`;
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, nftTokenId: tokenId }
        : event
    ));
    alert(`Event NFT created with token ID: ${tokenId}`);
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.encrypted ? '🔒 ' + event.title : event.title + (event.nftTokenId ? ' 🎨' : ''),
    start: event.start,
    end: event.end,
    backgroundColor: event.encrypted ? '#ff6b6b' : event.nftTokenId ? '#4ecdc4' : '#3498db',
    borderColor: event.encrypted ? '#e55656' : event.nftTokenId ? '#45b7b8' : '#2980b9'
  }));

  return (
    <div className={`calendar-page ${!isMobile && !devSidebarCollapsed ? 'sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="calendar-header">
        <div className="calendar-title-section">
          <Calendar className="calendar-icon" size={32} />
          <div>
            <h1 className="calendar-title">Bitcoin Calendar</h1>
            <p className="calendar-subtitle">
              Decentralized scheduling on Bitcoin SV • {events.length} events
              {isAuthenticated && currentUser && (
                <span className="user-info"> • Connected as ${currentUser.handle || 'User'}</span>
              )}
            </p>
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
            onClick={handleImportCalendar}
            title="Import calendar from Google, Outlook, iCal"
          >
            <Download size={20} />
            <span>Import</span>
          </button>

          <button 
            className="action-btn secondary"
            onClick={handleExportCalendar}
            title="Export calendar to iCal, CSV"
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

                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div className="event-attendees">
                      <strong>Attendees:</strong>
                      <ul>
                        {selectedEvent.attendees.map((attendee, index) => (
                          <li key={index}>{attendee}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="event-status">
                    {selectedEvent.encrypted && (
                      <span className="status-badge encrypted">🔒 Encrypted</span>
                    )}
                    {selectedEvent.nftTokenId && (
                      <span className="status-badge nft">🎨 NFT: {selectedEvent.nftTokenId}</span>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleEncryptEvent(selectedEvent.id)}
                  >
                    {selectedEvent.encrypted ? <Unlock size={16} /> : <Lock size={16} />}
                    <span>{selectedEvent.encrypted ? 'Decrypt' : 'Encrypt'}</span>
                  </button>

                  <button 
                    className="action-btn secondary"
                    onClick={() => handleCreateNFT(selectedEvent.id)}
                    disabled={!!selectedEvent.nftTokenId}
                  >
                    <span>🎨 {selectedEvent.nftTokenId ? 'NFT Created' : 'Create NFT'}</span>
                  </button>

                  <button 
                    className="action-btn secondary"
                    onClick={() => alert('Share functionality coming soon')}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
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
          <div className="stat-value">{events.filter(e => e.encrypted).length}</div>
          <div className="stat-label">Encrypted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{events.filter(e => e.nftTokenId).length}</div>
          <div className="stat-label">NFT Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{isAuthenticated ? 'Connected' : 'Disconnected'}</div>
          <div className="stat-label">Blockchain Status</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;