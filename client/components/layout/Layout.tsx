import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, MapPin, BrainCircuit, X, User, Bell, AlertCircle, CheckCircle2, Calendar, Gift, Newspaper } from "lucide-react";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ChatBot from "../chat/ChatBot";
import SplashCursor from "../effects/SplashCursor";

function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);
  if (!mounted) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function NotificationBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
      <div className="container flex flex-col md:flex-row gap-2 items-center justify-between py-2 text-sm">
        <p className="font-medium">Admissions & scholarships: Upcoming deadlines this month</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25 text-white">View Alerts</Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss"
            title="Dismiss"
            className="text-white/85 hover:text-white hover:bg-white/10 focus-visible:ring-white/40"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

type NotificationItem = { id: string; title: string; description: string; date: string; read: boolean };

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const raw = localStorage.getItem("app:notifications");
      if (raw) return JSON.parse(raw);
      const seed: NotificationItem[] = [
        {
          id: "scholarship-2025-nsp",
          title: "National Scholarship Portal: New cycle open",
          description: "Apply for Post-Matric and Merit-cum-Means scholarships before Oct 31.",
          date: new Date().toISOString(),
          read: false,
        },
        {
          id: "state-scholarship",
          title: "State Govt Scholarship",
          description: "Your state has announced fresh UG/PG fee waivers for eligible students.",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          read: false,
        },
        {
          id: "news-career-fair",
          title: "Career Guidance Fair this weekend",
          description: "Meet colleges and counselors, free entry with student ID.",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          read: true,
        },
      ];
      localStorage.setItem("app:notifications", JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const unread = notifications.filter((n) => !n.read).length;
  const save = (items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem("app:notifications", JSON.stringify(items));
  };
  const markAllRead = () => save(notifications.map((n) => ({ ...n, read: true })));
  const clearAll = () => save([]);

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const pickIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("scholar") || t.includes("grant")) return <Gift className="h-4 w-4"/>;
    if (t.includes("deadline") || t.includes("fair") || t.includes("event")) return <Calendar className="h-4 w-4"/>;
    if (t.includes("update") || t.includes("news")) return <Newspaper className="h-4 w-4"/>;
    if (t.includes("success") || t.includes("approved") || t.includes("verified")) return <CheckCircle2 className="h-4 w-4"/>;
    return <AlertCircle className="h-4 w-4"/>;
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!containerRef.current) return;
      if (
        containerRef.current.contains(target)
      ) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        ref={btnRef}
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground grid place-items-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 mt-2 w-[22rem] rounded-xl border bg-popover text-popover-foreground shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">Notifications</div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={markAllRead} disabled={unread===0}>Mark all</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearAll}>Clear</Button>
              </div>
            </div>
          </div>
          <div className="max-h-80 overflow-auto p-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Bell className="h-6 w-6 mx-auto mb-2 text-muted-foreground/60" />
                You're all caught up
                <div className="text-xs mt-1">No new notifications</div>
              </div>
            ) : (
              notifications
                .slice()
                .sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime())
                .map((n) => (
                  <button
                    key={n.id}
                    onClick={() => save(notifications.map(x => x.id===n.id ? { ...x, read: !x.read } : x))}
                    className={`group w-full text-left rounded-lg border p-3 transition-colors ${n.read ? "bg-background hover:bg-muted/50" : "bg-secondary hover:bg-secondary/80"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-8 w-8 shrink-0 rounded-full grid place-items-center ${n.read ? "bg-muted" : "bg-primary/10 text-primary"}`}>
                        {pickIcon(n.title)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium leading-tight truncate">{n.title}</div>
                          {!n.read && <span className="ml-auto inline-block h-2 w-2 rounded-full bg-primary" aria-label="unread" />}
                        </div>
                        <div className="text-muted-foreground text-xs mt-0.5">{relativeTime(n.date)}</div>
                        <div className="mt-1 text-[13px] text-muted-foreground/90 line-clamp-3">{n.description}</div>
                      </div>
                    </div>
                  </button>
                ))
            )}
          </div>
          <div className="p-2 border-t text-center">
            <Button variant="ghost" size="sm" className="h-8">View all</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 grid place-items-center text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">ED-vantage</div>
            <div className="text-xs text-muted-foreground -mt-0.5">The Edge You Need</div>
          </div>
        </NavLink>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/quiz" className={({isActive})=>`hover:text-primary ${isActive?"text-primary font-semibold":"text-muted-foreground"}`}>Take Quiz</NavLink>
          <NavLink to="/colleges" className={({isActive})=>`hover:text-primary ${isActive?"text-primary font-semibold":"text-muted-foreground"}`}>Explore Colleges</NavLink>
          <NavLink to="/careers" className={({isActive})=>`hover:text-primary ${isActive?"text-primary font-semibold":"text-muted-foreground"}`}>Career Paths</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <NotificationBell />
          <UserAccountSheet />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10 mt-10">
      <div className="container grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg mb-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 grid place-items-center text-white">
              <MapPin className="h-4 w-4" />
            </div>
            ED-vantage
          </div>
          <p className="text-muted-foreground">Helping students choose the right path after Class 10 and 12.</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Explore</p>
          <div className="flex flex-col gap-1">
            <NavLink to="/quiz" className="text-muted-foreground hover:text-foreground">Aptitude Quiz</NavLink>
            <NavLink to="/courses" className="text-muted-foreground hover:text-foreground">Courses</NavLink>
            <NavLink to="/colleges" className="text-muted-foreground hover:text-foreground">Colleges</NavLink>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Resources</p>
          <div className="flex flex-col gap-1">
            <NavLink to="/careers" className="text-muted-foreground hover:text-foreground">Career Pathways</NavLink>
          </div>
        </div>
      </div>
      <div className="container pt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} ED-vantage Platform</div>
    </footer>
  );
}

