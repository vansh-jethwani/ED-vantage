export type Stream = "Science" | "Commerce" | "Arts" | "Vocational";

export type QuizOption = {
  label: string;
  weights: Partial<Record<Stream, number>>; // how strongly this option maps to streams
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Which school subjects do you enjoy the most?",
    options: [
      { label: "Maths & Science", weights: { Science: 3, Commerce: 1 } },
      { label: "Accounting & Business", weights: { Commerce: 3 } },
      { label: "Literature & Social Sciences", weights: { Arts: 3 } },
      { label: "Practical/Hands-on (IT, Design, Vocational)", weights: { Vocational: 3, Science: 1 } },
    ],
  },
  {
    id: "q2",
    text: "What type of work appeals to you?",
    options: [
      { label: "Research, experiments, problem-solving", weights: { Science: 3 } },
      { label: "Business, finance, entrepreneurship", weights: { Commerce: 3 } },
      { label: "Writing, arts, psychology, law", weights: { Arts: 3 } },
      { label: "Technical trades, design, IT support", weights: { Vocational: 3 } },
    ],
  },
  {
    id: "q3",
    text: "How do you prefer learning?",
    options: [
      { label: "Logical and analytical", weights: { Science: 2, Commerce: 1 } },
      { label: "Through real-world business cases", weights: { Commerce: 2 } },
      { label: "Creative and expressive", weights: { Arts: 2 } },
      { label: "Hands-on and practical", weights: { Vocational: 2, Science: 1 } },
    ],
  },
  {
    id: "q4",
    text: "Which exams or future goals sound exciting?",
    options: [
      { label: "JEE/NEET/Engineering/Medical", weights: { Science: 3 } },
      { label: "CA/CMA/Banking/Finance", weights: { Commerce: 3 } },
      { label: "UPSC/IAS/Media/Law/Design", weights: { Arts: 3 } },
      { label: "Polytechnic/Skill Courses/IT diplomas", weights: { Vocational: 3 } },
    ],
  },
  {
    id: "q5",
    text: "Pick an extracurricular you enjoy",
    options: [
      { label: "Science club/Robotics", weights: { Science: 2 } },
      { label: "Business club/Stock market", weights: { Commerce: 2 } },
      { label: "Debate/Theatre/Art", weights: { Arts: 2 } },
      { label: "DIY/Repair/Graphic design", weights: { Vocational: 2 } },
    ],
  },
  {
    id: "q6",
    text: "You prefer a career that is…",
    options: [
      { label: "Scientific & research oriented", weights: { Science: 2 } },
      { label: "Business & finance focused", weights: { Commerce: 2 } },
      { label: "People-centric & creative", weights: { Arts: 2 } },
      { label: "Skill-based & job-ready", weights: { Vocational: 2 } },
    ],
  },
  {
    id: "q7",
    text: "Which tool sounds more fun to use?",
    options: [
      { label: "Microscope/Lab tools", weights: { Science: 2 } },
      { label: "Excel/Trading platforms", weights: { Commerce: 2 } },
      { label: "Camera/Canva/Notion", weights: { Arts: 2 } },
      { label: "3D Printer/CAD/Power tools", weights: { Vocational: 2 } },
    ],
  },
  {
    id: "q8",
    text: "Pick a role model",
    options: [
      { label: "Scientist/Engineer/Doctor", weights: { Science: 2 } },
      { label: "Entrepreneur/Banker/CA", weights: { Commerce: 2 } },
      { label: "Writer/Lawyer/Designer", weights: { Arts: 2 } },
      { label: "Technician/Creator/Developer", weights: { Vocational: 2 } },
    ],
  },
  {
    id: "q9",
    text: "If a student scored 85 marks out of 170, what is the percentage?",
    options: [
      { label: "40%", weights: { } },
      { label: "45%", weights: { } },
      { label: "50%", weights: { Science: 2, Commerce: 2 } },
      { label: "55%", weights: { } },
    ],
  },
  {
    id: "q10",
    text: "The average of 5 numbers is 20. If one number is 25, what is the average of the remaining 4?",
    options: [
      { label: "18.5", weights: { } },
      { label: "19", weights: { Science: 2, Commerce: 2 } },
      { label: "20", weights: { } },
      { label: "21", weights: { } },
    ],
  },
  {
    id: "q11",
    text: "The simple interest on ₹5000 at 5% per annum for 2 years is:",
    options: [
      { label: "₹400", weights: { } },
      { label: "₹450", weights: { } },
      { label: "₹500", weights: { Science: 2, Commerce: 2 } },
      { label: "₹550", weights: { } },
    ],
  },
  {
    id: "q12",
    text: "Find the odd one out:",
    options: [
      { label: "Biology", weights: { } },
      { label: "Chemistry", weights: { } },
      { label: "Physics", weights: { } },
      { label: "History", weights: { Commerce: 3 } },
    ],
  },
  {
    id: "q13",
    text: "If in a code language, CAT = 24, then DOG = ?",
    options: [
      { label: "22", weights: { } },
      { label: "26", weights: { Commerce: 3 } },
      { label: "28", weights: { } },
      { label: "30", weights: { } },
    ],
  },
  {
    id: "q14",
    text: "Arrange the words in dictionary order:",
    options: [
      { label: "Mango, Market, March", weights: { } },
      { label: "March, Mango, Market", weights: { Commerce: 3 } },
      { label: "Market, Mango, March", weights: { } },
      { label: "Mango, March, Market", weights: { } },
    ],
  },
  {
    id: "q15",
    text: "Choose the correct spelling:",
    options: [
      { label: "Environment", weights: { Vocational: 3 } },
      { label: "Enviroment", weights: { } },
      { label: "Environmant", weights: { } },
      { label: "Enviranment", weights: { } },
    ],
  },
  {
    id: "q16",
    text: "Fill in the blank: \"The teacher was pleased ___ the student’s performance.\"",
    options: [
      { label: "at", weights: { } },
      { label: "with", weights: { Vocational: 3 } },
      { label: "for", weights: { } },
      { label: "of", weights: { } },
    ],
  },
  {
    id: "q17",
    text: "Find the synonym of Innovative:",
    options: [
      { label: "Creative", weights: { Vocational: 3 } },
      { label: "Boring", weights: { } },
      { label: "Silent", weights: { } },
      { label: "Weak", weights: { } },
    ],
  },
  {
    id: "q18",
    text: "Which of the following is not a renewable energy source?",
    options: [
      { label: "Solar", weights: { } },
      { label: "Wind", weights: { } },
      { label: "Coal", weights: { Arts: 3, Science: 1 } },
      { label: "Water", weights: { } },
    ],
  },
  {
    id: "q19",
    text: "If you rotate a square 45°, the new figure looks like:",
    options: [
      { label: "Rectangle", weights: { } },
      { label: "Rhombus/Diamond", weights: { Arts: 3, Science: 1 } },
      { label: "Circle", weights: { } },
      { label: "Triangle", weights: { } },
    ],
  },
  {
    id: "q20",
    text: "A box contains 4 red, 3 green, and 3 blue balls. What is the probability of picking a green ball?",
    options: [
      { label: "1/5", weights: { } },
      { label: "3/10", weights: { Arts: 3, Science: 1 } },
      { label: "3/5", weights: { } },
      { label: "2/5", weights: { } },
    ],
  },
];

export const streams: Stream[] = ["Science", "Commerce", "Arts", "Vocational"];

export function scoreResults(answerIndexes: number[]) {
  const totals: Record<Stream, number> = { Science: 0, Commerce: 0, Arts: 0, Vocational: 0 };
  quizQuestions.forEach((q, i) => {
    const idx = answerIndexes[i];
    if (idx == null) return;
    const opt = q.options[idx];
    Object.entries(opt.weights).forEach(([k, v]) => {
      totals[k as Stream] += v || 0;
    });
  });
  const max = Math.max(...Object.values(totals), 1);
  const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  const percentages = Object.fromEntries(
    Object.entries(totals).map(([k, v]) => [k, Math.round((v / sum) * 100)])
  ) as Record<Stream, number>;
  const top = (Object.entries(percentages).sort((a,b)=>b[1]-a[1])[0] || ["Science",0]) as [Stream, number];
  return { totals, percentages, topStream: top[0] };
}
