import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WorkspaceCanvas = ({ 
  placedEquipment, 
  onEquipmentPlace, 
  onEquipmentSelect, 
  selectedWorkspaceItem,
  onEquipmentRemove,
  isSimulating,
  reactionAnimation 
}) => {
  const canvasRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleDragOver = (e) => {
    e?.preventDefault();
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;

    try {
      const equipmentData = JSON.parse(e?.dataTransfer?.getData('application/json'));
      const newItem = {
        ...equipmentData,
        instanceId: `${equipmentData?.id}-${Date.now()}`,
        position: { x: Math.max(0, x - 25), y: Math.max(0, y - 25) },
        properties: {
          temperature: 25,
          volume: equipmentData?.id?.includes('beaker') ? 250 : 100,
          concentration: 0,
          contents: []
        }
      };
      onEquipmentPlace(newItem);
    } catch (error) {
      console.error('Error parsing dropped equipment:', error);
    }
  };

  const handleItemClick = (item) => {
    onEquipmentSelect(item);
  };

  const handleItemDoubleClick = (item) => {
    onEquipmentRemove(item?.instanceId);
  };

  const renderEquipmentItem = (item) => {
    const isSelected = selectedWorkspaceItem?.instanceId === item?.instanceId;
    const hasContents = item?.properties?.contents?.length > 0;
    
    return (
      <div
        key={item?.instanceId}
        className={`
          absolute cursor-pointer transition-ui transform hover:scale-105
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${isSimulating && hasContents ? 'animate-pulse' : ''}
        `}
        style={{
          left: item?.position?.x,
          top: item?.position?.y,
          zIndex: isSelected ? 10 : 1
        }}
        onClick={() => handleItemClick(item)}
        onDoubleClick={() => handleItemDoubleClick(item)}
        title={`${item?.name} - Double click to remove`}
      >
        <div className={`
          p-3 rounded-lg border-2 bg-card shadow-element-card
          ${isSelected ? 'border-primary' : 'border-border'}
          ${hasContents ? 'bg-primary/5' : ''}
        `}>
          <Icon 
            name={item?.icon} 
            size={32} 
            className={`
              ${hasContents ? 'text-primary' : 'text-muted-foreground'}
              ${isSimulating && hasContents ? 'animate-bounce' : ''}
            `} 
          />
          {hasContents && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        {isSelected && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap">
            {item?.name}
          </div>
        )}
      </div>
    );
  };

  const renderReactionAnimation = () => {
    if (!reactionAnimation || !isSimulating) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {reactionAnimation?.particles?.map((particle, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              left: particle?.x,
              top: particle?.y,
              backgroundColor: particle?.color,
              animationDelay: `${particle?.delay}ms`
            }}
          />
        ))}
        {reactionAnimation?.effects?.map((effect, index) => (
          <div
            key={index}
            className={`absolute text-2xl animate-bounce ${effect?.className}`}
            style={{
              left: effect?.x,
              top: effect?.y,
              animationDelay: `${effect?.delay}ms`
            }}
          >
            {effect?.symbol}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card h-full relative overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Beaker" size={20} />
            <span>Lab Workspace</span>
          </h3>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Drop equipment here • Double-click to remove</span>
          </div>
        </div>
      </div>
      <div
        ref={canvasRef}
        className="relative w-full h-[calc(100%-80px)] bg-gradient-to-br from-muted/20 to-muted/40"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {placedEquipment?.map(renderEquipmentItem)}
        {renderReactionAnimation()}
        
        {placedEquipment?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Icon name="MousePointer" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Drag Equipment Here</p>
              <p className="text-sm">Start building your experiment by dragging equipment from the left panel</p>
            </div>
          </div>
        )}

        {isSimulating && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-element-card">
            <div className="flex items-center space-x-2">
              <Icon name="Play" size={16} />
              <span className="text-sm font-medium">Simulation Running</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceCanvas;