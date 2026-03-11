import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EquipmentProperties = ({ 
  selectedItem, 
  onPropertiesUpdate, 
  onItemRemove 
}) => {
  const [properties, setProperties] = useState(
    selectedItem?.properties || {
      temperature: 25,
      volume: 100,
      concentration: 0,
      contents: []
    }
  );

  const handlePropertyChange = (property, value) => {
    const updatedProperties = {
      ...properties,
      [property]: value
    };
    setProperties(updatedProperties);
    onPropertiesUpdate(selectedItem?.instanceId, updatedProperties);
  };

  const handleRemoveContent = (index) => {
    const updatedContents = properties?.contents?.filter((_, i) => i !== index);
    handlePropertyChange('contents', updatedContents);
  };

  if (!selectedItem) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-element-card h-full">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Settings" size={20} />
            <span>Equipment Properties</span>
          </h3>
        </div>
        
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select equipment to view properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Settings" size={20} />
            <span>Properties</span>
          </h3>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onItemRemove(selectedItem?.instanceId)}
            iconName="Trash2"
            title="Remove equipment"
          />
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <Icon name={selectedItem?.icon} size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{selectedItem?.name}</span>
        </div>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Physical Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Physical Properties</h4>
          
          <Input
            label="Temperature (°C)"
            type="number"
            value={properties?.temperature}
            onChange={(e) => handlePropertyChange('temperature', parseFloat(e?.target?.value) || 0)}
            min="-273"
            max="2000"
            description="Operating temperature"
          />
          
          <Input
            label="Volume (mL)"
            type="number"
            value={properties?.volume}
            onChange={(e) => handlePropertyChange('volume', parseFloat(e?.target?.value) || 0)}
            min="0"
            max="5000"
            description="Container capacity"
          />
          
          <Input
            label="Concentration (M)"
            type="number"
            value={properties?.concentration}
            onChange={(e) => handlePropertyChange('concentration', parseFloat(e?.target?.value) || 0)}
            min="0"
            max="20"
            step="0.1"
            description="Solution concentration"
          />
        </div>

        {/* Contents */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Contents</h4>
          
          {properties?.contents?.length > 0 ? (
            <div className="space-y-2">
              {properties?.contents?.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: content?.color }}
                    >
                      {content?.symbol}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{content?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {content?.amount || 1} mol
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContent(index)}
                    iconName="X"
                    title="Remove element"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <Icon name="Droplet" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No contents added</p>
              <p className="text-xs">Add elements from the queue</p>
            </div>
          )}
        </div>

        {/* Safety Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Safety Information</h4>
          
          <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Safety Guidelines</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Monitor temperature to prevent overheating</li>
                  <li>• Use appropriate PPE when handling chemicals</li>
                  <li>• Ensure proper ventilation for gas-producing reactions</li>
                  <li>• Keep fire extinguisher accessible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Status</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-card border border-border rounded-lg text-center">
              <Icon name="Thermometer" size={20} className="mx-auto mb-1 text-destructive" />
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-sm font-medium text-foreground">{properties?.temperature}°C</p>
            </div>
            
            <div className="p-3 bg-card border border-border rounded-lg text-center">
              <Icon name="Droplet" size={20} className="mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Fill Level</p>
              <p className="text-sm font-medium text-foreground">
                {Math.round((properties?.contents?.length / 5) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentProperties;