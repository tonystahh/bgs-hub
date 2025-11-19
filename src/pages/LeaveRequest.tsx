import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LeaveRequest = () => {
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
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Leave Date(s)</label>
                <input 
                  type="date" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reason</label>
                <Textarea placeholder="Explain why you need leave" rows={4} />
              </div>
              <Button className="w-full">Submit Leave Request</Button>
            </div>
          </Card>

          {/* Leave History */}
          <h2 className="text-2xl font-semibold mb-4">Leave History</h2>
          <div className="space-y-4">
            <LeaveCard
              date="March 25, 2024"
              reason="Medical appointment"
              status="Approved"
              note="Approved. Please submit medical certificate."
            />
            <LeaveCard
              date="March 18, 2024"
              reason="Family function"
              status="Pending"
            />
            <LeaveCard
              date="March 10, 2024"
              reason="Personal work"
              status="Rejected"
              note="Maximum leave quota exceeded for this month."
            />
          </div>
        </div>
      </header>
    </div>
  );
};

const LeaveCard = ({ date, reason, status, note }: { date: string; reason: string; status: string; note?: string }) => {
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
