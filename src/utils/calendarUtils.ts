// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import { CalendarEvent, CalendarImportSource, CalendarExportOptions, CalendarEncryption } from '../types/calendar';
// import * as ICAL from 'ical.js'; // Temporarily disabled due to typing issues

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Check if event is happening now
 */
export const isEventActive = (event: CalendarEvent): boolean => {
  const now = new Date();
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : start;
  
  return now >= start && now <= end;
};

/**
 * Check if event is upcoming (within next 24 hours)
 */
export const isEventUpcoming = (event: CalendarEvent): boolean => {
  const now = new Date();
  const start = new Date(event.start);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  return start > now && start <= tomorrow;
};

/**
 * Get event duration in minutes
 */
export const getEventDuration = (event: CalendarEvent): number => {
  if (!event.end) return 0;
  
  const start = new Date(event.start);
  const end = new Date(event.end);
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

/**
 * Generate recurring event instances
 */
export const generateRecurringEvents = (
  baseEvent: CalendarEvent,
  maxInstances: number = 100
): CalendarEvent[] => {
  if (!baseEvent.recurring) return [baseEvent];
  
  const events: CalendarEvent[] = [];
  const { frequency, interval, endDate, count } = baseEvent.recurring;
  
  const startDate = new Date(baseEvent.start);
  const endEventDate = new Date(baseEvent.end || baseEvent.start);
  const duration = endEventDate.getTime() - startDate.getTime();
  
  let currentDate = new Date(startDate);
  let instanceCount = 0;
  const maxDate = endDate ? new Date(endDate) : null;
  const maxCount = count || maxInstances;
  
  while (instanceCount < maxCount) {
    if (maxDate && currentDate > maxDate) break;
    
    const eventStart = new Date(currentDate);
    const eventEnd = new Date(currentDate.getTime() + duration);
    
    events.push({
      ...baseEvent,
      id: `${baseEvent.id}_${instanceCount}`,
      start: eventStart.toISOString(),
      end: eventEnd.toISOString(),
    });
    
    // Calculate next occurrence
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
    }
    
    instanceCount++;
  }
  
  return events;
};

/**
 * Convert events to iCal format (simplified implementation)
 */
export const exportToICal = (events: CalendarEvent[], options?: CalendarExportOptions): string => {
  const filteredEvents = options?.dateRange 
    ? events.filter(event => {
        const eventDate = new Date(event.start);
        const startDate = new Date(options.dateRange!.start);
        const endDate = new Date(options.dateRange!.end);
        return eventDate >= startDate && eventDate <= endDate;
      })
    : events;
  
  // Simplified iCal format
  const icalLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bitcoin Calendar//Bitcoin Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Bitcoin Calendar',
    'X-WR-TIMEZONE:UTC'
  ];
  
  filteredEvents.forEach(event => {
    if (options?.includePrivate === false && event.visibility === 'private') return;
    if (options?.includeEncrypted === false && event.encrypted) return;
    
    icalLines.push('BEGIN:VEVENT');
    icalLines.push(`UID:${event.id}`);
    icalLines.push(`SUMMARY:${event.title}`);
    icalLines.push(`DTSTART:${new Date(event.start).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`);
    
    if (event.end) {
      icalLines.push(`DTEND:${new Date(event.end).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`);
    }
    
    if (event.description) {
      icalLines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    }
    
    if (event.location) {
      icalLines.push(`LOCATION:${event.location}`);
    }
    
    icalLines.push(`CREATED:${new Date(event.createdAt).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`);
    icalLines.push(`LAST-MODIFIED:${new Date(event.updatedAt).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`);
    
    // Add custom properties
    if (event.encrypted) {
      icalLines.push('X-BITCOIN-CALENDAR-ENCRYPTED:true');
    }
    
    if (event.nftTokenId) {
      icalLines.push(`X-BITCOIN-CALENDAR-NFT:${event.nftTokenId}`);
    }
    
    if (event.blockchainTxId) {
      icalLines.push(`X-BITCOIN-CALENDAR-TX:${event.blockchainTxId}`);
    }
    
    icalLines.push('END:VEVENT');
  });
  
  icalLines.push('END:VCALENDAR');
  
  return icalLines.join('\r\n');
};

/**
 * Import events from iCal data (simplified implementation)
 */
