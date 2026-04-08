import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Briefcase, Brain, DollarSign, Building2,
  Users, Award, ExternalLink, ChevronRight, Star, BarChart3,
  Globe, ArrowLeft, Shield, Code, PieChart, Megaphone,
  UserCheck, Leaf, Lock, Database,
} from "lucide-react";

/* ─── i18n ─────────────────────────────────────────── */
const t = {
  ar: {
    dir: "rtl" as const,
    langBtn: "English",
    header: "المرصد الوطني للتوظيف والمهن",
    subheader: "بيانات حية عن سوق العمل السعودي — مدعوم بالذكاء الاصطناعي",
    kpiTitle: "الإحصاءات الرئيسية",
    skillsTitle: "المهارات الأكثر طلباً",
    sectorsTitle: "أكثر القطاعات توظيفاً",
    hadafTitle: "فرص مدعومة من هدف",
    certsTitle: "الشهادات الاحترافية المطلوبة",
    ctaTitle: "احصل على تقريرك المخصص",
    ctaDesc: "سجّل لتحصل على تقرير مخصص لمهاراتك وميولك",
    ctaBtn: "احصل على تقريرك المجاني",
    hadafNote: "جميع البرامج موجودة على hadaf.gov.sa — فرصتي تعرضها وترشدك",
    applyNow: "تقدّم الآن",
    jobs: "وظيفة",
    demand: {
      high: "طلب عالٍ",
      vhigh: "طلب عالٍ جداً",
      medium: "طلب متوسط",
    },
    kpis: [
      { label: "معدل التوظيف", value: "78.3%", change: "+2.1%", up: true },
      { label: "الوظائف المتاحة الآن", value: "12,847", change: "+348", up: true },
      { label: "المهارة الأكثر طلباً", value: "الذكاء الاصطناعي", change: "", up: true },
      { label: "متوسط الراتب (مبتدئ)", value: "8,500 ر.س", change: "+5%", up: true },
      { label: "الشركات المشاركة", value: "+1,240", change: "+12%", up: true },
      { label: "نسبة السعودة", value: "82%", change: "+1.3%", up: true },
    ],
    skills: [
      { name: "الذكاء الاصطناعي", pct: 94 },
      { name: "تطوير البرمجيات", pct: 89 },
      { name: "تحليل البيانات", pct: 85 },
      { name: "إدارة المشاريع", pct: 78 },
      { name: "التسويق الرقمي", pct: 72 },
      { name: "الأمن السيبراني", pct: 68 },
      { name: "إدارة الموارد البشرية", pct: 61 },
      { name: "الاستدامة والبيئة", pct: 54 },
    ],
    sectors: [
      { name: "التقنية", count: "3,240" },
      { name: "الصحة", count: "2,180" },
      { name: "التعليم", count: "1,920" },
      { name: "المال والأعمال", count: "1,640" },
      { name: "الهندسة", count: "1,420" },
      { name: "التجزئة والضيافة", count: "980" },
    ],
    hadafPrograms: [
      { name: "تمهير", org: "هدف + القطاع الخاص", support: "حتى 2,000 ريال/شهر", duration: "12 شهراً" },
      { name: "نطاقات", org: "وزارة الموارد البشرية", support: "—", duration: "مستمر" },
      { name: "برنامج التدريب الصيفي", org: "هدف", support: "مدفوع", duration: "3 أشهر" },
      { name: "برنامج كفاءة", org: "هدف", support: "دعم مالي", duration: "6 أشهر" },
      { name: "دعم التوظيف الذاتي", org: "هدف", support: "حتى 4,000 ريال/شهر", duration: "12 شهراً" },
      { name: "شريك المستقبل", org: "القطاع الخاص", support: "—", duration: "مستمر" },
    ],
    certs: [
      { code: "PMP", field: "إدارة المشاريع", demand: "high" },
      { code: "CISSP", field: "الأمن السيبراني", demand: "vhigh" },
      { code: "AWS Cloud", field: "الحوسبة السحابية", demand: "vhigh" },
      { code: "CPA", field: "المحاسبة", demand: "high" },
      { code: "SHRM", field: "الموارد البشرية", demand: "medium" },
      { code: "Google Analytics", field: "التسويق", demand: "medium" },
      { code: "CCNA", field: "الشبكات", demand: "high" },
      { code: "Data Science", field: "البيانات", demand: "vhigh" },
    ],
    tableHeaders: ["اسم البرنامج", "الجهة", "الدعم", "المدة", ""],
  },
  en: {
    dir: "ltr" as const,
    langBtn: "عربي",
    header: "National Employment & Careers Observatory",
    subheader: "Live data on the Saudi labor market — powered by AI",
    kpiTitle: "Key Statistics",
    skillsTitle: "Most In-Demand Skills",
    sectorsTitle: "Top Hiring Sectors",
    hadafTitle: "HADAF-Supported Programs",
    certsTitle: "Sought-After Professional Certifications",
    ctaTitle: "Get Your Personalized Report",
    ctaDesc: "Sign up to receive a report tailored to your skills and interests",
    ctaBtn: "Get Your Free Report",
    hadafNote: "All programs are listed on hadaf.gov.sa — Fursati displays and guides you to them",
    applyNow: "Apply Now",
    jobs: "jobs",
    demand: {
      high: "High Demand",
      vhigh: "Very High Demand",
      medium: "Medium Demand",
    },
    kpis: [
      { label: "Employment Rate", value: "78.3%", change: "+2.1%", up: true },
      { label: "Available Jobs Now", value: "12,847", change: "+348", up: true },
      { label: "Most In-Demand Skill", value: "Artificial Intelligence", change: "", up: true },
      { label: "Avg. Entry Salary", value: "8,500 SAR", change: "+5%", up: true },
      { label: "Participating Companies", value: "1,240+", change: "+12%", up: true },
      { label: "Saudization Rate", value: "82%", change: "+1.3%", up: true },
    ],
    skills: [
      { name: "Artificial Intelligence", pct: 94 },
      { name: "Software Development", pct: 89 },
      { name: "Data Analysis", pct: 85 },
      { name: "Project Management", pct: 78 },
      { name: "Digital Marketing", pct: 72 },
      { name: "Cybersecurity", pct: 68 },
      { name: "HR Management", pct: 61 },
      { name: "Sustainability & Environment", pct: 54 },
    ],
    sectors: [
      { name: "Technology", count: "3,240" },
      { name: "Healthcare", count: "2,180" },
      { name: "Education", count: "1,920" },
      { name: "Finance & Business", count: "1,640" },
      { name: "Engineering", count: "1,420" },
      { name: "Retail & Hospitality", count: "980" },
    ],
    hadafPrograms: [
      { name: "Tamheer", org: "HADAF + Private Sector", support: "Up to 2,000 SAR/month", duration: "12 months" },
      { name: "Nitaqat", org: "Ministry of HR", support: "—", duration: "Ongoing" },
      { name: "Summer Training Program", org: "HADAF", support: "Paid", duration: "3 months" },
      { name: "Kafaa Program", org: "HADAF", support: "Financial Support", duration: "6 months" },
      { name: "Self-Employment Support", org: "HADAF", support: "Up to 4,000 SAR/month", duration: "12 months" },
      { name: "Future Partner", org: "Private Sector", support: "—", duration: "Ongoing" },
    ],
    certs: [
      { code: "PMP", field: "Project Management", demand: "high" },
      { code: "CISSP", field: "Cybersecurity", demand: "vhigh" },
      { code: "AWS Cloud", field: "Cloud Computing", demand: "vhigh" },
      { code: "CPA", field: "Accounting", demand: "high" },
      { code: "SHRM", field: "Human Resources", demand: "medium" },
      { code: "Google Analytics", field: "Marketing", demand: "medium" },
      { code: "CCNA", field: "Networking", demand: "high" },
      { code: "Data Science", field: "Data Science", demand: "vhigh" },
    ],
    tableHeaders: ["Program Name", "Organization", "Support", "Duration", ""],
  },
};

