import type { Stream } from "@/data/quiz";

export type CareerPath = {
  degree: string;
  jobs: string[];
  higherStudies: string[]; // exams or postgraduate options
  tags?: string[];
};

const base: Record<Stream, CareerPath[]> = {
  Science: [
    {
      degree: "B.Sc. Physics",
      jobs: ["Lab Technician", "Data Analyst (entry)", "Research Assistant"],
      higherStudies: ["GATE", "CSIR-NET", "M.Sc. / Integrated PhD"],
      tags: ["Analytical", "Research"],
    },
    {
      degree: "B.Tech (any branch)",
      jobs: ["Software Engineer", "Junior Engineer", "QA Engineer"],
      higherStudies: ["GATE", "CAT (MBA)", "GRE"],
      tags: ["Technical", "In-demand"],
    },
    {
      degree: "MBBS/BHMS/BAMS (Medical)",
      jobs: ["Junior Doctor", "Resident", "Medical Officer"],
      higherStudies: ["NEET-PG", "USMLE", "MD/MS"],
      tags: ["Healthcare"],
    },
  ],
  Commerce: [
    {
      degree: "B.Com",
      jobs: ["Accountant", "Tax Associate", "Bank Clerk"],
      higherStudies: ["CA/CS/CMA", "MBA", "Bank PO (IBPS/SBI)"] ,
      tags: ["Finance", "Banking"],
    },
    {
      degree: "BBA",
      jobs: ["Business Analyst (entry)", "Marketing Associate", "Operations Exec"],
      higherStudies: ["MBA", "PGDM", "CAT/XAT/CMAT"],
      tags: ["Management"],
    },
  ],
  Arts: [
    {
      degree: "B.A. Psychology",
      jobs: ["HR Assistant", "Counsellor (entry)", "Research Intern"],
      higherStudies: ["MA/MSc Psychology", "NET/JRF", "MBA-HR"],
      tags: ["People", "Research"],
    },
    {
      degree: "B.A. English / History / Political Science",
      jobs: ["Content Writer", "Journalism Trainee", "Civil Services Aspirant"],
      higherStudies: ["UPSC/SSC", "LLB", "MA"],
      tags: ["Civil Services", "Law"],
    },
  ],
  Vocational: [
    {
      degree: "Diploma in Computer Engineering / IT",
      jobs: ["IT Support", "Junior Developer", "Network Technician"],
      higherStudies: ["Lateral Entry B.Tech", "Vendor Certs (CCNA, AWS)"] ,
      tags: ["Job-ready", "Tech"],
    },
    {
      degree: "Diploma in Mechanical / Civil / ECE",
      jobs: ["Technician", "CAD Operator", "Field Service Engineer"],
      higherStudies: ["AMIE", "Lateral Entry B.Tech", "Apprenticeships"],
      tags: ["Hands-on"],
    },
  ],
};

export function getCareerPaths(stream: Stream): CareerPath[] {
  return base[stream] || [];
}
