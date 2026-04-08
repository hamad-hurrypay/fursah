import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Plus, Trash2, Save, User, GraduationCap, Briefcase,
  Award, Heart, Globe, Link2, Download, Languages, Eye, PenLine,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Certificate } from "@shared/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CvData {
  lang: "ar" | "en";
  personalInfo: {
    fullName: string;
    fullNameEn: string;
    email: string;
    phone: string;
    summary: string;
    summaryEn: string;
    linkedin: string;
    github: string;
  };
  education: { institution: string; degree: string; field: string; year: string }[];
  experience: { company: string; position: string; period: string; description: string }[];
  skills: string[];
  certificates: string[];
  volunteer: string;
  languages: { name: string; level: string }[];
}

// ─── Translations ─────────────────────────────────────────────────────────────

const t = {
  ar: {
    title: "بناء السيرة الذاتية",
    langToggle: "English",
    fillTab: "تعبئة",
    previewTab: "معاينة",
    personal: "المعلومات الشخصية",
    fullName: "الاسم الكامل (عربي)",
    fullNameEn: "الاسم الكامل (إنجليزي)",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    summary: "نبذة مختصرة (عربي)",
    summaryEn: "النبذة المختصرة (إنجليزي)",
    linkedin: "رابط LinkedIn",
    github: "رابط GitHub",
    education: "التعليم",
    institution: "المؤسسة التعليمية",
    degree: "الدرجة العلمية",
    field: "التخصص",
    year: "سنة التخرج",
    add: "إضافة",
    experience: "الخبرات العملية",
    company: "الشركة / الجهة",
    position: "المسمى الوظيفي",
    period: "الفترة (مثال: 2022 – 2024)",
    description: "وصف المهام",
    skills: "المهارات",
    skillsNote: "مجلوبة تلقائياً من ملفك الشخصي",
    certificates: "الشهادات",
    certsNote: "مجلوبة تلقائياً من قاعدة البيانات",
    volunteer: "العمل التطوعي",
    volunteerPlaceholder: "اذكر نشاطاتك التطوعية ومدتها...",
    languages: "اللغات",
    langName: "اللغة",
    langLevel: "المستوى",
    langNamePlaceholder: "مثال: الإنجليزية",
    langLevelPlaceholder: "مثال: متقدم",
    links: "الروابط المهنية",
    save: "حفظ السيرة الذاتية",
    saving: "جاري الحفظ...",
    downloadPdf: "تحميل PDF",
    savedOk: "تم حفظ السيرة الذاتية بنجاح",
    cvPreview: "معاينة السيرة الذاتية",
    noName: "الاسم الكامل",
    noSummary: "",
    contactInfo: "معلومات التواصل",
  },
  en: {
    title: "CV Builder",
    langToggle: "عربي",
    fillTab: "Fill",
    previewTab: "Preview",
    personal: "Personal Information",
    fullName: "Full Name (Arabic)",
    fullNameEn: "Full Name (English)",
    email: "Email Address",
    phone: "Phone Number",
    summary: "Summary (Arabic)",
    summaryEn: "Summary (English)",
    linkedin: "LinkedIn URL",
    github: "GitHub URL",
    education: "Education",
    institution: "Institution",
    degree: "Degree",
    field: "Field of Study",
    year: "Graduation Year",
    add: "Add",
    experience: "Work Experience",
    company: "Company / Organization",
    position: "Job Title",
    period: "Period (e.g. 2022 – 2024)",
    description: "Role Description",
    skills: "Skills",
    skillsNote: "Auto-fetched from your profile",
    certificates: "Certificates",
    certsNote: "Auto-fetched from database",
    volunteer: "Volunteer Work",
    volunteerPlaceholder: "Describe your volunteer activities and duration...",
    languages: "Languages",
    langName: "Language",
    langLevel: "Level",
    langNamePlaceholder: "e.g. Arabic",
    langLevelPlaceholder: "e.g. Advanced",
    links: "Professional Links",
    save: "Save CV",
    saving: "Saving...",
    downloadPdf: "Download PDF",
    savedOk: "CV saved successfully",
    cvPreview: "CV Preview",
    noName: "Full Name",
    noSummary: "",
    contactInfo: "Contact",
  },
} as const;

