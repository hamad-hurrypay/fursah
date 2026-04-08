import { Switch, Route, Router, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import AptitudeTest from "@/pages/aptitude-test";
import SkillsAssessment from "@/pages/skills";
import Courses from "@/pages/courses";
import Certificates from "@/pages/certificates";
import Volunteer from "@/pages/volunteer";
import Jobs from "@/pages/jobs";
import Training from "@/pages/training";
import CVBuilder from "@/pages/cv-builder";
import Profile from "@/pages/profile";
import AppLayout from "@/components/app-layout";
import AdminDashboard from "@/pages/admin-dashboard";
import ObservatoryPage from "@/pages/observatory";
import SupervisorDashboard from "@/pages/supervisor-dashboard";
import CompanyDashboard from "@/pages/company-dashboard";
import UserTracks from "@/pages/user-tracks";
import Admissions from "@/pages/admissions";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Redirect to="/auth" />;
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function AppRouter() {
  const { user } = useAuth();
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth">
        {user ? <Redirect to="/dashboard" /> : <AuthPage />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/aptitude">
        <ProtectedRoute component={AptitudeTest} />
      </Route>
      <Route path="/skills">
        <ProtectedRoute component={SkillsAssessment} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={Courses} />
      </Route>
      <Route path="/certificates">
        <ProtectedRoute component={Certificates} />
      </Route>
      <Route path="/volunteer">
        <ProtectedRoute component={Volunteer} />
      </Route>
      <Route path="/jobs">
        <ProtectedRoute component={Jobs} />
      </Route>
      <Route path="/training">
        <ProtectedRoute component={Training} />
      </Route>
      <Route path="/cv-builder">
        <ProtectedRoute component={CVBuilder} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/observatory" component={ObservatoryPage} />
      <Route path="/tracks" component={UserTracks} />
      <Route path="/admissions" component={Admissions} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/supervisor-dashboard">
        <ProtectedRoute component={SupervisorDashboard} />
      </Route>
      <Route path="/company-dashboard">
        <ProtectedRoute component={CompanyDashboard} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
