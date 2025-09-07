import { Button } from "@/components/ui/button";
import { GraduationCap, Compass, Brain, Building2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Typewriter({ text, speed = 95, eraseSpeed = 70, pause = 1400 }: { text: string; speed?: number; eraseSpeed?: number; pause?: number; }) {
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timer: number;
    if (!deleting && display.length < text.length) {
      timer = window.setTimeout(() => setDisplay(text.slice(0, display.length + 1)), speed);
    } else if (!deleting && display.length === text.length) {
      timer = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && display.length > 0) {
      timer = window.setTimeout(() => setDisplay(text.slice(0, display.length - 1)), eraseSpeed);
    } else if (deleting && display.length === 0) {
      setDeleting(false);
    }
    return () => window.clearTimeout(timer);
  }, [display, deleting, text, speed, eraseSpeed, pause]);

  return (
    <span aria-live="polite" aria-atomic="true">
      {display}
      <span className="ml-0.5 inline-block w-0.5 h-[1em] bg-foreground align-[-0.1em] animate-pulse" />
    </span>
  );
}

export default function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-50%,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-fuchsia-500/20 blur-2xl animate-float" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-violet-500/20 to-indigo-500/20 blur-2xl animate-float" style={{animationDelay:'1.2s'}} />
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-4 bg-background/60">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Empowering students after Class 10 & 12
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight animate-fade-in-up">
                <Typewriter text="Choose the right academic path with confidence" />
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl animate-fade-in" style={{animationDelay:'120ms'}}>
                ED-vantage helps you discover your best-fit stream, explore degree programs, and find colleges near you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{animationDelay:'220ms'}}>
                <NavLink to="/quiz"><Button size="lg" className="px-6"><Brain className="mr-2"/>Take Quiz</Button></NavLink>
                <NavLink to="/colleges"><Button size="lg" variant="secondary" className="px-6"><Building2 className="mr-2"/>Explore Colleges</Button></NavLink>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> No data sharing</div>
                <div className="flex items-center gap-2"><Compass className="text-amber-500"/> Personalized guidance</div>
              </div>
            </div>
            <div className="relative animate-fade-in-up" style={{animationDelay:'320ms'}}>
              <div className="mx-auto max-w-md lg:max-w-none">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <FeatureCard icon={<Brain />} title="Aptitude Quiz" desc="Discover your best-fit stream" color="from-emerald-500/20 to-emerald-500/5" />
                    <FeatureCard icon={<GraduationCap />} title="Courses" desc="Degree recommendations" color="from-indigo-500/20 to-indigo-500/5" />
                    <FeatureCard icon={<Building2 />} title="Colleges" desc="Nearby govt. colleges" color="from-fuchsia-500/20 to-fuchsia-500/5" />
                    <FeatureCard icon={<Compass />} title="Careers" desc="Job & exam pathways" color="from-amber-500/20 to-amber-500/5" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">Mobile-responsive • Accessible • Made for students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">How it works</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">Answer a few questions, get stream matches, explore courses and colleges, and track your progress.</p>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard step="1" title="Take the Quiz" desc="Get a percentage match for Science, Commerce, Arts, and Vocational." />
            <StepCard step="2" title="See Courses" desc="View degrees like B.Sc., B.Com, B.A., with career tags." />
            <StepCard step="3" title="Find Colleges" desc="Filter by city, stream, hostel/library availability." />
            <StepCard step="4" title="Plan Careers" desc="Follow pathways to jobs, higher studies, and exams." />
          </div>
          <div className="mt-10 flex justify-center">
            <NavLink to="/quiz"><Button size="lg">Start Now <ArrowRight className="ml-2"/></Button></NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string; }) {
  return (
    <div className={`rounded-xl border p-4 bg-gradient-to-br ${color} transition-transform duration-300 hover:scale-[1.02] hover:shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-background grid place-items-center text-primary">{icon}</div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string; }) {
  return (
    <div className="rounded-xl border bg-card p-5 transition-transform duration-300 hover:scale-[1.02]">
      <div className="text-xs font-semibold text-muted-foreground">STEP {step}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}
