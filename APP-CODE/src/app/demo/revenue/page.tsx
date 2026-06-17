import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevenueDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Revenue & Finance</h1>
          <p className="text-gray-400 mt-1">Fee collection, dues management, and financial tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-[#011B2B] rounded-md font-medium text-sm">Generate Invoices</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E] md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Collected (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">₵2,450,000</div>
            <p className="text-sm text-green-400 mt-2">+18% compared to same period last year</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Outstanding Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">₵185,500</div>
            <p className="text-xs text-gray-500 mt-1">Across 342 members</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Payment Gateways</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">100%</div>
            <p className="text-xs text-green-400 mt-1">Mobile Money & Card Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E] min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Revenue by Stream</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-56">
            <div className="w-full h-full border border-dashed border-[#01314E] rounded-lg flex flex-col items-center justify-center bg-[#011B2B]/50 gap-2">
              <span className="text-gray-500">[Interactive Donut Chart]</span>
              <div className="flex gap-4 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div> Annual Dues (70%)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Certifications (20%)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Events (10%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { ref: "TXN-8821", amount: "₵500", type: "Annual Dues", method: "Mobile Money", status: "Success" },
                { ref: "TXN-8822", amount: "₵1,200", type: "Certification Fee", method: "Visa", status: "Success" },
                { ref: "TXN-8823", amount: "₵500", type: "Annual Dues", method: "Mobile Money", status: "Failed" },
                { ref: "TXN-8824", amount: "₵250", type: "Event Registration", method: "Mastercard", status: "Success" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#01314E]/30 border border-[#01314E]/50">
                  <div>
                    <p className="text-sm font-medium text-white">{item.ref} - {item.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">via {item.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{item.amount}</p>
                    <p className={`text-xs ${item.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
