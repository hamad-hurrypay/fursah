import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, BookOpen, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ====================================================
// RIASEC Model — نموذج هولاند للميول المهنية
// R = Realistic (واقعي)  I = Investigative (تحليلي)
// A = Artistic (إبداعي)  S = Social (اجتماعي)
// E = Enterprising (ريادي)  C = Conventional (تنظيمي)
// ====================================================

type RiasecType = "R" | "I" | "A" | "S" | "E" | "C";

const RIASEC_INFO: Record<RiasecType, {
  label: string;
  color: string;
  bg: string;
  desc: string;
  careers: string[];
  courses: { title: string; provider: string; url: string }[];
}> = {
  R: {
    label: "الواقعي",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    desc: "تحب العمل اليدوي والتقني، وتميل للأنشطة العملية والميكانيكية وبناء الأشياء.",
    careers: ["مهندس ميكانيكي", "مهندس كهربائي", "تقني شبكات", "مهندس مدني", "فني طبي"],
    courses: [
      { title: "هندسة الشبكات والبنية التحتية", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Engineering & Technology", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/science-engineering-and-maths-courses/engineering" },
    ],
  },
  I: {
    label: "التحليلي",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    desc: "تحب البحث والتحليل وحل المشكلات المعقدة، وتميل للعلوم والتفكير المنطقي.",
    careers: ["عالم بيانات", "باحث", "مبرمج", "محلل أنظمة", "طبيب", "صيدلاني"],
    courses: [
      { title: "تحليل البيانات والذكاء الاصطناعي", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Data Science & AI", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/it-and-computer-science-courses/data-science" },
      { title: "دورات العلوم والتحليل", provider: "Classperts", url: "https://classperts.com" },
    ],
  },
  A: {
    label: "الإبداعي",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    desc: "تحب التعبير الإبداعي والفن والتصميم، وتميل لبيئات العمل الحرة وغير الروتينية.",
    careers: ["مصمم جرافيك", "مصور", "كاتب محتوى", "مخرج", "معمار", "مطور UI/UX"],
    courses: [
      { title: "تصميم الجرافيك والهوية البصرية", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Creative Arts & Media", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/creative-arts-and-media-courses" },
    ],
  },
  S: {
    label: "الاجتماعي",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    desc: "تحب العمل مع الناس ومساعدتهم وتعليمهم، وتميل للتواصل والتأثير الإيجابي.",
    careers: ["معلم", "مستشار مهني", "أخصائي موارد بشرية", "طبيب نفسي", "مدير مجتمع"],
    courses: [
      { title: "الموارد البشرية وإدارة المواهب", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Education & Teaching", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/education-courses" },
      { title: "دورات التواصل والقيادة", provider: "Classperts", url: "https://classperts.com" },
    ],
  },
  E: {
    label: "الريادي",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    desc: "تحب القيادة وإقناع الآخرين وإدارة المشاريع، وتميل للمخاطرة المحسوبة وريادة الأعمال.",
    careers: ["رائد أعمال", "مدير تنفيذي", "مدير مبيعات", "محامٍ", "مستشار أعمال"],
    courses: [
      { title: "ريادة الأعمال وإدارة المشاريع", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Business & Management", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/business-and-management-courses" },
    ],
  },
  C: {
    label: "التنظيمي",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    desc: "تحب النظام والدقة والعمل وفق أنظمة وإجراءات واضحة، وتميل للتفاصيل والبيانات.",
    careers: ["محاسب", "مدير مالي", "مدقق حسابات", "مدير إداري", "محلل أعمال"],
    courses: [
      { title: "المحاسبة والمالية للأعمال", provider: "كن للتدريب", url: "https://betraining.com.sa/ar" },
      { title: "Accounting & Finance", provider: "FutureLearn", url: "https://www.futurelearn.com/subjects/business-and-management-courses/accounting-finance" },
    ],
  },
};

