import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage brokers, reviews, and platform settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Brokers", value: "1,245", icon: TrendingUp, trend: "+12 this week" },
          { title: "Active Users", value: "84,392", icon: Users, trend: "+4% this month" },
          { title: "Pending Reviews", value: "128", icon: MessageSquare, trend: "Requires action" },
          { title: "Open Complaints", value: "34", icon: AlertTriangle, trend: "5 high priority" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New review posted", target: "IC Markets", time: "2 minutes ago", status: "Pending" },
                { action: "Complaint updated", target: "ScamBroker FX", time: "1 hour ago", status: "Resolved" },
                { action: "Broker verified", target: "Exness", time: "3 hours ago", status: "Approved" },
                { action: "User reported", target: "User ID #49281", time: "5 hours ago", status: "Reviewing" },
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                  <div>
                    <div className="font-medium text-sm">{activity.action} - <span className="font-bold">{activity.target}</span></div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded bg-muted">
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-sm rounded hover:bg-muted transition-colors">Add New Broker</button>
            <button className="w-full text-left px-4 py-2 text-sm rounded hover:bg-muted transition-colors">Review Pending Comments</button>
            <button className="w-full text-left px-4 py-2 text-sm rounded hover:bg-muted transition-colors">Manage Regulatory Data</button>
            <button className="w-full text-left px-4 py-2 text-sm rounded hover:bg-muted transition-colors">Platform Settings</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
