"use client";

import { useState } from "react";
import { resourcesContent } from "@/data/content";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import SubscribeModal from "@/components/sections/SubscribeModal";
import { categoryIcons } from "@/data/icons";
import { BookOpen, ClipboardList, Lightbulb, ArrowRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  guides: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "case-studies": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  insights: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const categoryBgColors: Record<string, string> = {
  guides: "from-blue-400/5 to-transparent",
  "case-studies": "from-emerald-400/5 to-transparent",
  insights: "from-purple-400/5 to-transparent",
};

export default function ResourcesPage() {
  const { hero, categories, articles } = resourcesContent;
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState("");

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featuredArticles = articles.filter((a) => a.featured);

  function openSubscribe(articleTitle: string) {
    setSelectedArticle(articleTitle);
    setModalOpen(true);
  }

  function getCategoryIcon(catId: string) {
    const Icon = categoryIcons[catId];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">

      {/* ── HERO ── */}
      <section className="pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/5 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm text-[var(--primary)] animate-fade-in-scale">
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight animate-fade-in-up stagger-1">
            <span className="text-[var(--primary)]">Insights</span>{" "}
            <span className="text-white">for Organizational Leaders</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up stagger-2">{hero.description}</p>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="py-16 bg-[var(--secondary)]/20 border-b border-[var(--border)]">
        <div className="container px-4 md:px-6">
          <h2 className="text-xl font-bold text-white mb-8">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="p-6 rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-b from-[var(--primary)]/5 to-transparent glass-effect card-hover card-glow group cursor-pointer"
                onClick={() => openSubscribe(article.title)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[article.category]}`}>
                    {article.categoryLabel}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="font-bold text-white leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{article.summary}</p>
                <div className="mt-5 pt-3 border-t border-[var(--border)]/50 text-xs text-[var(--primary)] font-medium flex items-center gap-1">
                  Read Article <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER + ALL ARTICLES ── */}
      <section className="py-20">
        <div className="container px-4 md:px-6">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-[var(--primary)] text-[#011B2B]"
                  : "border border-[var(--border)] text-gray-400 hover:border-[var(--primary)]/50 hover:text-white"
              }`}
            >
              All Resources
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-[var(--primary)] text-[#011B2B]"
                    : "border border-[var(--border)] text-gray-400 hover:border-[var(--primary)]/50 hover:text-white"
                }`}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--secondary)]/20 to-transparent card-hover card-glow group cursor-pointer"
                onClick={() => openSubscribe(article.title)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[article.category]}`}>
                    {article.categoryLabel}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--primary)]/20 transition-colors">
                  {(() => { const Icon = categoryIcons[article.category]; return Icon ? <Icon className="w-4 h-4 text-[var(--primary)]" /> : null; })()}
                </div>
                <h3 className="font-bold text-white leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors text-sm">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">{article.summary}</p>
                <div className="mt-5 pt-3 border-t border-[var(--border)]/50 text-xs text-[var(--primary)] font-medium flex items-center gap-1">
                  Read Article <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              No resources found in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="py-16 border-t border-[var(--border)] bg-gradient-to-b from-[var(--secondary)]/20 to-[var(--background)]">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Stay Ahead of the Curve</h2>
          <p className="text-gray-400">Get the latest insights on digital transformation for membership organizations, delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              className="form-input flex-1"
              placeholder="your@organization.org"
            />
            <button className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[#011B2B] font-semibold text-sm hover:bg-[var(--primary)]/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <ConsultationCTA
        title="Ready to Put These Insights Into Action?"
        description="Schedule a consultation to develop a digital transformation strategy tailored to your organization's specific needs and goals."
      />

      <SubscribeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        articleTitle={selectedArticle}
      />
    </main>
  );
}
