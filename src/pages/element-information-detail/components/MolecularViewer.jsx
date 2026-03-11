import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MolecularViewer = ({ element }) => {
  const [viewMode, setViewMode] = useState('3d');
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleRotate = (axis, direction) => {
    if (axis === 'x') {
      setRotationX(prev => prev + (direction * 15));
    } else {
      setRotationY(prev => prev + (direction * 15));
    }
  };

  const handleZoom = (direction) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + (direction * 0.1))));
  };

  const resetView = () => {
    setRotationX(0);
    setRotationY(0);
    setZoom(1);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Atom" size={20} />
          <span>Molecular Structure</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('3d')}
          >
            3D
          </Button>
          <Button
            variant={viewMode === 'orbital' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('orbital')}
          >
            Orbitals
          </Button>
        </div>
      </div>
      {/* Molecular Viewer Area */}
      <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-lg h-64 flex items-center justify-center mb-4">
        <div 
          className="relative transition-transform duration-300"
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`
          }}
        >
          {viewMode === '3d' ? (
            <div className="relative">
              {/* Central Nucleus */}
              <div className={`w-12 h-12 rounded-full ${element?.categoryColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {element?.symbol}
              </div>
              
              {/* Electron Shells */}
              {[1, 2, 3]?.map((shell) => (
                <div
                  key={shell}
                  className="absolute border-2 border-primary/30 rounded-full animate-pulse"
                  style={{
                    width: `${shell * 40}px`,
                    height: `${shell * 40}px`,
                    top: `${24 - shell * 20}px`,
                    left: `${24 - shell * 20}px`,
                    animationDelay: `${shell * 0.5}s`
                  }}
                >
                  {/* Electrons */}
                  <div className="absolute w-2 h-2 bg-accent rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                  {shell > 1 && (
                    <div className="absolute w-2 h-2 bg-accent rounded-full bottom-0 right-0 transform translate-x-1 translate-y-1"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['s', 'p', 'd']?.map((orbital) => (
                  <div key={orbital} className="bg-primary/20 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-foreground">{orbital}</div>
                    <div className="w-8 h-8 bg-primary/40 rounded-full mx-auto mt-1"></div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Orbital Configuration: {element?.electronConfiguration}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rotate:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRotate('y', -1)}
            title="Rotate Left"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRotate('y', 1)}
            title="Rotate Right"
          >
            <Icon name="RotateCw" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRotate('x', -1)}
            title="Rotate Up"
          >
            <Icon name="ChevronUp" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRotate('x', 1)}
            title="Rotate Down"
          >
            <Icon name="ChevronDown" size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(-1)}
            title="Zoom Out"
          >
            <Icon name="ZoomOut" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(1)}
            title="Zoom In"
          >
            <Icon name="ZoomIn" size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>
      </div>
      {/* Structure Information */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">Bond Length:</span>
            <span className="text-muted-foreground ml-2">{element?.bondLength || "N/A"}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Bond Angle:</span>
            <span className="text-muted-foreground ml-2">{element?.bondAngle || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolecularViewer;