import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Complaints = () => {
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
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Complaint System</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Submit and track your complaints with transparent status updates
          </p>

          {/* Submit Complaint Form */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit New Complaint</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input placeholder="Brief description of your complaint" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea placeholder="Provide detailed information about your complaint" rows={5} />
              </div>
              <Button className="w-full">Submit Complaint</Button>
            </div>
          </Card>

          {/* Recent Complaints */}
          <h2 className="text-2xl font-semibold mb-4">Your Recent Complaints</h2>
          <div className="space-y-4">
            <ComplaintCard
              title="Internet connectivity issues"
              status="In-Review"
              date="2 days ago"
              reply="We are working on resolving this issue. Our team is currently investigating the network infrastructure."
            />
            <ComplaintCard
              title="AC not working in Lab 2"
              status="Resolved"
              date="5 days ago"
              reply="The AC has been repaired and is now fully functional. Thank you for reporting this issue."
            />
            <ComplaintCard
              title="Need more charging points"
              status="Pending"
              date="1 week ago"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

const ComplaintCard = ({ title, status, date, reply }: { title: string; status: string; date: string; reply?: string }) => {
  const statusColor = status === "Resolved" ? "bg-success/10 text-success" : status === "In-Review" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground";
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge className={statusColor}>{status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{date}</p>
      {reply && (
        <div className="bg-secondary/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Staff Reply:</p>
          <p className="text-sm text-muted-foreground">{reply}</p>
        </div>
      )}
    </Card>
  );
};

export default Complaints;
