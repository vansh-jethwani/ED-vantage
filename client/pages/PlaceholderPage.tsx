import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export default function PlaceholderPage({ title, description }: { title: string; description: string; }) {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        <div className="flex gap-3 justify-center">
          <NavLink to="/quiz"><Button>Take the Quiz</Button></NavLink>
          <NavLink to="/"><Button variant="outline">Back to Home</Button></NavLink>
        </div>
      </div>
    </section>
  );
}
