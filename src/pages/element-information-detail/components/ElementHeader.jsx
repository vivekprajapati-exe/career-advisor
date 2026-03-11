import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ElementHeader = ({ element, onBookmark, onShare, onAddToWorkspace, isBookmarked }) => {
  const getElectronShellConfig = (atomicNumber) => {
    const shells = [];
    let remaining = atomicNumber;
    const maxElectrons = [2, 8, 18, 32, 32, 18, 8];
    
    for (let i = 0; i < maxElectrons?.length && remaining > 0; i++) {
      const electronsInShell = Math.min(remaining, maxElectrons?.[i]);
      shells?.push(electronsInShell);
      remaining -= electronsInShell;
    }
    
    return shells;
  };

  const shells = getElectronShellConfig(element?.atomicNumber);

  return (
    <div className="bg-card border border-border rounded-lg shadow-element-card p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Element Basic Info */}
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center text-white font-bold ${element?.categoryColor}`}>
              <div className="text-xs opacity-80">{element?.atomicNumber}</div>
              <div className="text-2xl">{element?.symbol}</div>
              <div className="text-xs opacity-80">{element?.atomicMass}</div>
            </div>
          </div>
          
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">{element?.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Atom" size={16} />
                <span>Atomic Number: {element?.atomicNumber}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Weight" size={16} />
                <span>Atomic Mass: {element?.atomicMass} u</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Tag" size={16} />
                <span>{element?.category}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Electron Shell Diagram */}
        <div className="flex-shrink-0">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 text-center">Electron Configuration</h3>
            <div className="relative w-32 h-32 mx-auto">
              {shells?.map((electronCount, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-primary rounded-full flex items-center justify-center"
                  style={{
                    width: `${(index + 1) * 20}px`,
                    height: `${(index + 1) * 20}px`,
                    top: `${64 - (index + 1) * 10}px`,
                    left: `${64 - (index + 1) * 10}px`,
                  }}
                >
                  <span className="text-xs font-medium text-primary">{electronCount}</span>
                </div>
              ))}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              {element?.electronConfiguration}
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant={isBookmarked ? "default" : "outline"}
          onClick={onBookmark}
          iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
          iconPosition="left"
        >
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        
        <Button
          variant="outline"
          onClick={onShare}
          iconName="Share2"
          iconPosition="left"
        >
          Share
        </Button>
        
        <Button
          variant="default"
          onClick={onAddToWorkspace}
          iconName="Plus"
          iconPosition="left"
        >
          Add to Lab
        </Button>
        
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            title="Previous Element"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Next Element"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ElementHeader;