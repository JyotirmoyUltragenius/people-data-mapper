
import React, { useCallback, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck2 } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
    toast({
      title: "File selected",
      description: file.name,
      variant: "default"
    });
  };

  const handleSubmit = useCallback(() => {
    if (file) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`w-full border-2 border-dashed rounded-xl p-10 transition-all duration-300 animate-fade-in
          ${isDragging ? 'bg-primary/10 border-primary' : 'bg-background border-border'}
          ${file ? 'bg-primary/5 border-primary/50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse-soft">
              <Upload size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Upload CSV File</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Drag & drop your file here, or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <Button 
              variant="secondary" 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="mt-2"
            >
              Select File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <FileCheck2 size={28} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">File Selected</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                onClick={() => setFile(null)}
              >
                Change
              </Button>
              <Button 
                onClick={handleSubmit}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
