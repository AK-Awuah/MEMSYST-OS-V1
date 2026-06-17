import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketplaceDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Marketplace & Economic Empowerment</h1>
          <p className="text-gray-400 mt-1">Member business directory, opportunities, and B2B networking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-[#011B2B] rounded-md font-medium text-sm">Post Opportunity</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Member Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">842</div>
            <p className="text-xs text-green-400 mt-1">Across 12 sectors</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">B2B Connections Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,204</div>
            <p className="text-xs text-[var(--primary)] mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Contract Value (Est)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₵15.2M</div>
            <p className="text-xs text-green-400 mt-1">Generated within network</p>
          </CardContent>
        </Card>
      </div>

      {/* Directory Mockup */}
      <Card className="bg-[#011B2B] border-[#01314E]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Featured Member Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Corporate Legal Services Retainer", company: "Osei & Co Chambers", sector: "Legal", type: "Service Offering" },
              { title: "Supply of 500 Laptops for Secretariat", company: "TechHub Ghana", sector: "IT", type: "Procurement Request" },
              { title: "Annual Audit Services Required", company: "National Secretariat", sector: "Finance", type: "Tender" },
              { title: "Discounted Health Insurance for Members", company: "Star Assurance", sector: "Healthcare", type: "Member Benefit" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#01314E]/30 border border-[#01314E]/50 hover:border-[var(--primary)]/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-[var(--primary)]">{item.sector}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-300">{item.type}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.company}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
