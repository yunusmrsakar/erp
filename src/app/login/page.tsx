import { LoginForm } from "@/components/auth/LoginForm";
import { Database } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Database className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Nexus ERP
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Sisteme giriş yapmak için bilgilerinizi girin.
          </p>
        </div>
        
        <LoginForm />
      </div>
    </main>
  );
}