// 48 سؤالاً — 8 لكل نوع من أنواع RIASEC الستة
// كل سؤال: هل تحب هذا النشاط؟ (مقياس 1-5)
const QUESTIONS: { text: string; type: RiasecType }[] = [
  // Realistic — واقعي
  { text: "إصلاح الأجهزة الكهربائية أو الميكانيكية", type: "R" },
  { text: "العمل في الخارج وممارسة الأنشطة البدنية", type: "R" },
  { text: "استخدام الأدوات والمعدات اليدوية في بناء شيء", type: "R" },
  { text: "العمل على المركبات أو الآلات الصناعية", type: "R" },
  { text: "تجميع وتركيب الأجهزة والمعدات", type: "R" },
  { text: "تشغيل المعدات التقنية والآلات الثقيلة", type: "R" },
  { text: "العمل في مشاريع البناء والإنشاء", type: "R" },
  { text: "فحص وصيانة الأنظمة التقنية", type: "R" },

  // Investigative — تحليلي
  { text: "إجراء البحوث العلمية والتجارب المختبرية", type: "I" },
  { text: "تحليل البيانات والإحصاءات المعقدة", type: "I" },
  { text: "قراءة المقالات العلمية والأبحاث الأكاديمية", type: "I" },
  { text: "البحث عن إجابات لأسئلة علمية معقدة", type: "I" },
  { text: "تطوير نظريات ونماذج لتفسير الظواهر", type: "I" },
  { text: "حل المسائل الرياضية والمنطقية الصعبة", type: "I" },
  { text: "دراسة كيفية عمل الأنظمة المعقدة", type: "I" },
  { text: "كتابة التقارير التحليلية والدراسات المعمقة", type: "I" },

  // Artistic — إبداعي
  { text: "رسم أو تصوير الأعمال الفنية", type: "A" },
  { text: "كتابة القصص أو المقالات أو الشعر", type: "A" },
  { text: "تصميم الملصقات والهويات البصرية", type: "A" },
  { text: "العزف الموسيقي أو الغناء أو التمثيل", type: "A" },
  { text: "تصميم مواقع الإنترنت أو تطبيقات بصرية جميلة", type: "A" },
  { text: "الإخراج الفني أو إنتاج الفيديو والمحتوى الإبداعي", type: "A" },
  { text: "تصميم الأزياء أو الديكور الداخلي", type: "A" },
  { text: "ابتكار أفكار إبداعية وغير تقليدية", type: "A" },

  // Social — اجتماعي
  { text: "تدريس وشرح المفاهيم الصعبة للآخرين", type: "S" },
  { text: "مساعدة الأشخاص في حل مشكلاتهم الشخصية", type: "S" },
  { text: "العمل التطوعي وخدمة المجتمع", type: "S" },
  { text: "تقديم الدعم النفسي والعاطفي للمحتاجين", type: "S" },
  { text: "التنسيق بين الفرق والعمل الجماعي", type: "S" },
  { text: "تنظيم الفعاليات والأنشطة الاجتماعية", type: "S" },
  { text: "التواصل مع أشخاص من ثقافات مختلفة", type: "S" },
  { text: "الإرشاد المهني ومساعدة الآخرين في مساراتهم", type: "S" },

  // Enterprising — ريادي
  { text: "إدارة فريق وتوجيه الآخرين نحو الهدف", type: "E" },
  { text: "التفاوض وإقناع الآخرين بأفكار وخطط", type: "E" },
  { text: "تأسيس مشاريع وشركات جديدة", type: "E" },
  { text: "البيع والتسويق للمنتجات والخدمات", type: "E" },
  { text: "اتخاذ قرارات مهمة تؤثر على المنظمة", type: "E" },
  { text: "وضع الاستراتيجيات وخطط العمل طويلة المدى", type: "E" },
  { text: "المشاركة في المنافسات وتحديات الأعمال", type: "E" },
  { text: "قيادة الاجتماعات وتقديم العروض التقديمية", type: "E" },

  // Conventional — تنظيمي
  { text: "تنظيم الملفات والبيانات بشكل منهجي ودقيق", type: "C" },
  { text: "العمل وفق إجراءات وأنظمة واضحة ومحددة", type: "C" },
  { text: "إدارة الحسابات والمعاملات المالية", type: "C" },
  { text: "التدقيق في التفاصيل والتحقق من دقة البيانات", type: "C" },
  { text: "إعداد التقارير الإدارية والمالية الدورية", type: "C" },
  { text: "متابعة الجداول الزمنية والمواعيد النهائية", type: "C" },
  { text: "إدخال البيانات وتحديث قواعد المعلومات", type: "C" },
  { text: "التخطيط للميزانيات وضبط التكاليف", type: "C" },
];

const SCALE = [
  { value: 1, label: "لا أحبه أبداً" },
  { value: 2, label: "لا أحبه كثيراً" },
  { value: 3, label: "محايد" },
  { value: 4, label: "أحبه" },
  { value: 5, label: "أحبه كثيراً" },
];

