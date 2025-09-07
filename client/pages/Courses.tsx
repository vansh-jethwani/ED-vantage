import { useMemo } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCareerPaths } from "@/data/careers";
import type { Stream } from "@/data/quiz";
import { Sparkles, GraduationCap, Briefcase, BookOpen } from "lucide-react";

function useQuizContext() {
  const location = useLocation() as any;
  const fromState = location?.state || {};
  return useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("quizResults") || "null");
      const breakdown: Record<Stream, number> = fromState.breakdown || stored?.percentages || { Science: 0, Commerce: 0, Arts: 0, Vocational: 0 };
      const topStream: Stream = fromState.topStream || stored?.topStream || "Science";
      return { breakdown, topStream } as { breakdown: Record<Stream, number>; topStream: Stream };
    } catch {
      return { breakdown: { Science: 0, Commerce: 0, Arts: 0, Vocational: 0 }, topStream: "Science" as Stream };
    }
  }, [location]);
}

export default function Courses() {
  const { breakdown, topStream } = useQuizContext();

  const orderedStreams = useMemo(() => {
    return (Object.keys(breakdown) as Stream[]).sort((a, b) => breakdown[b] - breakdown[a]);
  }, [breakdown]);

  const items = useMemo(() => {
    const list = orderedStreams.flatMap((s) => {
      const paths = getCareerPaths(s);
      return paths.map((p) => ({ ...p, stream: s }));
    });
    return list;
  }, [orderedStreams]);

  return (
    <section>
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/30">
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Course Recommendations</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Based on your quiz results. Top match: <span className="font-medium">{topStream}</span></p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {(Object.keys(breakdown) as Stream[]).map((s) => (
              <Badge key={s} variant={s === topStream ? "default" : "secondary"}>{s}: {breakdown[s]}%</Badge>
            ))}
          </div>
          <div className="mt-6">
            <NavLink to="/quiz"><Button variant="outline">Retake Quiz</Button></NavLink>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-xl border p-6 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{it.stream}</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-1">{it.degree}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {it.tags?.map((t: string) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
                <Badge className="shrink-0" variant="outline">Match: {breakdown[it.stream]}%</Badge>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium"><Briefcase className="h-4 w-4"/>Entry-level roles</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {it.jobs.map((j: string) => (<li key={j}>{j}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium"><BookOpen className="h-4 w-4"/>Exams / Higher studies</div>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {it.higherStudies.map((h: string) => (<li key={h}>{h}</li>))}
                  </ul>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <NavLink to="/colleges" state={{ stream: it.stream, degree: it.degree }}>
                  <Button size="sm"><Sparkles className="mr-2"/>Find Colleges</Button>
                </NavLink>
                <NavLink to="/careers" state={{ stream: it.stream }}>
                  <Button size="sm" variant="outline">Explore Careers</Button>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
