import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Search,
  FileText,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

// ─── Fake Data ────────────────────────────────────────────────────────────────

const recentActivities = [
  { name: "أحمد الغامدي", role: "طالب", stage: "اختبار RIASEC", lastActivity: "منذ ساعتين", status: "نشط" },
  { name: "سارة العتيبي", role: "موظف", stage: "استكشاف المسار", lastActivity: "منذ 3 ساعات", status: "نشط" },
  { name: "محمد القحطاني", role: "طالب", stage: "بناء السيرة الذاتية", lastActivity: "منذ يوم", status: "قيد المراجعة" },
  { name: "نورة الشهري", role: "موظف", stage: "التدريب التعاوني", lastActivity: "منذ يومين", status: "مكتمل" },
  { name: "فيصل الدوسري", role: "طالب", stage: "بانتظار الموافقة", lastActivity: "منذ 4 أيام", status: "معلق" },
];

const affiliates = [
  { id: 1, name: "أحمد محمد الغامدي", email: "ahmed.g@edu.sa", role: "طالب", stage: "اختبار RIASEC", riasec: "RIA", courses: 3, cv: "مكتمل", status: "نشط" },
  { id: 2, name: "سارة خالد العتيبي", email: "sara.a@company.sa", role: "موظف", stage: "استكشاف المسار", riasec: "SEC", courses: 5, cv: "مكتمل", status: "نشط" },
  { id: 3, name: "محمد عبدالله القحطاني", email: "m.q@edu.sa", role: "طالب", stage: "بناء السيرة الذاتية", riasec: "AIE", courses: 2, cv: "جزئي", status: "قيد المراجعة" },
  { id: 4, name: "نورة سعد الشهري", email: "n.shahri@company.sa", role: "موظف", stage: "التدريب التعاوني", riasec: "CSE", courses: 8, cv: "مكتمل", status: "مكتمل" },
  { id: 5, name: "فيصل عمر الدوسري", email: "f.dosari@edu.sa", role: "طالب", stage: "نظرة عامة", riasec: "ECS", courses: 1, cv: "لم يبدأ", status: "معلق" },
  { id: 6, name: "هند ناصر الزهراني", email: "hend.z@edu.sa", role: "طالب", stage: "اختبار RIASEC", riasec: "ASI", courses: 4, cv: "مكتمل", status: "نشط" },
  { id: 7, name: "عبدالرحمن يوسف الحارثي", email: "ar.h@company.sa", role: "موظف", stage: "بناء السيرة الذاتية", riasec: "REC", courses: 6, cv: "مكتمل", status: "نشط" },
  { id: 8, name: "ريم محمد الأحمدي", email: "reem.a@edu.sa", role: "طالب", stage: "استكشاف المسار", riasec: "ISA", courses: 3, cv: "جزئي", status: "قيد المراجعة" },
  { id: 9, name: "سلطان فهد المطيري", email: "sultan.m@company.sa", role: "موظف", stage: "التدريب التعاوني", riasec: "CES", courses: 7, cv: "مكتمل", status: "مكتمل" },
  { id: 10, name: "لمياء إبراهيم الرشيدي", email: "lamia.r@edu.sa", role: "طالب", stage: "نظرة عامة", riasec: "AIS", courses: 0, cv: "لم يبدأ", status: "معلق" },
];

const courses = [
  { id: 1, title: "مهارات العرض والتقديم الاحترافي", provider: "كورسيرا", duration: "8 ساعات", category: "مهارات ناعمة", level: "مبتدئ" },
  { id: 2, title: "أساسيات البرمجة بـ Python", provider: "edX", duration: "20 ساعة", category: "تقنية", level: "مبتدئ" },
  { id: 3, title: "إدارة المشاريع الاحترافية (PMP)", provider: "PMI", duration: "40 ساعة", category: "إدارة", level: "متوسط" },
  { id: 4, title: "التسويق الرقمي والتواصل الاجتماعي", provider: "Google Digital Garage", duration: "12 ساعة", category: "تسويق", level: "مبتدئ" },
  { id: 5, title: "تحليل البيانات باستخدام Excel", provider: "Microsoft Learn", duration: "15 ساعة", category: "تقنية", level: "متوسط" },
];

