"use client";

import Link from "next/link";

const PROBLEM_TECH = [
  {
    year: "First Year",
    title: "Human Nutrition Tips",
    desc: "Web application frontend for nutrition guidance.",
    tech: ["React / Next.js", "HTML/CSS", "JavaScript", "Tailwind CSS"],
    queries: "Frontend UI/UX, state management, responsive design",
  },
  {
    year: "Second Year",
    title: "Health Management System",
    desc: "Full-stack health management solution.",
    tech: ["React / Next.js", "Node.js", "PostgreSQL", "Prisma", "REST API"],
    queries: "Backend APIs, database design, authentication",
  },
  {
    year: "Third Year",
    title: "Tenant Architecture of Health Management System",
    desc: "Multi-tenant architecture for health systems.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Multi-tenancy", "AWS/Vercel"],
    queries: "Tenant isolation, schema design, scalability",
  },
];

export default function QueriesTechPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#fff5f0]">
      <nav className="sticky top-0 z-50 border-b border-orange-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-[#ff6b35] transition hover:text-[#e55a2b]">
            ← Hackathon 2026
          </Link>
        </div>
      </nav>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="animate-fade-in-up text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Queries & Tech Stack
          </h1>
          <p className="mt-3 animate-fade-in-up text-center text-gray-600 animate-delay-100">
            Tech stack and common queries for each problem statement
          </p>

          <div className="mt-12 space-y-8">
            {PROBLEM_TECH.map((p, i) => (
              <div
                key={p.year}
                className="animate-fade-in-up group rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b35] hover:shadow-xl hover:shadow-[#ff6b35]/15"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <span className="rounded-full bg-[#ff6b35] px-4 py-1 text-sm font-semibold text-white">
                  {p.year}
                </span>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{p.title}</h2>
                <p className="mt-2 text-gray-600">{p.desc}</p>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-[#ff6b35]">
                    Tech Stack
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition group-hover:bg-orange-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-orange-50/80 p-4">
                  <h4 className="text-sm font-semibold text-gray-800">Common Queries</h4>
                  <p className="mt-1 text-sm text-gray-600">{p.queries}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
