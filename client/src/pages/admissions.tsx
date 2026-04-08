import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, MapPin, Clock, ExternalLink, Search, Globe, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// ─── Data ──────────────────────────────────────────────────────────────────

const diplomas = [
  { id: 1, title: "دبلوم تقنية المعلومات", institution: "الكلية التقنية", duration: "سنتان", status: "متاح" },
  { id: 2, title: "دبلوم إدارة الأعمال", institution: "الكلية التقنية", duration: "سنتان", status: "متاح" },
  { id: 3, title: "دبلوم الصحة والسلامة", institution: "كلية تطبيقية", duration: "سنة", status: "متاح" },
  { id: 4, title: "دبلوم التصميم الجرافيكي", institution: "كلية تطبيقية", duration: "سنتان", status: "محدود" },
  { id: 5, title: "دبلوم المحاسبة", institution: "الكلية التقنية", duration: "سنتان", status: "متاح" },
  { id: 6, title: "دبلوم الشبكات والاتصالات", institution: "كلية تطبيقية", duration: "سنتان", status: "متاح" },
];

const localUniversities = [
  { id: 1, name: "جامعة الملك سعود", city: "الرياض", majors: 142 },
  { id: 2, name: "جامعة الملك عبدالعزيز", city: "جدة", majors: 128 },
  { id: 3, name: "جامعة الملك فهد للبترول", city: "الظهران", majors: 64 },
  { id: 4, name: "جامعة الإمام محمد بن سعود", city: "الرياض", majors: 116 },
  { id: 5, name: "جامعة الأميرة نورة", city: "الرياض", majors: 88 },
  { id: 6, name: "جامعة الملك خالد", city: "أبها", majors: 97 },
  { id: 7, name: "جامعة القصيم", city: "القصيم", majors: 73 },
  { id: 8, name: "جامعة طيبة", city: "المدينة المنورة", majors: 81 },
];

const internationalUniversities = [
  { id: 1, name: "University of London", country: "المملكة المتحدة", field: "Online Degrees", flag: "🇬🇧" },
  { id: 2, name: "Coventry University", country: "المملكة المتحدة", field: "Business & Tech", flag: "🇬🇧" },
  { id: 3, name: "Deakin University", country: "أستراليا", field: "Education", flag: "🇦🇺" },
  { id: 4, name: "Griffith University", country: "أستراليا", field: "Health", flag: "🇦🇺" },
  { id: 5, name: "RMIT University", country: "أستراليا", field: "Design", flag: "🇦🇺" },
  { id: 6, name: "University of Leeds", country: "المملكة المتحدة", field: "Engineering", flag: "🇬🇧" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function GoldNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#C9A44B]/40 bg-[#C9A44B]/5 px-4 py-3 text-sm text-[#C9A44B]">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

// ─── Tab 1: Diplomas ────────────────────────────────────────────────────────

function DiplomasTab() {
  const [query, setQuery] = useState("");
  const filtered = diplomas.filter(
    (d) =>
      d.title.includes(query) ||
      d.institution.includes(query)
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          dir="rtl"
          placeholder="ابحث عن برنامج أو كلية..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d, i) => (
          <motion.div
            key={d.id}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-card-border h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground leading-snug flex-1">
                    {d.title}
                  </h3>
                  <Badge
                    variant={d.status === "محدود" ? "destructive" : "secondary"}
                    className="shrink-0 text-[10px]"
                  >
                    {d.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {d.institution}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {d.duration}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-auto w-full"
                  onClick={() =>
                    window.open("https://admission.gov.sa", "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="ml-2 h-3 w-3" />
                  تقدم الآن
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <GoldNotice>
        التقديم يتم عبر بوابة القبول الموحد — فرصتي ترشدك فقط
      </GoldNotice>
    </div>
  );
}

// ─── Tab 2: Local Universities ───────────────────────────────────────────────

function LocalUniversitiesTab() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {localUniversities.map((u, i) => (
          <motion.div
            key={u.id}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-card-border h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-1">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm text-foreground leading-snug">{u.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {u.city}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{u.majors}</span> تخصص
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-auto w-full"
                  onClick={() =>
                    window.open("https://admission.gov.sa", "_blank", "noopener,noreferrer")
                  }
                >
                  استكشف التخصصات
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <GoldNotice>
        للتقديم توجه لبوابة القبول الموحد — edu.sa
      </GoldNotice>
    </div>
  );
}

// ─── Tab 3: International Universities ──────────────────────────────────────

function InternationalTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        ادرس في أفضل جامعات العالم أونلاين بشهادات معتمدة
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {internationalUniversities.map((u, i) => (
          <motion.div
            key={u.id}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.06 }}
          >
            <Card className="border-card-border h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{u.flag}</span>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    FutureLearn Partner
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-foreground leading-snug">{u.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  {u.country}
                </div>
                <Badge variant="outline" className="text-[10px] w-fit">
                  {u.field}
                </Badge>
                <Button
                  size="sm"
                  className="mt-auto w-full"
                  onClick={() =>
                    window.open("https://www.futurelearn.com", "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="ml-2 h-3 w-3" />
                  استكشف
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <GoldNotice>
        بالشراكة مع FutureLearn — الدرجات العلمية الدولية المعتمدة
      </GoldNotice>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Admissions() {
  return (
    <div dir="rtl" className="max-w-5xl space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="initial" animate="animate">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">فرص القبول الأكاديمي</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          نرشدك لأفضل المسارات الأكاديمية المناسبة لك — دون التعارض مع القبول الموحد لوزارة التعليم
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="diplomas" dir="rtl">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="diplomas">الكليات التطبيقية والدبلومات</TabsTrigger>
          <TabsTrigger value="local">الجامعات المحلية</TabsTrigger>
          <TabsTrigger value="international">الجامعات الدولية</TabsTrigger>
        </TabsList>

        <TabsContent value="diplomas" className="mt-5">
          <DiplomasTab />
        </TabsContent>

        <TabsContent value="local" className="mt-5">
          <LocalUniversitiesTab />
        </TabsContent>

        <TabsContent value="international" className="mt-5">
          <InternationalTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
