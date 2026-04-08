import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Star, Search } from "lucide-react";
import { motion } from "framer-motion";

// ─── Data ──────────────────────────────────────────────────────────────────

const tracks = [
  {
    id: "student",
    icon: GraduationCap,
    title: "الطالب الجامعي",
    description: "ابدأ رحلتك المهنية من اليوم الأول في الجامعة",
    features: ["اختبار الميول RIASEC", "خارطة المسار التسع مراحل", "التدريب التعاوني"],
    cta: "ابدأ رحلة الطالب",
    href: "/auth",
  },
  {
    id: "employee",
    icon: Briefcase,
    title: "الموظف",
    description: "طور مهاراتك وابحث عن فرص أفضل",
    features: ["تقييم المهارات الحالية", "دورات متقدمة", "فرص العمل الجزئي والتطوع"],
    cta: "ابدأ مسار الموظف",
    href: "/auth",
  },
  {
    id: "retired",
    icon: Star,
    title: "المتقاعد",
    description: "خبرتك قيمة — نساعدك في توظيفها من جديد",
    features: ["بناء سيرة ذاتية احترافية", "فرص توظيف جزئي وكلي", "استشارات مهنية"],
    cta: "ابدأ مسار المتقاعد",
    href: "/auth",
  },
  {
    id: "jobseeker",
    icon: Search,
    title: "الباحث عن عمل",
    description: "اكتشف الفرص المناسبة لمهاراتك وميولك",
    features: ["مرصد سوق العمل", "مطابقة ذكية للوظائف", "توصيات مخصصة"],
    cta: "ابدأ البحث",
    href: "/auth",
  },
];

// ─── Animations ─────────────────────────────────────────────────────────────

const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Track Card ──────────────────────────────────────────────────────────────

function TrackCard({ track }: { track: (typeof tracks)[number] }) {
  const Icon = track.icon;

  return (
    <motion.div variants={cardVariants} className="group h-full">
      <Card className="border-card-border h-full flex flex-col transition-all duration-200 group-hover:border-[#C9A44B] group-hover:shadow-lg group-hover:shadow-[#C9A44B]/10">
        <CardContent className="p-6 flex flex-col flex-1 gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-[#C9A44B]/15 transition-colors duration-200">
            <Icon className="h-7 w-7 text-primary group-hover:text-[#C9A44B] transition-colors duration-200" />
          </div>

          {/* Title & description */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-1">{track.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-1.5 flex-1">
            {track.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link href={track.href}>
            <Button className="w-full mt-2" variant="default">
              {track.cta}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UserTracks() {
  return (
    <div dir="rtl" className="max-w-5xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">اختر مسارك</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          فرصتي تخدم الجميع — اختر المسار المناسب لك
        </p>
      </motion.div>

      {/* 2×2 grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-5 sm:grid-cols-2"
      >
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </motion.div>
    </div>
  );
}
