import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

interface NavigationProps {
  items: NavItem[];
  onNavigate: (path: string) => void;
  currentPath: string;
}

const navVariants = {
  expanded: {
    width: '240px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  collapsed: {
    width: '64px',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
} as const;

const itemVariants = {
  expanded: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  collapsed: {
    x: -20,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
} as const;

// Memoized NavItem component
const NavItemComponent = React.memo(function NavItemComponent({
  item,
  isActive,
  isExpanded
}: {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
}) {
  return (
    <motion.div
      className={`flex items-center px-4 py-3 mb-2 relative ${
        isActive
          ? 'text-teal-600'
          : 'text-gray-600 hover:text-teal-600'
      }`}
      whileHover={{
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={item.path}
        className="flex items-center w-full"
        aria-current={isActive ? 'page' : undefined}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"
            initial={false}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          />
        )}
        
        <span className="w-8 h-8 flex items-center justify-center">
          {item.icon}
        </span>
        
        <motion.span
          variants={itemVariants}
          initial={isExpanded ? "expanded" : "collapsed"}
          animate={isExpanded ? "expanded" : "collapsed"}
          className="ml-3 font-medium whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      </Link>
    </motion.div>
  );
});

export default function Navigation({ items, onNavigate, currentPath }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavigation = useCallback((path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  }, [onNavigate]);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--secondary-color)',
        borderRight: '1px solid rgba(118, 171, 174, 0.2)',
        transition: 'transform var(--transition-speed)',
        transform: isMobileMenuOpen ? 'translateX(0)' : undefined,
        zIndex: 50,
      }}
    >
      {/* Mobile Menu Button */}
      <motion.button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: 'fixed',
          top: 'calc(var(--header-height) + var(--spacing-sm))',
          left: isMobileMenuOpen ? 'var(--sidebar-width)' : 'var(--spacing-sm)',
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--primary-color)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
          zIndex: 51,
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isMobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </motion.button>

      {/* Navigation Items */}
      <div
        style={{
          padding: 'var(--spacing-md)',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <motion.div
          initial={false}
          animate={{
            x: isMobileMenuOpen ? 0 : -50,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
          }}
        >
          {items.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: currentPath === item.path
                  ? 'var(--primary-color)'
                  : 'transparent',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.95rem',
                transition: 'background-color var(--transition-speed)',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: -1,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <style>
        {`
          @media (max-width: 768px) {
            nav {
              transform: translateX(-100%);
            }
            
            nav.open {
              transform: translateX(0);
            }

            .mobile-menu-button {
              display: block;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            nav {
              transition: none;
            }
          }
        `}
      </style>
    </nav>
  );
} 