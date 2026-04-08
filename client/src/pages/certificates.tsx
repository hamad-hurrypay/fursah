import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Award, Plus, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import type { Certificate } from "@shared/schema";

const categories = ["تقنية", "إدارة", "تصميم", "تسويق", "صحية", "لغات", "أخرى"];

export default function Certificates() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", issuer: "", dateObtained: "", category: "" });

  const { data: certs = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/certificates", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({ title: "تمت إضافة الشهادة بنجاح" });
      setForm({ title: "", issuer: "", dateObtained: "", category: "" });
      setOpen(false);
    },
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground" data-testid="text-certs-title">الشهادات الاحترافية</h1>
          </div>
          <p className="text-sm text-muted-foreground">تتبع شهاداتك المعتمدة وأضف شهادات جديدة</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="btn-add-cert">
              <Plus className="w-4 h-4 ml-1" />
              إضافة شهادة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>اسم الشهادة</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-cert-title" className="mt-1" />
              </div>
              <div>
                <Label>الجهة المانحة</Label>
                <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} data-testid="input-cert-issuer" className="mt-1" />
              </div>
              <div>
                <Label>تاريخ الحصول</Label>
                <Input type="date" value={form.dateObtained} onChange={(e) => setForm({ ...form, dateObtained: e.target.value })} data-testid="input-cert-date" className="mt-1" />
              </div>
              <div>
                <Label>التصنيف</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1" data-testid="select-cert-category">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending || !form.title || !form.issuer || !form.dateObtained || !form.category} className="w-full" data-testid="btn-save-cert">
                {addMutation.isPending ? "جاري الحفظ..." : "حفظ الشهادة"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {certs.length === 0 ? (
        <Card className="border-card-border">
          <CardContent className="p-12 text-center">
            <Award className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">لا توجد شهادات بعد</h3>
            <p className="text-sm text-muted-foreground">أضف شهاداتك المعتمدة لتعزيز سيرتك الذاتية</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-card-border" data-testid={`cert-card-${cert.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Award className="w-8 h-8 text-primary/80" />
                    <Badge variant="secondary" className="text-[10px]">{cert.category}</Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{cert.issuer}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="w-3 h-3" />
                    <span>{cert.dateObtained}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
