import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Executive Overview</h1>
          <p className="text-gray-400 mt-1">Real-time performance metrics and organizational health.</p>
        </div>
        <div className="text-sm text-gray-400">Last updated: Just now</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">14,289</div>
            <p className="text-xs text-green-400 mt-1">+12% from last year</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Revenue Collection (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₵2.4M</div>
            <p className="text-xs text-green-400 mt-1">94% compliance rate</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">24</div>
            <p className="text-xs text-[var(--primary)] mt-1">Requires Board attention</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Upcoming Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">45 Days</div>
            <p className="text-xs text-gray-400 mt-1">Voter roll is 80% verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Area Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-[#011B2B] border-[#01314E] min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Membership Growth vs Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-72">
            <div className="w-full h-full border border-dashed border-[#01314E] rounded-lg flex items-center justify-center bg-[#011B2B]/50">
              <span className="text-gray-500">[Interactive Line Chart Visualization]</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Board Resolutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: "Annual General Meeting Budget", status: "Approved", date: "Today" },
                { title: "New Member Vetting Criteria", status: "Pending", date: "Yesterday" },
                { title: "Regional Branch Expansion", status: "Approved", date: "Oct 12" },
                { title: "Q3 Financial Audit Report", status: "Review", date: "Oct 10" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'Approved' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                    item.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                    'bg-blue-900/30 text-blue-400 border border-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
