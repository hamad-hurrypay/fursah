import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JourneyTracker from "@/components/journey-tracker";
import { STAGES } from "@shared/schema";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import {
  BookOpen, Award, Heart, Briefcase, ArrowLeft, Rocket, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { UserCourse, Certificate } from "@shared/schema";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = useAuth();

  // Seed data on first load
  useEffect(() => {
    apiRequest("POST", "/api/seed").catch(() => {});
  }, []);

  const { data: userCourses = [] } = useQuery<UserCourse[]>({
    queryKey: ["/api/user-courses"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: certs = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const completedStages: number[] = user?.completedStages ? JSON.parse(user.completedStages) : [];
  const currentStage = user?.currentStage || 1;
  const stageInfo = STAGES.find((s) => s.id === currentStage);

  const stageRoutes: Record<number, string> = {
    1: "/aptitude", 2: "/skills", 3: "/courses", 4: "/certificates",
    5: "/volunteer", 6: "/jobs", 7: "/jobs", 8: "/jobs", 9: "/jobs",
  };

  const stats = [
    { icon: Sparkles, label: "المراحل المكتملة", value: `${completedStages.length} / ٩`, color: "text-primary" },
    { icon: BookOpen, label: "الدورات المسجلة", value: String(userCourses.length || 0), color: "text-chart-2" },
    { icon: Award, label: "الشهادات المكتسبة", value: String(certs.length || 0), color: "text-chart-3" },
    { icon: Heart, label: "ساعات التطوع", value: "٠", color: "text-chart-4" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-welcome">
              مرحباً، {user?.fullName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">تابع رحلتك المهنية من هنا</p>
          </div>
          <Badge variant="secondary" className="text-xs" data-testid="badge-stage">
            المرحلة {currentStage} من ٩
          </Badge>
        </div>
      </motion.div>

      {/* Journey Tracker */}
      <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: 0.1 } } }}>
        <Card className="border-card-border">
          <CardContent className="p-5">
            <JourneyTracker currentStage={currentStage} completedStages={completedStages} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Stage */}
      <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: 0.15 } } }}>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">المرحلة الحالية: {stageInfo?.name}</h3>
                  <p className="text-sm text-muted-foreground">{stageInfo?.description}</p>
                </div>
              </div>
              <Link href={stageRoutes[currentStage] || "/dashboard"}>
                <Button size="sm" data-testid="btn-current-stage">
                  ابدأ الآن
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: 0.2 + i * 0.05 } } }}>
            <Card className="border-card-border" data-testid={`stat-card-${i}`}>
              <CardContent className="p-4 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <motion.div initial="hidden" animate="visible" variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: 0.35 } } }}>
        <Card className="border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "اختبار الميول", href: "/aptitude", icon: "🧭" },
                { label: "تصفح الدورات", href: "/courses", icon: "📚" },
                { label: "فرص العمل", href: "/jobs", icon: "💼" },
                { label: "السيرة الذاتية", href: "/cv-builder", icon: "📄" },
              ].map((q) => (
                <Link key={q.href} href={q.href}>
                  <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1" data-testid={`quick-${q.href.slice(1)}`}>
                    <span className="text-lg">{q.icon}</span>
                    <span className="text-xs">{q.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
