import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Clock, Building2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { TrainingProgram } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const programTypes = ["الكل", "تمهير", "مهارات", "هدف", "مسك"];

const programColors: Record<string, string> = {
  "تمهير": "bg-blue-100 text-blue-700",
  "مهارات": "bg-emerald-100 text-emerald-700",
  "هدف": "bg-purple-100 text-purple-700",
  "مسك": "bg-amber-100 text-amber-700",
};

export default function Training() {
  const { toast } = useToast();

  const { data: programs = [], isLoading } = useQuery<TrainingProgram[]>({
    queryKey: ["/api/training-programs"],
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-training-title">البرامج التدريبية</h1>
        </div>
        <p className="text-sm text-muted-foreground">برامج تدريبية مرتبطة بالبرامج الوطنية الرائدة</p>
      </div>

      {/* National Programs Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["تمهير", "مهارات", "هدف", "مسك"].map((p) => (
          <Card key={p} className="border-card-border" data-testid={`program-badge-${p}`}>
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${programColors[p]}`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{p}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{programs.filter((pr) => pr.linkedProgram === p).length} برامج</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="الكل">
        <TabsList className="flex-wrap h-auto gap-1">
          {programTypes.map((t) => (
            <TabsTrigger key={t} value={t} data-testid={`tab-training-${t}`}>{t}</TabsTrigger>
          ))}
        </TabsList>
        {programTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3].map((n) => <Skeleton key={n} className="h-44 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {programs
                  .filter((p) => type === "الكل" || p.linkedProgram === type)
                  .map((prog, i) => (
                    <motion.div key={prog.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-card-border" data-testid={`training-card-${prog.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            {prog.linkedProgram && (
                              <Badge className={`text-[10px] ${programColors[prog.linkedProgram] || ""}`}>{prog.linkedProgram}</Badge>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />{prog.duration}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-foreground mb-1">{prog.title}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{prog.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="w-3 h-3" />{prog.provider}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: "سيتم توجيهك", description: `تقديم على: ${prog.title}` })}
                              data-testid={`apply-training-${prog.id}`}
                            >
                              <ExternalLink className="w-3 h-3 ml-1" />
                              التفاصيل
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
