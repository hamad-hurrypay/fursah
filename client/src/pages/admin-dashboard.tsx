import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Eye,
  Plus,
  Building2,
  Heart,
  Briefcase,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalStudents: 1_284,
  activeStudents: 847,
  totalPrograms: 63,
  completionRate: 71,
};

const MOCK_STUDENTS = [
  { id: 1, name: "سارة العتيبي",    email: "sara@example.com",    stage: "اختبار الميول",    riasec: "ASI", courses: 4, cvStatus: "مكتملة",    joinDate: "2026-01-10" },
  { id: 2, name: "محمد الغامدي",    email: "moh@example.com",     stage: "تطوير المهارات",   riasec: "REC", courses: 7, cvStatus: "جزئية",     joinDate: "2026-01-14" },
  { id: 3, name: "نورة الشهري",     email: "noura@example.com",   stage: "الدورات التدريبية",riasec: "SEC", courses: 3, cvStatus: "لم تُنشأ",   joinDate: "2026-01-18" },
  { id: 4, name: "عبدالله القحطاني",email: "abd@example.com",     stage: "التطوع",           riasec: "EAS", courses: 5, cvStatus: "مكتملة",    joinDate: "2026-01-22" },
  { id: 5, name: "ريم المالكي",     email: "reem@example.com",    stage: "التدريب التعاوني", riasec: "CAR", courses: 9, cvStatus: "مكتملة",    joinDate: "2026-02-01" },
  { id: 6, name: "خالد الدوسري",   email: "khalid@example.com",  stage: "السيرة الذاتية",   riasec: "IAE", courses: 6, cvStatus: "جزئية",     joinDate: "2026-02-05" },
  { id: 7, name: "هند السبيعي",    email: "hind@example.com",    stage: "فرص العمل",        riasec: "SER", courses: 8, cvStatus: "مكتملة",    joinDate: "2026-02-09" },
  { id: 8, name: "أنس الحربي",     email: "anas@example.com",    stage: "اختبار الميول",    riasec: "RIC", courses: 2, cvStatus: "لم تُنشأ",   joinDate: "2026-02-13" },
  { id: 9, name: "لجين العسيري",   email: "lujain@example.com",  stage: "تطوير المهارات",   riasec: "ACS", courses: 5, cvStatus: "جزئية",     joinDate: "2026-02-20" },
  { id: 10,"name": "فيصل الزهراني",email: "faisal@example.com",  stage: "الشهادات",         riasec: "ECS", courses: 11,cvStatus: "مكتملة",    joinDate: "2026-02-28" },
];

const MOCK_COURSES = [
  { id: 1, title: "مهارات البرمجة بـ Python", provider: "FutureLearn",         duration: "٨ أسابيع",  category: "تقنية",    level: "مبتدئ" },
  { id: 2, title: "إدارة المشاريع الاحترافية", provider: "Classperts",          duration: "٦ أسابيع",  category: "إدارة",    level: "متوسط" },
  { id: 3, title: "التسويق الرقمي المتقدم",   provider: "كن للتدريب",           duration: "٤ أسابيع",  category: "تسويق",    level: "متقدم" },
  { id: 4, title: "ريادة الأعمال الناشئة",    provider: "تكامل لحلول الأعمال",  duration: "٥ أسابيع",  category: "أعمال",    level: "مبتدئ" },
];

const MOCK_VOLUNTEER = [
  { id: 1, title: "مساعد تعليمي في مدارس أرامكو",     org: "أرامكو السعودية",    hours: 40, location: "الظهران",   category: "تعليم" },
  { id: 2, title: "متطوع في مهرجان الجنادرية",          org: "وزارة الثقافة",       hours: 20, location: "الرياض",    category: "ثقافة" },
];