function UserAccountSheet() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; photoUrl?: string; phone?: string; city?: string } | null>(null);
  const [form, setForm] = useState<{ name?: string; email?: string; photoUrl?: string; phone?: string; city?: string }>({});
  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("auth:user") || "null"); setUser(u); setForm(u || {}); } catch { setUser(null); setForm({}); }
  }, [open]);
  const saveProfile = () => { const u = { ...(user||{}), ...form }; setUser(u); localStorage.setItem("auth:user", JSON.stringify(u)); };
  const logout = () => { localStorage.removeItem("auth:user"); setUser(null); setForm({}); };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({ ...f, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const quiz = (() => { try { return JSON.parse(localStorage.getItem("quizResults") || "null"); } catch { return null; } })();
  const savedColleges: any[] = (() => { try { return JSON.parse(localStorage.getItem("saved:colleges") || "[]"); } catch { return []; } })();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[380px] sm:w-[440px] p-0 flex flex-col">
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-white/20">
              <AvatarImage src={form.photoUrl || user?.photoUrl} alt={user?.name || user?.email || "User"} />
              <AvatarFallback>{(user?.name || user?.email || "").slice(0,2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm opacity-80">Signed in as</div>
              <div className="font-semibold leading-tight">{user?.name || user?.email || "Guest"}</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 space-y-6 text-sm overflow-y-auto">
          {!user && (
            <div className="rounded-md border p-3 flex gap-2">
              <NavLink to="/login" onClick={()=>setOpen(false)}><Button size="sm">Log In</Button></NavLink>
              <NavLink to="/signup" onClick={()=>setOpen(false)}><Button size="sm" variant="outline">Sign Up</Button></NavLink>
            </div>
          )}

          <section>
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground">Profile</h3>
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="profilePic">Profile Picture</Label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-foreground hover:file:bg-secondary/80 cursor-pointer"
                  onChange={handleFileChange}
                />
                {form.photoUrl && (
                  <div className="mt-2">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/30">
                      <AvatarImage src={form.photoUrl} alt="Profile Preview" />
                      <AvatarFallback>{(user?.name || user?.email || "").slice(0,2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" value={form.name || ""} onChange={(e)=> setForm(f=>({...f, name: e.target.value}))} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" value={form.email || ""} onChange={(e)=> setForm(f=>({...f, email: e.target.value}))} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91 ..." value={form.phone || ""} onChange={(e)=> setForm(f=>({...f, phone: e.target.value}))} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Your city" value={form.city || ""} onChange={(e)=> setForm(f=>({...f, city: e.target.value}))} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveProfile}>Save</Button>
                <Button size="sm" variant="outline" onClick={()=> setForm(user || {})}>Reset</Button>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <p className="text-xs text-muted-foreground mb-1">Quiz</p>
            {quiz ? (
              <div className="rounded-md border p-3">
                <div className="flex justify-between"><span>Top Stream</span><span className="font-medium">{quiz.topStream}</span></div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {Object.entries(quiz.percentages || {}).map(([k,v]: any)=> (
                    <span key={k} className="px-2 py-1 rounded bg-secondary text-xs">{k}: {v}%</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <NavLink to="/careers" onClick={()=>setOpen(false)}><Button size="sm">Career Paths</Button></NavLink>
                  <NavLink to="/colleges" onClick={()=>setOpen(false)}><Button size="sm" variant="outline">Nearby Colleges</Button></NavLink>
                </div>
              </div>
            ) : (
              <div className="rounded-md border p-3 text-muted-foreground">No quiz taken yet.</div>
            )}
          </section>

          <section>
            <p className="text-xs text-muted-foreground mb-1">Saved Colleges</p>
            {savedColleges.length ? (
              <ul className="space-y-2">
                {savedColleges.slice(0,5).map((c:any)=> (
                  <li key={c.id} className="flex justify-between"><span>{c.name}</span><span className="text-xs text-muted-foreground">{c.city}</span></li>
                ))}
              </ul>
            ) : (
              <div className="rounded-md border p-3 text-muted-foreground">No saved colleges.</div>
            )}
          </section>
        </div>
        <div className="mt-auto p-4 border-t">
          {user && <Button variant="outline" className="w-full" onClick={logout}>Log out</Button>}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function WelcomeAuthDialog() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("auth:user") || "null");
      const skipped = localStorage.getItem("auth:skipped");
      if (!user && !skipped) setOpen(true);
    } catch { /* noop */ }
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to ED-vantage</DialogTitle>
          <DialogDescription>Log in or sign up to save your progress. You can also skip for now.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <NavLink to="/login" onClick={()=>setOpen(false)}><Button className="w-full sm:w-auto">Log In</Button></NavLink>
          <NavLink to="/signup" onClick={()=>setOpen(false)}><Button className="w-full sm:w-auto" variant="secondary">Sign Up</Button></NavLink>
          <Button className="w-full sm:w-auto" variant="outline" onClick={()=>{ localStorage.setItem("auth:skipped","1"); setOpen(false); }}>Skip for now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <WelcomeAuthDialog />
      <NotificationBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SplashCursor />
      <ChatBot />
    </div>
  );
}
