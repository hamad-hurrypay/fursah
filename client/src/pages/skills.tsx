import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Target, ArrowLeft, Save, Star } from "lucide-react";
import { motion } from "framer-motion";

const skillCategories = [
  {
    name: "مهارات تقنية",
    skills: ["البرمجة", "تحليل البيانات", "تطوير الويب", "قواعد البيانات", "الأمن السيبراني"],
  },
  {
    name: "مهارات شخصية",
    skills: ["التواصل الفعّال", "العمل الجماعي", "إدارة الوقت", "حل المشكلات", "التفكير النقدي"],
  },
  {
    name: "مهارات قيادية",
    skills: ["اتخاذ القرارات", "التخطيط الاستراتيجي", "إدارة الفرق", "التفاوض", "إدارة الأزمات"],
  },
  {
    name: "مهارات تواصل",
    skills: ["العرض والتقديم", "الكتابة المهنية", "التواصل عبر الثقافات", "الاستماع الفعّال", "بناء العلاقات"],
  },
];

export default function SkillsAssessment() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const existingSkills: Record<string, number> = user?.skills ? (() => {
    try {
      const parsed = JSON.parse(user.skills);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
        const map: Record<string, number> = {};
        parsed.forEach((s: any) => { map[s.name] = s.level; });
        return map;
      }
      return {};
    } catch { return {}; }
  })() : {};

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    skillCategories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        init[skill] = existingSkills[skill] || 3;
      });
    });
    return init;
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const skills = Object.entries(ratings).map(([name, level]) => ({ name, level }));
      await apiRequest("PATCH", "/api/user/skills", { skills });
      await apiRequest("PATCH", "/api/user/stage", { currentStage: 3, completedStage: 2 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "تم حفظ تقييم المهارات بنجاح" });
    },
  });

  const levelLabels = ["", "مبتدئ", "أساسي", "متوسط", "متقدم", "خبير"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-skills-title">تحديد المهارات</h1>
        </div>
        <p className="text-sm text-muted-foreground">قيّم مستوى مهاراتك في كل مجال من ١ إلى ٥</p>
      </div>

      {skillCategories.map((cat, ci) => (
        <motion.div key={cat.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
          <Card className="border-card-border" data-testid={`skill-category-${ci}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {cat.skills.map((skill) => (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRatings((prev) => ({ ...prev, [skill]: n }))}
                          data-testid={`star-${skill}-${n}`}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              n <= ratings[skill] ? "fill-primary text-primary" : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-muted-foreground mr-2 w-12">
                        {levelLabels[ratings[skill]]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Summary radar - simple bar visual */}
      <Card className="border-card-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ملخص المهارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skillCategories.map((cat) => {
            const avg = cat.skills.reduce((sum, s) => sum + ratings[s], 0) / cat.skills.length;
            const pct = (avg / 5) * 100;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">{avg.toFixed(1)} / ٥</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="btn-save-skills">
          <Save className="w-4 h-4 ml-1" />
          {saveMutation.isPending ? "جاري الحفظ..." : "حفظ وانتقال للمرحلة التالية"}
        </Button>
      </div>
    </div>
  );
}
