import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  BookOpen,
  Award,
  Briefcase,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  MapPin,
  Clock,
  Star,
  BriefcaseBusiness,
} from "lucide-react";

// ─── Fake Data ────────────────────────────────────────────────────────────────

const recentApplications = [
  { name: "أحمد الغامدي", position: "مطور برمجيات أول", match: 94, date: "2026-04-07", status: "قيد المراجعة" },
  { name: "سارة العتيبي", position: "محلل بيانات", match: 88, date: "2026-04-06", status: "مقبول" },
  { name: "محمد القحطاني", position: "مدير مشاريع", match: 76, date: "2026-04-05", status: "قيد المراجعة" },
  { name: "نورة الشهري", position: "مصممة UI/UX", match: 91, date: "2026-04-04", status: "مرفوض" },
  { name: "فيصل الدوسري", position: "مهندس شبكات", match: 82, date: "2026-04-03", status: "قيد المراجعة" },
];

const postedJobs = [
  { id: 1, title: "مطور برمجيات أول", dept: "تقنية المعلومات", location: "الرياض", type: "دوام كامل", salary: "12,000–18,000 ر.س", applications: 24, riasec: "RIA", deadline: "2026-05-01", status: "نشطة" },
  { id: 2, title: "محلل بيانات", dept: "التحليل والذكاء الاصطناعي", location: "جدة", type: "عن بعد", salary: "10,000–15,000 ر.س", applications: 18, riasec: "IAR", deadline: "2026-04-28", status: "نشطة" },
  { id: 3, title: "مدير مشاريع", dept: "إدارة المشاريع", location: "الرياض", type: "دوام كامل", salary: "15,000–22,000 ر.س", applications: 11, riasec: "ECS", deadline: "2026-05-10", status: "نشطة" },
  { id: 4, title: "مصمم UI/UX", dept: "تطوير المنتجات", location: "الدمام", type: "جزئي", salary: "8,000–12,000 ر.س", applications: 19, riasec: "AIS", deadline: "2026-04-25", status: "نشطة" },
  { id: 5, title: "مهندس شبكات", dept: "البنية التحتية", location: "الرياض", type: "دوام كامل", salary: "11,000–16,000 ر.س", applications: 15, riasec: "REC", deadline: "2026-05-15", status: "منتهية" },
];

const trainingPrograms = [
  { id: 1, name: "برنامج التدريب التعاوني لهندسة البرمجيات", type: "تعاوني", duration: "6 أشهر", seats: 10, hadaf: true, status: "مفتوح" },
  { id: 2, name: "برنامج تمهير لتحليل البيانات", type: "تمهير", duration: "3 أشهر", seats: 5, hadaf: true, status: "مفتوح" },
  { id: 3, name: "التدريب الصيفي لطلاب الإدارة", type: "صيفي", duration: "2 شهر", seats: 8, hadaf: false, status: "مغلق" },
];

