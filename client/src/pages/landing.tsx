import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STAGES } from "@shared/schema";
import {
  Compass, Target, BookOpen, Award, Heart, Clock, Users, Briefcase, Trophy,
  Route, Building2, FileText, ArrowLeft, Star, Zap, ChevronDown,
  GraduationCap, UserCheck, UserX, Search, BarChart3, Brain, ExternalLink, ChevronRight,
  Menu, X,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = { Compass, Target, BookOpen, Award, Heart, Clock, Users, Briefcase, Trophy };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/#about" },
    { label: "اختر مسارك", href: "/tracks" },
    { label: "مرصد التوظيف", href: "/observatory" },
    { label: "القبول الأكاديمي", href: "/admissions" },
    { label: "لوحة المؤسسة", href: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1A2533]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#C9A44B] flex items-center justify-center">
                <span className="text-[#1A2533] font-black text-sm">ف</span>
              </div>
              <span className="text-white font-bold text-lg">فرصتي</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" data-testid="btn-login">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold" data-testid="btn-register-nav">
                ابدأ رحلتك
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white p-1"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1A2533] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer block"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link href="/auth">
                <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/10 justify-start" data-testid="btn-login-mobile">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold" data-testid="btn-register-nav-mobile">
                  ابدأ رحلتك
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative bg-[#1A2533] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#C9A44B] blur-[120px]" />
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-[#C9A44B] blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A44B]/15 border border-[#C9A44B]/30 mb-6">
              <Star className="w-3.5 h-3.5 text-[#C9A44B]" />
              <span className="text-[#C9A44B] text-sm font-medium">منصة التطوير المهني الشاملة</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              فرصتي
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-3 font-medium">
              رحلتك المهنية تبدأ هنا
            </p>
            <p className="text-base text-white/50 mb-8 max-w-xl mx-auto">
              من اختبار الميول إلى الوظيفة المثالية — ٩ مراحل متكاملة تقودك نحو مستقبلك المهني
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold text-base px-8 h-12" data-testid="btn-hero-cta">
                ابدأ رحلتك الآن
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="flex justify-center pb-6">
          <ChevronDown className="w-5 h-5 text-white/30 animate-bounce" />
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-xl font-bold text-[#1A2533] mb-2">شركاؤنا الاستراتيجيون</h2>
            <p className="text-gray-500 text-sm">شراكات موثوقة تُعزّز مسيرتك المهنية</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "FutureLearn",
                desc: "منصة بريطانية عالمية · 14 مليون مستخدم",
                tag: "تعليم دولي",
              },
              {
                name: "Classperts",
                desc: "مرخصة من المركز الوطني للتعليم الإلكتروني",
                tag: "معتمدة وطنياً",
              },
              {
                name: "كن للتدريب",
                desc: "40,000+ متدرب · شهادات معتمدة دولياً",
                tag: "تدريب مهني",
              },
              {
                name: "تكامل لحلول الأعمال",
                desc: "الذراع التشغيلية لصندوق تنمية الموارد البشرية",
                tag: "موارد بشرية",
              },
            ].map((partner, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.45, delay: i * 0.1 } } }}
              >
                <div className="bg-white border border-[#C9A44B]/30 hover:border-[#C9A44B]/70 hover:shadow-md transition-all duration-300 rounded-xl p-5 h-full flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[#1A2533] font-extrabold text-base leading-snug">{partner.name}</h3>
                    <span className="text-[10px] font-semibold text-[#C9A44B] bg-[#C9A44B]/10 px-2 py-0.5 rounded-full whitespace-nowrap">{partner.tag}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{partner.desc}</p>
                  <div className="mt-auto pt-2 border-t border-[#C9A44B]/15">
                    <div className="w-8 h-1 rounded-full bg-[#C9A44B]/40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground mb-2">لماذا فرصتي؟</h2>
            <p className="text-muted-foreground">أدوات متكاملة لبناء مسارك المهني</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Route, title: "رحلة مهنية متكاملة", desc: "٩ مراحل مدروسة تأخذك من اكتشاف ميولك حتى الحصول على وظيفتك المثالية" },
              { icon: Building2, title: "ربط بالبرامج الوطنية", desc: "تكامل مع تمهير وهدف ومسك ومهارات لتوفير أفضل الفرص التدريبية" },
              { icon: FileText, title: "سيرة ذاتية ذكية", desc: "بناء سيرة ذاتية احترافية تتكامل مع شهاداتك ومهاراتك تلقائياً" },
            ].map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
                <Card className="h-full hover:shadow-md transition-shadow border-card-border" data-testid={`feature-card-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Stages */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground mb-2">رحلتك في ٩ مراحل</h2>
            <p className="text-muted-foreground">خطوات واضحة نحو مستقبلك المهني</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
            {STAGES.map((stage, i) => {
              const Icon = iconMap[stage.icon];
              return (
                <motion.div
                  key={stage.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.05 } } }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground leading-tight">{stage.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#1A2533]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "٩", label: "مراحل مهنية" },
              { value: "+٥٠٠", label: "دورة تدريبية" },
              { value: "+٢٠٠", label: "فرصة عمل" },
              { value: "+٥٠", label: "جهة تدريبية" },
            ].map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.1 } } }} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#C9A44B] mb-1">{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-xl font-bold text-foreground mb-6">شركاؤنا في النجاح</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {["تمهير", "هدف", "مسك", "مهارات"].map((p) => (
                <div key={p} className="px-6 py-3 rounded-lg bg-muted border border-border" data-testid={`partner-${p}`}>
                  <span className="text-lg font-bold text-muted-foreground">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1A2533]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Zap className="w-10 h-10 text-[#C9A44B] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-3">مستعد لبدء رحلتك المهنية؟</h2>
            <p className="text-white/50 mb-6">سجل الآن وابدأ بخطوتك الأولى نحو مستقبل مهني ناجح</p>
            <Link href="/auth">
              <Button size="lg" className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-bold px-8" data-testid="btn-cta-register">
                سجل مجاناً
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ من نخدم؟ ══ */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground mb-2">من نخدم؟</h2>
            <p className="text-muted-foreground text-sm">فرصتي تخدم كل من يسعى لبناء مستقبل مهني أفضل</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: GraduationCap, title: "الطالب الجامعي", desc: "اكتشف مسارك قبل التخرج", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Briefcase, title: "الموظف", desc: "طوّر مهاراتك وانتقل للأفضل", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: UserCheck, title: "المتقاعد", desc: "استثمر خبرتك في مجال جديد", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Search, title: "الباحث عن عمل", desc: "ابحث عن فرصتك المثالية", color: "text-[#C9A44B]", bg: "bg-[#C9A44B]/10" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.45, delay: i * 0.1 } } }}
              >
                <Link href="/tracks">
                  <div className="bg-white border border-gray-100 hover:border-[#C9A44B]/50 hover:shadow-md transition-all duration-300 rounded-xl p-5 text-center cursor-pointer group h-full flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-bold text-[#1A2533] text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ مرصد التوظيف ══ */}
      <section className="py-14 bg-[#1A2533]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 md:p-10">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-[#C9A44B] blur-[100px]" />
              </div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A44B]/15 border border-[#C9A44B]/30 mb-4">
                    <BarChart3 className="w-3.5 h-3.5 text-[#C9A44B]" />
                    <span className="text-[#C9A44B] text-xs font-semibold">مرصد التوظيف الوطني</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-5">المرصد الوطني للتوظيف</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A44B]/15 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-[#C9A44B]" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-[#C9A44B]">12,847</p>
                        <p className="text-white/60 text-xs">وظيفة متاحة الآن</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A44B]/15 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-[#C9A44B]" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-[#C9A44B]">الذكاء الاصطناعي</p>
                        <p className="text-white/60 text-xs">المهارة الأكثر طلباً</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/observatory">
                  <Button size="lg" className="bg-[#C9A44B] hover:bg-[#b8933a] text-[#1A2533] font-black px-7 h-12 whitespace-nowrap">
                    استكشف المرصد
                    <ChevronRight className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ برامج هدف ══ */}
      <section className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">برامج هدف المدعومة</h2>
                <p className="text-muted-foreground text-sm">برامج توظيف وتدريب تدعمها هيئة تنمية الموارد البشرية</p>
              </div>
              <Link href="/observatory">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1 border-[#C9A44B]/40 text-[#C9A44B] hover:bg-[#C9A44B]/10">
                  عرض جميع البرامج
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {[
              { name: "تمهير", tag: "حتى ٢٠٠٠ ريال/شهر", color: "border-emerald-200 bg-emerald-50" },
              { name: "نطاقات", tag: "مستمر", color: "border-blue-200 bg-blue-50" },
              { name: "كفاءة", tag: "دعم مالي", color: "border-purple-200 bg-purple-50" },
              { name: "التدريب الصيفي", tag: "مدفوع", color: "border-amber-200 bg-amber-50" },
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.08 } } }}
              >
                <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border ${prog.color} hover:shadow-sm transition-all`}>
                  <div>
                    <p className="font-bold text-[#1A2533] text-sm">{prog.name}</p>
                    <p className="text-xs text-gray-500">{prog.tag}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: 0.35 } } }}
              className="sm:mr-auto"
            >
              <Link href="/observatory">
                <Button variant="outline" className="border-[#C9A44B]/40 text-[#C9A44B] hover:bg-[#C9A44B]/10 h-full min-h-[58px]">
                  عرض جميع البرامج
                  <ChevronRight className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2533] border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C9A44B] flex items-center justify-center">
              <span className="text-[#1A2533] font-black text-xs">ف</span>
            </div>
            <span className="text-white/70 text-sm font-medium">فرصتي</span>
          </div>
          <p className="text-white/40 text-xs">منتج من يسير لإدارة المشاريع © ٢٠٢٦</p>
        </div>
      </footer>
    </div>
  );
}
