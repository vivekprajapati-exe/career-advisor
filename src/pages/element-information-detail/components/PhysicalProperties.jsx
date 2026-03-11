import React from 'react';
import Icon from '../../../components/AppIcon';

const PhysicalProperties = ({ element }) => {
  const properties = [
    {
      label: "Melting Point",
      value: element?.meltingPoint,
      unit: "K",
      icon: "Thermometer"
    },
    {
      label: "Boiling Point",
      value: element?.boilingPoint,
      unit: "K",
      icon: "Flame"
    },
    {
      label: "Density",
      value: element?.density,
      unit: "g/cm³",
      icon: "Package"
    },
    {
      label: "Phase at STP",
      value: element?.phase,
      unit: "",
      icon: "Layers"
    },
    {
      label: "Crystal Structure",
      value: element?.crystalStructure,
      unit: "",
      icon: "Gem"
    },
    {
      label: "Thermal Conductivity",
      value: element?.thermalConductivity,
      unit: "W/(m·K)",
      icon: "Zap"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {properties?.map((property, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="flex-shrink-0">
            <Icon name={property?.icon} size={20} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground">{property?.label}</div>
            <div className="text-sm text-muted-foreground">
              {property?.value !== null && property?.value !== undefined 
                ? `${property?.value} ${property?.unit}`?.trim()
                : "Unknown"
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhysicalProperties;