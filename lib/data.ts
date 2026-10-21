import type { Member, Professor, Project, CourseArea } from "@/lib/types";

export const currentUser: Member = {
  name: "Alex Morgan",
  email: "alex.morgan@university.edu",
  course: "Computer Science",
  github: "https://github.com/alexmorgan",
  linkedin: "https://www.linkedin.com/in/alexmorgan",
};

export const professors: Professor[] = [
  {
    id: "ana",
    name: "Dr. Ana Silva",
    email: "ana.silva@university.edu",
    department: "Technology & Computer Science",
    image: "/images/avatar-47.jpg",
  },
  {
    id: "ricardo",
    name: "Dr. Ricardo Santos",
    email: "ricardo.santos@university.edu",
    department: "Engineering & Sustainability",
    image: "/images/avatar-12.jpg",
  },
  {
    id: "mariana",
    name: "Dr. Mariana Costa",
    email: "mariana.costa@university.edu",
    department: "Health Sciences",
    image: "/images/avatar-44.jpg",
  },
  {
    id: "carlos",
    name: "Dr. Carlos Oliveira",
    email: "carlos.oliveira@university.edu",
    department: "Education & Humanities",
    image: "/images/avatar-53.jpg",
  },
  {
    id: "beatriz",
    name: "Dr. Beatriz Lima",
    email: "beatriz.lima@university.edu",
    department: "Communication, Arts & Business",
    image: "/images/avatar-49.jpg",
  },
];

function member(name: string, course: string): Member {
  const handle = name.toLowerCase().replace(/\s/g, "");
  return {
    name,
    course,
    github: `https://github.com/${handle}`,
    linkedin: `https://www.linkedin.com/in/${handle}`,
  };
}

