import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Compass, Target, BookOpen, Award, Heart, Briefcase,
  GraduationCap, FileText, UserCircle, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "الرئيسية",
    items: [
      { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "رحلتي المهنية",
    items: [
      { title: "اختبار الميول", href: "/aptitude", icon: Compass },
      { title: "تحديد المهارات", href: "/skills", icon: Target },
      { title: "الدورات", href: "/courses", icon: BookOpen },
      { title: "الشهادات", href: "/certificates", icon: Award },
      { title: "الأعمال التطوعية", href: "/volunteer", icon: Heart },
      { title: "فرص العمل", href: "/jobs", icon: Briefcase },
      { title: "التدريب", href: "/training", icon: GraduationCap },
    ],
  },
  {
    label: "أدواتي",
    items: [
      { title: "السيرة الذاتية", href: "/cv-builder", icon: FileText },
      { title: "الملف الشخصي", href: "/profile", icon: UserCircle },
    ],
  },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">ف</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-black text-sidebar-primary">فرصتي</h1>
            <p className="text-[10px] text-sidebar-foreground/60 -mt-1">رحلتك المهنية تبدأ هنا</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        data-testid={`nav-${item.href.slice(1)}`}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-accent-foreground text-xs font-bold">
              {user?.fullName?.charAt(0) || "م"}
            </span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.fullName}</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-sidebar-foreground/50 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            onClick={() => logoutMutation.mutate(undefined as any)}
            data-testid="btn-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
