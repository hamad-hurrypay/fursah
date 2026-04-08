import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Save, Mail, Phone, User } from "lucide-react";
import JourneyTracker from "@/components/journey-tracker";
import { STAGES } from "@shared/schema";
import type { Certificate, UserCourse } from "@shared/schema";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const { data: userCourses = [] } = useQuery<UserCourse[]>({
    queryKey: ["/api/user-courses"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: certs = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/user/profile", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "تم تحديث الملف الشخصي بنجاح" });
    },
  });

  const completedStages: number[] = user?.completedStages ? JSON.parse(user.completedStages) : [];
  const currentStage = user?.currentStage || 1;

  const skills: { name: string; level: number }[] = user?.skills ? (() => {
    try { const p = JSON.parse(user.skills); return Array.isArray(p) ? p : []; } catch { return []; }
  })() : [];

  const aptitudeResult: { category: string; score: number }[] = user?.aptitudeResult ? (() => {
    try { return JSON.parse(user.aptitudeResult); } catch { return []; }
  })() : [];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <UserCircle className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground" data-testid="text-profile-title">الملف الشخصي</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">معلوماتي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{user?.fullName?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs flex items-center gap-1"><User className="w-3 h-3" /> الاسم الكامل</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} data-testid="input-profile-name" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> البريد الإلكتروني</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="input-profile-email" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> رقم الهاتف</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="input-profile-phone" className="mt-1" />
              </div>
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="w-full" data-testid="btn-save-profile">
                <Save className="w-4 h-4 ml-1" />
                {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats & Journey */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-card-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">رحلتي المهنية</CardTitle>
              </CardHeader>
              <CardContent>
                <JourneyTracker currentStage={currentStage} completedStages={completedStages} compact />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{completedStages.length}</p>
                    <p className="text-[10px] text-muted-foreground">مراحل مكتملة</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-chart-2">{userCourses.length}</p>
                    <p className="text-[10px] text-muted-foreground">دورات</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-chart-3">{certs.length}</p>
                    <p className="text-[10px] text-muted-foreground">شهادات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {aptitudeResult.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="border-card-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">نتيجة اختبار الميول</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {aptitudeResult.map((r, i) => (
                      <Badge key={i} variant={i === 0 ? "default" : "secondary"} data-testid={`aptitude-badge-${i}`}>
                        {r.category} ({r.score})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {skills.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-card-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">المهارات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.filter((s) => s.level >= 3).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]" data-testid={`skill-badge-${i}`}>
                        {s.name} ({s.level}/٥)
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
