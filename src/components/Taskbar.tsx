import React, { useState, useRef, useEffect } from 'react';
import { Github, BookOpen, FileText, ExternalLink } from 'lucide-react';
import './Taskbar.css';

interface DropdownItem {
  label?: string;
  action?: () => void;
  href?: string;
  divider?: boolean;
  shortcut?: string;
  icon?: string;
}

interface DropdownMenu {
  label: string;
  items: DropdownItem[];
}

interface TaskbarProps {
  isAuthenticated: boolean;
  currentUser: any;
  onLogout: () => void;
  onNewEvent?: () => void;
  onSaveEvent?: () => void;
  onOpenTokenizeModal?: () => void;
  onOpenTwitterModal?: () => void;
  onToggleAIChat?: () => void;
  onImportCalendar?: () => void;
  onExportCalendar?: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  isAuthenticated,
  currentUser,
  onLogout,
  onNewEvent,
  onSaveEvent,
  onOpenTokenizeModal,
  onOpenTwitterModal,
  onToggleAIChat,
  onImportCalendar,
  onExportCalendar
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  const menus: DropdownMenu[] = [
    {
      label: 'Bitcoin Calendar',
      items: [
        { 
          label: 'Home', 
          shortcut: '⌘⇧H',
          action: () => window.location.href = '/'
        },
        { divider: true },
        { 
          label: 'About Bitcoin Calendar', 
          action: () => alert('Bitcoin Calendar v2.0\n\nDecentralized calendar and scheduling on Bitcoin SV\n\n© 2025 The Bitcoin Corporation LTD\nRegistered in England and Wales • Company No. 16735102\n\nBuilt with HandCash integration') 
        },
        { divider: true },
        { 
          label: 'Preferences...', 
          shortcut: '⌘,', 
          action: () => console.log('Preferences') 
        },
        { divider: true },
        { 
          label: 'Hide Bitcoin Calendar', 
          shortcut: '⌘H', 
          action: () => console.log('Hide') 
        },
        { 
          label: 'Hide Others', 
          shortcut: '⌥⌘H', 
          action: () => console.log('Hide Others') 
        },
        { divider: true },
        ...(isAuthenticated ? [
          { 
            label: 'Sign Out', 
            shortcut: '⌘Q', 
            action: onLogout 
          }
        ] : [
          { 
            label: 'Sign In', 
            action: () => document.querySelector<HTMLButtonElement>('.sign-in-btn')?.click()
          }
        ])
      ]
    },
    {
      label: 'File',
      items: [
        { 
          label: 'New Event', 
          shortcut: '⌘N', 
          action: onNewEvent 
        },
        { 
          label: 'Import Calendar...', 
          shortcut: '⌘O', 
          action: onImportCalendar 
        },
        { divider: true },
        { 
          label: 'Save Event', 
          shortcut: '⌘S', 
          action: onSaveEvent 
        },
        { 
          label: 'Export Calendar...', 
          shortcut: '⇧⌘S', 
          action: onExportCalendar 
        },
        { divider: true },
        { 
          label: 'Export as iCal', 
          action: () => console.log('Export iCal') 
        },
        { 
          label: 'Export as CSV', 
          action: () => console.log('Export CSV') 
        },
        { divider: true },
        { 
          label: 'Close', 
          shortcut: '⌘W', 
          action: () => console.log('Close') 
        }
      ]
    },
    {
      label: 'Edit',
      items: [
        { 
          label: 'Undo', 
          shortcut: '⌘Z', 
          action: () => document.execCommand('undo') 
        },
        { 
          label: 'Redo', 
          shortcut: '⇧⌘Z', 
          action: () => document.execCommand('redo') 
        },
        { divider: true },
        { 
          label: 'Cut', 
          shortcut: '⌘X', 
          action: () => document.execCommand('cut') 
        },
        { 
          label: 'Copy', 
          shortcut: '⌘C', 
          action: () => document.execCommand('copy') 
        },
        { 
          label: 'Paste', 
          shortcut: '⌘V', 
          action: () => document.execCommand('paste') 
        },
        { divider: true },
        { 
          label: 'Select All', 
          shortcut: '⌘A', 
          action: () => document.execCommand('selectAll') 
        },
        { 
          label: 'Find...', 
          shortcut: '⌘F', 
          action: () => console.log('Find') 
        },
        { 
          label: 'Replace...', 
          shortcut: '⌥⌘F', 
          action: () => console.log('Replace') 
        }
      ]
    },
    {
      label: 'Format',
      items: [
        { 
          label: 'Bold', 
          shortcut: '⌘B', 
          action: () => document.execCommand('bold') 
        },
        { 
          label: 'Italic', 
          shortcut: '⌘I', 
          action: () => document.execCommand('italic') 
        },
        { 
          label: 'Underline', 
          shortcut: '⌘U', 
          action: () => document.execCommand('underline') 
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'AI Assistant',
          icon: '🤖',
          shortcut: '⌘⌥A',
          action: onToggleAIChat
        },
        { divider: true },
        { 
          label: 'Save Calendar to Blockchain', 
          action: () => console.log('Save calendar to blockchain') 
        },
        { 
          label: 'Encrypt Calendar', 
          action: () => (document.querySelector('[title*="Encrypt"]') as HTMLElement)?.click() 
        },
        { divider: true },
        { 
          label: 'Create Calendar NFT', 
          action: onOpenTokenizeModal 
        },
        { 
          label: 'Set Event Paywall', 
          action: () => (document.querySelector('[title*="Set price"]') as HTMLElement)?.click() 
        },
        { divider: true },
        { 
          label: 'Share Event on Twitter', 
          action: onOpenTwitterModal 
        }
      ]
    },
    {
      label: 'View',
      items: [
        { 
          label: 'Enter Full Screen', 
          shortcut: '⌃⌘F', 
          action: () => document.documentElement.requestFullscreen() 
        },
        { divider: true },
        { 
          label: 'Actual Size', 
          shortcut: '⌘0', 
          action: () => (document.body.style as any).zoom = '100%' 
        },
        { 
          label: 'Zoom In', 
          shortcut: '⌘+', 
          action: () => (document.body.style as any).zoom = '110%' 
        },
        { 
          label: 'Zoom Out', 
          shortcut: '⌘-', 
          action: () => (document.body.style as any).zoom = '90%' 
        }
      ]
    },
    {
      label: 'Window',
      items: [
        { 
          label: 'Minimize', 
          shortcut: '⌘M', 
          action: () => console.log('Minimize') 
        },
        { 
          label: 'Zoom', 
          action: () => console.log('Zoom') 
        },
        { divider: true },
        { 
          label: 'Bring All to Front', 
          action: () => console.log('Bring to front') 
        }
      ]
    },
    {
      label: 'Help',
      items: [
        { 
          label: 'Bitcoin Calendar Help', 
          shortcut: '⌘?', 
          action: () => alert('Bitcoin Calendar v2.0\n\nSchedule, encrypt, and store events on the Bitcoin blockchain') 
        },
        { divider: true },
        { 
          label: 'Report an Issue', 
          href: 'https://github.com/bitcoin-apps-suite/bitcoin-calendar/issues' 
        }
      ]
    }
  ];


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setShowMobileMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      ref={menuRef}
      className="bitcoin-calendar-taskbar"
    >
      {/* Bitcoin Logo */}
      <div 
        className="taskbar-logo"
        onDoubleClick={() => window.location.href = '/'}
        title="Double-click to go home"
      >
        <span className="bitcoin-symbol">₿</span>
      </div>

