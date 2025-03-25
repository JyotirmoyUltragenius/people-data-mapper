
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';

interface ColumnMappingProps {
  columns: string[];
  suggestions: { [key: string]: string };
  standardColumns: { [key: string]: string };
  onConfirm: (mapping: { [key: string]: string }) => void;
  onBack: () => void;
}

const ColumnMapping: React.FC<ColumnMappingProps> = ({
  columns,
  suggestions,
  standardColumns,
  onConfirm,
  onBack
}) => {
  const [mapping, setMapping] = useState<{ [key: string]: string }>({});
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    // Initialize mapping with suggestions
    const initialMapping: { [key: string]: string } = {};
    columns.forEach(column => {
      if (suggestions[column]) {
        initialMapping[column] = suggestions[column];
      }
    });
    setMapping(initialMapping);
    
    // Hide hint after 5 seconds
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, [columns, suggestions]);

  const handleChange = (column: string, value: string) => {
    setMapping(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleConfirm = () => {
    onConfirm(mapping);
  };

  // Check if we have at least one field mapped
  const hasMapping = Object.keys(mapping).length > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        {showHint && (
          <div className="absolute -top-16 left-0 right-0 bg-primary/10 text-primary p-3 rounded-lg text-sm animate-fade-in">
            We've automatically suggested mappings based on your column names
          </div>
        )}
        
        <div className="bg-card rounded-xl border p-6 shadow-sm animate-fade-in">
          <h2 className="text-xl font-semibold mb-5">Map Your Columns</h2>
          
          <div className="space-y-6 mb-6">
            {columns.map((column, index) => (
              <div 
                key={column}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  "animate-slide-in",
                  { "bg-primary/5": mapping[column] }
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1 text-left">
                  <p className="font-medium truncate" title={column}>
                    {column}
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground/50" size={16} />
                <div className="w-36">
                  <Select
                    value={mapping[column] || ""}
                    onValueChange={(value) => handleChange(column, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ignore</SelectItem>
                      {Object.entries(standardColumns).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={onBack}>
              <ChevronLeft className="mr-1" size={16} />
              Back
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!hasMapping}
            >
              Continue
              <ChevronRight className="ml-1" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnMapping;
