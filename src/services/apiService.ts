
interface ColumnMapping {
  [key: string]: string;
}

interface UploadResponse {
  file_id: string;
  columns: string[];
  suggestions: { [key: string]: string };
  standard_columns: { [key: string]: string };
}

export interface Person {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
}

// Mock data for demo purposes
let mockDatabase: Person[] = [];
let lastId = 0;

// Standard columns that our system recognizes
const STANDARD_COLUMNS = {
  name: "Name",
  company: "Company",
  phone: "Phone",
  email: "Email"
};

// Simulates uploading a file to the server
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Generate intelligent column mapping suggestions
      const suggestions: { [key: string]: string } = {};
      
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        
        if (lowerHeader.includes('name') || lowerHeader.includes('full')) {
          suggestions[header] = 'name';
        } else if (lowerHeader.includes('company') || lowerHeader.includes('org') || lowerHeader.includes('business')) {
          suggestions[header] = 'company';
        } else if (lowerHeader.includes('phone') || lowerHeader.includes('tel') || lowerHeader.includes('mobile')) {
          suggestions[header] = 'phone';
        } else if (lowerHeader.includes('email') || lowerHeader.includes('mail') || lowerHeader.includes('@')) {
          suggestions[header] = 'email';
        }
      });
      
      // Simulate network delay
      setTimeout(() => {
        resolve({
          file_id: `file_${Date.now()}`,
          columns: headers,
          suggestions,
          standard_columns: STANDARD_COLUMNS
        });
      }, 600);
    };
    
    reader.readAsText(file);
  });
};

// Process the CSV data with the confirmed column mappings
export const processCSV = async (
  file: File, 
  columnMapping: ColumnMapping
): Promise<Person[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse the CSV data based on the provided mapping
      const people: Person[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        // Skip empty lines
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length === headers.length) {
          const person: any = { id: ++lastId };
          
          headers.forEach((header, index) => {
            const standardField = columnMapping[header];
            if (standardField) {
              person[standardField] = values[index];
            }
          });
          
          people.push(person as Person);
        }
      }
      
      // Add to mock database
      mockDatabase = [...mockDatabase, ...people];
      
      // Simulate network delay
      setTimeout(() => {
        resolve(people);
      }, 800);
    };
    
    reader.readAsText(file);
  });
};

// Get all people from the database
export const getPeople = async (): Promise<Person[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockDatabase);
    }, 300);
  });
};
