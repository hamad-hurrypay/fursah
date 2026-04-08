import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, GraduationCap, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Course, UserCourse } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const cats = ["الكل", "تقنية", "إدارة", "تصميم", "تسويق", "صحية"];

export default function Courses() {
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: userCourses = [] } = useQuery<UserCourse[]>({
    queryKey: ["/api/user-courses"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("POST", "/api/user-courses", { courseId, status: "in_progress", progress: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses"] });
      toast({ title: "تم التسجيل في الدورة بنجاح" });
    },
  });

  const enrolledIds = new Set(userCourses.map((uc) => uc.courseId));

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground" data-testid="text-courses-title">الدورات التدريبية</h1>
        </div>
        <p className="text-sm text-muted-foreground">طوّر مهاراتك من خلال دورات متخصصة من أفضل المنصات</p>
      </div>

      <Tabs defaultValue="الكل">
        <TabsList className="flex-wrap h-auto gap-1">
          {cats.map((c) => (
            <TabsTrigger key={c} value={c} data-testid={`tab-${c}`}>{c}</TabsTrigger>
          ))}
          <TabsTrigger value="enrolled" data-testid="tab-enrolled">دوراتي ({userCourses.length})</TabsTrigger>
        </TabsList>

        {cats.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => <Skeleton key={n} className="h-48 rounded-lg" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses
                  .filter((c) => cat === "الكل" || c.category === cat)
                  .map((course, i) => (
                    <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="border-card-border h-full flex flex-col" data-testid={`course-card-${course.id}`}>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                            <Badge variant="outline" className="text-[10px]">{course.level}</Badge>
                          </div>
                          <h3 className="font-bold text-sm text-foreground mb-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{course.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{course.provider}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                          </div>
                          {enrolledIds.has(course.id) ? (
                            <Button size="sm" variant="secondary" disabled className="w-full" data-testid={`enrolled-${course.id}`}>
                              <Play className="w-3 h-3 ml-1" />
                              مسجّل
                            </Button>
                          ) : (
                            <Button size="sm" className="w-full" onClick={() => enrollMutation.mutate(course.id)} disabled={enrollMutation.isPending} data-testid={`enroll-${course.id}`}>
                              التسجيل في الدورة
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="enrolled" className="mt-4">
          {userCourses.length === 0 ? (
            <Card className="border-card-border">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">لم تسجل في أي دورة بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userCourses.map((uc) => {
                const course = courses.find((c) => c.id === uc.courseId);
                if (!course) return null;
                return (
                  <Card key={uc.id} className="border-card-border" data-testid={`my-course-${uc.id}`}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm text-foreground mb-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{course.provider}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={uc.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{uc.progress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
