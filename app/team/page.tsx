"use client";

import Link from "next/link";
import { SHRADDHA_DEVELOPERS_TEAM } from "@/lib/constants";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#fff5f0]">
      <nav className="sticky top-0 z-50 border-b border-orange-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-[#ff6b35] transition hover:text-[#e55a2b]">
            ← IoT Hackathon · Dhanalakshmi Srinivasan Engineering College
          </Link>
        </div>
      </nav>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="animate-fade-in-up text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Shraddha Developers Team
          </h1>
          <p className="mt-3 animate-fade-in-up text-center text-gray-600 animate-delay-100">
            Meet the team behind the hackathon
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {SHRADDHA_DEVELOPERS_TEAM.map((member, i) => (
              <div
                key={member.name}
                className="animate-fade-in-up group rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/50 transition-all duration-300 hover:-translate-y-2 hover:border-[#ff6b35] hover:shadow-xl hover:shadow-[#ff6b35]/20"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <span className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-0.5 text-sm font-medium text-[#ff6b35]">
                  {member.role}
                </span>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>
                    <a
                      href={`tel:${member.mobile.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 transition hover:text-[#ff6b35]"
                    >
                      <span className="text-orange-400">📞</span> {member.mobile}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 transition hover:text-[#ff6b35]"
                    >
                      <span className="text-orange-400">✉</span> {member.email}
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