export const importFromICal = (icalData: string): CalendarEvent[] => {
  try {
    // Simplified parsing - in production, use a proper iCal parser
    const lines = icalData.split(/\r?\n/);
    const events: CalendarEvent[] = [];
    let currentEvent: Partial<CalendarEvent> | null = null;
    
    for (const line of lines) {
      if (line.trim() === 'BEGIN:VEVENT') {
        currentEvent = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          creator: 'imported',
          category: 'meeting',
          visibility: 'private',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else if (line.trim() === 'END:VEVENT' && currentEvent) {
        if (currentEvent.title && currentEvent.start) {
          events.push(currentEvent as CalendarEvent);
        }
        currentEvent = null;
      } else if (currentEvent && line.includes(':')) {
        const [prop, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        
        switch (prop.trim()) {
          case 'UID':
            currentEvent.id = value;
            break;
          case 'SUMMARY':
            currentEvent.title = value;
            break;
          case 'DESCRIPTION':
            currentEvent.description = value.replace(/\\n/g, '\n');
            break;
          case 'DTSTART':
            // Parse basic date format
            const startMatch = value.match(/(\d{8})T(\d{6})/);
            if (startMatch) {
              const [, date, time] = startMatch;
              const year = date.substr(0, 4);
              const month = date.substr(4, 2);
              const day = date.substr(6, 2);
              const hour = time.substr(0, 2);
              const minute = time.substr(2, 2);
              const second = time.substr(4, 2);
              currentEvent.start = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
            }
            break;
          case 'DTEND':
            // Parse basic date format
            const endMatch = value.match(/(\d{8})T(\d{6})/);
            if (endMatch) {
              const [, date, time] = endMatch;
              const year = date.substr(0, 4);
              const month = date.substr(4, 2);
              const day = date.substr(6, 2);
              const hour = time.substr(0, 2);
              const minute = time.substr(2, 2);
              const second = time.substr(4, 2);
              currentEvent.end = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
            }
            break;
          case 'LOCATION':
            currentEvent.location = value;
            break;
          case 'X-BITCOIN-CALENDAR-ENCRYPTED':
            currentEvent.encrypted = value === 'true';
            break;
          case 'X-BITCOIN-CALENDAR-NFT':
            currentEvent.nftTokenId = value;
            break;
          case 'X-BITCOIN-CALENDAR-TX':
            currentEvent.blockchainTxId = value;
            break;
        }
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error parsing iCal data:', error);
    throw new Error('Invalid iCal format');
  }
};

/**
 * Convert events to CSV format
 */
export const exportToCSV = (events: CalendarEvent[]): string => {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Start Date',
    'End Date',
    'Location',
    'Creator',
    'Category',
    'Priority',
    'Encrypted',
    'NFT Token ID',
    'Created At'
  ];
  
  const rows = events.map(event => [
    event.id,
    `"${event.title.replace(/"/g, '""')}"`,
    `"${(event.description || '').replace(/"/g, '""')}"`,
    event.start,
    event.end || '',
    `"${(event.location || '').replace(/"/g, '""')}"`,
    event.creator,
    event.category || '',
    event.priority || '',
    event.encrypted ? 'Yes' : 'No',
    event.nftTokenId || '',
    event.createdAt
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

/**
 * Simple encryption for calendar events (demo purposes)
 * In production, use proper encryption libraries
 */
export const encryptEventData = async (
  eventData: string,
  password: string
): Promise<CalendarEncryption> => {
  try {
    // This is a simplified demo implementation
    // In production, use proper crypto libraries like Web Crypto API or node-forge
    const encoded = new TextEncoder().encode(eventData + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const encryptedData = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      algorithm: 'AES-256-GCM',
      encryptedData,
      iv: 'demo-iv',
      salt: 'demo-salt',
      keyDerivation: {
        algorithm: 'PBKDF2',
        iterations: 10000
      }
    };
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

/**
 * Simple decryption for calendar events (demo purposes)
 */
export const decryptEventData = async (
  encryptionData: CalendarEncryption,
  password: string
): Promise<string> => {
  try {
    // This is a simplified demo implementation
    // In production, implement proper decryption
    const mockDecryptedData = {
      title: 'Decrypted Event',
      description: 'This event was encrypted and has been decrypted',
      start: new Date().toISOString(),
      location: 'Secure Location'
    };
    
    return JSON.stringify(mockDecryptedData, null, 2);
  } catch (error) {
    throw new Error('Decryption failed');
  }
};

/**
 * Filter events based on criteria
 */
export const filterEvents = (events: CalendarEvent[], filters: {
  dateRange?: { start: string; end: string };
  categories?: string[];
  searchQuery?: string;
  creator?: string;
  encrypted?: boolean;
  hasNFT?: boolean;
}): CalendarEvent[] => {
  return events.filter(event => {
    // Date range filter
    if (filters.dateRange) {
      const eventDate = new Date(event.start);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      if (eventDate < startDate || eventDate > endDate) return false;
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!event.category || !filters.categories.includes(event.category)) return false;
    }
    
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${event.title} ${event.description || ''} ${event.location || ''}`.toLowerCase();
      if (!searchableText.includes(query)) return false;
    }
    
    // Creator filter
    if (filters.creator && event.creator !== filters.creator) {
      return false;
    }
    
    // Encrypted filter
    if (filters.encrypted !== undefined && event.encrypted !== filters.encrypted) {
      return false;
    }
    
    // NFT filter
    if (filters.hasNFT !== undefined) {
      const hasNFT = !!event.nftTokenId;
      if (hasNFT !== filters.hasNFT) return false;
    }
    
    return true;
  });
};

/**
 * Generate unique event ID
 */
export const generateEventId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `cal_${timestamp}_${randomStr}`;
};

/**
 * Validate event data
 */
export const validateEventData = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];
  
  if (!event.title || event.title.trim().length === 0) {
    errors.push('Event title is required');
  }
  
  if (!event.start) {
    errors.push('Event start date is required');
  } else if (new Date(event.start).toString() === 'Invalid Date') {
    errors.push('Invalid start date format');
  }
  
  if (event.end) {
    if (new Date(event.end).toString() === 'Invalid Date') {
      errors.push('Invalid end date format');
    } else if (new Date(event.end) <= new Date(event.start || '')) {
      errors.push('End date must be after start date');
    }
  }
  
  if (event.title && event.title.length > 200) {
    errors.push('Event title must be less than 200 characters');
  }
  
  if (event.description && event.description.length > 2000) {
    errors.push('Event description must be less than 2000 characters');
  }
  
  return errors;
};