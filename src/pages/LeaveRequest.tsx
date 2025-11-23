import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const LeaveRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveDate || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check if date is not in the past
    const selectedDate = new Date(leaveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast({
        title: "Error",
        description: "Leave date cannot be in the past",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from("leave_requests").insert({
        user_id: user?.id,
        leave_date: leaveDate,
        reason: reason.trim(),
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });

      // Reset form
      setLeaveDate("");
      setReason("");
      
      // Refresh the list
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Leave Requests</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Request leave and get instant approval notifications
          </p>

          {/* Submit Leave Request Form */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="leave-date">Leave Date</Label>
                <input 
                  id="leave-date"
                  type="date" 
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  disabled={submitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <Label htmlFor="leave-reason">Reason</Label>
                <Textarea 
                  id="leave-reason"
                  placeholder="Explain why you need leave" 
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Leave Request"}
              </Button>
            </form>
          </Card>

          {/* Leave History */}
          <h2 className="text-2xl font-semibold mb-4">Leave History</h2>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : leaveRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No leave requests yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <LeaveCard
                  key={request.id}
                  date={format(new Date(request.leave_date), "MMMM dd, yyyy")}
                  reason={request.reason}
                  status={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  note={request.admin_note}
                />
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

const LeaveCard = ({ date, reason, status, note }: { date: string; reason: string; status: string; note?: string | null }) => {
  const statusColor = status === "Approved" ? "bg-success/10 text-success" : status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{date}</h3>
          <p className="text-sm text-muted-foreground mt-1">{reason}</p>
        </div>
        <Badge className={statusColor}>{status}</Badge>
      </div>
      {note && (
        <div className="bg-secondary/50 p-4 rounded-lg mt-4">
          <p className="text-sm font-medium mb-1">Staff Note:</p>
          <p className="text-sm text-muted-foreground">{note}</p>
        </div>
      )}
    </Card>
  );
};

export default LeaveRequest;
