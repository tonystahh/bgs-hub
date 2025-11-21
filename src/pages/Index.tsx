import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-4xl">B</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Brototype Portal</h1>
        </div>

        {/* Centered Login and Sign Up Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to="/auth">
            <Button variant="outline" size="lg" className="min-w-[140px]">
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" className="min-w-[140px]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
