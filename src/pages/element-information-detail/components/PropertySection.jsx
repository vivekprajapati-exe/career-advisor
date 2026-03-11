import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PropertySection = ({ title, icon, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card mb-4">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-ui"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Icon name={icon} size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySection;