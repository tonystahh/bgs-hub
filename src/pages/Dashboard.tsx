import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Megaphone, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Complaint System",
      description: "Submit and track your complaints",
      path: "/complaints",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Calendar,
      title: "Leave Requests",
      description: "Request and manage your leaves",
      path: "/leave-request",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: BarChart3,
      title: "Attendance",
      description: "View your attendance records",
      path: "/attendance",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: Megaphone,
      title: "Announcements",
      description: "Stay updated with campus news",
      path: "/announcements",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="font-bold text-xl">Brototype Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">
                {userRole || 'student'}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-3">Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Select a feature to get started
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.path}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50"
                onClick={() => navigate(feature.path)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
