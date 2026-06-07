"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  onSwitch: () => void;
}

export function SignInForm({ onSwitch }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof values>>({});

  const validate = () => {
    const e: Partial<typeof values> = {};
    if (!values.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    // TODO: replace with your auth call (NextAuth signIn, Supabase, etc.)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  const field = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-email" className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Email
        </Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => field("email", e.target.value)}
          className={cn("h-11 text-sm", errors.email && "border-destructive")}
        />
        {errors.email && (
          <p className="text-[11px] text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password" className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Password
          </Label>
          <button
            type="button"
            className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => field("password", e.target.value)}
            className={cn("h-11 pr-10 text-sm", errors.password && "border-destructive")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-destructive">{errors.password}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full text-[11px] uppercase tracking-widest">
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
      </Button>

      <p className="text-center text-[12px] text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-foreground underline-offset-2 hover:underline"
        >
          Create one
        </button>
      </p>
    </form>
  );
}