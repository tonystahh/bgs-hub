import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Megaphone, 
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { toast } = useToast();
  const { user, userRole, loading, signOut } = useAuth();
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
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive",
      });
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          title: complaintTitle,
          description: complaintDescription,
        });

      if (error) throw error;

      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully. You'll receive a response soon.",
      });
      setComplaintTitle("");
      setComplaintDescription("");
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-xl">Brototype Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {userRole === "admin" ? "Admin" : "Student"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Active Complaints"
            value="2"
            trend="1 resolved this week"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Pending Leaves"
            value="1"
            trend="1 approved"
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Attendance"
            value="92%"
            trend="23/25 days"
          />
          <StatCard
            icon={<Megaphone className="w-5 h-5" />}
            label="New Announcements"
            value="3"
            trend="Last 7 days"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Complaint Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Submit a Complaint
                </CardTitle>
                <CardDescription>
                  Raise an issue and our staff will respond promptly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief summary of your complaint"
                      value={complaintTitle}
                      onChange={(e) => setComplaintTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your issue..."
                      rows={4}
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={submitting}>
                    <Send className="w-4 h-4" />
                    {submitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Complaints */}
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Complaints</CardTitle>
                <CardDescription>Track the status of your submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingComplaints ? (
                  <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : complaints.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No complaints yet. Submit one above.
                  </p>
                ) : (
                  complaints.map((complaint) => (
                    <ComplaintItem
                      key={complaint.id}
                      title={complaint.title}
                      status={complaint.status}
                      date={formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                      reply={complaint.reply}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leave Request */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Quick Leave
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="leave-date">Date</Label>
                  <Input id="leave-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="leave-reason">Reason</Label>
                  <Textarea id="leave-reason" placeholder="Brief reason..." rows={3} />
                </div>
                <Button className="w-full">Request Leave</Button>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  Latest Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnnouncementItem
                  title="Holiday on Friday"
                  date="Today"
                />
                <AnnouncementItem
                  title="Workshop: React Advanced Patterns"
                  date="2 days ago"
                />
                <AnnouncementItem
                  title="Monthly assessment schedule released"
                  date="3 days ago"
                />
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AttendanceRow label="Present" value="23" color="success" />
                <AttendanceRow label="Absent" value="2" color="destructive" />
                <AttendanceRow label="Leaves" value="3" color="warning" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </CardContent>
  </Card>
);

const ComplaintItem = ({ 
  title, 
  status, 
  date,
  reply
}: { 
  title: string; 
  status: 'pending' | 'in-review' | 'resolved';
  date: string;
  reply?: string;
}) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
    'in-review': { icon: MessageSquare, color: 'text-accent', bg: 'bg-accent/10', label: 'In Review' },
    resolved: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Resolved' }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm">{title}</p>
        <Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{date}</p>
      {reply && (
        <div className="mt-2 p-2 bg-secondary rounded text-xs">
          <span className="font-medium">Staff Reply:</span> {reply}
        </div>
      )}
    </div>
  );
};

const AnnouncementItem = ({ title, date }: { title: string; date: string }) => (
  <div className="border rounded-lg p-3">
    <p className="font-medium text-sm mb-1">{title}</p>
    <p className="text-xs text-muted-foreground">{date}</p>
  </div>
);

const AttendanceRow = ({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: string; 
  color: 'success' | 'destructive' | 'warning';
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <span className={`font-semibold text-${color}`}>{value}</span>
  </div>
);

export default Dashboard;