      {/* Mobile: Center title */}
      <button 
        className="mobile-title"
        onClick={() => {
          // Navigate to home
          window.location.href = '/';
        }}
        title="Bitcoin Calendar - Tap to go home"
      >
        <span className="bitcoin-symbol">₿</span>
        <span>Bitcoin Calendar</span>
      </button>

      {/* Menu Items - After Logo */}
      <div className="taskbar-menus">
        {menus.map((menu) => (
          <div key={menu.label} className="menu-container">
            <button
              className={`menu-button ${activeMenu === menu.label ? 'active' : ''}`}
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <div className="dropdown-menu">
                {menu.items.map((item, index) => (
                  item.divider ? (
                    <div key={index} className="menu-divider" />
                  ) : item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="menu-item"
                      onClick={() => setActiveMenu(null)}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button
                      key={index}
                      className="menu-item"
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - App links */}
      <div className="taskbar-status">
        <a 
          href="https://github.com/bitcoin-apps-suite/bitcoin-calendar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="taskbar-link"
          title="GitHub"
        >
          <Github className="taskbar-link-icon" />
        </a>
        <a 
          href="https://docs.bitcoinapps.store/calendar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="taskbar-link"
          title="Documentation"
        >
          <BookOpen className="taskbar-link-icon" />
        </a>
        <a 
          href="/changelog" 
          className="taskbar-link"
          title="Changelog"
        >
          <FileText className="taskbar-link-icon" />
        </a>
        <a 
          href="https://x.com/BitcoinCal_X" 
          target="_blank" 
          rel="noopener noreferrer"
          className="taskbar-link"
          title="Follow us on X"
        >
          <ExternalLink className="taskbar-link-icon" />
        </a>
        {isAuthenticated && currentUser && (
          <div className="taskbar-user">
            <span className="taskbar-user-text">
              {currentUser.handle ? `$${currentUser.handle}` : 'Connected'}
            </span>
            <span className="status-indicator connected">●</span>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        {showMobileMenu ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            {/* User Status */}
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {isAuthenticated && currentUser ? (
                <>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>
                    {currentUser.handle ? `$${currentUser.handle}` : 'Connected'}
                  </span>
                  <span style={{ color: '#30d158' }}>●</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>Not Connected</span>
                  <span style={{ color: '#ff3b30', opacity: 0.6 }}>●</span>
                </>
              )}
            </div>

            {/* Menu Sections */}
            {menus.map((menu) => (
              <div key={menu.label} className="mobile-menu-section">
                <div className="mobile-menu-header">
                  {menu.label}
                </div>
                <div style={{ padding: '8px' }}>
                  {menu.items.map((item, index) => (
                    item.divider ? (
                      <div 
                        key={index}
                        style={{
                          height: '1px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          margin: '8px 0'
                        }}
                      />
                    ) : item.href ? (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-menu-item"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        key={index}
                        className="mobile-menu-item"
                        onClick={() => {
                          item.action?.();
                          setShowMobileMenu(false);
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskbar;