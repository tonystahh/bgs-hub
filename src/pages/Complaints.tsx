import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
const Complaints = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);
  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const {
        data,
        error
      } = await supabase.from("complaints").select("*").eq("user_id", user?.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive"
      });
    } finally {
      setLoadingComplaints(false);
    }
  };
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    try {
      setSubmitting(true);
      const {
        error
      } = await supabase.from("complaints").insert({
        user_id: user?.id,
        title: complaintTitle,
        description: complaintDescription,
        status: "pending"
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Complaint submitted successfully"
      });
      setComplaintTitle("");
      setComplaintDescription("");
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background" />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
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
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div>
                
                <Input placeholder="Brief description of your complaint" value={complaintTitle} onChange={e => setComplaintTitle(e.target.value)} disabled={submitting} />
              </div>
              <div>
                
                <Textarea placeholder="Provide detailed information about your complaint" rows={5} value={complaintDescription} onChange={e => setComplaintDescription(e.target.value)} disabled={submitting} />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </Card>

          {/* Recent Complaints */}
          <h2 className="text-2xl font-semibold mb-4">Your Recent Complaints</h2>
          <div className="space-y-4">
            {loadingComplaints ? <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </> : complaints.length === 0 ? <Card className="p-8 text-center">
                <p className="text-muted-foreground">No complaints yet</p>
              </Card> : complaints.map(complaint => <ComplaintCard key={complaint.id} title={complaint.title} status={complaint.status} date={formatDistanceToNow(new Date(complaint.created_at), {
            addSuffix: true
          })} reply={complaint.reply} />)}
          </div>
        </div>
      </header>
    </div>;
};
const ComplaintCard = ({
  title,
  status,
  date,
  reply
}: {
  title: string;
  status: string;
  date: string;
  reply?: string;
}) => {
  const statusColor = status === "resolved" ? "bg-success/10 text-success" : status === "in-review" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground";
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  return <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge className={statusColor}>{displayStatus}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{date}</p>
      {reply && <div className="bg-secondary/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-1">Staff Reply:</p>
          <p className="text-sm text-muted-foreground">{reply}</p>
        </div>}
    </Card>;
};
export default Complaints;