/* ─── Animations ────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const demandColors: Record<string, string> = {
  high: "bg-amber-100 text-amber-800 border-amber-200",
  vhigh: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
};

const sectorIcons = [Code, Users, Award, DollarSign, Building2, Briefcase];

/* ─── Component ─────────────────────────────────────── */
export default function ObservatoryPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const T = t[lang];

  return (
    <div dir={T.dir} className="min-h-screen bg-[#F8F9FB]" lang={lang}>
      {/* ── Navbar ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#1A2533]/97 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#C9A44B] flex items-center justify-center">
                <span className="text-[#1A2533] font-black text-sm">ف</span>
              </div>
              <span className="text-white font-bold text-lg">فرصتي</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent text-xs px-3"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            >
              <Globe className="w-3.5 h-3.5 ml-1.5" />
              {T.langBtn}
            </Button>
            <Link href="/auth">
              <Button className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold text-sm h-8 px-4">
                {lang === "ar" ? "ابدأ الآن" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Header ────────────────────────── */}
      <section className="relative bg-[#1A2533] overflow-hidden py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-[#C9A44B] blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[#C9A44B] blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A44B]/15 border border-[#C9A44B]/30 mb-5">
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A44B]" />
              <span className="text-[#C9A44B] text-sm font-medium">
                {lang === "ar" ? "بيانات محدّثة لحظياً" : "Real-time updated data"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
              {T.header}
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
              {T.subheader}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ── Section 1: KPIs ────────────────────── */}
        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-7">
            <h2 className="text-xl font-bold text-[#1A2533]">{T.kpiTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {T.kpis.map((kpi, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="bg-white border border-gray-100 hover:shadow-md hover:border-[#C9A44B]/40 transition-all duration-300">
                  <CardContent className="p-5">
                    <p className="text-xs text-gray-500 mb-2 font-medium">{kpi.label}</p>
                    <p className="text-2xl md:text-3xl font-black text-[#C9A44B] mb-1 leading-none">{kpi.value}</p>
                    {kpi.change && (
                      <div className={`inline-flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                        {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {kpi.change}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Skills Progress Bars ─────── */}
        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-7">
            <h2 className="text-xl font-bold text-[#1A2533]">{T.skillsTitle}</h2>
          </motion.div>
          <Card className="bg-white border border-gray-100">
            <CardContent className="p-6 space-y-5">
              {T.skills.map((skill, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-[#1A2533]">{skill.name}</span>
                    <span className="text-sm font-bold text-[#C9A44B]">{skill.pct}%</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#C9A44B] to-[#e8c06a]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* ── Section 3: Sectors ──────────────────── */}
        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-7">
            <h2 className="text-xl font-bold text-[#1A2533]">{T.sectorsTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {T.sectors.map((sec, i) => {
              const Icon = sectorIcons[i];
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Card className="bg-white border border-gray-100 hover:shadow-md hover:border-[#C9A44B]/40 transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#1A2533]/5 group-hover:bg-[#C9A44B]/10 flex items-center justify-center transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#1A2533]/60 group-hover:text-[#C9A44B] transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A2533] text-sm">{sec.name}</p>
                        <p className="text-[#C9A44B] font-black text-lg leading-tight">{sec.count}</p>
                        <p className="text-xs text-gray-400">{T.jobs}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Section 4: HADAF Programs ───────────── */}
        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-7">
            <h2 className="text-xl font-bold text-[#1A2533]">{T.hadafTitle}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A2533]/5 border-b border-gray-100">
                    {T.tableHeaders.map((h, i) => (
                      <th key={i} className={`px-5 py-3.5 text-[#1A2533] font-bold text-right text-xs ${i === 4 ? "w-28" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {T.hadafPrograms.map((prog, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-[#C9A44B]/4 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#1A2533]">{prog.name}</td>
                      <td className="px-5 py-3.5 text-gray-600">{prog.org}</td>
                      <td className="px-5 py-3.5 text-[#C9A44B] font-semibold">{prog.support}</td>
                      <td className="px-5 py-3.5 text-gray-500">{prog.duration}</td>
                      <td className="px-5 py-3.5">
                        <a
                          href="https://hadaf.gov.sa"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#1A2533] bg-[#C9A44B]/15 hover:bg-[#C9A44B]/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          {T.applyNow}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-3 flex items-start gap-2 px-1">
              <Star className="w-4 h-4 text-[#C9A44B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-500 italic">{T.hadafNote}</p>
            </div>
          </motion.div>
        </section>

        {/* ── Section 5: Certifications ───────────── */}
        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-7">
            <h2 className="text-xl font-bold text-[#1A2533]">{T.certsTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {T.certs.map((cert, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="bg-white border border-gray-100 hover:shadow-md hover:border-[#C9A44B]/50 transition-all duration-300 group h-full">
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A2533] flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-[#C9A44B]" />
                    </div>
                    <div>
                      <p className="font-black text-[#1A2533] text-base leading-tight">{cert.code}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cert.field}</p>
                    </div>
                    <span className={`self-start text-[10px] font-bold px-2 py-1 rounded-full border ${demandColors[cert.demand]}`}>
                      {T.demand[cert.demand as keyof typeof T.demand]}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Section 6: CTA (registered users) ───── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="relative overflow-hidden rounded-2xl bg-[#1A2533] p-8 md:p-10 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#C9A44B] blur-[100px]" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A44B]/15 border border-[#C9A44B]/30 flex items-center justify-center mx-auto mb-5">
                <BarChart3 className="w-7 h-7 text-[#C9A44B]" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-3">{T.ctaTitle}</h2>
              <p className="text-white/60 mb-7 max-w-md mx-auto">{T.ctaDesc}</p>
              <Link href="/auth">
                <Button size="lg" className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-black px-8 h-12 text-base">
                  {T.ctaBtn}
                  <ChevronRight className="w-5 h-5 mr-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

      </div>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="bg-[#1A2533] border-t border-white/10 py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C9A44B] flex items-center justify-center">
              <span className="text-[#1A2533] font-black text-xs">ف</span>
            </div>
            <span className="text-white/70 text-sm font-medium">فرصتي</span>
          </div>
          <p className="text-white/40 text-xs">
            {lang === "ar" ? "منتج من يسير لإدارة المشاريع © ٢٠٢٦" : "A product by Yaseer © 2026"}
          </p>
        </div>
      </footer>
    </div>
  );
}
