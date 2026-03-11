import React from 'react';
import Icon from '../../../components/AppIcon';

const SafetyInformation = ({ element }) => {
  const getHazardLevel = (level) => {
    const levels = {
      low: { color: "text-success", bg: "bg-success/10", icon: "Shield" },
      moderate: { color: "text-warning", bg: "bg-warning/10", icon: "AlertTriangle" },
      high: { color: "text-error", bg: "bg-error/10", icon: "AlertOctagon" },
      extreme: { color: "text-destructive", bg: "bg-destructive/10", icon: "Skull" }
    };
    return levels?.[level] || levels?.low;
  };

  const hazard = getHazardLevel(element?.hazardLevel);

  return (
    <div className="space-y-4">
      {/* Hazard Level */}
      <div className={`p-4 rounded-lg border ${hazard?.bg} border-current/20`}>
        <div className="flex items-center space-x-3 mb-3">
          <Icon name={hazard?.icon} size={20} className={hazard?.color} />
          <h4 className={`text-lg font-semibold ${hazard?.color}`}>
            {element?.hazardLevel?.charAt(0)?.toUpperCase() + element?.hazardLevel?.slice(1)} Hazard Level
          </h4>
        </div>
        <p className="text-sm text-muted-foreground">
          {element?.safetyDescription}
        </p>
      </div>
      {/* Safety Precautions */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="ShieldCheck" size={16} />
          <span>Safety Precautions</span>
        </h4>
        <ul className="space-y-2">
          {element?.safetyPrecautions?.map((precaution, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
              <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
              <span>{precaution}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* First Aid */}
      {element?.firstAid && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Heart" size={16} className="text-error" />
            <span>First Aid Information</span>
          </h4>
          <div className="space-y-2">
            {Object.entries(element?.firstAid)?.map(([type, instruction]) => (
              <div key={type} className="text-sm">
                <span className="font-medium text-foreground capitalize">{type}:</span>
                <span className="text-muted-foreground ml-2">{instruction}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Storage Requirements */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Package" size={16} />
          <span>Storage Requirements</span>
        </h4>
        <p className="text-sm text-muted-foreground">
          {element?.storageRequirements || "Store in a cool, dry place away from incompatible materials."}
        </p>
      </div>
    </div>
  );
};

export default SafetyInformation;