const matchedCandidates = [
  { name: "ريم الأحمدي", riasec: "RIA", skills: ["React", "TypeScript", "Node.js"], match: 96, job: "مطور برمجيات أول" },
  { name: "عبدالرحمن الحارثي", riasec: "IAR", skills: ["Python", "SQL", "Tableau"], match: 91, job: "محلل بيانات" },
  { name: "منال الزهراني", riasec: "AIS", skills: ["Figma", "Adobe XD", "Prototyping"], match: 88, job: "مصمم UI/UX" },
  { name: "خالد المطيري", riasec: "ECS", skills: ["PMP", "Agile", "JIRA"], match: 85, job: "مدير مشاريع" },
  { name: "لمياء الرشيدي", riasec: "IAR", skills: ["Power BI", "Python", "Excel"], match: 83, job: "محلل بيانات" },
  { name: "يوسف العمري", riasec: "REC", skills: ["Cisco", "CompTIA", "Networking"], match: 79, job: "مهندس شبكات" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "قيد المراجعة": "bg-amber-100 text-amber-700 border-amber-200",
    مقبول: "bg-emerald-100 text-emerald-700 border-emerald-200",
    مرفوض: "bg-red-100 text-red-700 border-red-200",
    نشطة: "bg-emerald-100 text-emerald-700 border-emerald-200",
    منتهية: "bg-gray-100 text-gray-600 border-gray-200",
    مفتوح: "bg-emerald-100 text-emerald-700 border-emerald-200",
    مغلق: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function MatchScore({ value }: { value: number }) {
  const color = value >= 90 ? "text-emerald-600 bg-emerald-50" : value >= 75 ? "text-amber-600 bg-amber-50" : "text-red-500 bg-red-50";
  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${color}`}>
      <Star className="w-2.5 h-2.5" />
      {value}%
    </span>
  );
}

function KpiCard({ icon: Icon, title, value, sub }: { icon: any; title: string; value: number | string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-[#C9A44B]/30 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A2533] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#C9A44B]" />
            </div>
            <span className="text-3xl font-bold text-[#1A2533]">{value}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Tab 1: Overview ──────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Briefcase} title="الوظائف المنشورة" value={12} sub="وظيفة نشطة حالياً" />
        <KpiCard icon={Users} title="الطلبات الواردة" value={87} sub="خلال الشهر الحالي" />
        <KpiCard icon={CheckCircle2} title="قبلتهم" value={23} sub="تم قبولهم للمقابلة" />
        <KpiCard icon={Sparkles} title="المرشحون المناسبون" value={156} sub="بتطابق ≥ 70%" />
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold text-[#1A2533] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C9A44B]" />
            آخر الطلبات الواردة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                {["الاسم", "المنصب المطلوب", "درجة التطابق", "تاريخ التقديم", "الحالة"].map((h) => (
                  <TableHead key={h} className="text-right font-semibold text-[#1A2533] text-xs py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((r, i) => (
                <TableRow key={i} className="hover:bg-[#C9A44B]/5 transition-colors">
                  <TableCell className="font-medium text-[#1A2533] text-sm py-3">{r.name}</TableCell>
                  <TableCell className="text-sm text-gray-600 py-3">{r.position}</TableCell>
                  <TableCell className="py-3"><MatchScore value={r.match} /></TableCell>
                  <TableCell className="text-xs text-gray-400 py-3">{r.date}</TableCell>
                  <TableCell className="py-3"><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 2: Jobs Management ───────────────────────────────────────────────────

function JobsTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#1A2533]">الوظائف المنشورة</h3>
        <Button
          size="sm"
          className="bg-[#C9A44B] hover:bg-[#b8933e] text-white gap-1.5 text-sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4" />
          نشر وظيفة جديدة
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-[#C9A44B]/30 bg-[#C9A44B]/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-[#1A2533]">نموذج نشر وظيفة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "المسمى الوظيفي", placeholder: "مثال: مهندس برمجيات أول" },
                    { label: "القسم", placeholder: "مثال: تقنية المعلومات" },
                    { label: "الموقع", placeholder: "مثال: الرياض" },
                    { label: "الراتب المتوقع", placeholder: "مثال: 10,000–15,000 ر.س" },
                    { label: "الميول المطلوبة (RIASEC)", placeholder: "مثال: RIA" },
                    { label: "تاريخ انتهاء التقديم", placeholder: "YYYY-MM-DD", type: "date" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <Label className="text-xs text-[#1A2533] font-medium">{f.label}</Label>
                      <Input placeholder={f.placeholder} type={f.type ?? "text"} className="text-sm border-gray-200" />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">نوع العمل</Label>
                    <Select>
                      <SelectTrigger className="text-sm border-gray-200">
                        <SelectValue placeholder="اختر نوع العمل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">دوام كامل</SelectItem>
                        <SelectItem value="part">دوام جزئي</SelectItem>
                        <SelectItem value="remote">عن بعد</SelectItem>
                        <SelectItem value="hybrid">هجين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">الحالة</Label>
                    <Select>
                      <SelectTrigger className="text-sm border-gray-200">
                        <SelectValue placeholder="الحالة عند النشر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشر فوري</SelectItem>
                        <SelectItem value="draft">حفظ كمسودة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">الوصف الوظيفي</Label>
                    <Textarea placeholder="اكتب وصفاً تفصيلياً للوظيفة..." rows={3} className="text-sm border-gray-200 resize-none" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">المتطلبات</Label>
                    <Textarea placeholder="المؤهلات والخبرات والمهارات المطلوبة..." rows={2} className="text-sm border-gray-200 resize-none" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-[#1A2533] hover:bg-[#243347] text-white text-sm gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    نشر الوظيفة
                  </Button>
                  <Button size="sm" variant="outline" className="text-sm" onClick={() => setShowForm(false)}>إلغاء</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70">
                {["المسمى", "القسم", "الموقع", "النوع", "الراتب", "الطلبات", "RIASEC", "الموعد النهائي", "الحالة", "إجراء"].map((h) => (
                  <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3 whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {postedJobs.map((j) => (
                <TableRow key={j.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                  <TableCell className="font-medium text-[#1A2533] text-sm py-3 whitespace-nowrap">{j.title}</TableCell>
                  <TableCell className="text-xs text-gray-500 py-3">{j.dept}</TableCell>
                  <TableCell className="py-3">
                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {j.location}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-xs whitespace-nowrap">{j.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 py-3 whitespace-nowrap">{j.salary}</TableCell>
                  <TableCell className="text-sm font-semibold text-[#1A2533] py-3 text-center">{j.applications}</TableCell>
                  <TableCell className="py-3">
                    <span className="font-mono text-xs bg-[#1A2533]/5 text-[#1A2533] px-2 py-0.5 rounded font-bold">{j.riasec}</span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 py-3 whitespace-nowrap">{j.deadline}</TableCell>
                  <TableCell className="py-3"><StatusBadge status={j.status} /></TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="w-7 h-7 p-0 text-gray-400 hover:text-[#1A2533]"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="w-7 h-7 p-0 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab 3: Training Programs ─────────────────────────────────────────────────

function TrainingTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#1A2533]">برامج التدريب</h3>
        <Button
          size="sm"
          className="bg-[#C9A44B] hover:bg-[#b8933e] text-white gap-1.5 text-sm"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4" />
          إضافة برنامج
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-[#C9A44B]/30 bg-[#C9A44B]/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-[#1A2533]">نموذج إضافة برنامج تدريبي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "اسم البرنامج", placeholder: "عنوان البرنامج التدريبي" },
                    { label: "المدة", placeholder: "مثال: 3 أشهر" },
                    { label: "عدد المقاعد", placeholder: "مثال: 10", type: "number" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <Label className="text-xs text-[#1A2533] font-medium">{f.label}</Label>
                      <Input placeholder={f.placeholder} type={f.type ?? "text"} className="text-sm border-gray-200" />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">نوع البرنامج</Label>
                    <Select>
                      <SelectTrigger className="text-sm border-gray-200">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coop">تعاوني</SelectItem>
                        <SelectItem value="tamheer">تمهير</SelectItem>
                        <SelectItem value="summer">صيفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">هل مدعوم من هدف؟</Label>
                    <Select>
                      <SelectTrigger className="text-sm border-gray-200">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">الوصف</Label>
                    <Textarea placeholder="وصف البرنامج..." rows={2} className="text-sm border-gray-200 resize-none" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-[#1A2533] font-medium">شروط القبول</Label>
                    <Textarea placeholder="المؤهلات والمتطلبات المطلوبة للمتقدمين..." rows={2} className="text-sm border-gray-200 resize-none" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-[#1A2533] hover:bg-[#243347] text-white text-sm gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    إضافة البرنامج
                  </Button>
                  <Button size="sm" variant="outline" className="text-sm" onClick={() => setShowForm(false)}>إلغاء</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70">
              {["اسم البرنامج", "النوع", "المدة", "المقاعد", "مدعوم هدف", "الحالة", "إجراء"].map((h) => (
                <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingPrograms.map((p) => (
              <TableRow key={p.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                <TableCell className="font-medium text-[#1A2533] text-sm py-3">{p.name}</TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-xs border-[#C9A44B]/40 text-[#1A2533]">{p.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-3">{p.duration}</TableCell>
                <TableCell className="text-sm text-gray-500 py-3 text-center">{p.seats}</TableCell>
                <TableCell className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.hadaf ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.hadaf ? "✓ مدعوم" : "غير مدعوم"}
                  </span>
                </TableCell>
                <TableCell className="py-3"><StatusBadge status={p.status} /></TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="w-7 h-7 p-0 text-gray-400 hover:text-[#1A2533]"><Edit className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="w-7 h-7 p-0 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── Tab 4: Matched Candidates ────────────────────────────────────────────────

function CandidatesTab() {
  const [selectedJob, setSelectedJob] = useState("all");

  const filtered = selectedJob === "all"
    ? matchedCandidates
    : matchedCandidates.filter((c) => c.job === selectedJob);

  const uniqueJobs = [...new Set(matchedCandidates.map((c) => c.job))];

  return (
    <div className="space-y-5">
      {/* AI Banner */}
      <Card className="border border-[#C9A44B]/40 bg-gradient-to-l from-[#1A2533] to-[#243347] text-white overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A44B]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#C9A44B]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-[#C9A44B]">المطابقة الذكية بالذكاء الاصطناعي</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                يقوم الذكاء الاصطناعي بتحليل ملف كل مرشح ومطابقة مهاراته ونتائج RIASEC مع متطلبات وظائفك تلقائياً،
                ليمنحك نسبة تطابق دقيقة تساعدك في اتخاذ قرارات توظيف أسرع وأذكى.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Filter */}
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium text-[#1A2533] whitespace-nowrap">عرض حسب الوظيفة:</Label>
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-64 border-gray-200 text-sm">
            <SelectValue placeholder="اختر وظيفة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الوظائف</SelectItem>
            {uniqueJobs.map((j) => (
              <SelectItem key={j} value={j}>{j}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs border-[#C9A44B]/40 text-[#1A2533]">
          {filtered.length} مرشح
        </Badge>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <Card className="border border-gray-100 shadow-sm hover:shadow-md hover:border-[#C9A44B]/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A2533] flex items-center justify-center text-[#C9A44B] font-bold text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A2533] text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.job}</p>
                    </div>
                  </div>
                  <MatchScore value={c.match} />
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-xs text-gray-400">RIASEC:</span>
                  <span className="font-mono text-xs bg-[#1A2533]/5 text-[#1A2533] px-2 py-0.5 rounded font-bold">
                    {c.riasec}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">نسبة التطابق</span>
                    <span className="font-bold text-[#1A2533]">{c.match}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.match}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.07 }}
                      className="h-1.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #1A2533, #C9A44B)" }}
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-[#1A2533] hover:bg-[#243347] text-[#C9A44B] text-xs gap-1.5 h-8"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  تواصل مع المرشح
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: TrendingUp },
    { key: "jobs", label: "إدارة الوظائف", icon: Briefcase },
    { key: "training", label: "برامج التدريب", icon: BookOpen },
    { key: "candidates", label: "المرشحون المناسبون", icon: Sparkles },
  ];

  const quickStats = [
    { label: "وظائف منشورة", value: 12 },
    { label: "طلبات واردة", value: 87 },
    { label: "تدريبات نشطة", value: 3 },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 font-sans">
      {/* Header */}
      <div className="bg-[#1A2533] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C9A44B]/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#C9A44B]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">لوحة تحكم الشركة</h1>
                  <p className="text-[#C9A44B] text-sm mt-0.5 font-medium">
                    {(user as any)?.companyName ?? user?.fullName ?? "شركة فرصتي للتقنية"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                {quickStats.map((s) => (
                  <div key={s.label} className="flex flex-col items-center px-4 py-2 bg-white/10 rounded-xl">
                    <span className="text-xl font-bold text-[#C9A44B]">{s.value}</span>
                    <span className="text-xs text-white/70 whitespace-nowrap">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 w-fit">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === t.key
                        ? "bg-[#C9A44B] text-[#1A2533]"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "jobs" && <JobsTab />}
            {activeTab === "training" && <TrainingTab />}
            {activeTab === "candidates" && <CandidatesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
