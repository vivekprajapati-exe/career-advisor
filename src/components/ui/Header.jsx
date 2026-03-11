import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Elements',
      path: '/element-information-detail',
      icon: 'Atom',
      tooltip: 'Explore periodic table and element properties'
    },
    {
      label: 'Laboratory',
      path: '/virtual-laboratory-workspace',
      icon: 'FlaskConical',
      tooltip: 'Virtual chemistry lab and experiments'
    },
    {
      label: 'Results',
      path: '/reaction-simulation-results',
      icon: 'BarChart3',
      tooltip: 'View reaction analysis and results'
    },
    {
      label: 'Profile',
      path: '/user-profile-progress-dashboard',
      icon: 'User',
      tooltip: 'Track learning progress and achievements'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-element-card">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-ui">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Atom" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">ChemLab Virtual</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-ui
                ${isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-element-card'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
        </Button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-lab-equipment">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-ui
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item?.icon} size={20} />
                <div>
                  <div>{item?.label}</div>
                  <div className="text-xs opacity-75">{item?.tooltip}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
      {/* Mobile Bottom Navigation (Alternative for small screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lab-equipment md:hidden">
        <nav className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`
                flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-ui min-w-0 flex-1
                ${isActivePath(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }
              `}
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={20} />
              <span className="truncate">{item?.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;