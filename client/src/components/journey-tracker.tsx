import { STAGES } from "@shared/schema";
import { Compass, Target, BookOpen, Award, Heart, Clock, Users, Briefcase, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = { Compass, Target, BookOpen, Award, Heart, Clock, Users, Briefcase, Trophy };

interface JourneyTrackerProps {
  currentStage: number;
  completedStages: number[];
  compact?: boolean;
}

export default function JourneyTracker({ currentStage, completedStages, compact }: JourneyTrackerProps) {
  const progress = Math.round((completedStages.length / STAGES.length) * 100);

  return (
    <div data-testid="journey-tracker" className="w-full">
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">رحلتك المهنية</h3>
          <span className="text-sm font-semibold text-primary">{progress}% مكتمل</span>
        </div>
      )}
      <div className="relative flex items-center justify-between gap-0 overflow-x-auto pb-2">
        {/* connecting line */}
        <div className="absolute top-5 right-5 left-5 h-0.5 bg-border z-0" />
        <div
          className="absolute top-5 right-5 h-0.5 bg-primary z-0 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        {STAGES.map((stage) => {
          const Icon = iconMap[stage.icon];
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          return (
            <div key={stage.id} className="flex flex-col items-center z-10 min-w-[64px]" data-testid={`stage-${stage.id}`}>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 border-primary text-primary animate-pulse"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!compact && (
                <span className={cn(
                  "text-[10px] mt-1.5 text-center leading-tight max-w-[60px]",
                  isCompleted ? "text-primary font-semibold" : isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {stage.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
