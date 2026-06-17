import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrainingDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Training & Capacity Development</h1>
          <p className="text-gray-400 mt-1">Certifications, CPD tracking, and learning management.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--primary)] text-[#011B2B] rounded-md font-medium text-sm">Upload Course</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Active Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">3,190</div>
            <p className="text-xs text-green-400 mt-1">22% of total membership</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">CPD Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">76%</div>
            <p className="text-xs text-yellow-400 mt-1">Deadline approaching in 14 days</p>
          </CardContent>
        </Card>

        <Card className="bg-[#011B2B] border-[#01314E]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Certificates Issued (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,450</div>
            <p className="text-xs text-[var(--primary)] mt-1">Digitally verifiable</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Mockup */}
      <Card className="bg-[#011B2B] border-[#01314E]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Ongoing Professional Development Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Advanced Corporate Governance", enrolled: 450, completion: 65, credits: "15 CPD" },
              { title: "Digital Transformation Leadership", enrolled: 890, completion: 42, credits: "20 CPD" },
              { title: "Financial Auditing Standards 2026", enrolled: 320, completion: 89, credits: "10 CPD" },
            ].map((course, i) => (
              <div key={i} className="p-5 rounded-lg bg-[#01314E]/30 border border-[#01314E]/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs px-2 py-1 rounded bg-[var(--primary)]/20 text-[var(--primary)] font-medium">{course.credits}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 leading-tight">{course.title}</h4>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{course.enrolled} Enrolled</span>
                    <span>{course.completion}% Complete</span>
                  </div>
                  <div className="w-full bg-[#011B2B] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--primary)] h-full" style={{ width: `${course.completion}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
