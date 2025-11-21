import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar, BarChart3, Megaphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);
  if (loading || user) {
    return null;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-xl">Brototype Portal</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Digital Campus Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A streamlined platform for Brototype students to manage complaints, track attendance, 
            request leaves, and stay updated with announcements.
          </p>
          
          {/* Centered Login and Sign Up Buttons */}
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button variant="outline" size="lg">Login</Button>
            </Link>
            <Link to="/auth">
              <Button size="lg">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Why Use This Portal?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <BenefitCard title="Save Time" description="No more WhatsApp spam. Everything in one place." />
            <BenefitCard title="Stay Organized" description="Track all your requests and get timely responses." />
            <BenefitCard title="Transparency" description="Clear visibility into attendance and complaint status." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center mb-8">
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
          <div className="text-center text-muted-foreground">
            <p>© 2024 Brototype Student Portal. Built for excellence.</p>
          </div>
        </div>
      </footer>
    </div>;
};
const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>;
const BenefitCard = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => <div className="text-center">
    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-4">
      <div className="w-8 h-8 bg-accent rounded-full"></div>
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>;
export default Index;