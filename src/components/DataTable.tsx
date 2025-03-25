
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Person } from "@/services/apiService";
import { ChevronLeft, Search, FileUp, Plus } from "lucide-react";

interface DataTableProps {
  data: Person[];
  onBack: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Filter data based on search term
    const filtered = data.filter(person => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (person.name && person.name.toLowerCase().includes(searchLower)) ||
        (person.company && person.company.toLowerCase().includes(searchLower)) ||
        (person.email && person.email.toLowerCase().includes(searchLower)) ||
        (person.phone && person.phone.toLowerCase().includes(searchLower))
      );
    });
    
    setFilteredData(filtered);
  }, [data, searchTerm]);

  useEffect(() => {
    // Set animation completed after a delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">People Database</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onBack}>
                <FileUp className="mr-1" size={16} />
                Upload More
              </Button>
              <Button size="sm">
                <Plus className="mr-1" size={16} />
                New Entry
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search people..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((person, index) => (
                  <TableRow 
                    key={person.id}
                    className="opacity-0 animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <TableCell className="font-medium">{person.id}</TableCell>
                    <TableCell>{person.name || '-'}</TableCell>
                    <TableCell>{person.company || '-'}</TableCell>
                    <TableCell>{person.email || '-'}</TableCell>
                    <TableCell>{person.phone || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className={animationComplete ? "animate-fade-in" : ""}>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchTerm 
                      ? "No results found. Try a different search term." 
                      : "No data available. Upload a CSV file to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
