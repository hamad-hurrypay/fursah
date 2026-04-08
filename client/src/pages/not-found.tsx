import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background" dir="rtl">
      <Card className="w-full max-w-md mx-4 border-card-border">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground mb-2">الصفحة غير موجودة</h1>
          <p className="text-sm text-muted-foreground mb-4">عذراً، لم نتمكن من العثور على الصفحة المطلوبة</p>
          <Link href="/">
            <Button data-testid="btn-go-home">العودة للرئيسية</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