type Lang = "ar" | "en";

// ─── Default Data ─────────────────────────────────────────────────────────────

const defaultCv = (): CvData => ({
  lang: "ar",
  personalInfo: {
    fullName: "", fullNameEn: "", email: "", phone: "",
    summary: "", summaryEn: "", linkedin: "", github: "",
  },
  education: [{ institution: "", degree: "", field: "", year: "" }],
  experience: [{ company: "", position: "", period: "", description: "" }],
  skills: [],
  certificates: [],
  volunteer: "",
  languages: [{ name: "", level: "" }],
});

// ─── Preview Component ────────────────────────────────────────────────────────

function CvPreview({ cv, lang }: { cv: CvData; lang: Lang }) {
  const tr = t[lang];
  const isAr = lang === "ar";
  const displayName = isAr ? cv.personalInfo.fullName : cv.personalInfo.fullNameEn;
  const displaySummary = isAr ? cv.personalInfo.summary : cv.personalInfo.summaryEn;

  return (
    <div
      id="cv-preview-print"
      className="bg-white shadow-lg rounded-lg overflow-hidden text-sm"
      dir={isAr ? "rtl" : "ltr"}
      style={{ fontFamily: isAr ? "'Segoe UI', Tahoma, Arial, sans-serif" : "'Segoe UI', Arial, sans-serif" }}
    >
      {/* Header */}
      <div
        className="px-8 py-6 text-white"
        style={{ background: "linear-gradient(135deg, #1A2533 0%, #243447 100%)" }}
      >
        <h1 className="text-2xl font-bold" style={{ color: "#C9A44B" }}>
          {displayName || tr.noName}
        </h1>
        {cv.experience.some((e) => e.position) && (
          <p className="text-sm mt-0.5 text-gray-300">
            {cv.experience[0].position}
          </p>
        )}
        <div
          className="flex flex-wrap gap-4 mt-3 text-xs text-gray-300"
          style={{ flexDirection: isAr ? "row-reverse" : "row" }}
        >
          {cv.personalInfo.email && (
            <span>✉ {cv.personalInfo.email}</span>
          )}
          {cv.personalInfo.phone && (
            <span>📞 {cv.personalInfo.phone}</span>
          )}
          {cv.personalInfo.linkedin && (
            <span>🔗 {cv.personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>
          )}
          {cv.personalInfo.github && (
            <span>⚡ {cv.personalInfo.github.replace(/^https?:\/\//, "")}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Summary */}
        {displaySummary && (
          <div>
            <SectionTitle icon={<User className="w-3.5 h-3.5" />} label={isAr ? "نبذة مختصرة" : "Professional Summary"} />
            <p className="text-gray-600 text-xs leading-relaxed mt-1.5">{displaySummary}</p>
          </div>
        )}

        {/* Education */}
        {cv.education.some((e) => e.institution) && (
          <div>
            <SectionTitle icon={<GraduationCap className="w-3.5 h-3.5" />} label={isAr ? "التعليم" : "Education"} />
            <div className="mt-1.5 space-y-2">
              {cv.education.filter((e) => e.institution).map((edu, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[#1A2533] text-xs">
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                    </span>
                    {edu.year && <span className="text-[10px] text-gray-400">{edu.year}</span>}
                  </div>
                  <p className="text-[11px] text-gray-500">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {cv.experience.some((e) => e.company) && (
          <div>
            <SectionTitle icon={<Briefcase className="w-3.5 h-3.5" />} label={isAr ? "الخبرات العملية" : "Work Experience"} />
            <div className="mt-1.5 space-y-3">
              {cv.experience.filter((e) => e.company).map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[#1A2533] text-xs">{exp.position}</span>
                    {exp.period && <span className="text-[10px] text-gray-400">{exp.period}</span>}
                  </div>
                  <p className="text-[11px] text-gray-500 mb-0.5">{exp.company}</p>
                  {exp.description && <p className="text-[11px] text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column lower section */}
        <div className="grid grid-cols-2 gap-5">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <div>
              <SectionTitle icon={<Award className="w-3.5 h-3.5" />} label={isAr ? "المهارات" : "Skills"} />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {cv.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] rounded-full border"
                    style={{ borderColor: "#C9A44B", color: "#1A2533", background: "#FBF5E6" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cv.languages.some((l) => l.name) && (
            <div>
              <SectionTitle icon={<Languages className="w-3.5 h-3.5" />} label={isAr ? "اللغات" : "Languages"} />
              <div className="mt-1.5 space-y-1">
                {cv.languages.filter((l) => l.name).map((lang, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] text-[#1A2533]">{lang.name}</span>
                    {lang.level && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{lang.level}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certificates */}
        {cv.certificates.length > 0 && (
          <div>
            <SectionTitle icon={<Award className="w-3.5 h-3.5" />} label={isAr ? "الشهادات" : "Certificates"} />
            <ul className="mt-1.5 space-y-0.5">
              {cv.certificates.map((c, i) => (
                <li key={i} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                  <span style={{ color: "#C9A44B" }}>◆</span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Volunteer */}
        {cv.volunteer && (
          <div>
            <SectionTitle icon={<Heart className="w-3.5 h-3.5" />} label={isAr ? "العمل التطوعي" : "Volunteer Work"} />
            <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">{cv.volunteer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 pb-1 border-b" style={{ borderColor: "#C9A44B" }}>
      <span style={{ color: "#C9A44B" }}>{icon}</span>
      <h3 className="text-xs font-bold" style={{ color: "#1A2533" }}>{label}</h3>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CVBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lang, setLang] = useState<Lang>("ar");

  // Parse existing CV from user data
  const existingCv: CvData | null = user?.cvData
    ? (() => { try { return JSON.parse(user.cvData); } catch { return null; } })()
    : null;

  // Parse user skills
  const userSkills: { name: string; level: number }[] = user?.skills
    ? (() => { try { const p = JSON.parse(user.skills); return Array.isArray(p) ? p : []; } catch { return []; } })()
    : [];

  // Fetch certificates
  const { data: certs = [] } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const [cv, setCv] = useState<CvData>(() => {
    const base: CvData = existingCv || defaultCv();
    // Pre-fill from user profile if empty
    if (!base.personalInfo.fullName && user?.fullName) base.personalInfo.fullName = user.fullName;
    if (!base.personalInfo.email && user?.email) base.personalInfo.email = user.email;
    if (!base.personalInfo.phone && user?.phone) base.personalInfo.phone = user.phone;
    if (userSkills.length > 0 && base.skills.length === 0) {
      base.skills = userSkills.filter((s) => s.level >= 3).map((s) => s.name);
    }
    return base;
  });

  // Sync language toggle with cv.lang
  useEffect(() => {
    if (existingCv?.lang) setLang(existingCv.lang);
  }, []);

  // Populate certificates once loaded
  useEffect(() => {
    if (certs.length > 0 && cv.certificates.length === 0) {
      setCv((prev) => ({
        ...prev,
        certificates: certs.map((c) => `${c.title} — ${c.issuer} (${c.dateObtained})`),
      }));
    }
  }, [certs]);

  const tr = t[lang];
  const isAr = lang === "ar";

  // Toggle language
  const toggleLang = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next);
    setCv((prev) => ({ ...prev, lang: next }));
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...cv, lang };
      await apiRequest("PATCH", "/api/user/cv", { cvData: payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: tr.savedOk });
    },
  });

  // PDF print
  const handlePrint = () => {
    window.print();
  };

  // ── Updaters ──

  const updatePersonal = (key: keyof CvData["personalInfo"], value: string) =>
    setCv((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [key]: value } }));

  const addEducation = () =>
    setCv((prev) => ({ ...prev, education: [...prev.education, { institution: "", degree: "", field: "", year: "" }] }));
  const removeEducation = (i: number) =>
    setCv((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));
  const updateEducation = (i: number, key: keyof CvData["education"][0], value: string) =>
    setCv((prev) => { const arr = [...prev.education]; arr[i] = { ...arr[i], [key]: value }; return { ...prev, education: arr }; });

  const addExperience = () =>
    setCv((prev) => ({ ...prev, experience: [...prev.experience, { company: "", position: "", period: "", description: "" }] }));
  const removeExperience = (i: number) =>
    setCv((prev) => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
  const updateExperience = (i: number, key: keyof CvData["experience"][0], value: string) =>
    setCv((prev) => { const arr = [...prev.experience]; arr[i] = { ...arr[i], [key]: value }; return { ...prev, experience: arr }; });

  const addLanguage = () =>
    setCv((prev) => ({ ...prev, languages: [...prev.languages, { name: "", level: "" }] }));
  const removeLanguage = (i: number) =>
    setCv((prev) => ({ ...prev, languages: prev.languages.filter((_, idx) => idx !== i) }));
  const updateLanguage = (i: number, key: keyof CvData["languages"][0], value: string) =>
    setCv((prev) => { const arr = [...prev.languages]; arr[i] = { ...arr[i], [key]: value }; return { ...prev, languages: arr }; });

  // ── Form Card (reusable wrapper) ──

  const FormCard = ({
    icon, title, children, action,
  }: { icon: React.ReactNode; title: string; children: React.ReactNode; action?: React.ReactNode }) => (
    <Card className="border-card-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">{icon} {title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );

  // ── Form Side ──

  const FormSide = () => (
    <div className="space-y-4" dir={isAr ? "rtl" : "ltr"}>

      {/* Personal Info */}
      <FormCard icon={<User className="w-4 h-4" />} title={tr.personal}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{tr.fullName}</Label>
            <Input className="mt-1" value={cv.personalInfo.fullName}
              onChange={(e) => updatePersonal("fullName", e.target.value)}
              data-testid="input-cv-name" />
          </div>
          <div>
            <Label className="text-xs">{tr.fullNameEn}</Label>
            <Input className="mt-1" value={cv.personalInfo.fullNameEn}
              onChange={(e) => updatePersonal("fullNameEn", e.target.value)}
              placeholder="e.g. Mohammed Ali" dir="ltr" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">{tr.email}</Label>
            <Input className="mt-1" value={cv.personalInfo.email}
              onChange={(e) => updatePersonal("email", e.target.value)}
              data-testid="input-cv-email" dir="ltr" />
          </div>
          <div>
            <Label className="text-xs">{tr.phone}</Label>
            <Input className="mt-1" value={cv.personalInfo.phone}
              onChange={(e) => updatePersonal("phone", e.target.value)}
              data-testid="input-cv-phone" dir="ltr" />
          </div>
        </div>
        <div>
          <Label className="text-xs">{tr.summary}</Label>
          <Textarea className="mt-1" rows={3} value={cv.personalInfo.summary}
            onChange={(e) => updatePersonal("summary", e.target.value)}
            data-testid="input-cv-summary" />
        </div>
        <div>
          <Label className="text-xs">{tr.summaryEn}</Label>
          <Textarea className="mt-1" rows={3} value={cv.personalInfo.summaryEn}
            onChange={(e) => updatePersonal("summaryEn", e.target.value)}
            dir="ltr" />
        </div>
      </FormCard>

      {/* Professional Links */}
      <FormCard icon={<Link2 className="w-4 h-4" />} title={tr.links}>
        <div>
          <Label className="text-xs">{tr.linkedin}</Label>
          <Input className="mt-1" value={cv.personalInfo.linkedin}
            onChange={(e) => updatePersonal("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username" dir="ltr" />
        </div>
        <div>
          <Label className="text-xs">{tr.github}</Label>
          <Input className="mt-1" value={cv.personalInfo.github}
            onChange={(e) => updatePersonal("github", e.target.value)}
            placeholder="https://github.com/username" dir="ltr" />
        </div>
      </FormCard>

      {/* Education */}
      <FormCard
        icon={<GraduationCap className="w-4 h-4" />}
        title={tr.education}
        action={
          <Button size="sm" variant="ghost" onClick={addEducation} data-testid="btn-add-edu">
            <Plus className="w-3 h-3" style={{ marginInlineEnd: "4px" }} />{tr.add}
          </Button>
        }
      >
        {cv.education.map((edu, i) => (
          <div key={i} className="space-y-2">
            {i > 0 && <Separator />}
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder={tr.institution} value={edu.institution}
                onChange={(e) => updateEducation(i, "institution", e.target.value)}
                data-testid={`input-edu-inst-${i}`} />
              <Input placeholder={tr.degree} value={edu.degree}
                onChange={(e) => updateEducation(i, "degree", e.target.value)}
                data-testid={`input-edu-deg-${i}`} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder={tr.field} value={edu.field}
                onChange={(e) => updateEducation(i, "field", e.target.value)} />
              <div className="flex gap-2">
                <Input placeholder={tr.year} value={edu.year}
                  onChange={(e) => updateEducation(i, "year", e.target.value)}
                  data-testid={`input-edu-year-${i}`} className="flex-1" />
                {cv.education.length > 1 && (
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0"
                    onClick={() => removeEducation(i)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </FormCard>

      {/* Experience */}
      <FormCard
        icon={<Briefcase className="w-4 h-4" />}
        title={tr.experience}
        action={
          <Button size="sm" variant="ghost" onClick={addExperience} data-testid="btn-add-exp">
            <Plus className="w-3 h-3" style={{ marginInlineEnd: "4px" }} />{tr.add}
          </Button>
        }
      >
        {cv.experience.map((exp, i) => (
          <div key={i} className="space-y-2">
            {i > 0 && <Separator />}
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder={tr.company} value={exp.company}
                onChange={(e) => updateExperience(i, "company", e.target.value)}
                data-testid={`input-exp-company-${i}`} />
              <Input placeholder={tr.position} value={exp.position}
                onChange={(e) => updateExperience(i, "position", e.target.value)}
                data-testid={`input-exp-pos-${i}`} />
            </div>
            <Input placeholder={tr.period} value={exp.period}
              onChange={(e) => updateExperience(i, "period", e.target.value)}
              data-testid={`input-exp-period-${i}`} dir="ltr" />
            <div className="flex items-start gap-2">
              <Textarea placeholder={tr.description} value={exp.description}
                onChange={(e) => updateExperience(i, "description", e.target.value)}
                data-testid={`input-exp-desc-${i}`} rows={2} className="flex-1" />
              {cv.experience.length > 1 && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0 mt-0.5"
                  onClick={() => removeExperience(i)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </FormCard>

      {/* Skills */}
      <FormCard icon={<Award className="w-4 h-4" />} title={tr.skills}>
        <p className="text-xs text-muted-foreground">{tr.skillsNote}</p>
        <div className="flex flex-wrap gap-2">
          {cv.skills.length > 0 ? (
            cv.skills.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs gap-1 cursor-default">
                {s}
                <button
                  onClick={() => setCv((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))}
                  className="text-muted-foreground hover:text-destructive ml-0.5"
                >
                  ×
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">—</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={isAr ? "أضف مهارة يدوياً..." : "Add skill manually..."}
            className="text-xs"
            id="skill-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !cv.skills.includes(val)) {
                  setCv((prev) => ({ ...prev, skills: [...prev.skills, val] }));
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <Button size="sm" variant="outline"
            onClick={() => {
              const inp = document.getElementById("skill-input") as HTMLInputElement;
              const val = inp?.value.trim();
              if (val && !cv.skills.includes(val)) {
                setCv((prev) => ({ ...prev, skills: [...prev.skills, val] }));
                inp.value = "";
              }
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </FormCard>

      {/* Languages */}
      <FormCard
        icon={<Languages className="w-4 h-4" />}
        title={tr.languages}
        action={
          <Button size="sm" variant="ghost" onClick={addLanguage}>
            <Plus className="w-3 h-3" style={{ marginInlineEnd: "4px" }} />{tr.add}
          </Button>
        }
      >
        {cv.languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input placeholder={tr.langNamePlaceholder} value={lang.name}
              onChange={(e) => updateLanguage(i, "name", e.target.value)}
              className="flex-1" />
            <Input placeholder={tr.langLevelPlaceholder} value={lang.level}
              onChange={(e) => updateLanguage(i, "level", e.target.value)}
              className="flex-1" />
            {cv.languages.length > 1 && (
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0"
                onClick={() => removeLanguage(i)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </FormCard>

      {/* Certificates */}
      <FormCard icon={<Award className="w-4 h-4" />} title={tr.certificates}>
        <p className="text-xs text-muted-foreground">{tr.certsNote}</p>
        {cv.certificates.length > 0 ? (
          <ul className="space-y-1">
            {cv.certificates.map((c, i) => (
              <li key={i} className="text-xs flex items-center gap-1.5 text-muted-foreground">
                <span style={{ color: "#C9A44B" }}>◆</span> {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground italic">—</p>
        )}
      </FormCard>

      {/* Volunteer */}
      <FormCard icon={<Heart className="w-4 h-4" />} title={tr.volunteer}>
        <Textarea
          value={cv.volunteer}
          onChange={(e) => setCv((prev) => ({ ...prev, volunteer: e.target.value }))}
          placeholder={tr.volunteerPlaceholder}
          rows={3}
        />
      </FormCard>

      {/* Save Button */}
      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="w-full"
        data-testid="btn-save-cv"
      >
        <Save className="w-4 h-4" style={{ marginInlineEnd: "6px" }} />
        {saveMutation.isPending ? tr.saving : tr.save}
      </Button>
    </div>
  );

  // ── Render ──

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cv-preview-print, #cv-preview-print * { visibility: visible !important; }
          #cv-preview-print {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-7xl">
        {/* Page Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground" data-testid="text-cv-title">
              {tr.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLang}
              className="text-xs font-medium"
              style={{ borderColor: "#C9A44B", color: "#C9A44B" }}
            >
              <Globe className="w-3.5 h-3.5" style={{ marginInlineEnd: "4px" }} />
              {tr.langToggle}
            </Button>
            {/* Download PDF */}
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5" style={{ marginInlineEnd: "4px" }} />
              {tr.downloadPdf}
            </Button>
          </div>
        </motion.div>

        {/* Desktop: split-screen layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-start">
          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <FormSide />
          </motion.div>

          {/* Preview Column */}
          <motion.div
            className="sticky top-4"
            initial={{ opacity: 0, x: isAr ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{tr.cvPreview}</span>
            </div>
            <CvPreview cv={cv} lang={lang} />
          </motion.div>
        </div>

        {/* Mobile: tabbed layout */}
        <div className="lg:hidden">
          <Tabs defaultValue="fill">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="fill" className="flex-1 flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5" /> {tr.fillTab}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {tr.previewTab}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fill">
              <FormSide />
            </TabsContent>
            <TabsContent value="preview">
              <CvPreview cv={cv} lang={lang} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
