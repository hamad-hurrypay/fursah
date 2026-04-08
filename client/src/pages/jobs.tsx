import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Building2, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const types = [
  { value: "الكل", label: "جميع الفرص" },
  { value: "عمل_جزئي", label: "عمل جزئي" },
  { value: "تدريب_تعاوني", label: "تدريب تعاوني" },
  { value: "تدريب_منتهي_بالتوظيف", label: "تدريب منتهي بالتوظيف" },
  { value: "وظيفة", label: "وظيفة كاملة" },
];

const typeLabels: Record<string, string> = {
  "عمل_جزئي": "عمل جزئي",
  "تدريب_تعاوني": "تدريب تعاوني",
  "تدريب_منتهي_بالتوظيف": "تدريب منتهي بالتوظيف",
  "وظيفة": "وظيفة",
};

export default function Jobs() {
  const { toast } = useToast();

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-jobs-title">فرص العمل</h1>
        </div>
        <p className="text-sm text-muted-foreground">استكشف فرص العمل والتدريب المتاحة</p>
      </div>

      <Tabs defaultValue="الكل">
        <TabsList className="flex-wrap h-auto gap-1">
          {types.map((t) => (
            <TabsTrigger key={t.value} value={t.value} data-testid={`tab-job-${t.value}`}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
        {types.map((type) => (
          <TabsContent key={type.value} value={type.value} className="mt-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => <Skeleton key={n} className="h-44 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {jobs
                  .filter((j) => type.value === "الكل" || j.type === type.value)
                  .map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-card-border" data-testid={`job-card-${job.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-[10px]">{job.category}</Badge>
                            <Badge variant="outline" className="text-[10px]">{typeLabels[job.type] || job.type}</Badge>
                          </div>
                          <h3 className="font-bold text-sm text-foreground mb-1">{job.title}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                            {job.salaryRange && (
                              <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />{job.salaryRange}</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => toast({ title: "تم التقديم", description: `تم التقديم على: ${job.title}` })}
                            data-testid={`apply-job-${job.id}`}
                          >
                            تقديم على الفرصة
                          </Button>
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
