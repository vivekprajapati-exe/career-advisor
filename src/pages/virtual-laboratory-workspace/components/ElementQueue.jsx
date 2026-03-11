import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ElementQueue = ({ 
  selectedElements, 
  onElementRemove, 
  onElementAdd, 
  onClearQueue,
  onAddToEquipment,
  selectedWorkspaceItem 
}) => {
  const mockElements = [
    { symbol: "H", name: "Hydrogen", atomicNumber: 1, color: "#FF6B6B" },
    { symbol: "O", name: "Oxygen", atomicNumber: 8, color: "#4ECDC4" },
    { symbol: "Na", name: "Sodium", atomicNumber: 11, color: "#45B7D1" },
    { symbol: "Cl", name: "Chlorine", atomicNumber: 17, color: "#96CEB4" },
    { symbol: "C", name: "Carbon", atomicNumber: 6, color: "#FFEAA7" },
    { symbol: "N", name: "Nitrogen", atomicNumber: 7, color: "#DDA0DD" },
    { symbol: "S", name: "Sulfur", atomicNumber: 16, color: "#FFD93D" },
    { symbol: "Fe", name: "Iron", atomicNumber: 26, color: "#FF7675" }
  ];

  const handleQuickAdd = (element) => {
    onElementAdd(element);
  };

  const handleAddToEquipment = (element) => {
    if (selectedWorkspaceItem) {
      onAddToEquipment(element, selectedWorkspaceItem);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Atom" size={20} />
            <span>Element Queue</span>
          </h3>
          
          {selectedElements?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearQueue}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedElements?.length} elements selected
        </p>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Selected Elements */}
        {selectedElements?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Selected Elements</h4>
            <div className="space-y-2">
              {selectedElements?.map((element, index) => (
                <div
                  key={`${element?.symbol}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: element?.color }}
                    >
                      {element?.symbol}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{element?.name}</p>
                      <p className="text-xs text-muted-foreground">Atomic #{element?.atomicNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {selectedWorkspaceItem && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToEquipment(element)}
                        iconName="Plus"
                        title="Add to selected equipment"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onElementRemove(index)}
                      iconName="X"
                      title="Remove from queue"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {selectedWorkspaceItem && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Selected: {selectedWorkspaceItem?.name}
                </p>
                <p className="text-xs text-primary/80">
                  Click + to add elements to this equipment
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Add Elements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Quick Add Elements</h4>
          <div className="grid grid-cols-2 gap-2">
            {mockElements?.map((element) => (
              <div
                key={element?.symbol}
                className="p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-ui"
                onClick={() => handleQuickAdd(element)}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: element?.color }}
                  >
                    {element?.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {element?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{element?.atomicNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation to Element Information */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            iconName="Search"
            iconPosition="left"
            onClick={() => window.location.href = '/element-information-detail'}
          >
            Browse All Elements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ElementQueue;