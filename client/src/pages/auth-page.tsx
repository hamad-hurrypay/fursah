import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Building2, Briefcase, Check, Star, Compass, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ===== Types =====
type Role = "beneficiary" | "supervisor" | "company";

interface RoleCard {
  role: Role;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const roleCards: RoleCard[] = [
  {
    role: "beneficiary",
    icon: <GraduationCap className="w-8 h-8 text-[#1A2533]" />,
    title: "مستفيد",
    description: "طالب، موظف، أو باحث عن عمل",
    features: [
      "اختبار الميول RIASEC",
      "خارطة المسار المهني",
      "دورات وشهادات معتمدة",
      "فرص التوظيف والتدريب",
    ],
  },
  {
    role: "supervisor",
    icon: <Building2 className="w-8 h-8 text-[#1A2533]" />,
    title: "مشرف مؤسسة",
    description: "جامعة، مدرسة، أو معهد تدريبي",
    features: [
      "متابعة منسوبي المؤسسة",
      "إضافة البرامج التدريبية",
      "تقارير الأداء والإحصاءات",
      "إدارة فرص التطوع والتعاوني",
    ],
  },
  {
    role: "company",
    icon: <Briefcase className="w-8 h-8 text-[#1A2533]" />,
    title: "شركة / جهة توظيف",
    description: "شركة خاصة أو حكومية",
    features: [
      "نشر فرص الوظائف",
      "عرض برامج التدريب",
      "استعراض المرشحين المناسبين",
      "ربط بمنصة تمهير وهدف",
    ],
  },
];

// ===== Helper: redirect by role =====
function redirectByRole(role: string, setLocation: (path: string) => void) {
  if (role === "supervisor") setLocation("/supervisor-dashboard");
  else if (role === "company") setLocation("/company-dashboard");
  else setLocation("/dashboard");
}

// ===== Step 1: Role Selection =====
function RoleSelector({
  selected,
  onSelect,
  onNext,
}: {
  selected: Role | null;
  onSelect: (role: Role) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-xl font-bold text-[#1A2533] mb-1">اختر نوع حسابك</h2>
      <p className="text-sm text-gray-500 mb-5">حدد نوع الحساب المناسب لك للبدء في رحلتك</p>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {roleCards.map((card) => {
          const isSelected = selected === card.role;
          return (
            <button
              key={card.role}
              type="button"
              onClick={() => onSelect(card.role)}
              className={`relative w-full text-right rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#C9A44B] bg-amber-50/60"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              {/* Check mark */}
              {isSelected && (
                <span className="absolute top-3 left-3 w-5 h-5 bg-[#C9A44B] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-amber-100" : "bg-gray-100"
                  }`}
                >
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[#1A2533] text-sm">{card.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{card.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.features.map((f) => (
                      <span
                        key={f}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-[#1A2533] hover:bg-[#243346] text-white font-semibold py-2.5 rounded-xl disabled:opacity-40"
      >
        التالي
        <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
      </Button>
    </motion.div>
  );
}

// ===== Step 2: Registration Form =====
function RegistrationForm({
  role,
  onBack,
  onSuccess,
}: {
  role: Role;
  onBack: () => void;
  onSuccess: (userRole: string) => void;
}) {
  const { registerMutation } = useAuth();
  const { toast } = useToast();

  // Beneficiary form
  const beneficiaryForm = useForm({
    defaultValues: { fullName: "", username: "", email: "", phone: "", password: "" },
  });

  // Supervisor form
  const supervisorForm = useForm({
    defaultValues: {
      institutionName: "",
      institutionType: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const [institutionType, setInstitutionType] = useState("");

  // Company form
  const companyForm = useForm({
    defaultValues: {
      companyName: "",
      sector: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const handleBeneficiary = beneficiaryForm.handleSubmit(async (data) => {
    try {
      const result = await registerMutation.mutateAsync({
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: "beneficiary",
      } as any);
      onSuccess((result as any)?.role || "beneficiary");
    } catch (err: any) {
      toast({ title: "خطأ في التسجيل", description: err.message, variant: "destructive" });
    }
  });

  const handleSupervisor = supervisorForm.handleSubmit(async (data) => {
    try {
      const result = await registerMutation.mutateAsync({
        username: data.email.split("@")[0] + "_sup",
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: "supervisor",
      } as any);
      onSuccess((result as any)?.role || "supervisor");
    } catch (err: any) {
      toast({ title: "خطأ في التسجيل", description: err.message, variant: "destructive" });
    }
  });

  const handleCompany = companyForm.handleSubmit(async (data) => {
    try {
      const result = await registerMutation.mutateAsync({
        username: data.email.split("@")[0] + "_co",
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: "company",
      } as any);
      onSuccess((result as any)?.role || "company");
    } catch (err: any) {
      toast({ title: "خطأ في التسجيل", description: err.message, variant: "destructive" });
    }
  });

  const isPending = registerMutation.isPending;

  const fieldClass = "mt-1 bg-white border-gray-200 focus:border-[#C9A44B] focus:ring-[#C9A44B]/20";

  const roleLabel = role === "beneficiary" ? "مستفيد" : role === "supervisor" ? "مشرف مؤسسة" : "شركة / جهة توظيف";

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-[#1A2533]">بيانات الحساب</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5 mr-7">
        أنت تسجّل كـ{" "}
        <span className="text-[#C9A44B] font-semibold">{roleLabel}</span>
      </p>

      {/* ---- BENEFICIARY FORM ---- */}
      {role === "beneficiary" && (
        <form onSubmit={handleBeneficiary} className="space-y-3">
          <div>
            <Label htmlFor="b-fullName" className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
            <Input id="b-fullName" className={fieldClass} {...beneficiaryForm.register("fullName", { required: true })} />
          </div>
          <div>
            <Label htmlFor="b-username" className="text-sm font-medium text-gray-700">اسم المستخدم</Label>
            <Input id="b-username" className={fieldClass} {...beneficiaryForm.register("username", { required: true })} />
          </div>
          <div>
            <Label htmlFor="b-email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
            <Input id="b-email" type="email" className={fieldClass} {...beneficiaryForm.register("email", { required: true })} />
          </div>
          <div>
            <Label htmlFor="b-phone" className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
            <Input id="b-phone" className={fieldClass} {...beneficiaryForm.register("phone")} />
          </div>
          <div>
            <Label htmlFor="b-password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
            <Input id="b-password" type="password" className={fieldClass} {...beneficiaryForm.register("password", { required: true })} />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#C9A44B] hover:bg-[#b8913e] text-white font-semibold py-2.5 rounded-xl mt-2"
          >
            {isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
          </Button>
        </form>
      )}

      {/* ---- SUPERVISOR FORM ---- */}
      {role === "supervisor" && (
        <form onSubmit={handleSupervisor} className="space-y-3">
          <div>
            <Label htmlFor="s-institutionName" className="text-sm font-medium text-gray-700">اسم المؤسسة</Label>
            <Input id="s-institutionName" className={fieldClass} {...supervisorForm.register("institutionName", { required: true })} />
          </div>
          <div>
            <Label htmlFor="s-institutionType" className="text-sm font-medium text-gray-700">نوع المؤسسة</Label>
            <Select
              value={institutionType}
              onValueChange={(v) => {
                setInstitutionType(v);
                supervisorForm.setValue("institutionType", v);
              }}
            >
              <SelectTrigger id="s-institutionType" className={`mt-1 ${fieldClass}`}>
                <SelectValue placeholder="اختر نوع المؤسسة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">جامعة</SelectItem>
                <SelectItem value="institute">معهد تدريبي</SelectItem>
                <SelectItem value="school">مدرسة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="s-fullName" className="text-sm font-medium text-gray-700">الاسم الكامل للمشرف</Label>
            <Input id="s-fullName" className={fieldClass} {...supervisorForm.register("fullName", { required: true })} />
          </div>
          <div>
            <Label htmlFor="s-email" className="text-sm font-medium text-gray-700">البريد المؤسسي</Label>
            <Input id="s-email" type="email" className={fieldClass} {...supervisorForm.register("email", { required: true })} />
          </div>
          <div>
            <Label htmlFor="s-phone" className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
            <Input id="s-phone" className={fieldClass} {...supervisorForm.register("phone")} />
          </div>
          <div>
            <Label htmlFor="s-password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
            <Input id="s-password" type="password" className={fieldClass} {...supervisorForm.register("password", { required: true })} />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#C9A44B] hover:bg-[#b8913e] text-white font-semibold py-2.5 rounded-xl mt-2"
          >
            {isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
          </Button>
        </form>
      )}

      {/* ---- COMPANY FORM ---- */}
      {role === "company" && (
        <form onSubmit={handleCompany} className="space-y-3">
          <div>
            <Label htmlFor="c-companyName" className="text-sm font-medium text-gray-700">اسم الشركة</Label>
            <Input id="c-companyName" className={fieldClass} {...companyForm.register("companyName", { required: true })} />
          </div>
          <div>
            <Label htmlFor="c-sector" className="text-sm font-medium text-gray-700">القطاع</Label>
            <Input id="c-sector" className={fieldClass} {...companyForm.register("sector", { required: true })} />
          </div>
          <div>
            <Label htmlFor="c-fullName" className="text-sm font-medium text-gray-700">الاسم الكامل للممثل</Label>
            <Input id="c-fullName" className={fieldClass} {...companyForm.register("fullName", { required: true })} />
          </div>
          <div>
            <Label htmlFor="c-email" className="text-sm font-medium text-gray-700">البريد الرسمي</Label>
            <Input id="c-email" type="email" className={fieldClass} {...companyForm.register("email", { required: true })} />
          </div>
          <div>
            <Label htmlFor="c-phone" className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
            <Input id="c-phone" className={fieldClass} {...companyForm.register("phone")} />
          </div>
          <div>
            <Label htmlFor="c-password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
            <Input id="c-password" type="password" className={fieldClass} {...companyForm.register("password", { required: true })} />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#C9A44B] hover:bg-[#b8913e] text-white font-semibold py-2.5 rounded-xl mt-2"
          >
            {isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
          </Button>
        </form>
      )}
    </motion.div>
  );
}

// ===== Main Auth Page =====
export default function AuthPage() {
  const { loginMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    redirectByRole(user.role || "beneficiary", setLocation);
    return null;
  }

  const loginForm = useForm({ defaultValues: { username: "", password: "" } });

  const onLogin = loginForm.handleSubmit(async (data) => {
    try {
      const result = await loginMutation.mutateAsync(data as any);
      redirectByRole((result as any)?.role || "beneficiary", setLocation);
    } catch (err: any) {
      toast({ title: "خطأ في تسجيل الدخول", description: err.message, variant: "destructive" });
    }
  });

  // Register steps state
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="min-h-screen grid md:grid-cols-2" dir="rtl">
      {/* ===== Form side ===== */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#1A2533] flex items-center justify-center">
              <span className="text-[#C9A44B] font-black text-sm">ف</span>
            </div>
            <span className="text-lg font-bold text-[#1A2533]">فرصتي</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-5 bg-gray-100 rounded-xl p-1">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A2533] data-[state=active]:shadow-sm"
              >
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A2533] data-[state=active]:shadow-sm"
                onClick={() => { setRegisterStep(1); setSelectedRole(null); }}
              >
                حساب جديد
              </TabsTrigger>
            </TabsList>

            {/* ===== LOGIN TAB ===== */}
            <TabsContent value="login">
              <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <form onSubmit={onLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-username" className="text-sm font-medium text-gray-700">اسم المستخدم</Label>
                      <Input
                        id="login-username"
                        data-testid="input-login-username"
                        {...loginForm.register("username", { required: true })}
                        className="mt-1 border-gray-200 focus:border-[#C9A44B]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">كلمة المرور</Label>
                      <Input
                        id="login-password"
                        type="password"
                        data-testid="input-login-password"
                        {...loginForm.register("password", { required: true })}
                        className="mt-1 border-gray-200 focus:border-[#C9A44B]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#1A2533] hover:bg-[#243346] text-white font-semibold py-2.5 rounded-xl"
                      disabled={loginMutation.isPending}
                      data-testid="btn-login-submit"
                    >
                      {loginMutation.isPending ? "جاري الدخول..." : "دخول"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== REGISTER TAB ===== */}
            <TabsContent value="register">
              <Card className="border-gray-200 shadow-sm rounded-2xl">
                <CardContent className="p-6 overflow-hidden">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${registerStep >= 1 ? "bg-[#1A2533] text-white" : "bg-gray-200 text-gray-500"}`}>
                      ١
                    </div>
                    <div className={`flex-1 h-0.5 transition-colors ${registerStep >= 2 ? "bg-[#C9A44B]" : "bg-gray-200"}`} />
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${registerStep >= 2 ? "bg-[#C9A44B] text-white" : "bg-gray-200 text-gray-500"}`}>
                      ٢
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {registerStep === 1 ? (
                      <RoleSelector
                        key="selector"
                        selected={selectedRole}
                        onSelect={setSelectedRole}
                        onNext={() => selectedRole && setRegisterStep(2)}
                      />
                    ) : (
                      <RegistrationForm
                        key="form"
                        role={selectedRole!}
                        onBack={() => setRegisterStep(1)}
                        onSuccess={(userRole) => redirectByRole(userRole, setLocation)}
                      />
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ===== Branding side ===== */}
      <div className="hidden md:flex items-center justify-center bg-[#1A2533] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#C9A44B] blur-[120px]" />
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-[#C9A44B] blur-[100px]" />
        </div>
        <div className="relative text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A44B] flex items-center justify-center mx-auto mb-6">
            <span className="text-[#1A2533] font-black text-2xl">ف</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">فرصتي</h2>
          <p className="text-white/60 leading-relaxed mb-8">
            رحلتك المهنية تبدأ هنا — من اكتشاف ميولك إلى الحصول على وظيفتك المثالية في ٩ مراحل مدروسة
          </p>

          {/* Role pills */}
          <div className="flex flex-col gap-3 text-right">
            {[
              { icon: <GraduationCap className="w-4 h-4 text-[#C9A44B]" />, label: "مستفيد", desc: "طلاب وباحثو عمل" },
              { icon: <Building2 className="w-4 h-4 text-[#C9A44B]" />, label: "مشرف مؤسسة", desc: "جامعات ومعاهد" },
              { icon: <Briefcase className="w-4 h-4 text-[#C9A44B]" />, label: "شركة توظيف", desc: "فرص وبرامج تدريب" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-white/40 text-sm mt-8">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#C9A44B]" />
              <span>٩ مراحل</span>
            </div>
            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#C9A44B]" />
              <span>+٥٠٠ دورة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