const MOCK_TRAINING = [
  { id: 1, program: "تمهير - الحكومة الرقمية", provider: "وزارة الاتصالات",    type: "حكومي",   duration: "٦ أشهر" },
  { id: 2, program: "هدف - الصناعة الوطنية",  provider: "وزارة الصناعة",      type: "صناعي",   duration: "٣ أشهر" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card className="border border-[#C9A44B]/20 hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-black text-[#C9A44B] leading-none">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── CV Status Badge ──────────────────────────────────────────────────────────
function CVBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "مكتملة":  "bg-green-100 text-green-700",
    "جزئية":   "bg-yellow-100 text-yellow-700",
    "لم تُنشأ":"bg-gray-100 text-gray-500",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}>{status}</span>;
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users}      label="إجمالي الطلاب"    value={MOCK_STATS.totalStudents.toLocaleString("ar-SA")} color="bg-[#1A2533]" />
        <StatCard icon={TrendingUp} label="الطلاب النشطون"   value={MOCK_STATS.activeStudents.toLocaleString("ar-SA")} color="bg-[#C9A44B]" />
        <StatCard icon={BookOpen}   label="البرامج المضافة"  value={MOCK_STATS.totalPrograms}  color="bg-[#1A2533]" />
        <StatCard icon={Award}      label="معدل الإكمال %"   value={`${MOCK_STATS.completionRate}%`} color="bg-[#C9A44B]" />
      </div>

      <div>
        <h3 className="text-base font-bold text-[#1A2533] mb-4">آخر الطلاب المسجلين</h3>
        <div className="rounded-xl border border-[#C9A44B]/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1A2533]/5">
                <TableHead className="text-[#1A2533] font-bold text-right">الاسم</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">البريد</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المرحلة الحالية</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">تاريخ التسجيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STUDENTS.slice(0, 5).map((s) => (
                <TableRow key={s.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                  <TableCell className="font-semibold text-[#1A2533]">{s.name}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{s.email}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-[#1A2533]/10 text-[#1A2533] px-2 py-0.5 rounded-full font-medium">{s.stage}</span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{s.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ─── Students Tab ─────────────────────────────────────────────────────────────
function StudentsTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof MOCK_STUDENTS[0] | null>(null);

  const filtered = MOCK_STUDENTS.filter((s) =>
    s.name.includes(search) || s.email.includes(search) || s.stage.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Input
          placeholder="ابحث بالاسم أو البريد أو المرحلة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs border-[#C9A44B]/30 focus:border-[#C9A44B] text-right"
          dir="rtl"
        />
        <span className="text-sm text-gray-400">{filtered.length} طالب</span>
      </div>

      <div className="rounded-xl border border-[#C9A44B]/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1A2533]/5">
              <TableHead className="text-[#1A2533] font-bold text-right">الاسم</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">البريد</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">المرحلة</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">RIASEC</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">الدورات</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">السيرة الذاتية</TableHead>
              <TableHead className="text-[#1A2533] font-bold text-right">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} className="hover:bg-[#C9A44B]/5 transition-colors">
                <TableCell className="font-semibold text-[#1A2533]">{s.name}</TableCell>
                <TableCell className="text-gray-500 text-sm">{s.email}</TableCell>
                <TableCell>
                  <span className="text-xs bg-[#1A2533]/10 text-[#1A2533] px-2 py-0.5 rounded-full font-medium">{s.stage}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-[#C9A44B] bg-[#C9A44B]/10 px-2 py-0.5 rounded">{s.riasec}</span>
                </TableCell>
                <TableCell className="text-center font-bold text-[#1A2533]">{s.courses}</TableCell>
                <TableCell><CVBadge status={s.cvStatus} /></TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1A2533] hover:bg-[#1A2533]/10 gap-1.5"
                        onClick={() => setSelected(s)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        عرض التفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-[#1A2533] text-right">تفاصيل الطالب</DialogTitle>
                      </DialogHeader>
                      {selected && (
                        <div className="space-y-4 text-right">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#1A2533] flex items-center justify-center text-white font-black text-lg">
                              {selected.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#1A2533] text-base">{selected.name}</p>
                              <p className="text-sm text-gray-500">{selected.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#1A2533]/5 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">المرحلة الحالية</p>
                              <p className="font-bold text-[#1A2533] text-sm">{selected.stage}</p>
                            </div>
                            <div className="bg-[#C9A44B]/10 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">نتيجة RIASEC</p>
                              <p className="font-mono font-black text-[#C9A44B] text-lg">{selected.riasec}</p>
                            </div>
                            <div className="bg-[#1A2533]/5 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">الدورات المكتملة</p>
                              <p className="font-black text-[#1A2533] text-xl">{selected.courses}</p>
                            </div>
                            <div className="bg-[#1A2533]/5 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">حالة السيرة الذاتية</p>
                              <CVBadge status={selected.cvStatus} />
                            </div>
                          </div>
                          <div className="bg-[#1A2533]/5 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">تاريخ التسجيل</p>
                            <p className="font-semibold text-[#1A2533] text-sm">{selected.joinDate}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Programs Tab ─────────────────────────────────────────────────────────────
function ProgramsTab() {
  const { toast } = useToast();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEER);
  const [trainings, setTrainings] = useState(MOCK_TRAINING);

  // Course form state
  const [courseForm, setCourseForm] = useState({ title: "", description: "", provider: "", duration: "", category: "", level: "" });
  const [courseOpen, setCourseOpen] = useState(false);

  // Volunteer form state
  const [volForm, setVolForm] = useState({ title: "", org: "", description: "", location: "", hours: "", category: "" });
  const [volOpen, setVolOpen] = useState(false);

  // Training form state
  const [trainForm, setTrainForm] = useState({ program: "", provider: "", description: "", type: "", duration: "", relatedProgram: "" });
  const [trainOpen, setTrainOpen] = useState(false);

  const handleAddCourse = () => {
    if (!courseForm.title) return;
    setCourses((prev) => [...prev, { id: prev.length + 1, ...courseForm }]);
    setCourseForm({ title: "", description: "", provider: "", duration: "", category: "", level: "" });
    setCourseOpen(false);
    toast({ title: "تمت الإضافة", description: "تم إضافة الدورة بنجاح" });
  };

  const handleAddVol = () => {
    if (!volForm.title) return;
    setVolunteers((prev) => [...prev, { id: prev.length + 1, ...volForm, hours: Number(volForm.hours) }]);
    setVolForm({ title: "", org: "", description: "", location: "", hours: "", category: "" });
    setVolOpen(false);
    toast({ title: "تمت الإضافة", description: "تم إضافة الفرصة التطوعية بنجاح" });
  };

  const handleAddTrain = () => {
    if (!trainForm.program) return;
    setTrainings((prev) => [...prev, { id: prev.length + 1, ...trainForm }]);
    setTrainForm({ program: "", provider: "", description: "", type: "", duration: "", relatedProgram: "" });
    setTrainOpen(false);
    toast({ title: "تمت الإضافة", description: "تم إضافة برنامج التدريب التعاوني بنجاح" });
  };

  return (
    <Tabs defaultValue="courses" dir="rtl">
      <TabsList className="bg-[#1A2533]/5 mb-6">
        <TabsTrigger value="courses"  className="data-[state=active]:bg-[#1A2533] data-[state=active]:text-white">الدورات التدريبية</TabsTrigger>
        <TabsTrigger value="volunteer" className="data-[state=active]:bg-[#1A2533] data-[state=active]:text-white">الفرص التطوعية</TabsTrigger>
        <TabsTrigger value="training" className="data-[state=active]:bg-[#1A2533] data-[state=active]:text-white">التدريب التعاوني</TabsTrigger>
      </TabsList>

      {/* Courses */}
      <TabsContent value="courses" className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#1A2533]">الدورات التدريبية المضافة</h3>
          <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold gap-2">
                <Plus className="w-4 h-4" /> إضافة دورة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-[#1A2533] text-right">إضافة دورة تدريبية</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-right">
                <div><Label>عنوان الدورة *</Label><Input value={courseForm.title} onChange={e=>setCourseForm(p=>({...p,title:e.target.value}))} className="mt-1" dir="rtl" /></div>
                <div><Label>الوصف</Label><Textarea value={courseForm.description} onChange={e=>setCourseForm(p=>({...p,description:e.target.value}))} className="mt-1" dir="rtl" rows={2} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>المزود</Label><Input value={courseForm.provider} onChange={e=>setCourseForm(p=>({...p,provider:e.target.value}))} className="mt-1" dir="rtl" /></div>
                  <div><Label>المدة</Label><Input value={courseForm.duration} onChange={e=>setCourseForm(p=>({...p,duration:e.target.value}))} className="mt-1" dir="rtl" placeholder="مثال: ٦ أسابيع" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>التصنيف</Label>
                    <Select value={courseForm.category} onValueChange={v=>setCourseForm(p=>({...p,category:v}))}>
                      <SelectTrigger className="mt-1 text-right"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent><SelectItem value="تقنية">تقنية</SelectItem><SelectItem value="إدارة">إدارة</SelectItem><SelectItem value="تسويق">تسويق</SelectItem><SelectItem value="أعمال">أعمال</SelectItem><SelectItem value="أخرى">أخرى</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المستوى</Label>
                    <Select value={courseForm.level} onValueChange={v=>setCourseForm(p=>({...p,level:v}))}>
                      <SelectTrigger className="mt-1 text-right"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent><SelectItem value="مبتدئ">مبتدئ</SelectItem><SelectItem value="متوسط">متوسط</SelectItem><SelectItem value="متقدم">متقدم</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddCourse} className="w-full bg-[#1A2533] hover:bg-[#1A2533]/90 text-white font-bold mt-2">إضافة الدورة</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-xl border border-[#C9A44B]/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1A2533]/5">
                <TableHead className="text-[#1A2533] font-bold text-right">عنوان الدورة</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المزود</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المدة</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">التصنيف</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المستوى</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id} className="hover:bg-[#C9A44B]/5">
                  <TableCell className="font-semibold text-[#1A2533]">{c.title}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{c.provider}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{c.duration}</TableCell>
                  <TableCell><span className="text-xs bg-[#1A2533]/10 text-[#1A2533] px-2 py-0.5 rounded-full">{c.category}</span></TableCell>
                  <TableCell><span className="text-xs bg-[#C9A44B]/15 text-[#C9A44B] font-semibold px-2 py-0.5 rounded-full">{c.level}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Volunteer */}
      <TabsContent value="volunteer" className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#1A2533]">الفرص التطوعية المضافة</h3>
          <Dialog open={volOpen} onOpenChange={setVolOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold gap-2">
                <Plus className="w-4 h-4" /> إضافة فرصة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-[#1A2533] text-right">إضافة فرصة تطوعية</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-right">
                <div><Label>العنوان *</Label><Input value={volForm.title} onChange={e=>setVolForm(p=>({...p,title:e.target.value}))} className="mt-1" dir="rtl" /></div>
                <div><Label>المنظمة</Label><Input value={volForm.org} onChange={e=>setVolForm(p=>({...p,org:e.target.value}))} className="mt-1" dir="rtl" /></div>
                <div><Label>الوصف</Label><Textarea value={volForm.description} onChange={e=>setVolForm(p=>({...p,description:e.target.value}))} className="mt-1" dir="rtl" rows={2} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>الموقع</Label><Input value={volForm.location} onChange={e=>setVolForm(p=>({...p,location:e.target.value}))} className="mt-1" dir="rtl" /></div>
                  <div><Label>الساعات</Label><Input type="number" value={volForm.hours} onChange={e=>setVolForm(p=>({...p,hours:e.target.value}))} className="mt-1" /></div>
                </div>
                <div>
                  <Label>التصنيف</Label>
                  <Select value={volForm.category} onValueChange={v=>setVolForm(p=>({...p,category:v}))}>
                    <SelectTrigger className="mt-1 text-right"><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent><SelectItem value="تعليم">تعليم</SelectItem><SelectItem value="ثقافة">ثقافة</SelectItem><SelectItem value="صحة">صحة</SelectItem><SelectItem value="بيئة">بيئة</SelectItem><SelectItem value="أخرى">أخرى</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddVol} className="w-full bg-[#1A2533] hover:bg-[#1A2533]/90 text-white font-bold mt-2">إضافة الفرصة</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-xl border border-[#C9A44B]/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1A2533]/5">
                <TableHead className="text-[#1A2533] font-bold text-right">العنوان</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المنظمة</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">الموقع</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">الساعات</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">التصنيف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id} className="hover:bg-[#C9A44B]/5">
                  <TableCell className="font-semibold text-[#1A2533]">{v.title}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{v.org}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{v.location}</TableCell>
                  <TableCell className="font-bold text-[#C9A44B]">{v.hours}</TableCell>
                  <TableCell><span className="text-xs bg-[#1A2533]/10 text-[#1A2533] px-2 py-0.5 rounded-full">{v.category}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Training */}
      <TabsContent value="training" className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#1A2533]">برامج التدريب التعاوني</h3>
          <Dialog open={trainOpen} onOpenChange={setTrainOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold gap-2">
                <Plus className="w-4 h-4" /> إضافة برنامج
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-[#1A2533] text-right">إضافة برنامج تدريب تعاوني</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-right">
                <div><Label>اسم البرنامج *</Label><Input value={trainForm.program} onChange={e=>setTrainForm(p=>({...p,program:e.target.value}))} className="mt-1" dir="rtl" /></div>
                <div><Label>الجهة المقدمة</Label><Input value={trainForm.provider} onChange={e=>setTrainForm(p=>({...p,provider:e.target.value}))} className="mt-1" dir="rtl" /></div>
                <div><Label>الوصف</Label><Textarea value={trainForm.description} onChange={e=>setTrainForm(p=>({...p,description:e.target.value}))} className="mt-1" dir="rtl" rows={2} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>النوع</Label>
                    <Select value={trainForm.type} onValueChange={v=>setTrainForm(p=>({...p,type:v}))}>
                      <SelectTrigger className="mt-1 text-right"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent><SelectItem value="حكومي">حكومي</SelectItem><SelectItem value="صناعي">صناعي</SelectItem><SelectItem value="خاص">خاص</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>المدة</Label><Input value={trainForm.duration} onChange={e=>setTrainForm(p=>({...p,duration:e.target.value}))} className="mt-1" dir="rtl" placeholder="مثال: ٣ أشهر" /></div>
                </div>
                <div>
                  <Label>البرنامج المرتبط</Label>
                  <Select value={trainForm.relatedProgram} onValueChange={v=>setTrainForm(p=>({...p,relatedProgram:v}))}>
                    <SelectTrigger className="mt-1 text-right"><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent><SelectItem value="تمهير">تمهير</SelectItem><SelectItem value="هدف">هدف</SelectItem><SelectItem value="مسك">مسك</SelectItem><SelectItem value="مهارات">مهارات</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddTrain} className="w-full bg-[#1A2533] hover:bg-[#1A2533]/90 text-white font-bold mt-2">إضافة البرنامج</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-xl border border-[#C9A44B]/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1A2533]/5">
                <TableHead className="text-[#1A2533] font-bold text-right">اسم البرنامج</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">الجهة المقدمة</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">النوع</TableHead>
                <TableHead className="text-[#1A2533] font-bold text-right">المدة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((t) => (
                <TableRow key={t.id} className="hover:bg-[#C9A44B]/5">
                  <TableCell className="font-semibold text-[#1A2533]">{t.program}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{t.provider}</TableCell>
                  <TableCell><span className="text-xs bg-[#C9A44B]/15 text-[#C9A44B] font-semibold px-2 py-0.5 rounded-full">{t.type}</span></TableCell>
                  <TableCell className="text-gray-500 text-sm">{t.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    orgName: "جامعة الملك عبدالعزيز",
    orgType: "جامعة",
    logo: "",
    email: "admin@kau.edu.sa",
  });

  const handleSave = () => {
    toast({ title: "تم الحفظ", description: "تم حفظ إعدادات المؤسسة بنجاح" });
  };

  return (
    <div className="max-w-lg space-y-5" dir="rtl">
      <h3 className="font-bold text-[#1A2533] text-base">إعدادات المؤسسة</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-[#1A2533] font-semibold">اسم المؤسسة</Label>
          <Input
            value={form.orgName}
            onChange={e=>setForm(p=>({...p,orgName:e.target.value}))}
            className="mt-1 border-[#C9A44B]/30 focus:border-[#C9A44B]"
            dir="rtl"
          />
        </div>
        <div>
          <Label className="text-[#1A2533] font-semibold">نوع المؤسسة</Label>
          <Select value={form.orgType} onValueChange={v=>setForm(p=>({...p,orgType:v}))}>
            <SelectTrigger className="mt-1 border-[#C9A44B]/30 text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="جامعة">جامعة</SelectItem>
              <SelectItem value="معهد">معهد</SelectItem>
              <SelectItem value="مدرسة">مدرسة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#1A2533] font-semibold">رابط الشعار</Label>
          <Input
            value={form.logo}
            onChange={e=>setForm(p=>({...p,logo:e.target.value}))}
            className="mt-1 border-[#C9A44B]/30 focus:border-[#C9A44B]"
            placeholder="https://..."
            dir="ltr"
          />
        </div>
        <div>
          <Label className="text-[#1A2533] font-semibold">بريد التواصل</Label>
          <Input
            value={form.email}
            onChange={e=>setForm(p=>({...p,email:e.target.value}))}
            className="mt-1 border-[#C9A44B]/30 focus:border-[#C9A44B]"
            dir="ltr"
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        className="w-full bg-[#1A2533] hover:bg-[#1A2533]/90 text-white font-bold h-11 mt-2"
      >
        حفظ الإعدادات
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-[#1A2533] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C9A44B] flex items-center justify-center">
              <span className="text-[#1A2533] font-black text-sm">ف</span>
            </div>
            <div>
              <h1 className="text-[#C9A44B] font-black text-base leading-none">لوحة تحكم المؤسسة</h1>
              <p className="text-white/40 text-xs mt-0.5">منصة فرصتي — الإدارة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A44B]/20 border border-[#C9A44B]/40 flex items-center justify-center">
              <span className="text-[#C9A44B] font-bold text-sm">م</span>
            </div>
            <span className="text-white/70 text-sm hidden sm:block">المسؤول</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" dir="rtl">
          <TabsList className="bg-white border border-[#C9A44B]/20 shadow-sm mb-8 h-11 p-1 gap-1">
            <TabsTrigger
              value="overview"
              className="gap-2 data-[state=active]:bg-[#1A2533] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="gap-2 data-[state=active]:bg-[#1A2533] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold"
            >
              <Users className="w-4 h-4" />
              إدارة الطلاب
            </TabsTrigger>
            <TabsTrigger
              value="programs"
              className="gap-2 data-[state=active]:bg-[#1A2533] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold"
            >
              <BookOpen className="w-4 h-4" />
              البرامج والفرص
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:bg-[#1A2533] data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold"
            >
              <Settings className="w-4 h-4" />
              إعدادات المؤسسة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="students"><StudentsTab /></TabsContent>
          <TabsContent value="programs"><ProgramsTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