export default function AptitudeTest() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const existingResult = user?.aptitudeResult ? JSON.parse(user.aptitudeResult) : null;

  const saveMutation = useMutation({
    mutationFn: async (result: any) => {
      await apiRequest("PATCH", "/api/user/aptitude", { result });
      await apiRequest("PATCH", "/api/user/stage", { currentStage: 2, completedStage: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "تم حفظ نتائج الاختبار بنجاح" });
    },
  });

  const calcResults = (ans: number[]) => {
    const scores: Record<RiasecType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    ans.forEach((val, idx) => { scores[QUESTIONS[idx].type] += val; });
    return (Object.entries(scores) as [RiasecType, number][])
      .sort((a, b) => b[1] - a[1]);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const sorted = calcResults(newAnswers);
      saveMutation.mutate(sorted.map(([type, score]) => ({ type, score })));
      setShowResults(true);
    }
  };

  // Existing result display
  const displayResults: [RiasecType, number][] | null = showResults
    ? calcResults(answers)
    : existingResult
    ? existingResult.map((r: any) => [r.type as RiasecType, r.score as number])
    : null;

  // ---- RESULTS PAGE ----
  if (displayResults) {
    const top3 = displayResults.slice(0, 3);
    const maxScore = 8 * 5; // 8 questions × max 5
    const hollandCode = top3.map(([t]) => t).join("");

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">نتائج اختبار الميول المهنية</h1>
          <p className="text-sm text-muted-foreground mt-1">
            كودك المهني (Holland Code):
            <span className="font-bold text-primary mx-1">{hollandCode}</span>
          </p>
        </div>

        {/* Top 3 types */}
        <div className="space-y-3">
          {top3.map(([type, score], i) => {
            const info = RIASEC_INFO[type];
            return (
              <motion.div key={type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                <Card className={`border ${info.bg}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-muted"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-base ${info.color}`}>{info.label}</h3>
                          <Badge variant={i === 0 ? "default" : "secondary"} className="text-xs">
                            {Math.round((score / maxScore) * 100)}٪
                          </Badge>
                        </div>
                        <Progress value={(score / maxScore) * 100} className="h-1.5 mt-1" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{info.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {info.careers.slice(0, 4).map((c) => (
                        <span key={c} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{c}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recommended courses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                دورات موصى بها بناءً على ميولك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {top3.slice(0, 2).flatMap(([type]) => RIASEC_INFO[type].courses).slice(0, 4).map((course, i) => (
                <a
                  key={i}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.provider}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {!existingResult && (
            <Button variant="outline" onClick={() => { setCurrentQ(0); setAnswers([]); setShowResults(false); setSelected(null); }}>
              إعادة الاختبار
            </Button>
          )}
          <Button onClick={() => setLocation("/skills")}>
            المرحلة التالية: تحديد المهارات
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>
    );
  }

  // ---- TEST PAGE ----
  const progress = (currentQ / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">اختبار الميول المهنية — RIASEC</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          48 سؤالاً — حدد مدى إعجابك بكل نشاط على مقياس من 1 إلى 5
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
          {currentQ + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {RIASEC_INFO[question.type].label}
                </Badge>
              </div>
              <CardTitle className="text-base leading-relaxed">
                هل تحب: <span className="text-primary">{question.text}</span>؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {SCALE.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelected(s.value)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                      selected === s.value
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <span className={`text-xl font-bold ${selected === s.value ? "text-primary" : "text-muted-foreground"}`}>
                      {s.value}
                    </span>
                    <span className="text-[10px] text-center text-muted-foreground leading-tight hidden sm:block">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                <span>لا أحبه أبداً</span>
                <span>أحبه كثيراً</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentQ === 0}
          onClick={() => {
            setCurrentQ(currentQ - 1);
            setAnswers(answers.slice(0, -1));
            setSelected(answers[currentQ - 1] ?? null);
          }}
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          السابق
        </Button>

        <Button
          disabled={selected === null}
          onClick={handleNext}
          className="px-8"
        >
          {currentQ === QUESTIONS.length - 1 ? "عرض النتائج" : "التالي"}
          {currentQ < QUESTIONS.length - 1 && <ArrowLeft className="w-4 h-4 mr-1" />}
        </Button>
      </div>
    </div>
  );
}
