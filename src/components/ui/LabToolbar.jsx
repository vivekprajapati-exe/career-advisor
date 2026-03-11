import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const LabToolbar = ({ 
  onSave = () => {}, 
  onClear = () => {}, 
  onUndo = () => {}, 
  onRedo = () => {},
  onSafetyToggle = () => {},
  safetyMode = true,
  hasUnsavedChanges = false,
  canUndo = false,
  canRedo = false,
  isSimulating = false
}) => {
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);

  const handleSave = () => {
    onSave();
  };

  const handleClear = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to clear all work? Unsaved changes will be lost.')) {
        onClear();
      }
    } else {
      onClear();
    }
  };

  const toggleSafetyInfo = () => {
    setShowSafetyInfo(!showSafetyInfo);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section - Main Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSimulating}
            iconName="Save"
            iconPosition="left"
            className="hidden sm:flex"
          >
            Save Experiment
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSimulating}
            className="sm:hidden"
            title="Save Experiment"
          >
            <Icon name="Save" size={18} />
          </Button>

          <Button
            variant="outline"
            onClick={onUndo}
            disabled={!canUndo || isSimulating}
            size="icon"
            title="Undo"
          >
            <Icon name="Undo" size={18} />
          </Button>

          <Button
            variant="outline"
            onClick={onRedo}
            disabled={!canRedo || isSimulating}
            size="icon"
            title="Redo"
          >
            <Icon name="Redo" size={18} />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={isSimulating}
            iconName="Trash2"
            iconPosition="left"
            className="hidden sm:flex"
          >
            Clear Lab
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleClear}
            disabled={isSimulating}
            className="sm:hidden"
            title="Clear Lab"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        </div>

        {/* Right Section - Safety & Status */}
        <div className="flex items-center space-x-3">
          {/* Safety Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={safetyMode ? "success" : "warning"}
              onClick={onSafetyToggle}
              disabled={isSimulating}
              iconName={safetyMode ? "Shield" : "ShieldAlert"}
              iconPosition="left"
              className="hidden sm:flex"
            >
              {safetyMode ? "Safety On" : "Safety Off"}
            </Button>

            <Button
              variant={safetyMode ? "success" : "warning"}
              size="icon"
              onClick={onSafetyToggle}
              disabled={isSimulating}
              className="sm:hidden"
              title={safetyMode ? "Safety Mode On" : "Safety Mode Off"}
            >
              <Icon name={safetyMode ? "Shield" : "ShieldAlert"} size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSafetyInfo}
              title="Safety Information"
            >
              <Icon name="Info" size={16} />
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-1 text-warning text-sm">
                <Icon name="AlertCircle" size={16} />
                <span className="hidden sm:inline">Unsaved</span>
              </div>
            )}

            {isSimulating && (
              <div className="flex items-center space-x-1 text-primary text-sm">
                <Icon name="Play" size={16} />
                <span className="hidden sm:inline">Simulating</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Information Panel */}
      {showSafetyInfo && (
        <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={20} className="text-success mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-foreground mb-1">Laboratory Safety Mode</h4>
              <p className="text-muted-foreground mb-2">
                {safetyMode 
                  ? "Safety mode is active. Dangerous reactions are prevented and safety warnings are displayed." :"Safety mode is disabled. All reactions are allowed. Use caution with hazardous materials."
                }
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Always wear appropriate safety equipment</li>
                <li>• Read material safety data sheets before experiments</li>
                <li>• Keep emergency procedures accessible</li>
                <li>• Report any incidents immediately</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabToolbar;