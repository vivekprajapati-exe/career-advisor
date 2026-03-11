import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExperimentHistory = ({ experiments, onReplay, onShare }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filterOptions = [
    { value: "all", label: "All Experiments" },
    { value: "organic", label: "Organic Chemistry" },
    { value: "inorganic", label: "Inorganic Chemistry" },
    { value: "physical", label: "Physical Chemistry" },
    { value: "analytical", label: "Analytical Chemistry" }
  ];

  const sortOptions = [
    { value: "date", label: "Date (Newest)" },
    { value: "name", label: "Name (A-Z)" },
    { value: "rating", label: "Success Rating" },
    { value: "duration", label: "Duration" }
  ];

  const filteredExperiments = experiments?.filter(exp => {
      const matchesSearch = exp?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           exp?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesFilter = filterType === "all" || exp?.category === filterType;
      return matchesSearch && matchesFilter;
    })?.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a?.name?.localeCompare(b?.name);
        case "rating":
          return b?.successRating - a?.successRating;
        case "duration":
          return b?.duration - a?.duration;
        default:
          return new Date(b.completedAt) - new Date(a.completedAt);
      }
    });

  const getSuccessColor = (rating) => {
    if (rating >= 90) return "text-success";
    if (rating >= 70) return "text-warning";
    return "text-error";
  };

  const getSuccessIcon = (rating) => {
    if (rating >= 90) return "CheckCircle";
    if (rating >= 70) return "AlertCircle";
    return "XCircle";
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border shadow-element-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search experiments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              placeholder="Filter by type"
              className="min-w-[150px]"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="min-w-[150px]"
            />
          </div>
        </div>
      </div>
      {/* Experiments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExperiments?.map((experiment) => (
          <div key={experiment?.id} className="bg-card rounded-lg border border-border shadow-element-card overflow-hidden">
            {/* Experiment Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={experiment?.thumbnail}
                alt={experiment?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                  {experiment?.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <div className={`flex items-center space-x-1 px-2 py-1 bg-black/70 rounded-full ${getSuccessColor(experiment?.successRating)}`}>
                  <Icon name={getSuccessIcon(experiment?.successRating)} size={12} />
                  <span className="text-xs text-white">{experiment?.successRating}%</span>
                </div>
              </div>
            </div>

            {/* Experiment Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground text-lg">{experiment?.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShare(experiment)}
                  title="Share experiment"
                >
                  <Icon name="Share2" size={16} />
                </Button>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {experiment?.description}
              </p>

              {/* Experiment Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{formatDuration(experiment?.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(experiment?.completedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Beaker" size={14} />
                  <span>{experiment?.reactions} reactions</span>
                </div>
              </div>

              {/* Key Results */}
              {experiment?.keyResults && experiment?.keyResults?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Results:</h4>
                  <div className="flex flex-wrap gap-1">
                    {experiment?.keyResults?.map((result, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  onClick={() => onReplay(experiment)}
                  iconName="Play"
                  iconPosition="left"
                  className="flex-1"
                >
                  Replay
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/reaction-simulation-results?id=${experiment?.id}`, '_blank')}
                  iconName="ExternalLink"
                  iconPosition="left"
                  className="flex-1"
                >
                  View Results
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredExperiments?.length === 0 && (
        <div className="bg-card rounded-lg border border-border shadow-element-card p-12 text-center">
          <Icon name="Beaker" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Experiments Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterType !== "all" ?"Try adjusting your search or filter criteria" :"Start your chemistry journey by conducting your first experiment"
            }
          </p>
          <Button
            variant="default"
            onClick={() => window.location.href = '/virtual-laboratory-workspace'}
            iconName="Plus"
            iconPosition="left"
          >
            Start New Experiment
          </Button>
        </div>
      )}
      {/* Summary Stats */}
      {filteredExperiments?.length > 0 && (
        <div className="bg-card rounded-lg border border-border shadow-element-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{filteredExperiments?.length}</div>
              <div className="text-sm text-muted-foreground">Total Experiments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {Math.round(filteredExperiments?.reduce((acc, exp) => acc + exp?.successRating, 0) / filteredExperiments?.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {Math.round(filteredExperiments?.reduce((acc, exp) => acc + exp?.duration, 0) / 60)}h
              </div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">
                {filteredExperiments?.reduce((acc, exp) => acc + exp?.reactions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Reactions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentHistory;