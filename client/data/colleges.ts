export type College = {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  streams: ("Science" | "Commerce" | "Arts" | "Vocational")[];
  courses: string[];
  hostel: boolean;
  library: boolean;
  rating: number; // 1-5
};

export const colleges: College[] = [
  {
    id: "clg_1",
    name: "Govt. College of Science, Mumbai",
    city: "Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    latitude: 19.076,
    longitude: 72.8777,
    streams: ["Science", "Commerce"],
    courses: ["B.Sc. Physics", "B.Sc. Chemistry", "B.Com"],
    hostel: true,
    library: true,
    rating: 4.6,
  },
  {
    id: "clg_2",
    name: "Govt. Arts & Commerce College, Pune",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    streams: ["Arts", "Commerce"],
    courses: ["B.A. Psychology", "B.A. Economics", "B.Com"],
    hostel: true,
    library: true,
    rating: 4.4,
  },
  {
    id: "clg_3",
    name: "Govt. Polytechnic, Navi Mumbai",
    city: "Navi Mumbai",
    district: "Thane",
    state: "Maharashtra",
    latitude: 19.033,
    longitude: 73.0297,
    streams: ["Vocational", "Science"],
    courses: ["Diploma in IT", "Diploma in Mechanical"],
    hostel: false,
    library: true,
    rating: 4.2,
  },
  {
    id: "clg_4",
    name: "Delhi Govt. College of Arts",
    city: "New Delhi",
    district: "New Delhi",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    streams: ["Arts"],
    courses: ["B.A. English", "B.A. Fine Arts"],
    hostel: true,
    library: true,
    rating: 4.5,
  },
  {
    id: "clg_5",
    name: "Govt. Commerce College, Ahmedabad",
    city: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    streams: ["Commerce"],
    courses: ["B.Com", "BBA"],
    hostel: false,
    library: true,
    rating: 4.1,
  },
  {
    id: "clg_6",
    name: "Govt. Science College, Bengaluru",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    streams: ["Science"],
    courses: ["B.Sc. Computer Science", "B.Sc. Mathematics"],
    hostel: true,
    library: true,
    rating: 4.7,
  },
  {
    id: "clg_7",
    name: "Govt. Degree College, Jaipur",
    city: "Jaipur",
    district: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    streams: ["Arts", "Commerce"],
    courses: ["B.A. History", "B.Com"],
    hostel: true,
    library: true,
    rating: 4.3,
  },
  {
    id: "clg_8",
    name: "Govt. College, Lucknow",
    city: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8467,
    longitude: 80.9462,
    streams: ["Science", "Arts"],
    courses: ["B.Sc. Physics", "B.A. Political Science"],
    hostel: false,
    library: true,
    rating: 4.0,
  },
  {
    id: "clg_9",
    name: "Govt. Polytechnic, Chennai",
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    streams: ["Vocational"],
    courses: ["Diploma in Civil", "Diploma in ECE"],
    hostel: true,
    library: true,
    rating: 4.2,
  },
  {
    id: "clg_10",
    name: "Govt. Degree College, Kolkata",
    city: "Kolkata",
    district: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    streams: ["Arts", "Science"],
    courses: ["B.A. Sociology", "B.Sc. Chemistry"],
    hostel: true,
    library: true,
    rating: 4.3,
  },
];

export type GeoPoint = { lat: number; lon: number };

function haversine(a: GeoPoint, b: GeoPoint) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(s1 + s2));
  return R * c;
}

export function recommendColleges(user: GeoPoint | null, topStream?: "Science"|"Commerce"|"Arts"|"Vocational") {
  return colleges
    .map((c) => {
      const dist = user ? haversine(user, { lat: c.latitude, lon: c.longitude }) : Infinity;
      const proximityScore = user ? Math.max(0, 1 - Math.min(dist / 1000, 1)) : 0; // within 1000km
      const streamMatch = topStream && c.streams.includes(topStream) ? 1 : 0;
      const facility = (c.hostel ? 0.15 : 0) + (c.library ? 0.15 : 0);
      const ratingScore = (c.rating - 3) / 2; // normalize roughly 0..1
      const score = proximityScore * 0.45 + streamMatch * 0.3 + facility * 0.1 + ratingScore * 0.15;
      return { college: c, distKm: dist, score };
    })
    .sort((a, b) => b.score - a.score);
}
