import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertUserSchema, type User } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, suppliedBuffer);
}

declare global {
  namespace Express {
    interface User extends import("@shared/schema").User {}
  }
}

export function setupAuth(app: Express) {
  app.use(
    session({
      secret: "fursati-secret-key-2026",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
      cookie: { maxAge: 86400000 },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false, { message: "اسم المستخدم غير صحيح" });
        if (!verifyPassword(password, user.password)) return done(null, false, { message: "كلمة المرور غير صحيحة" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Register
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await storage.getUserByUsername(req.body.username);
      if (existing) {
        return res.status(400).json({ message: "اسم المستخدم مستخدم بالفعل" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        return res.status(201).json(safeUser);
      });
    } catch (err) {
      next(err);
    }
  });

  // Login
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "فشل تسجيل الدخول" });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        return res.json(safeUser);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  // Get current user
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "غير مسجل الدخول" });
    const { password, ...safeUser } = req.user!;
    res.json(safeUser);
  });
}
