import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-element-card mb-6">
      <div className="flex overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-ui border-b-2
              ${activeTab === tab?.id
                ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon name={tab?.icon} size={18} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;