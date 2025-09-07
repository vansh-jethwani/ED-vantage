import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle, Send, Bot, User, MapPin, GraduationCap } from "lucide-react";
import { streams, type Stream } from "@/data/quiz";
import { getCareerPaths } from "@/data/careers";
import { recommendColleges, colleges } from "@/data/colleges";

interface Msg { role: "user" | "bot"; text: string; }

async function askGemini(prompt: string, history: Msg[] = []) {
  const safeHistory = history.slice(-8).map((m) => ({ role: m.role === "bot" ? "model" : "user", content: m.text }));
  const resp = await fetch("/api/chat/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, history: safeHistory }),
  });
  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return (data.text as string) || "";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: "bot",
    text: "Hi! I'm your Career Guide. Ask me about career pathways (e.g., 'Science careers'), colleges near a city (e.g., 'colleges near Pune'), or say 'near me' to use your saved location.",
  }]);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [msgs, open]);

  const cityIndex = useMemo(() => {
    const set = new Set<string>();
    for (const c of colleges) set.add(`${c.city.toLowerCase()},${c.state.toLowerCase()}`);
    return set;
  }, []);

  const parseStream = (t: string): Stream | null => {
    const s = t.toLowerCase();
    if (/(science|b\.sc|engineering|medical|neet|jee)/.test(s)) return "Science";
    if (/(commerce|b\.com|finance|account|ca|cma|bank)/.test(s)) return "Commerce";
    if (/(arts|humanities|psychology|law|upsc|media|design)/.test(s)) return "Arts";
    if (/(vocational|diploma|polytechnic|skill|it support)/.test(s)) return "Vocational";
    return null;
  };

  const nearestCityFromLocation = (lat: number, lon: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const haversine = (a:{lat:number;lon:number}, b:{lat:number;lon:number}) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat); const dLon = toRad(b.lon - a.lon);
      const s1 = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
      return 2 * R * Math.asin(Math.sqrt(s1));
    };
    let best: { city: string; state: string; lat: number; lon: number } | null = null;
    let bestD = Infinity;
    const seen = new Map<string, {city:string;state:string;lat:number;lon:number;count:number}>();
    for (const c of colleges) {
      const key = `${c.city}||${c.state}`;
      const prev = seen.get(key) || {city:c.city, state:c.state, lat:0, lon:0, count:0};
      prev.lat += c.latitude; prev.lon += c.longitude; prev.count += 1; seen.set(key, prev);
    }
    for (const v of seen.values()) {
      const p = { lat: v.lat / v.count, lon: v.lon / v.count };
      const d = haversine({lat,lon}, p);
      if (d < bestD) { bestD = d; best = { city: v.city, state: v.state, lat: p.lat, lon: p.lon }; }
    }
    return best;
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");

    const lower = text.toLowerCase();
    const streamFromText = parseStream(lower);

    // Colleges intent
    if (/college|colleges/.test(lower)) {
      // near me
      if (/near\s*me|nearby|around\s*me/.test(lower)) {
        try {
          const saved = JSON.parse(localStorage.getItem("user:location") || "null");
          if (saved?.lat && saved?.lon) {
            const bestCity = nearestCityFromLocation(saved.lat, saved.lon);
            const recs = recommendColleges(saved, streamFromText || undefined).slice(0,3);
            const lines = recs.map((r,i)=> `${i+1}. ${r.college.name} — ${r.college.city}, ${r.college.state}`);
            setMsgs((m)=>[...m, { role:"bot", text: bestCity ? `Closest city: ${bestCity.city}, ${bestCity.state}. Top colleges near you:\n${lines.join("\n")}` : `Top colleges near you:\n${lines.join("\n")}` }]);
          } else {
            setMsgs((m)=>[...m, { role:"bot", text: "I couldn't find your saved location. Type a city name like 'colleges in Pune' or allow location from Colleges page." }]);
          }
        } catch {
          setMsgs((m)=>[...m, { role:"bot", text: "Please try again or specify a city, e.g., 'best colleges in Jaipur'." }]);
        }
        return;
      }
      // in CITY
      const cityMatch = /in\s+([a-zA-Z .]+?)(?:,\s*([a-zA-Z .]+))?$/.exec(lower);
      if (cityMatch) {
        const city = (cityMatch[1] || "").trim();
        const state = (cityMatch[2] || "").trim();
        const key = `${city}${state?","+state:""}`.toLowerCase();
        const known = Array.from(cityIndex.values()).find((k)=> k.startsWith(city.toLowerCase()));
        if (known) {
          const [cName, sName] = known.split(",");
          const arr = recommendColleges(null, streamFromText || undefined).filter(({college})=> college.city.toLowerCase()===cName && college.state.toLowerCase()===sName).slice(0,3);
          const resp = arr.length ? arr.map((r,i)=> `${i+1}. ${r.college.name} — ${r.college.courses.join(", ")}`).join("\n") : "No data found for that city yet.";
          setMsgs((m)=>[...m, { role:"bot", text: `Top government colleges in ${cName[0].toUpperCase()+cName.slice(1)}, ${sName.toUpperCase()[0]+sName.slice(1)}:\n${resp}` }]);
        } else {
          setMsgs((m)=>[...m, { role:"bot", text: "I don't recognize that city. Try another or use 'near me' after saving your location on the Colleges page." }]);
        }
        return;
      }
    }

    // Career pathways intent
    if (/career|path|job|higher studies|exam/.test(lower) || streamFromText) {
      const s = streamFromText || ((): Stream | null => {
        try { return JSON.parse(localStorage.getItem("quizResults") || "null")?.topStream || null; } catch { return null; }
      })();
      if (!s) {
        setMsgs((m)=>[...m,{ role:"bot", text: "Tell me your stream (Science, Commerce, Arts, Vocational) or take the quiz for a match." }]);
        return;
      }
      const paths = getCareerPaths(s).slice(0,2);
      const out = paths.map((p)=> `• ${p.degree}\n  Jobs: ${p.jobs.join(", ")}\n  Higher: ${p.higherStudies.join(", ")}`).join("\n\n");
      setMsgs((m)=>[...m,{ role:"bot", text: `Here are pathways for ${s}:\n${out}` }]);
      return;
    }

    // Fallback → Gemini
    (async () => {
      try {
        setLoadingAI(true);
        const reply = await askGemini(text, msgs);
        setMsgs((m)=>[...m, { role:"bot", text: reply || "I couldn't generate a response. Try rephrasing." }]);
      } catch (e: any) {
        setMsgs((m)=>[...m, { role:"bot", text: "AI is unavailable right now. I can help with:\n• Careers (e.g., 'Science careers')\n• Colleges (e.g., 'colleges near me' or 'colleges in Pune')\n• Stream advice (take the Quiz)." }]);
      } finally {
        setLoadingAI(false);
      }
    })();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-5 right-5 rounded-full h-14 w-14 shadow-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white hover:opacity-90 animate-bounce-soft" aria-label="Open chatbot">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[92vw] sm:w-[440px] p-0 flex flex-col h-dvh max-h-dvh">
        <div className="px-4 pt-4 pb-3 bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10 border-b">
          <SheetTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4"/> Career Guide</SheetTitle>
          <div className="text-xs text-muted-foreground">Powered by Gemini + ED-vantage data</div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <div ref={viewportRef} className="flex-1 overflow-y-auto px-4">
            <div className="space-y-3 py-3">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-muted-foreground">
                    {m.role === "user" ? <User className="h-3.5 w-3.5"/> : <Bot className="h-3.5 w-3.5"/>}
                    {m.role === "user" ? "You" : "Career Guide"}
                  </div>
                  <div className={`${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-2xl px-3 py-2 shadow-sm animate-fade-in-up`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{m.text}</pre>
                  </div>
                </div>
              ))}
              {loadingAI && (
                <div className="mr-auto max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-muted-foreground"><Bot className="h-3.5 w-3.5"/>Career Guide</div>
                  <div className="bg-muted rounded-2xl px-3 py-2 inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-3 border-t bg-background">
            <div className="flex flex-wrap gap-2 mb-2">
              {['Science careers','Colleges near me','Commerce jobs','Best courses after 12th'].map(sug => (
                <Button key={sug} size="sm" variant="secondary" className="h-7 text-xs" onClick={()=>{ setInput(sug); setTimeout(()=>handleSend(),0); }}>{sug}</Button>
              ))}
            </div>
            <form onSubmit={(e)=>{ e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input placeholder="Ask about careers or colleges..." value={input} onChange={(e)=>setInput(e.target.value)} />
              <Button type="submit" disabled={!input.trim()} aria-label="Send"><Send className="h-4 w-4"/></Button>
            </form>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Tip: Try "best colleges near me" or "Commerce careers".
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
