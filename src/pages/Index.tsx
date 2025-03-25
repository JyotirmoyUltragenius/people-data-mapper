
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import FileUpload from '@/components/FileUpload';
import ColumnMapping from '@/components/ColumnMapping';
import DataTable from '@/components/DataTable';
import { uploadFile, processCSV, getPeople, Person } from '@/services/apiService';

type AppView = 'upload' | 'mapping' | 'data';

const Index = () => {
  const { toast } = useToast();
  const [view, setView] = useState<AppView>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    
    try {
      const response = await uploadFile(selectedFile);
      setUploadResponse(response);
      setView('mapping');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingConfirm = async (mapping: { [key: string]: string }) => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      await processCSV(file, mapping);
      const allPeople = await getPeople();
      setPeople(allPeople);
      setView('data');
      
      toast({
        title: "Success",
        description: "Data has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'mapping') {
      setView('upload');
    } else if (view === 'data') {
      // When going back from data view, reload data
      getPeople().then(setPeople);
      setView('upload');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="w-full px-6 py-4 bg-white glass-effect border-b z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-medium">
              People Data Mapper
            </h1>
          </div>
        </div>
      </header>
      
      {/* Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-40 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-30" />
        </div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto z-10">
          {/* Steps indicator */}
          <div className="flex items-center justify-center mb-12 gap-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${view === 'upload' ? 'bg-primary text-white scale-110' : 'bg-secondary text-foreground'}`}
            >
              1
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${view === 'mapping' ? 'bg-primary text-white scale-110' : 'bg-secondary text-foreground'}`}
            >
              2
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${view === 'data' ? 'bg-primary text-white scale-110' : 'bg-secondary text-foreground'}`}
            >
              3
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-center">
            {view === 'upload' && "Upload Your CSV File"}
            {view === 'mapping' && "Map Your Columns"}
            {view === 'data' && "Your People Database"}
          </h1>
          
          <p className="text-muted-foreground mb-10 text-center">
            {view === 'upload' && "Start by uploading a CSV file with your contacts"}
            {view === 'mapping' && "Tell us which columns contain what information"}
            {view === 'data' && "View and search through your processed data"}
          </p>
          
          <div className="w-full mb-12">
            {view === 'upload' && (
              <FileUpload onFileSelected={handleFileSelected} />
            )}
            
            {view === 'mapping' && uploadResponse && (
              <ColumnMapping 
                columns={uploadResponse.columns}
                suggestions={uploadResponse.suggestions}
                standardColumns={uploadResponse.standard_columns}
                onConfirm={handleMappingConfirm}
                onBack={handleBack}
              />
            )}
            
            {view === 'data' && (
              <DataTable 
                data={people}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t bg-white/50">
        <div className="max-w-7xl mx-auto text-sm text-muted-foreground text-center">
          People Data Mapper — Designed with ❤️
        </div>
      </footer>
    </div>
  );
};

export default Index;
