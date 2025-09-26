import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  GitBranch, 
  Bug, 
  FileText, 
  DollarSign, 
  Users, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package,
  Terminal,
  Activity,
  Flower2,
  Wrench,
  Clock,
  Download,
  Upload,
  Lock,
  Unlock,
  Shield,
  Coins
} from 'lucide-react';
import './DevSidebar.css';

interface DevSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

const DevSidebar: React.FC<DevSidebarProps> = ({ onCollapsedChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    // Default to collapsed if no preference is saved
    return saved !== null ? saved === 'true' : true;
  });
  const [issueCount, setIssueCount] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('devSidebarCollapsed', isCollapsed.toString());
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  useEffect(() => {
    // Fetch GitHub issue count
    fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-calendar/issues?state=open')
      .then(res => res.json())
      .then(issues => setIssueCount(Array.isArray(issues) ? issues.length : 0))
      .catch(() => setIssueCount(0));
  }, []);

  const menuItems: Array<{
    path?: string;
    icon?: any;
    label?: string;
    badge?: string;
    divider?: boolean;
    section?: string;
    external?: boolean;
  }> = [
    // Token & NFT at top
    { path: '/token', icon: Coins, label: '$BCALENDAR', badge: 'NEW' },
    { path: '/nft', icon: Package, label: 'CALENDAR NFT', badge: 'MINT' },
    { path: '/exchange', icon: DollarSign, label: 'EXCHANGE' },
    
    // Calendar Operations
    { divider: true },
    { section: 'CALENDAR' },
    { path: '/import', icon: Download, label: 'Import Calendar' },
    { path: '/export', icon: Upload, label: 'Export Calendar' },
    { path: '/encrypt', icon: Lock, label: 'Encrypt Events' },
    { path: '/decrypt', icon: Unlock, label: 'Decrypt Events' },
    
    // Collaboration
    { divider: true },
    { section: 'COLLABORATION' },
    { path: '/tasks', icon: Clock, label: 'Task Manager' },
    { path: '/contributors', icon: Users, label: 'Contributors', badge: '2' },
    { path: '/docs', icon: BookOpen, label: 'Calendar Guides' },
    
    // Developers
    { divider: true },
    { section: 'DEVELOPERS' },
    { path: '/contracts', icon: Terminal, label: 'Smart Contracts', badge: issueCount > 0 ? String(issueCount) : '0' },
    { path: '/api', icon: Package, label: 'API Reference' },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-calendar', icon: GitBranch, label: 'GitHub', external: true },
    
    // System
    { divider: true },
    { path: '/changelog', icon: FileText, label: 'Changelog' },
    { path: '/status', icon: Activity, label: 'Status', badge: 'OK' }
  ];

  const stats = {
    totalTokens: '1,000,000,000',
    distributed: '850,000',
    contributors: '2',
    openEvents: '150+',
    calendarNFTs: '45'
  };

  return (
    <div className={`dev-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="dev-sidebar-header">
        {!isCollapsed && (
          <div className="dev-sidebar-title">
            <Calendar className="dev-sidebar-logo" />
            <span>Calendar Hub</span>
          </div>
        )}
        <button 
          className="dev-sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="dev-sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="dev-sidebar-divider" />;
          }

          if (item.section) {
            return !isCollapsed ? (
              <div key={index} className="dev-sidebar-section">
                {item.section}
              </div>
            ) : null;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.external) {
            return (
              <a
                key={`${item.path}-${index}`}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <>
                    <span className="dev-sidebar-label">{item.label}</span>
                    {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                  </>
                )}
              </a>
            );
          }

          return (
            <Link
              key={`${item.path}-${index}`}
              to={item.path || '/'}
              className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <>
                  <span className="dev-sidebar-label">{item.label}</span>
                  {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DevSidebar;