const seeds: {
  title: string;
  area: CourseArea;
  photo: string;
  alt: string;
  description: string;
  author: string;
  course: string;
  professor: number;
  website?: string;
  video?: string;
}[] = [
  {
    title: "EcoSense: a smarter, greener campus",
    area: "Technology",
    photo: "photo-1518770660439-4636190af475",
    alt: "Detailed electronic circuit board with integrated sensors",
    description:
      "An IoT solution that monitors energy consumption and helps our campus build a more sustainable future.",
    author: "Lucas Almeida",
    course: "Computer Science",
    professor: 0,
    website: "https://example.com",
    video: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
  {
    title: "ReForm: building a circular future",
    area: "Engineering",
    photo: "photo-1487958449943-2429e8be8625",
    alt: "Geometric glass and metal architecture with a striking triangular facade",
    description:
      "Transforming construction waste into sustainable materials for the next generation of urban spaces.",
    author: "Julia Fernandes",
    course: "Civil Engineering",
    professor: 1,
    website: "https://example.com",
  },
  {
    title: "Mindful: care that connects",
    area: "Health",
    photo: "photo-1474418397713-7ede21d49118",
    alt: "A person looking over a peaceful mountain landscape at sunrise",
    description:
      "Making mental well-being more accessible through a supportive, student-centered digital platform.",
    author: "Sofia Rodrigues",
    course: "Psychology",
    professor: 2,
  },
  {
    title: "OpenLearn: knowledge without limits",
    area: "Education",
    photo: "photo-1503676260728-1c00da094a0b",
    alt: "Books, colored pencils, an apple, and alphabet blocks on a classroom desk",
    description:
      "An inclusive learning experience that makes quality education accessible to every curious mind.",
    author: "Pedro Martins",
    course: "Pedagogy",
    professor: 3,
  },
  {
    title: "CityVoices: stories of belonging",
    area: "Communication and Arts",
    photo: "photo-1513364776144-60967b0f800f",
    alt: "Colorful art materials used for a collaborative community project",
    description:
      "A collaborative digital archive celebrating the people, cultures, and untold stories of our city.",
    author: "Isabella Souza",
    course: "Digital Media",
    professor: 4,
    website: "https://example.com",
  },
  {
    title: "AgroLink: from field to community",
    area: "Business",
    photo: "photo-1500382017468-9049fed747ef",
    alt: "Rolling green agricultural fields in warm morning light",
    description:
      "Connecting local farmers directly with communities to create a fairer, more sustainable food network.",
    author: "Gabriel Pereira",
    course: "Business Administration",
    professor: 4,
  },
  {
    title: "Stellar: mapping the night sky",
    area: "Exact Sciences",
    photo: "photo-1462331940025-496dfbfc7564",
    alt: "Colorful nebula and distant stars in deep space",
    description:
      "An open-source tool that turns astronomical datasets into an interactive map of our universe.",
    author: "Clara Santos",
    course: "Physics",
    professor: 0,
    video: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  },
  {
    title: "Memory Atlas: our shared history",
    area: "Humanities",
    photo: "photo-1481627834876-b7833e8f5570",
    alt: "Bookshelves filled with historical books and archived knowledge",
    description:
      "Preserving oral histories and connecting generations through an interactive community atlas.",
    author: "Rafael Lima",
    course: "History",
    professor: 3,
  },
  {
    title: "AccessPath: a campus for everyone",
    area: "Other",
    photo: "photo-1497366754035-f200968a6e72",
    alt: "Open accessible campus space filled with natural light",
    description:
      "Mapping accessible routes and shared spaces to make university life more inclusive for everyone.",
    author: "Laura Mendes",
    course: "Interdisciplinary Studies",
    professor: 1,
  },
  {
    title: "Neural Notes: listen, learn, discover",
    area: "Technology",
    photo: "photo-1451187580459-43490279c0fa",
    alt: "Earth at night with connected networks of city lights",
    description:
      "An assistive research companion that turns lecture recordings into structured, searchable notes.",
    author: "Bruno Ferreira",
    course: "Software Engineering",
    professor: 0,
  },
  {
    title: "Pulse: early insights, better health",
    area: "Health",
    photo: "photo-1576091160399-112ba8d25d1d",
    alt: "Health researcher reviewing medical information on a tablet",
    description:
      "A wearable prototype exploring how everyday health signals can support preventive care.",
    author: "Camila Rocha",
    course: "Biomedical Sciences",
    professor: 2,
  },
  {
    title: "SolarGrid: energy for tomorrow",
    area: "Engineering",
    photo: "photo-1509391366360-2e959784a276",
    alt: "Solar panels generating renewable energy in the sunlight",
    description:
      "A modular solar energy system designed to bring affordable, clean power to local communities.",
    author: "Felipe Costa",
    course: "Electrical Engineering",
    professor: 1,
    website: "https://example.com",
  },
];

export const projects: Project[] = seeds.map((seed, i) => ({
  id: String(i + 1),
  title: seed.title,
  area: seed.area,
  image: `/images/${seed.photo}.jpg`,
  imageAlt: seed.alt,
  description: seed.description,
  fullDescription: `${seed.description}\n\nDeveloped as a university research project, ${seed.title.split(":")[0]} brings classroom ideas into the real world. Our team worked with students, faculty, and community partners to understand the challenge, explore possible solutions, and build a working prototype.\n\nThe project follows a human-centered approach, combining research, iterative design, and hands-on testing. Early feedback helped us refine the experience and identify opportunities for meaningful impact.\n\nWe are sharing our work openly to encourage collaboration and inspire future research. Explore the repository to discover our methods, contribute ideas, or build on what we have learned.`,
  members: [
    member(seed.author, seed.course),
    member(
      ["Daniel Ribeiro", "Emma Oliveira", "Matheus Dias"][i % 3],
      seed.course,
    ),
  ],
  professor: professors[seed.professor],
  github: "https://github.com/topics/university-project",
  website: seed.website,
  video: seed.video,
  createdAt: new Date(Date.UTC(2026, 9, 20 - i)).toISOString(),
}));
