// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end?: string; // ISO string
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  creator: string;
  encrypted?: boolean;
  nftTokenId?: string;
  blockchainTxId?: string;
  category?: 'meeting' | 'task' | 'reminder' | 'deadline' | 'personal' | 'business';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  visibility?: 'public' | 'private' | 'encrypted';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every N days/weeks/months/years
    endDate?: string;
    count?: number; // number of occurrences
  };
  reminders?: {
    minutes: number; // minutes before event
    method: 'popup' | 'email' | 'sms';
  }[];
  tags?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarImportSource {
  type: 'google' | 'outlook' | 'ical' | 'csv' | 'json';
  url?: string;
  file?: File;
  credentials?: {
    accessToken?: string;
    refreshToken?: string;
    clientId?: string;
  };
}

export interface CalendarExportOptions {
  format: 'ical' | 'csv' | 'json' | 'pdf';
  dateRange?: {
    start: string;
    end: string;
  };
  eventTypes?: string[];
  includePrivate?: boolean;
  includeEncrypted?: boolean;
}

export interface CalendarNFTMetadata {
  name: string;
  description: string;
  image?: string;
  eventIds: string[];
  creator: string;
  createdAt: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}

export interface CalendarEncryption {
  algorithm: 'AES-256-GCM' | 'RSA-OAEP';
  encryptedData: string;
  iv?: string; // initialization vector for AES
  salt?: string;
  keyDerivation?: {
    algorithm: 'PBKDF2';
    iterations: number;
  };
}

export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day' | 'agenda';
  workingHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    days: number[]; // 0-6, Sunday-Saturday
  };
  timeZone: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
  notifications: {
    enabled: boolean;
    defaultReminder: number; // minutes before
    sound: boolean;
    email: boolean;
  };
  privacy: {
    allowPublicView: boolean;
    allowEventSharing: boolean;
    encryptByDefault: boolean;
  };
  blockchain: {
    autoSave: boolean;
    saveInterval: number; // minutes
    network: 'mainnet' | 'testnet';
    gasPrice?: string;
  };
}

export interface CalendarShare {
  id: string;
  eventId: string;
  shareUrl: string;
  expiresAt?: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canInvite: boolean;
  };
  sharedWith?: string[]; // email addresses or wallet addresses
  createdAt: string;
}

export interface CalendarSyncStatus {
  lastSync: string;
  status: 'syncing' | 'synced' | 'error' | 'pending';
  source: string;
  errorMessage?: string;
  eventsImported: number;
  eventsUpdated: number;
  eventsFailed: number;
}

export interface CalendarUser {
  id: string;
  email: string;
  walletAddress?: string;
  displayName: string;
  avatar?: string;
  timeZone: string;
  permissions: {
    canCreateEvents: boolean;
    canEditEvents: boolean;
    canDeleteEvents: boolean;
    canInviteUsers: boolean;
    canManageSettings: boolean;
    canExport: boolean;
    canEncrypt: boolean;
    canMintNFT: boolean;
  };
  subscription?: {
    type: 'free' | 'pro' | 'enterprise';
    expiresAt?: string;
    features: string[];
  };
  createdAt: string;
  lastLoginAt: string;
}

// Utility types
export type CalendarEventCreate = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type CalendarEventUpdate = Partial<CalendarEventCreate>;
export type CalendarEventPublic = Omit<CalendarEvent, 'encrypted' | 'blockchainTxId'>;

// Filter and search types
export interface CalendarFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  creators?: string[];
  tags?: string[];
  priority?: string[];
  visibility?: string[];
  hasNFT?: boolean;
  isEncrypted?: boolean;
  searchQuery?: string;
}

export interface CalendarSearchResult {
  events: CalendarEvent[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}