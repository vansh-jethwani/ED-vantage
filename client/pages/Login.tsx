import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { redirectTo?: string } } as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("auth:user", JSON.stringify({ email }));
      toast.success("Logged in successfully");
      const redirect = location?.state?.redirectTo || "/";
      navigate(redirect, { replace: true });
    }, 600);
  };

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Log in to continue</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Log In</CardTitle>
            <CardDescription>Use your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                <LogIn className="mr-2" /> {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between w-full">
            <span className="text-sm text-muted-foreground">Don't have an account?</span>
            <NavLink to="/signup" className="text-sm text-primary hover:underline">Create one</NavLink>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
