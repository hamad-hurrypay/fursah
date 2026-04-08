import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Clock, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VolunteerOpp } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const cats = ["الكل", "تعليم", "بيئة", "مجتمع", "ثقافة", "تقنية", "صحة"];

export default function Volunteer() {
  const { toast } = useToast();

  const { data: opps = [], isLoading } = useQuery<VolunteerOpp[]>({
    queryKey: ["/api/volunteer"],
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-volunteer-title">الأعمال التطوعية</h1>
        </div>
        <p className="text-sm text-muted-foreground">اكتسب خبرة وساهم في مجتمعك من خلال العمل التطوعي</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "ساعاتي التطوعية", value: "٠" },
          { label: "الفرص المتاحة", value: String(opps.length) },
          { label: "التصنيفات", value: String(new Set(opps.map((o) => o.category)).size) },
        ].map((s, i) => (
          <Card key={i} className="border-card-border" data-testid={`volunteer-stat-${i}`}>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="الكل">
        <TabsList className="flex-wrap h-auto gap-1">
          {cats.map((c) => (
            <TabsTrigger key={c} value={c} data-testid={`tab-vol-${c}`}>{c}</TabsTrigger>
          ))}
        </TabsList>
        {cats.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => <Skeleton key={n} className="h-40 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {opps
                  .filter((o) => cat === "الكل" || o.category === cat)
                  .map((opp, i) => (
                    <motion.div key={opp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-card-border" data-testid={`vol-card-${opp.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-[10px]">{opp.category}</Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />{opp.hours} ساعة
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-foreground mb-1">{opp.title}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{opp.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{opp.organization}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.location}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: "تم التقديم", description: `تم التقديم على: ${opp.title}` })}
                              data-testid={`apply-vol-${opp.id}`}
                            >
                              تقديم
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
