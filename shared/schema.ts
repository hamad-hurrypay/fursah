import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("beneficiary"),
  // القيم: "beneficiary" | "supervisor" | "company"
  currentStage: integer("current_stage").notNull().default(1),
  completedStages: text("completed_stages").notNull().default("[]"),
  skills: text("skills").notNull().default("[]"),
  aptitudeResult: text("aptitude_result"),
  cvData: text("cv_data"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  currentStage: true,
  completedStages: true,
  skills: true,
  aptitudeResult: true,
  cvData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Courses
export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull().default("مبتدئ"),
  stageRequired: integer("stage_required").notNull().default(3),
});

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// User course enrollment
export const userCourses = sqliteTable("user_courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").notNull().default("not_started"),
  progress: integer("progress").notNull().default(0),
});

export const insertUserCourseSchema = createInsertSchema(userCourses).omit({ id: true });
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;
export type UserCourse = typeof userCourses.$inferSelect;

// Certificates
export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  dateObtained: text("date_obtained").notNull(),
  category: text("category").notNull(),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

// Volunteer opportunities
export const volunteerOpps = sqliteTable("volunteer_opps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  hours: integer("hours").notNull(),
  category: text("category").notNull(),
});

export const insertVolunteerOppSchema = createInsertSchema(volunteerOpps).omit({ id: true });
export type InsertVolunteerOpp = z.infer<typeof insertVolunteerOppSchema>;
export type VolunteerOpp = typeof volunteerOpps.$inferSelect;

// Jobs
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  salaryRange: text("salary_range"),
  category: text("category").notNull(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Training programs
export const trainingPrograms = sqliteTable("training_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  duration: text("duration").notNull(),
  linkedProgram: text("linked_program"),
});

export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms).omit({ id: true });
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;
export type TrainingProgram = typeof trainingPrograms.$inferSelect;

// Stage definitions (constant data)
export const STAGES = [
  { id: 1, name: "اختبار الميول", icon: "Compass", description: "اكتشف ميولك واهتماماتك المهنية" },
  { id: 2, name: "تحديد المهارات", icon: "Target", description: "حدد مهاراتك الحالية وتعرف على نقاط القوة" },
  { id: 3, name: "دورات تدريبية", icon: "BookOpen", description: "طور مهاراتك من خلال دورات متخصصة" },
  { id: 4, name: "شهادات احترافية", icon: "Award", description: "احصل على شهادات معتمدة تعزز سيرتك" },
  { id: 5, name: "أعمال تطوعية", icon: "Heart", description: "اكتسب خبرة من خلال العمل التطوعي" },
  { id: 6, name: "عمل جزئي", icon: "Clock", description: "ابدأ بالعمل الجزئي لبناء خبرتك" },
  { id: 7, name: "تدريب تعاوني", icon: "Users", description: "انضم لبرامج التدريب التعاوني المعتمدة" },
  { id: 8, name: "تدريب منتهي بالتوظيف", icon: "Briefcase", description: "التحق ببرامج تدريب تقودك للتوظيف" },
  { id: 9, name: "الوظيفة", icon: "Trophy", description: "حقق هدفك واحصل على الوظيفة المناسبة" },
] as const;
