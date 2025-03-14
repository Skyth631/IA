import { motion } from 'framer-motion';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface NavigationProps {
  items: NavItem[];
  currentPath: string;
}

export default function Navigation({ items, currentPath }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
  };

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
  };

  return (
    <motion.nav
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={navVariants}
      className="fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col py-4"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        className="px-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-8 h-8">
          <img src="/logo.svg" alt="Logo" className="w-full h-full" />
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <motion.a
              key={item.id}
              href={item.href}
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
                <i className={`${item.icon} text-xl`} />
              </span>
              
              <motion.span
                variants={itemVariants}
                className="ml-3 font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </motion.a>
          );
        })}
      </div>

      <motion.div
        className="mt-auto px-4"
        variants={itemVariants}
      >
        <motion.button
          className="w-full py-2 px-3 rounded-lg bg-teal-50 text-teal-600 font-medium flex items-center"
          whileHover={{
            backgroundColor: 'rgba(20, 184, 166, 0.2)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="w-8 h-8 flex items-center justify-center">
            <i className="fas fa-cog text-xl" />
          </span>
          <motion.span
            variants={itemVariants}
            className="ml-3"
          >
            Settings
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.nav>
  );
} 