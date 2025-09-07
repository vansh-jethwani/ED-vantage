import { useEffect, useMemo, useState } from "react";
import { recommendColleges, colleges } from "@/data/colleges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, School, Sparkles, LocateIcon, MapPinned, BadgeCheck } from "lucide-react";
import { streams, type Stream } from "@/data/quiz";
import { toast } from "sonner"; // Import the toast function

export default function Colleges() {
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedCityKey, setSelectedCityKey] = useState<string>("");
  const [selectedCityLabel, setSelectedCityLabel] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<Stream | "">("");

  useEffect(() => {
    const saved = localStorage.getItem("user:location");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (typeof p.lat === "number" && typeof p.lon === "number") setLoc(p);
      } catch {}
    }
  }, []);


  const topStream: any = (() => {
    try {
      const res = JSON.parse(localStorage.getItem("quizResults") || "null");
      return res?.topStream;
    } catch {
      return undefined;
    }
  })();

  const cityData = useMemo(() => {
    const acc = new Map<string, { city: string; state: string; lat: number; lon: number; count: number }>();
    for (const c of colleges) {
      const key = `${c.city}||${c.state}`;
      const prev = acc.get(key) || { city: c.city, state: c.state, lat: 0, lon: 0, count: 0 };
      prev.lat += c.latitude;
      prev.lon += c.longitude;
      prev.count += 1;
      acc.set(key, prev);
    }
    return Array.from(acc.values()).map((v) => ({
      key: `${v.city}||${v.state}`,
      city: v.city,
      state: v.state,
      lat: v.lat / v.count,
      lon: v.lon / v.count,
    })).sort((a,b)=> a.city.localeCompare(b.city));
  }, []);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  useEffect(() => {
    if (loc && cityData.length) {
      if (!selectedCityKey) {
        let nearest: { key: string; city: string; state: string; lat: number; lon: number } | null = null;
        let bestDist = Infinity;
        for (const c of cityData) {
          const d = haversine(loc.lat, loc.lon, c.lat, c.lon);
          if (d < bestDist) { bestDist = d; nearest = c; }
        }
        if (nearest) {
          setSelectedCityKey(nearest.key);
          setSelectedCityLabel(`${nearest.city}, ${nearest.state}`);
        }
      }
    }
  }, [loc, cityData, selectedCityKey]);

  const baseStream = selectedStream || topStream;
  const resultsAll = useMemo(() => recommendColleges(loc, baseStream as any), [loc, baseStream]);
  const resultsFiltered = useMemo(() => {
    let arr = resultsAll;
    if (selectedCityKey) arr = arr.filter(({ college }) => `${college.city}||${college.state}` === selectedCityKey);
    if (selectedStream) arr = arr.filter(({ college }) => college.streams.includes(selectedStream as Stream));
    return arr;
  }, [resultsAll, selectedCityKey, selectedStream]);
  const best = resultsFiltered[0] || resultsAll[0];

  const detectViaIP = async (): Promise<{ lat: number; lon: number } | null> => {
    try {
      const r1 = await fetch("https://ipapi.co/json/");
      if (r1.ok) {
        const j = await r1.json();
        if (typeof j.latitude === "number" && typeof j.longitude === "number") {
          return { lat: j.latitude, lon: j.longitude };
        }
      }
    } catch {}
    try {
      const r2 = await fetch("https://ipwho.is/");
      if (r2.ok) {
        const j = await r2.json();
        if (j.success && typeof j.latitude === "number" && typeof j.longitude === "number") {
          return { lat: j.latitude, lon: j.longitude };
        }
      }
    } catch {}
    return null;
  };

  const useMyLocation = async () => {
    setError("");
    setLoading(true);
    const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({ code: 0, message: "Geolocation not supported" });
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    });

    try {
      toast.info("Requesting location...", { description: "Please approve the browser's location permission." });
      const pos = await getPosition();
      const p = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      localStorage.setItem("user:location", JSON.stringify(p));
      setLoc(p);
      let nearest: { key: string; city: string; state: string; lat: number; lon: number } | null = null;
      let bestDist = Infinity;
      for (const c of cityData) {
        const d = haversine(p.lat, p.lon, c.lat, c.lon);
        if (d < bestDist) { bestDist = d; nearest = c; }
      }
      if (nearest) {
        setSelectedCityKey(nearest.key);
        setSelectedCityLabel(`${nearest.city}, ${nearest.state}`);
      }
      toast.success("Location detected!", { description: `Found colleges near ${nearest?.city || "your location"}.`});
    } catch (e: any) {
      const fallback = await detectViaIP();
      if (fallback) {
        const p = fallback;
        localStorage.setItem("user:location", JSON.stringify(p));
        setLoc(p);
        let nearest: { key: string; city: string; state: string; lat: number; lon: number } | null = null;
        let bestDist = Infinity;
        for (const c of cityData) {
          const d = haversine(p.lat, p.lon, c.lat, c.lon);
          if (d < bestDist) { bestDist = d; nearest = c; }
        }
        if (nearest) {
          setSelectedCityKey(nearest.key);
          setSelectedCityLabel(`${nearest.city}, ${nearest.state}`);
        }
        setError("");
        toast.success("Approximate location used", { description: `Based on IP. Found colleges near ${nearest?.city || "your area"}.` });
      } else {
        const code = e?.code;
        const reason = code === 1 ? "Permission denied" : code === 2 ? "Position unavailable" : code === 3 ? "Timeout" : "Unknown error";
        const msg = e?.message || reason;
        setError(`Location error: ${reason}${msg ? ` — ${msg}` : ""}`);
        toast.error("Location request failed", { description: reason });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">College Directory</h1>
        <p className="text-muted-foreground">{selectedCityLabel || selectedStream ? `Results for ${[selectedCityLabel, (selectedStream || baseStream || "") && `Stream: ${selectedStream || baseStream}`].filter(Boolean).join(" • ")}` : (loc ? `Personalized to your location${baseStream ? ` and stream (${baseStream})` : ""}.` : "Choose an option below to find nearby government colleges (AI suggested).")}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Find colleges near you</CardTitle>
          <CardDescription>Pick one option. We’ll use AI to suggest the best nearby option for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-2 flex items-center gap-2"><LocateIcon className="h-4 w-4"/> Detect my location</div>
              <p className="text-sm text-muted-foreground mb-3">Allow location access to automatically detect nearby government colleges.</p>
              <Button onClick={useMyLocation} disabled={loading}>{loading ? "Detecting..." : "Use My Location"}</Button>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-2 flex items-center gap-2"><MapPinned className="h-4 w-4"/> Select city</div>
              <p className="text-sm text-muted-foreground mb-3">Choose a city to see colleges and AI suggestions near that area.</p>
              <div className="flex gap-2">
                <div className="w-full">
                  <Select
                    value={selectedCityKey || undefined}
                    onValueChange={(value)=>{
                      const sel = cityData.find((c)=>c.key===value);
                      if (!sel) return;
                      const p = { lat: sel.lat, lon: sel.lon };
                      localStorage.setItem("user:location", JSON.stringify(p));
                      setLoc(p);
                      setSelectedCityKey(sel.key);
                      setSelectedCityLabel(`${sel.city}, ${sel.state}`);
                    }}
                  >
                    <SelectTrigger aria-label="Select City"><SelectValue placeholder="Select City"/></SelectTrigger>
                    <SelectContent>
                      {cityData.map((c)=> (
                        <SelectItem key={c.key} value={c.key}>{c.city}, {c.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium mb-2 flex items-center gap-2"><BadgeCheck className="h-4 w-4"/> Select subject/stream</div>
              <p className="text-sm text-muted-foreground mb-3">Pick a stream to tailor suggestions. You can combine with city/location.</p>
              <div className="w-full">
                <Select value={selectedStream || undefined} onValueChange={(value)=> setSelectedStream(value as Stream)}>
                  <SelectTrigger aria-label="Select Stream"><SelectValue placeholder="Select Stream"/></SelectTrigger>
                  <SelectContent>
                    {streams.map((s)=> (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {best && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold"><Sparkles className="h-4 w-4"/> AI Suggestion</div>
            <CardTitle>{best.college.name}</CardTitle>
            <CardDescription className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {best.college.city}, {best.college.state} • ~{best.distKm.toFixed(0)} km away</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {best.college.streams.map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}
              {best.college.hostel && <Badge>Hostel</Badge>}
              {best.college.library && <Badge>Library</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">Courses: {best.college.courses.join(", ")}</div>
          </CardContent>
          <CardFooter>
            <Button><School className="mr-2"/>View Details</Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(resultsFiltered.length ? resultsFiltered : resultsAll).slice(0, 9).map(({ college, distKm }, i) => (
          <Card key={college.id}>
            <CardHeader>
              <CardTitle className="text-lg">{college.name}</CardTitle>
              <CardDescription className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {college.city}, {college.state} • ~{isFinite(distKm) ? distKm.toFixed(0) : "—"} km</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {college.streams.map((s)=> <Badge key={s} variant="secondary">{s}</Badge>)}
                {college.hostel && <Badge>Hostel</Badge>}
                {college.library && <Badge>Library</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">Courses: {college.courses.join(", ")}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
