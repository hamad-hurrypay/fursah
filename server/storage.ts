import {
  type User, type InsertUser, users,
  type Course, type InsertCourse, courses,
  type UserCourse, type InsertUserCourse, userCourses,
  type Certificate, type InsertCertificate, certificates,
  type VolunteerOpp, type InsertVolunteerOpp, volunteerOpps,
  type Job, type InsertJob, jobs,
  type TrainingProgram, type InsertTrainingProgram, trainingPrograms,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";

const client = createClient({ url: "file:data.db" });

export const db = drizzle(client);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;

  // User Courses
  getUserCourses(userId: number): Promise<UserCourse[]>;
  enrollCourse(data: InsertUserCourse): Promise<UserCourse>;
  updateCourseProgress(id: number, progress: number, status: string): Promise<UserCourse | undefined>;

  // Certificates
  getCertificates(userId: number): Promise<Certificate[]>;
  addCertificate(data: InsertCertificate): Promise<Certificate>;

  // Volunteer
  getVolunteerOpps(): Promise<VolunteerOpp[]>;
  getVolunteerOppsByCategory(category: string): Promise<VolunteerOpp[]>;

  // Jobs
  getJobs(): Promise<Job[]>;
  getJobsByType(type: string): Promise<Job[]>;

  // Training Programs
  getTrainingPrograms(): Promise<TrainingProgram[]>;
  getTrainingProgramsByType(type: string): Promise<TrainingProgram[]>;

  // All users
  getAllUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.username, username)).get();
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return db.insert(users).values(insertUser).returning().get();
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    return db.update(users).set(data).where(eq(users.id, id)).returning().get();
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).all();
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.category, category)).all();
  }

  // User Courses
  async getUserCourses(userId: number): Promise<UserCourse[]> {
    return db.select().from(userCourses).where(eq(userCourses.userId, userId)).all();
  }

  async enrollCourse(data: InsertUserCourse): Promise<UserCourse> {
    return db.insert(userCourses).values(data).returning().get();
  }

  async updateCourseProgress(id: number, progress: number, status: string): Promise<UserCourse | undefined> {
    return db.update(userCourses).set({ progress, status }).where(eq(userCourses.id, id)).returning().get();
  }

  // Certificates
  async getCertificates(userId: number): Promise<Certificate[]> {
    return db.select().from(certificates).where(eq(certificates.userId, userId)).all();
  }

  async addCertificate(data: InsertCertificate): Promise<Certificate> {
    return db.insert(certificates).values(data).returning().get();
  }

  // Volunteer
  async getVolunteerOpps(): Promise<VolunteerOpp[]> {
    return db.select().from(volunteerOpps).all();
  }

  async getVolunteerOppsByCategory(category: string): Promise<VolunteerOpp[]> {
    return db.select().from(volunteerOpps).where(eq(volunteerOpps.category, category)).all();
  }

  // Jobs
  async getJobs(): Promise<Job[]> {
    return db.select().from(jobs).all();
  }

  async getJobsByType(type: string): Promise<Job[]> {
    return db.select().from(jobs).where(eq(jobs.type, type)).all();
  }

  // Training Programs
  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    return db.select().from(trainingPrograms).all();
  }

  async getTrainingProgramsByType(type: string): Promise<TrainingProgram[]> {
    return db.select().from(trainingPrograms).where(eq(trainingPrograms.type, type)).all();
  }

  async getAllUsers() {
    return db.select().from(users).all();
  }
}

export const storage = new DatabaseStorage();
