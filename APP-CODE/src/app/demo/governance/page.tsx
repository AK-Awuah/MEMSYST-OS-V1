import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GovernanceDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Governance & Administration</h1>
          <p className="text-gray-400 mt-1">Approvals, compliance tracking, and administrative workflows.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-[#011B2B] rounded-md font-medium text-sm">New Resolution</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">98%</div>
            <p className="text-xs text-green-400 mt-1">All branch audits submitted</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Committee Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">12</div>
            <p className="text-xs text-gray-500 mt-1">Requires digital signature</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Board Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">15 / 15</div>
            <p className="text-xs text-green-400 mt-1">Quorum met for next meeting</p>
          </CardContent>
        </Card>
      </div>

      {/* Governance Workflows */}
      <Card className="bg-[#011B2B] border-[#01314E]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Approval Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { doc: "Q3 Expenditure Report", sender: "Finance Committee", status: "Awaiting Your Signature", urgency: "High" },
              { doc: "New Member Vetting Batch", sender: "Membership Committee", status: "In Review", urgency: "Medium" },
              { doc: "Annual General Meeting Minutes", sender: "Secretariat", status: "Approved", urgency: "Low" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-[#01314E]/30 border border-[#01314E]/50">
                <div>
                  <p className="text-sm font-medium text-white">{item.doc}</p>
                  <p className="text-xs text-gray-500 mt-0.5">From: {item.sender}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded ${item.urgency === 'High' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                    {item.urgency} Priority
                  </span>
                  <button className="px-3 py-1.5 bg-[#01314E] text-white text-xs rounded hover:bg-[var(--primary)] hover:text-[#011B2B] transition-colors">
                    {item.status === 'Approved' ? 'View' : 'Review & Sign'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
