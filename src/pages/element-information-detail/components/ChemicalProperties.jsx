import React from 'react';
import Icon from '../../../components/AppIcon';

const ChemicalProperties = ({ element }) => {
  const properties = [
    {
      label: "Electron Configuration",
      value: element?.electronConfiguration,
      icon: "Orbit"
    },
    {
      label: "Oxidation States",
      value: element?.oxidationStates?.join(", "),
      icon: "Plus"
    },
    {
      label: "Electronegativity",
      value: element?.electronegativity,
      icon: "Magnet"
    },
    {
      label: "Atomic Radius",
      value: element?.atomicRadius,
      unit: "pm",
      icon: "Circle"
    },
    {
      label: "Ionization Energy",
      value: element?.ionizationEnergy,
      unit: "kJ/mol",
      icon: "Zap"
    },
    {
      label: "Electron Affinity",
      value: element?.electronAffinity,
      unit: "kJ/mol",
      icon: "Minus"
    }
  ];

  return (
    <div className="space-y-4">
      {properties?.map((property, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
          <div className="flex-shrink-0 mt-0.5">
            <Icon name={property?.icon} size={18} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground mb-1">{property?.label}</div>
            <div className="text-sm text-muted-foreground">
              {property?.value !== null && property?.value !== undefined 
                ? `${property?.value} ${property?.unit || ""}`?.trim()
                : "Unknown"
              }
            </div>
          </div>
        </div>
      ))}
      {/* Valence Electrons Visualization */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Atom" size={16} />
          <span>Valence Shell</span>
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Valence Electrons:</span>
          <span className="text-sm font-medium text-foreground">{element?.valenceElectrons}</span>
        </div>
      </div>
    </div>
  );
};

export default ChemicalProperties;