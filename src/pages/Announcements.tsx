import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Announcements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-xl">Brototype Portal</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Megaphone className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Announcements</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Stay updated with important campus announcements
          </p>

          {/* Announcements List */}
          <div className="space-y-6">
            <AnnouncementCard
              title="Workshop on React Advanced Patterns"
              date="March 20, 2024"
              category="Event"
              content="Join us for an exclusive workshop on advanced React patterns including custom hooks, compound components, and performance optimization techniques. Registration is mandatory."
              isNew
            />
            <AnnouncementCard
              title="Campus Closed - Public Holiday"
              date="March 15, 2024"
              category="Holiday"
              content="The campus will remain closed on March 21st due to a public holiday. All classes scheduled for that day will be rescheduled."
            />
            <AnnouncementCard
              title="New Lab Timing Updates"
              date="March 10, 2024"
              category="Important"
              content="Starting next week, lab timings will be extended until 8 PM on weekdays. Please plan your schedule accordingly."
            />
            <AnnouncementCard
              title="Monthly Assessment Schedule Released"
              date="March 5, 2024"
              category="Academic"
              content="The schedule for monthly assessments has been published. Check your dashboard for detailed timings and topics."
            />
            <AnnouncementCard
              title="Placement Drive - Tech Companies"
              date="February 28, 2024"
              category="Placement"
              content="Several tech companies will be visiting campus for placement drives next month. Eligible students should register through the placement portal."
            />
          </div>
        </div>
      </header>
    </div>
  );
};

const AnnouncementCard = ({ 
  title, 
  date, 
  category, 
  content, 
  isNew 
}: { 
  title: string; 
  date: string; 
  category: string; 
  content: string; 
  isNew?: boolean 
}) => {
  const categoryColors: Record<string, string> = {
    Event: "bg-primary/10 text-primary",
    Holiday: "bg-success/10 text-success",
    Important: "bg-destructive/10 text-destructive",
    Academic: "bg-warning/10 text-warning",
    Placement: "bg-accent/10 text-accent"
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge className={categoryColors[category] || "bg-muted text-muted-foreground"}>
            {category}
          </Badge>
          {isNew && <Badge className="bg-success/10 text-success">New</Badge>}
        </div>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{content}</p>
    </Card>
  );
};

export default Announcements;
