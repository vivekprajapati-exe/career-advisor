import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoricalContext = ({ element }) => {
  return (
    <div className="space-y-4">
      {/* Discovery Information */}
      <div className="bg-muted rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Icon name="Calendar" size={18} className="text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">Discovery Year</div>
              <div className="text-sm text-muted-foreground">{element?.discoveryYear || "Ancient"}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="User" size={18} className="text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">Discovered By</div>
              <div className="text-sm text-muted-foreground">{element?.discoveredBy || "Unknown"}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Etymology */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="BookOpen" size={16} />
          <span>Etymology</span>
        </h4>
        <p className="text-sm text-muted-foreground">
          {element?.etymology}
        </p>
      </div>
      {/* Historical Uses */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Clock" size={16} />
          <span>Historical Uses</span>
        </h4>
        <ul className="space-y-2">
          {element?.historicalUses?.map((use, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
              <Icon name="ArrowRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Modern Applications */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Cpu" size={16} />
          <span>Modern Applications</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {element?.modernApplications?.map((application, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Zap" size={12} className="text-primary" />
              <span>{application}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Fun Facts */}
      {element?.funFacts && (
        <div className="bg-muted rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} />
            <span>Interesting Facts</span>
          </h4>
          <ul className="space-y-2">
            {element?.funFacts?.map((fact, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Icon name="Star" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoricalContext;