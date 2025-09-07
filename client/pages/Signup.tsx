import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("auth:user", JSON.stringify({ name, email }));
      toast.success("Account created");
      navigate("/", { replace: true });
    }, 600);
  };

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground">Sign up to get personalized guidance</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>It's quick and free</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Student Name" value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
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
                <UserPlus className="mr-2" /> {loading ? "Creating..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between w-full">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <NavLink to="/login" className="text-sm text-primary hover:underline">Log in</NavLink>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