const volunteerOps = [
  { id: 1, title: "تعليم محو الأمية الرقمية لكبار السن", org: "جمعية نهضة المرأة", location: "الرياض", hours: "4 ساعات/أسبوع" },
  { id: 2, title: "دعم ذوي الاحتياجات الخاصة", org: "جمعية الأطفال المعاقين", location: "جدة", hours: "6 ساعات/أسبوع" },
  { id: 3, title: "إرشاد الطلاب المستجدين في الجامعة", org: "جامعة الملك عبدالعزيز", location: "عبر الإنترنت", hours: "2 ساعة/أسبوع" },
];

const coopPrograms = [
  { id: 1, program: "التدريب التعاوني في هندسة البرمجيات", entity: "شركة STC", duration: "6 أشهر", type: "تعاوني", related: "تمهير" },
  { id: 2, program: "برنامج التدريب الصيفي للمحاسبة", entity: "ديلويت السعودية", duration: "3 أشهر", type: "صيفي", related: "هدف" },
  { id: 3, program: "تطوير المنتجات الرقمية", entity: "شركة مدى", duration: "4 أشهر", type: "تعاوني", related: "تمهير" },
];

const stageStats = [
  { stage: "نظرة عامة", count: 28, percent: 11 },
  { stage: "اختبار RIASEC", count: 45, percent: 18 },
  { stage: "استكشاف المسار", count: 62, percent: 25 },
  { stage: "بناء السيرة الذاتية", count: 54, percent: 22 },
  { stage: "التدريب التعاوني", count: 36, percent: 15 },
  { stage: "التوظيف", count: 22, percent: 9 },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    نشط: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "قيد المراجعة": "bg-amber-100 text-amber-700 border-amber-200",
    مكتمل: "bg-blue-100 text-blue-700 border-blue-200",
    معلق: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
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

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} title="إجمالي المنسوبين" value={247} sub="مسجّل في المنصة" />
        <KpiCard icon={TrendingUp} title="النشطون هذا الشهر" value={183} sub="نشاط خلال 30 يوماً" />
        <KpiCard icon={Award} title="أكملوا مسارهم" value={42} sub="إنجاز كامل" />
        <KpiCard icon={Clock} title="بانتظار الموافقة" value={8} sub="طلبات معلّقة" />
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold text-[#1A2533] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#C9A44B]" />
            آخر النشاطات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-right font-semibold text-[#1A2533] text-xs py-3">الاسم</TableHead>
                <TableHead className="text-right font-semibold text-[#1A2533] text-xs py-3">الدور</TableHead>
                <TableHead className="text-right font-semibold text-[#1A2533] text-xs py-3">المرحلة الحالية</TableHead>
                <TableHead className="text-right font-semibold text-[#1A2533] text-xs py-3">آخر نشاط</TableHead>
                <TableHead className="text-right font-semibold text-[#1A2533] text-xs py-3">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((row, i) => (
                <TableRow key={i} className="hover:bg-[#C9A44B]/5 transition-colors">
                  <TableCell className="font-medium text-[#1A2533] text-sm py-3">{row.name}</TableCell>
                  <TableCell className="text-sm text-gray-600 py-3">
                    <Badge variant="outline" className="text-xs border-[#1A2533]/20 text-[#1A2533]">{row.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 py-3">{row.stage}</TableCell>
                  <TableCell className="text-xs text-gray-400 py-3">{row.lastActivity}</TableCell>
                  <TableCell className="py-3"><StatusBadge status={row.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Affiliates ──────────────────────────────────────────────────────────

function AffiliatesTab() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAffiliate, setSelectedAffiliate] = useState<(typeof affiliates)[0] | null>(null);

  const filtered = affiliates.filter((a) => {
    const matchSearch = a.name.includes(search) || a.email.includes(search);
    const matchStage = stageFilter === "all" || a.stage === stageFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStage && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="بحث بالاسم أو البريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 text-sm border-gray-200 focus:border-[#C9A44B] focus:ring-[#C9A44B]/20"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-44 border-gray-200 text-sm">
            <SelectValue placeholder="فلتر المرحلة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المراحل</SelectItem>
            <SelectItem value="اختبار RIASEC">اختبار RIASEC</SelectItem>
            <SelectItem value="استكشاف المسار">استكشاف المسار</SelectItem>
            <SelectItem value="بناء السيرة الذاتية">بناء السيرة الذاتية</SelectItem>
            <SelectItem value="التدريب التعاوني">التدريب التعاوني</SelectItem>
            <SelectItem value="نظرة عامة">نظرة عامة</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 border-gray-200 text-sm">
            <SelectValue placeholder="فلتر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="نشط">نشط</SelectItem>
            <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
            <SelectItem value="مكتمل">مكتمل</SelectItem>
            <SelectItem value="معلق">معلق</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70">
                {["الاسم", "البريد الإلكتروني", "الدور", "المرحلة", "RIASEC", "الدورات", "السيرة الذاتية", "الحالة", "إجراء"].map((h) => (
                  <TableHead key={h} className="text-right font-semibold text-[#1A2533] text-xs py-3 whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                  <TableCell className="font-medium text-[#1A2533] text-sm py-3 whitespace-nowrap">{a.name}</TableCell>
                  <TableCell className="text-xs text-gray-500 py-3">{a.email}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-xs border-[#C9A44B]/40 text-[#1A2533]">{a.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 py-3 whitespace-nowrap">{a.stage}</TableCell>
                  <TableCell className="py-3">
                    <span className="font-mono text-xs bg-[#1A2533]/5 text-[#1A2533] px-2 py-0.5 rounded font-bold">{a.riasec}</span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 py-3 text-center">{a.courses}</TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={a.cv === "مكتمل" ? "مكتمل" : a.cv === "جزئي" ? "قيد المراجعة" : "معلق"} />
                  </TableCell>
                  <TableCell className="py-3"><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-[#C9A44B]/40 text-[#1A2533] hover:bg-[#C9A44B]/10 gap-1"
                      onClick={() => setSelectedAffiliate(a)}
                    >
                      <Eye className="w-3 h-3" />
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Profile Dialog */}
      <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-[#1A2533] text-lg">الملف الكامل</DialogTitle>
          </DialogHeader>
          {selectedAffiliate && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4 p-4 bg-[#1A2533]/5 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-[#1A2533] flex items-center justify-center text-[#C9A44B] text-xl font-bold">
                  {selectedAffiliate.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1A2533] text-base">{selectedAffiliate.name}</p>
                  <p className="text-sm text-gray-500">{selectedAffiliate.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["الدور", selectedAffiliate.role],
                  ["المرحلة الحالية", selectedAffiliate.stage],
                  ["كود RIASEC", selectedAffiliate.riasec],
                  ["الدورات المكتملة", `${selectedAffiliate.courses} دورة`],
                  ["حالة السيرة الذاتية", selectedAffiliate.cv],
                  ["الحالة العامة", selectedAffiliate.status],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    <p className="font-semibold text-[#1A2533]">{v}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">تقدم المسار</p>
                <Progress
                  value={
                    selectedAffiliate.stage === "نظرة عامة" ? 10
                    : selectedAffiliate.stage === "اختبار RIASEC" ? 30
                    : selectedAffiliate.stage === "استكشاف المسار" ? 50
                    : selectedAffiliate.stage === "بناء السيرة الذاتية" ? 65
                    : selectedAffiliate.stage === "التدريب التعاوني" ? 80
                    : 100
                  }
                  className="h-2"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Tab: Programs ────────────────────────────────────────────────────────────

function ProgramsTab() {
  const [activeProgram, setActiveProgram] = useState("courses");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showVolForm, setShowVolForm] = useState(false);
  const [showCoopForm, setShowCoopForm] = useState(false);

  const subTabs = [
    { key: "courses", label: "الدورات التدريبية" },
    { key: "volunteer", label: "فرص التطوع" },
    { key: "coop", label: "التدريب التعاوني" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveProgram(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeProgram === t.key
                ? "bg-[#1A2533] text-[#C9A44B]"
                : "text-gray-500 hover:text-[#1A2533] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Courses Sub-Tab */}
      {activeProgram === "courses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1A2533]">الدورات التدريبية المضافة</h3>
            <Button
              size="sm"
              className="bg-[#C9A44B] hover:bg-[#b8933e] text-white gap-1.5 text-sm"
              onClick={() => setShowCourseForm(!showCourseForm)}
            >
              <Plus className="w-4 h-4" />
              إضافة دورة
            </Button>
          </div>

          <AnimatePresence>
            {showCourseForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border border-[#C9A44B]/30 bg-[#C9A44B]/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#1A2533]">نموذج إضافة دورة جديدة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "عنوان الدورة", placeholder: "أدخل عنوان الدورة" },
                        { label: "المزود", placeholder: "Coursera, edX, ..." },
                        { label: "المدة", placeholder: "مثال: 12 ساعة" },
                        { label: "التصنيف", placeholder: "تقنية / إدارة / ..." },
                      ].map((f) => (
                        <div key={f.label} className="space-y-1.5">
                          <Label className="text-xs text-[#1A2533] font-medium">{f.label}</Label>
                          <Input placeholder={f.placeholder} className="text-sm border-gray-200" />
                        </div>
                      ))}
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[#1A2533] font-medium">المستوى</Label>
                        <Select>
                          <SelectTrigger className="text-sm border-gray-200">
                            <SelectValue placeholder="اختر المستوى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">مبتدئ</SelectItem>
                            <SelectItem value="intermediate">متوسط</SelectItem>
                            <SelectItem value="advanced">متقدم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[#1A2533] font-medium">رابط الدورة</Label>
                        <Input placeholder="https://..." type="url" className="text-sm border-gray-200" />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs text-[#1A2533] font-medium">الوصف</Label>
                        <Textarea placeholder="وصف مختصر للدورة..." rows={2} className="text-sm border-gray-200 resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#1A2533] hover:bg-[#243347] text-white text-sm">حفظ الدورة</Button>
                      <Button size="sm" variant="outline" className="text-sm" onClick={() => setShowCourseForm(false)}>إلغاء</Button>
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
                  {["العنوان", "المزود", "المدة", "التصنيف", "المستوى", "إجراء"].map((h) => (
                    <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                    <TableCell className="font-medium text-[#1A2533] text-sm py-3">{c.title}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{c.provider}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{c.duration}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-xs">{c.category}</Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-xs border-[#C9A44B]/40 text-[#1A2533]">{c.level}</Badge>
                    </TableCell>
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
      )}

      {/* Volunteer Sub-Tab */}
      {activeProgram === "volunteer" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1A2533]">فرص التطوع المضافة</h3>
            <Button
              size="sm"
              className="bg-[#C9A44B] hover:bg-[#b8933e] text-white gap-1.5 text-sm"
              onClick={() => setShowVolForm(!showVolForm)}
            >
              <Plus className="w-4 h-4" />
              إضافة فرصة
            </Button>
          </div>

          <AnimatePresence>
            {showVolForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border border-[#C9A44B]/30 bg-[#C9A44B]/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-[#1A2533]">نموذج إضافة فرصة تطوع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "عنوان الفرصة", placeholder: "اسم نشاط التطوع" },
                        { label: "المنظمة", placeholder: "اسم الجهة المنظِّمة" },
                        { label: "الموقع", placeholder: "المدينة أو عبر الإنترنت" },
                        { label: "الساعات المطلوبة", placeholder: "مثال: 4 ساعات/أسبوع" },
                      ].map((f) => (
                        <div key={f.label} className="space-y-1.5">
                          <Label className="text-xs text-[#1A2533] font-medium">{f.label}</Label>
                          <Input placeholder={f.placeholder} className="text-sm border-gray-200" />
                        </div>
                      ))}
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs text-[#1A2533] font-medium">الوصف</Label>
                        <Textarea placeholder="وصف مختصر للفرصة..." rows={2} className="text-sm border-gray-200 resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#1A2533] hover:bg-[#243347] text-white text-sm">حفظ الفرصة</Button>
                      <Button size="sm" variant="outline" className="text-sm" onClick={() => setShowVolForm(false)}>إلغاء</Button>
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
                  {["العنوان", "المنظمة", "الموقع", "الساعات", "إجراء"].map((h) => (
                    <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteerOps.map((v) => (
                  <TableRow key={v.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                    <TableCell className="font-medium text-[#1A2533] text-sm py-3">{v.title}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{v.org}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{v.location}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{v.hours}</TableCell>
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
      )}

      {/* Coop Sub-Tab */}
      {activeProgram === "coop" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1A2533]">برامج التدريب التعاوني</h3>
            <Button
              size="sm"
              className="bg-[#C9A44B] hover:bg-[#b8933e] text-white gap-1.5 text-sm"
              onClick={() => setShowCoopForm(!showCoopForm)}
            >
              <Plus className="w-4 h-4" />
              إضافة برنامج
            </Button>
          </div>

          <AnimatePresence>
            {showCoopForm && (
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
                        { label: "اسم البرنامج", placeholder: "عنوان برنامج التدريب" },
                        { label: "الجهة المضيفة", placeholder: "اسم الشركة أو المؤسسة" },
                        { label: "المدة", placeholder: "مثال: 3 أشهر" },
                      ].map((f) => (
                        <div key={f.label} className="space-y-1.5">
                          <Label className="text-xs text-[#1A2533] font-medium">{f.label}</Label>
                          <Input placeholder={f.placeholder} className="text-sm border-gray-200" />
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
                            <SelectItem value="summer">صيفي</SelectItem>
                            <SelectItem value="tamuir">تمهير</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[#1A2533] font-medium">البرنامج المرتبط</Label>
                        <Select>
                          <SelectTrigger className="text-sm border-gray-200">
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tamheer">تمهير</SelectItem>
                            <SelectItem value="hadaf">هدف</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#1A2533] hover:bg-[#243347] text-white text-sm">حفظ البرنامج</Button>
                      <Button size="sm" variant="outline" className="text-sm" onClick={() => setShowCoopForm(false)}>إلغاء</Button>
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
                  {["اسم البرنامج", "الجهة", "المدة", "النوع", "البرنامج المرتبط", "إجراء"].map((h) => (
                    <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {coopPrograms.map((c) => (
                  <TableRow key={c.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                    <TableCell className="font-medium text-[#1A2533] text-sm py-3">{c.program}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{c.entity}</TableCell>
                    <TableCell className="text-sm text-gray-500 py-3">{c.duration}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-xs border-[#C9A44B]/40 text-[#1A2533]">{c.type}</Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-xs">{c.related}</Badge>
                    </TableCell>
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
      )}
    </div>
  );
}

// ─── Tab: Reports ─────────────────────────────────────────────────────────────

function ReportsTab() {
  const performanceMetrics = [
    { label: "معدل إكمال المسار", value: 72 },
    { label: "نسبة الدورات المكتملة", value: 58 },
    { label: "التفاعل مع المنصة", value: 84 },
    { label: "نسبة التوظيف", value: 41 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-[#1A2533] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A44B]" />
              تقرير الأداء الشهري
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {performanceMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-bold text-[#1A2533]">{m.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-2 rounded-full"
                    style={{ background: `linear-gradient(90deg, #1A2533, #C9A44B)` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-[#1A2533] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C9A44B]" />
              توزيع المنسوبين على المراحل
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/70">
                  {["المرحلة", "عدد المنسوبين", "النسبة"].map((h) => (
                    <TableHead key={h} className="text-right text-xs font-semibold text-[#1A2533] py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {stageStats.map((s) => (
                  <TableRow key={s.stage} className="hover:bg-[#C9A44B]/5">
                    <TableCell className="font-medium text-[#1A2533] text-sm py-3">{s.stage}</TableCell>
                    <TableCell className="text-sm text-gray-600 py-3">{s.count} منسوب</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#C9A44B]" style={{ width: `${s.percent}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{s.percent}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => window.print()}
          className="bg-[#1A2533] hover:bg-[#243347] text-[#C9A44B] gap-2"
        >
          <FileText className="w-4 h-4" />
          تصدير PDF
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "affiliates", label: "منسوبيّ", icon: Users },
    { key: "programs", label: "البرامج", icon: BookOpen },
    { key: "reports", label: "التقارير", icon: TrendingUp },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 font-sans">
      {/* Header */}
      <div className="bg-[#1A2533] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">لوحة تحكم المشرف</h1>
              <p className="text-[#C9A44B] text-sm mt-1 font-medium">
                مرحباً {user?.fullName ?? "المشرف"} — {(user as any)?.institution ?? "مؤسسة فرصتي"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl p-1">
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
            {activeTab === "affiliates" && <AffiliatesTab />}
            {activeTab === "programs" && <ProgramsTab />}
            {activeTab === "reports" && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
