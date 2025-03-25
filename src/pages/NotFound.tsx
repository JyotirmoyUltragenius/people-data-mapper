
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-40" />
      </div>
      
      <div className="text-center relative z-10 max-w-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
          <span className="text-4xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button size="lg" asChild>
          <a href="/">
            <Home className="mr-2" size={18} />
            Return Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
