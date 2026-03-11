import React from 'react';
import Icon from '../../../components/AppIcon';

const LabEquipment = ({ onEquipmentSelect, selectedEquipment }) => {
  const equipmentCategories = [
    {
      name: "Glassware",
      icon: "FlaskConical",
      items: [
        { id: "beaker-250ml", name: "Beaker 250ml", icon: "FlaskConical", description: "Standard laboratory beaker" },
        { id: "beaker-500ml", name: "Beaker 500ml", icon: "FlaskConical", description: "Large capacity beaker" },
        { id: "test-tube", name: "Test Tube", icon: "TestTube", description: "Glass test tube for small reactions" },
        { id: "erlenmeyer-flask", name: "Erlenmeyer Flask", icon: "FlaskRound", description: "Conical flask for mixing" },
        { id: "graduated-cylinder", name: "Graduated Cylinder", icon: "Cylinder", description: "Precise volume measurement" },
        { id: "petri-dish", name: "Petri Dish", icon: "Circle", description: "Shallow dish for observations" }
      ]
    },
    {
      name: "Heating Equipment",
      icon: "Flame",
      items: [
        { id: "bunsen-burner", name: "Bunsen Burner", icon: "Flame", description: "Gas burner for heating" },
        { id: "hot-plate", name: "Hot Plate", icon: "Square", description: "Electric heating surface" },
        { id: "heating-mantle", name: "Heating Mantle", icon: "Circle", description: "Controlled flask heating" }
      ]
    },
    {
      name: "Measuring Tools",
      icon: "Ruler",
      items: [
        { id: "balance", name: "Analytical Balance", icon: "Scale", description: "Precise mass measurement" },
        { id: "thermometer", name: "Thermometer", icon: "Thermometer", description: "Temperature monitoring" },
        { id: "ph-meter", name: "pH Meter", icon: "Gauge", description: "Acidity measurement" },
        { id: "pipette", name: "Pipette", icon: "Droplet", description: "Precise liquid transfer" }
      ]
    },
    {
      name: "Safety Equipment",
      icon: "Shield",
      items: [
        { id: "safety-goggles", name: "Safety Goggles", icon: "Eye", description: "Eye protection" },
        { id: "fume-hood", name: "Fume Hood", icon: "Wind", description: "Ventilation system" },
        { id: "fire-extinguisher", name: "Fire Extinguisher", icon: "Zap", description: "Emergency fire suppression" }
      ]
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Wrench" size={20} />
          <span>Lab Equipment</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Drag equipment to workspace</p>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {equipmentCategories?.map((category) => (
          <div key={category?.name} className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Icon name={category?.icon} size={16} />
              <span>{category?.name}</span>
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              {category?.items?.map((item) => (
                <div
                  key={item?.id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-ui
                    ${selectedEquipment === item?.id
                      ? 'border-primary bg-primary/5 shadow-element-card'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => onEquipmentSelect(item)}
                  draggable
                  onDragStart={(e) => {
                    e?.dataTransfer?.setData('application/json', JSON.stringify(item));
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Icon name={item?.icon} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabEquipment;