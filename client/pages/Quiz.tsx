import { useMemo, useState } from "react";
import { quizQuestions, scoreResults, streams } from "@/data/quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Sparkles } from "lucide-react";
import { getCareerPaths } from "@/data/careers";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const [answers, setAnswers] = useState<number[]>(Array(quizQuestions.length).fill(undefined));
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const progress = Math.round((step / quizQuestions.length) * 100);
  const result = useMemo(() => scoreResults(answers), [answers]);
  const bestDegree = useMemo(() => {
    try {
      const paths = getCareerPaths(result.topStream as any);
      return paths?.[0]?.degree || null;
    } catch {
      return null;
    }
  }, [result.topStream]);

  const onSelect = (optionIdx: number) => {
    const next = [...answers];
    next[step] = optionIdx;
    setAnswers(next);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, quizQuestions.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("quizResults", JSON.stringify(result));
  };

  return (
    <section>
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/30">
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Aptitude Quiz</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Answer a few questions to discover your best-fit stream across Science, Commerce, Arts, or Vocational. You'll get a percentage match for each stream.</p>
          {!submitted && <div className="mt-6"><Progress value={progress} /></div>}
        </div>
      </div>

      {!submitted && (
        <div className="container py-8">
          <div className="rounded-xl border bg-card">
            <div className="p-6 md:p-8">
              <p className="text-sm text-muted-foreground mb-4">Question {step + 1} of {quizQuestions.length}</p>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">{quizQuestions[step].text}</h2>
              <div className="grid gap-3">
                {quizQuestions[step].options.map((opt, idx) => {
                  const active = answers[step] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelect(idx)}
                      className={`text-left rounded-lg border p-4 transition-colors ${active ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {active && <CheckCircle2 className="text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={step===0}>Back</Button>
                {step < quizQuestions.length - 1 ? (
                  <Button onClick={nextStep} disabled={answers[step] == null}>Next</Button>
                ) : (
                  <Button onClick={submit} disabled={answers[step] == null}><Sparkles className="mr-2"/>See Results</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="container py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-xl border p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-2">Your Stream Matches</h3>
              <p className="text-muted-foreground mb-6">Percentage match based on your answers.</p>
              <div className="space-y-5">
                {streams.map((s) => {
                  const pct = result.percentages[s];
                  const color = s === "Science" ? "bg-emerald-500" : s === "Commerce" ? "bg-amber-500" : s === "Arts" ? "bg-rose-500" : "bg-indigo-500";
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm mb-2"><span className="font-medium">{s}</span><span className="text-muted-foreground">{pct}%</span></div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-3 items-center">
                <Button onClick={() => navigate("/courses", { state: { topStream: result.topStream, breakdown: result.percentages, bestDegree } })}>
                  <Sparkles className="mr-2"/>
                  {bestDegree ? `View Courses • Best: ${bestDegree}` : "View Course Recommendations"}
                </Button>
                <Button variant="outline" onClick={() => { setSubmitted(false); setStep(0); }}>Retake Quiz</Button>
              </div>
            </div>

            <div className="rounded-xl border p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-fuchsia-50 dark:from-indigo-950/30 dark:to-fuchsia-950/30">
              <h3 className="text-2xl font-semibold mb-3">What this means</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Use the breakdown to explore streams beyond just your top match.</li>
                <li>Head to Courses to see degrees like B.Sc., B.Com, B.A. and more.</li>
                <li>Save colleges after logging in to build your shortlist.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
