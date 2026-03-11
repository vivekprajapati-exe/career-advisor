import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const routeMap = {
    '/element-information-detail': {
      label: 'Element Information',
      parent: null
    },
    '/virtual-laboratory-workspace': {
      label: 'Virtual Laboratory',
      parent: null
    },
    '/reaction-simulation-results': {
      label: 'Reaction Results',
      parent: '/virtual-laboratory-workspace'
    },
    '/user-profile-progress-dashboard': {
      label: 'Profile & Progress',
      parent: null
    }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const currentRoute = routeMap?.[location?.pathname];
    if (!currentRoute) return [];

    const breadcrumbs = [];
    
    // Add home
    breadcrumbs?.push({
      label: 'Home',
      path: '/',
      icon: 'Home'
    });

    // Add parent if exists
    if (currentRoute?.parent) {
      const parentRoute = routeMap?.[currentRoute?.parent];
      if (parentRoute) {
        breadcrumbs?.push({
          label: parentRoute?.label,
          path: currentRoute?.parent
        });
      }
    }

    // Add current page
    breadcrumbs?.push({
      label: currentRoute?.label,
      path: location?.pathname,
      current: true
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="text-border" />
            )}
            {crumb?.current ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                {crumb?.icon && <Icon name={crumb?.icon} size={16} />}
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="flex items-center space-x-1 hover:text-foreground transition-ui"
              >
                {crumb?.icon && <Icon name={crumb?.icon} size={16} />}
                <span>{crumb?.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;