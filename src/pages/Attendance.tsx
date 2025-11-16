import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Attendance = () => {
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
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Attendance Summary</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            View your attendance summary and track your presence
          </p>

          {/* Attendance Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-success mb-2">42</div>
              <p className="text-sm text-muted-foreground">Days Present</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-destructive mb-2">3</div>
              <p className="text-sm text-muted-foreground">Days Absent</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-warning mb-2">5</div>
              <p className="text-sm text-muted-foreground">Leaves Taken</p>
            </Card>
          </div>

          {/* Attendance Percentage */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Overall Attendance</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                  <div className="bg-success h-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <span className="text-2xl font-bold text-success">84%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              You've maintained good attendance this month. Keep it up!
            </p>
          </Card>

          {/* Monthly Breakdown */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
            <div className="space-y-3">
              <MonthRow month="March 2024" present={18} absent={1} leaves={1} />
              <MonthRow month="February 2024" present={15} absent={2} leaves={3} />
              <MonthRow month="January 2024" present={9} absent={0} leaves={1} />
            </div>
          </Card>
        </div>
      </header>
    </div>
  );
};

const MonthRow = ({ month, present, absent, leaves }: { month: string; present: number; absent: number; leaves: number }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <span className="font-medium">{month}</span>
    <div className="flex gap-6 text-sm">
      <span className="text-success">Present: {present}</span>
      <span className="text-destructive">Absent: {absent}</span>
      <span className="text-warning">Leaves: {leaves}</span>
    </div>
  </div>
);

export default Attendance;
