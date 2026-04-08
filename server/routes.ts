import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, db } from "./storage";
import { setupAuth } from "./auth";
import { courses, volunteerOpps, jobs, trainingPrograms } from "@shared/schema";

function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "غير مسجل الدخول" });
    return false;
  }
  return true;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Courses
  app.get("/api/courses", async (_req, res) => {
    const data = await storage.getCourses();
    res.json(data);
  });

  app.get("/api/courses/:category", async (req, res) => {
    const data = await storage.getCoursesByCategory(req.params.category);
    res.json(data);
  });

  // User Courses
  app.get("/api/user-courses", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.getUserCourses(req.user!.id);
    res.json(data);
  });

  app.post("/api/user-courses", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.enrollCourse({ ...req.body, userId: req.user!.id });
    res.status(201).json(data);
  });

  app.patch("/api/user-courses/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.updateCourseProgress(
      parseInt(req.params.id),
      req.body.progress,
      req.body.status
    );
    res.json(data);
  });

  // Certificates
  app.get("/api/certificates", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.getCertificates(req.user!.id);
    res.json(data);
  });

  app.post("/api/certificates", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.addCertificate({ ...req.body, userId: req.user!.id });
    res.status(201).json(data);
  });

  // Volunteer
  app.get("/api/volunteer", async (_req, res) => {
    const data = await storage.getVolunteerOpps();
    res.json(data);
  });

  app.get("/api/volunteer/:category", async (req, res) => {
    const data = await storage.getVolunteerOppsByCategory(req.params.category);
    res.json(data);
  });

  // Jobs
  app.get("/api/jobs", async (_req, res) => {
    const data = await storage.getJobs();
    res.json(data);
  });

  app.get("/api/jobs/:type", async (req, res) => {
    const data = await storage.getJobsByType(req.params.type);
    res.json(data);
  });

  // Training Programs
  app.get("/api/training-programs", async (_req, res) => {
    const data = await storage.getTrainingPrograms();
    res.json(data);
  });

  app.get("/api/training-programs/:type", async (req, res) => {
    const data = await storage.getTrainingProgramsByType(req.params.type);
    res.json(data);
  });

  // User profile updates
  app.patch("/api/user/profile", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.updateUser(req.user!.id, {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
    });
    if (data) {
      const { password, ...safeUser } = data;
      res.json(safeUser);
    }
  });

  app.patch("/api/user/stage", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const user = req.user!;
    const completedStages = JSON.parse(user.completedStages || "[]");
    if (!completedStages.includes(req.body.completedStage)) {
      completedStages.push(req.body.completedStage);
    }
    const data = await storage.updateUser(user.id, {
      currentStage: req.body.currentStage,
      completedStages: JSON.stringify(completedStages),
    });
    if (data) {
      const { password, ...safeUser } = data;
      res.json(safeUser);
    }
  });

  app.patch("/api/user/aptitude", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.updateUser(req.user!.id, {
      aptitudeResult: JSON.stringify(req.body.result),
    });
    if (data) {
      const { password, ...safeUser } = data;
      res.json(safeUser);
    }
  });

  app.patch("/api/user/skills", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.updateUser(req.user!.id, {
      skills: JSON.stringify(req.body.skills),
    });
    if (data) {
      const { password, ...safeUser } = data;
      res.json(safeUser);
    }
  });

  app.patch("/api/user/cv", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const data = await storage.updateUser(req.user!.id, {
      cvData: JSON.stringify(req.body.cvData),
    });
    if (data) {
      const { password, ...safeUser } = data;
      res.json(safeUser);
    }
  });

  // Seed data
  app.post("/api/seed", async (_req, res) => {
    const existingCourses = await storage.getCourses();
    if (existingCourses.length > 0) {
      return res.json({ message: "البيانات موجودة بالفعل" });
    }

    // Seed courses
    const coursesData = [
      { title: "أساسيات البرمجة بلغة بايثون", description: "تعلم البرمجة من الصفر باستخدام لغة بايثون", provider: "رواق", duration: "٨ أسابيع", category: "تقنية", level: "مبتدئ", stageRequired: 3 },
      { title: "تطوير تطبيقات الويب", description: "تعلم تطوير مواقع الويب الحديثة باستخدام أحدث التقنيات", provider: "إدراك", duration: "١٢ أسبوع", category: "تقنية", level: "متوسط", stageRequired: 3 },
      { title: "الذكاء الاصطناعي والتعلم الآلي", description: "مدخل إلى عالم الذكاء الاصطناعي وتطبيقاته", provider: "كورسيرا", duration: "١٠ أسابيع", category: "تقنية", level: "متقدم", stageRequired: 3 },
      { title: "إدارة المشاريع الاحترافية PMP", description: "التحضير لشهادة PMP في إدارة المشاريع", provider: "مهارات", duration: "٦ أسابيع", category: "إدارة", level: "متقدم", stageRequired: 3 },
      { title: "أساسيات إدارة الأعمال", description: "مقدمة شاملة في مبادئ إدارة الأعمال الحديثة", provider: "دروب", duration: "٤ أسابيع", category: "إدارة", level: "مبتدئ", stageRequired: 3 },
      { title: "القيادة والتأثير", description: "تطوير مهارات القيادة والتأثير في بيئة العمل", provider: "هدف", duration: "٣ أسابيع", category: "إدارة", level: "متوسط", stageRequired: 3 },
      { title: "التصميم الجرافيكي باستخدام أدوبي", description: "احتراف أدوات التصميم فوتوشوب وإليستريتور", provider: "يوديمي", duration: "٨ أسابيع", category: "تصميم", level: "مبتدئ", stageRequired: 3 },
      { title: "تصميم تجربة المستخدم UX", description: "أساسيات تصميم تجربة المستخدم وواجهات الاستخدام", provider: "جوجل", duration: "٦ أسابيع", category: "تصميم", level: "متوسط", stageRequired: 3 },
      { title: "التسويق الرقمي المتكامل", description: "استراتيجيات التسويق الرقمي عبر المنصات المختلفة", provider: "دروب", duration: "٥ أسابيع", category: "تسويق", level: "مبتدئ", stageRequired: 3 },
      { title: "إدارة حملات التواصل الاجتماعي", description: "تعلم إدارة وتحليل حملات وسائل التواصل الاجتماعي", provider: "مهارات", duration: "٤ أسابيع", category: "تسويق", level: "متوسط", stageRequired: 3 },
      { title: "الإسعافات الأولية والسلامة", description: "دورة شاملة في الإسعافات الأولية والسلامة المهنية", provider: "الهلال الأحمر", duration: "أسبوعين", category: "صحية", level: "مبتدئ", stageRequired: 3 },
      { title: "إدارة المرافق الصحية", description: "تعلم أساسيات إدارة المستشفيات والمرافق الصحية", provider: "وزارة الصحة", duration: "٨ أسابيع", category: "صحية", level: "متقدم", stageRequired: 3 },
      { title: "تحليل البيانات باستخدام Excel", description: "إتقان تحليل البيانات والتقارير باستخدام إكسل", provider: "لينكد إن", duration: "٣ أسابيع", category: "تقنية", level: "مبتدئ", stageRequired: 3 },
    ];
    for (const c of coursesData) {
      db.insert(courses).values(c).run();
    }

    // Seed volunteer opps
    const volunteerData = [
      { title: "تعليم الأطفال القراءة", organization: "جمعية خيركم", description: "المشاركة في برنامج تعليم القراءة للأطفال", location: "الرياض", hours: 20, category: "تعليم" },
      { title: "حملة تنظيف الشواطئ", organization: "جمعية البيئة", description: "المشاركة في تنظيف شواطئ المنطقة الشرقية", location: "الدمام", hours: 8, category: "بيئة" },
      { title: "مساعدة كبار السن", organization: "جمعية رعاية", description: "تقديم الدعم والمساعدة لكبار السن في دور الرعاية", location: "جدة", hours: 15, category: "مجتمع" },
      { title: "تنظيم فعاليات ثقافية", organization: "هيئة الثقافة", description: "المساعدة في تنظيم المعارض والفعاليات الثقافية", location: "الرياض", hours: 12, category: "ثقافة" },
      { title: "دعم تقني للمنظمات غير الربحية", organization: "مؤسسة التقنية", description: "تقديم الدعم التقني والحلول الرقمية للجمعيات", location: "عن بعد", hours: 25, category: "تقنية" },
      { title: "توزيع السلال الغذائية", organization: "بنك الطعام", description: "المشاركة في توزيع السلال الغذائية للأسر المحتاجة", location: "مكة", hours: 10, category: "مجتمع" },
      { title: "إرشاد سياحي تطوعي", organization: "هيئة السياحة", description: "العمل كمرشد سياحي تطوعي في المواقع التراثية", location: "المدينة", hours: 18, category: "ثقافة" },
      { title: "حملة التوعية الصحية", organization: "وزارة الصحة", description: "المشاركة في حملات التوعية الصحية في المدارس", location: "الرياض", hours: 14, category: "صحة" },
    ];
    for (const v of volunteerData) {
      db.insert(volunteerOpps).values(v).run();
    }

    // Seed jobs
    const jobsData = [
      { title: "مطور واجهات أمامية", company: "شركة تقنية ناشئة", description: "تطوير واجهات تطبيقات الويب باستخدام React", location: "الرياض", type: "عمل_جزئي", salaryRange: "٣,٠٠٠ - ٥,٠٠٠ ريال", category: "تقنية" },
      { title: "مصمم جرافيك", company: "وكالة إبداعية", description: "تصميم مواد تسويقية وهوية بصرية للعملاء", location: "جدة", type: "عمل_جزئي", salaryRange: "٢,٥٠٠ - ٤,٠٠٠ ريال", category: "تصميم" },
      { title: "متدرب تعاوني - تطوير برمجيات", company: "أرامكو", description: "فرصة تدريب تعاوني في قسم تطوير البرمجيات", location: "الظهران", type: "تدريب_تعاوني", salaryRange: "٣,٠٠٠ ريال", category: "تقنية" },
      { title: "متدرب تعاوني - موارد بشرية", company: "سابك", description: "تدريب في قسم الموارد البشرية والتطوير التنظيمي", location: "الرياض", type: "تدريب_تعاوني", salaryRange: "٢,٥٠٠ ريال", category: "إدارة" },
      { title: "متدرب تعاوني - تسويق رقمي", company: "STC", description: "تدريب في قسم التسويق الرقمي والإعلام الاجتماعي", location: "الرياض", type: "تدريب_تعاوني", salaryRange: "٣,٠٠٠ ريال", category: "تسويق" },
      { title: "برنامج تمهير - محلل بيانات", company: "بنك الراجحي", description: "برنامج تدريب منتهي بالتوظيف في تحليل البيانات", location: "الرياض", type: "تدريب_منتهي_بالتوظيف", salaryRange: "٦,٠٠٠ ريال", category: "تقنية" },
      { title: "برنامج تمهير - محاسب", company: "ديلويت", description: "تدريب منتهي بالتوظيف في قسم المحاسبة والمراجعة", location: "الرياض", type: "تدريب_منتهي_بالتوظيف", salaryRange: "٧,٠٠٠ ريال", category: "إدارة" },
      { title: "مهندس برمجيات", company: "نيوم", description: "وظيفة مهندس برمجيات في مشروع نيوم", location: "تبوك", type: "وظيفة", salaryRange: "١٥,٠٠٠ - ٢٥,٠٠٠ ريال", category: "تقنية" },
      { title: "مدير مشروع", company: "شركة المراعي", description: "إدارة المشاريع التقنية وفرق العمل", location: "الرياض", type: "وظيفة", salaryRange: "١٢,٠٠٠ - ١٨,٠٠٠ ريال", category: "إدارة" },
      { title: "أخصائي تسويق رقمي", company: "نون", description: "إدارة حملات التسويق الرقمي وتحسين محركات البحث", location: "الرياض", type: "وظيفة", salaryRange: "١٠,٠٠٠ - ١٤,٠٠٠ ريال", category: "تسويق" },
      { title: "كاتب محتوى", company: "منصة محتوى", description: "كتابة محتوى عربي احترافي لمختلف المنصات", location: "عن بعد", type: "عمل_جزئي", salaryRange: "٢,٠٠٠ - ٣,٥٠٠ ريال", category: "إبداعية" },
    ];
    for (const j of jobsData) {
      db.insert(jobs).values(j).run();
    }

    // Seed training programs
    const trainingData = [
      { title: "برنامج تمهير للخريجين", provider: "صندوق تنمية الموارد البشرية", description: "برنامج تدريب على رأس العمل للخريجين السعوديين", type: "تمهير", duration: "٦ أشهر", linkedProgram: "تمهير" },
      { title: "مسار التقنية - مهارات", provider: "منصة مهارات", description: "مسار تدريبي متكامل في المجال التقني", type: "مهارات", duration: "٣ أشهر", linkedProgram: "مهارات" },
      { title: "برنامج دعم التوظيف - هدف", provider: "صندوق هدف", description: "دعم مالي وتدريبي للباحثين عن عمل", type: "هدف", duration: "١٢ شهر", linkedProgram: "هدف" },
      { title: "برنامج مسك للتدريب القيادي", provider: "مؤسسة مسك", description: "تطوير المهارات القيادية للشباب السعودي", type: "مسك", duration: "٤ أشهر", linkedProgram: "مسك" },
      { title: "معسكر البرمجة المكثف", provider: "أكاديمية طويق", description: "معسكر تدريبي مكثف في تطوير البرمجيات", type: "مهارات", duration: "١٦ أسبوع", linkedProgram: "مهارات" },
      { title: "برنامج التدريب الصيفي", provider: "نيوم", description: "فرصة تدريب صيفية في مشروع نيوم", type: "تمهير", duration: "٣ أشهر", linkedProgram: "تمهير" },
    ];
    for (const t of trainingData) {
      db.insert(trainingPrograms).values(t).run();
    }

    res.json({ message: "تم إضافة البيانات التجريبية بنجاح" });
  });

  // Get users by role (for supervisor dashboard)
  app.get("/api/users/by-role/:role", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const allUsers = await storage.getAllUsers();
    const filtered = allUsers.filter((u: any) => u.role === req.params.role || !req.params.role);
    res.json(filtered);
  });

  // Get all users (supervisor only)
  app.get("/api/users/all", async (req, res) => {
    if (!requireAuth(req, res)) return;
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  });

  return httpServer;
}
