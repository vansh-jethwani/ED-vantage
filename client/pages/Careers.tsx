import { useMemo, useState } from "react";
import { streams, type Stream } from "@/data/quiz";
import { getCareerPaths, type CareerPath } from "@/data/careers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Briefcase, Landmark } from "lucide-react";

const streamBackgrounds: Record<Stream, string> = {
  Science: "https://images.pexels.com/photos/22690751/pexels-photo-22690751.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Commerce: "https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Arts: "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1600",
  Vocational: "https://images.pexels.com/photos/9242206/pexels-photo-9242206.jpeg?auto=compress&cs=tinysrgb&w=1600",
};


export default function Careers() {
  const quizTop: Stream | undefined = (() => {
    try { return JSON.parse(localStorage.getItem("quizResults") || "null")?.topStream; } catch { return undefined; }
  })();

  const [stream, setStream] = useState<Stream | "">(quizTop || "");

  const paths: CareerPath[] = useMemo(() => (stream ? getCareerPaths(stream as Stream) : []), [stream]);

  return (
    <section className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Career Pathways</h1>
        <p className="text-muted-foreground">Select your stream to view an AI-guided pathway: Degree → Job Options → Higher Studies/Exams.</p>
      </div>

      <div
        className={stream ? "relative mb-6 overflow-hidden rounded-lg bg-cover bg-center" : "mb-6"}
        style={stream ? { backgroundImage: `url(${streamBackgrounds[stream as Stream]})` } : undefined}
      >
        {stream && <div className="absolute inset-0 bg-black/40" />}
        <div className="relative z-10">
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader>
              <CardTitle className={stream ? "text-xl text-white" : "text-xl"}>Choose your subject/stream</CardTitle>
              <CardDescription className={stream ? "text-white/80" : undefined}>We’ll tailor the pathway to your selection. If you took the quiz, we prefill your top match.</CardDescription>
            </CardHeader>
          </Card>
          <div className="px-6 pb-6">
            <div className="w-full sm:w-64">
              <Select value={stream || undefined} onValueChange={(v)=> setStream(v as Stream)}>
                <SelectTrigger aria-label="Select Stream"><SelectValue placeholder="Select Stream"/></SelectTrigger>
                <SelectContent>
                  {streams.map((s)=> (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {stream && (
        <div className="grid md:grid-cols-2 gap-6">
          {paths.map((p, idx) => (
            <Card key={idx} className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {p.degree}
                </CardTitle>
                <CardDescription>AI suggested pathway for {stream}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2"><Briefcase className="h-4 w-4"/> Job Options</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {p.jobs.map((j, i)=>(<li key={i}>{j}</li>))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-2"><Landmark className="h-4 w-4"/> Higher Studies / Exams</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {p.higherStudies.map((h, i)=>(<li key={i}>{h}</li>))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
