import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembershipDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Membership Management</h1>
          <p className="text-gray-400 mt-1">Lifecycle tracking, onboarding, and engagement analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-[#011B2B] rounded-md font-medium text-sm">Add Member</button>
          <button className="px-4 py-2 bg-[#01314E] text-white border border-[#01314E] rounded-md font-medium text-sm hover:bg-[#011B2B]">Export Roster</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">New Onboards (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">412</div>
            <p className="text-xs text-[var(--primary)] mt-1">15 pending approval</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Membership Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">89%</div>
            <div className="w-full bg-[#01314E] h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[var(--primary)] h-full w-[89%]"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Member Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">7.8 / 10</div>
            <p className="text-xs text-green-400 mt-1">High participation in recent AGM</p>
          </CardContent>
        </Card>
      </div>

      {/* Roster Table Mockup */}
      <Card className="bg-[#011B2B] border-[#01314E]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Member Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#01314E]/50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Member Name</th>
                  <th className="px-6 py-3">ID Number</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Last Active</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  { name: "Dr. Kwame Mensah", id: "GMA-2023-45", cat: "Professional", status: "Active", time: "2 hrs ago" },
                  { name: "Amma Osei", id: "GMA-2021-12", cat: "Associate", status: "Pending Renewal", time: "1 day ago" },
                  { name: "Kofi Addo", id: "GMA-2024-01", cat: "Student", status: "Active", time: "Just now" },
                  { name: "Nana Yaa Appiah", id: "GMA-2018-88", cat: "Fellow", status: "Active", time: "3 days ago" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#01314E]/50 hover:bg-[#01314E]/30">
                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-6 py-4">{row.id}</td>
                    <td className="px-6 py-4">{row.cat}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${row.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
