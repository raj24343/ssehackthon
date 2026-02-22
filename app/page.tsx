"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FRONTEND_TEAM, BACKEND_TEAM, BRANCHES } from "@/lib/constants";

const NAV_ITEMS = ["Hero", "Prerequisites", "Problem Statements", "Register", "Form Team", "Teams", "Contact"];

const UPI_ID = "shraddhagroup123@ybl";
const REGISTRATION_FEE = 200;

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    year: "1",
    branch: "",
    phone: "",
    screenshot: "",
  });
  const [teamForm, setTeamForm] = useState({ teamName: "", rollNumbers: "" });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regMessage, setRegMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [teamMessage, setTeamMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [teams, setTeams] = useState<{ id: string; name: string; students: { name: string }[] }[]>([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setTeams(data) : setTeams([])))
      .catch(() => setTeams([]));
  }, []);

  const refreshTeams = () => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setTeams(data) : setTeams([])))
      .catch(() => setTeams([]));
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handlePayClick = () => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=ShraddhaGroup&am=${REGISTRATION_FEE}&cu=INR`;
    window.open(upiUrl, "_blank");
    setRegMessage({
      type: "success",
      text: "Complete payment in PhonePe/UPI app, take a screenshot of the success screen, and paste/upload it below.",
    });
  };

  const handleScreenshotPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setFormData((p) => ({ ...p, screenshot: reader.result as string }));
          reader.readAsDataURL(file);
          setRegMessage({ type: "success", text: "Screenshot pasted! You can now submit." });
        }
        break;
      }
    }
  };

  const handleScreenshotFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFormData((p) => ({ ...p, screenshot: reader.result as string }));
      reader.readAsDataURL(file);
      setRegMessage({ type: "success", text: "Screenshot uploaded!" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRegMessage(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setRegMessage({ type: "success", text: "Registration successful!" });
      setFormData({ name: "", rollNo: "", year: "1", branch: "", phone: "", screenshot: "" });
    } catch (err) {
      setRegMessage({ type: "error", text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rollNos = teamForm.rollNumbers.split(/[\s,;]+/).filter(Boolean);
    if (rollNos.length < 4 || rollNos.length > 5) {
      setTeamMessage({ type: "error", text: "Team must have 4 to 5 members (enter roll numbers)." });
      return;
    }
    setLoading(true);
    setTeamMessage(null);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: teamForm.teamName, rollNumbers: rollNos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Team creation failed");
      setTeamMessage({ type: "success", text: "Team created successfully!" });
      setTeamForm({ teamName: "", rollNumbers: "" });
      refreshTeams();
    } catch (err) {
      setTeamMessage({ type: "error", text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/98 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-xl font-bold text-[#ff6b35] sm:text-2xl">Hackathon 2K26</span>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s === "Hero" ? "hero" : s === "Form Team" ? "formteam" : s === "Teams" ? "teams" : s.toLowerCase().replace(/\s/g, ""))}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-orange-50 hover:text-[#ff6b35]"
              >
                {s}
              </button>
            ))}
            <Link href="/queries-tech" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-orange-50 hover:text-[#ff6b35]">
              Queries & Tech
            </Link>
            <Link href="/team" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-orange-50 hover:text-[#ff6b35]">
              Our Team
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#ff6b35] lg:hidden"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-orange-100 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s === "Hero" ? "hero" : s === "Form Team" ? "formteam" : s === "Teams" ? "teams" : s.toLowerCase().replace(/\s/g, ""))}
                  className="rounded-lg px-4 py-3 text-left font-medium text-gray-700 hover:bg-orange-50"
                >
                  {s}
                </button>
              ))}
              <Link href="/queries-tech" className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMobileMenuOpen(false)}>
                Queries & Tech
              </Link>
              <Link href="/team" className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-orange-50" onClick={() => setMobileMenuOpen(false)}>
                Our Team
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero - bold first impression */}
      <section
        id="hero"
        className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden bg-[#ff6b35] px-4 py-16 sm:py-24"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 25%, #e55a2b 50%, #ff6b35 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E\")" }} />
        {/* Floating shapes */}
        <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-white/10 blur-2xl animate-float" />
        <div className="absolute bottom-[15%] right-[15%] h-40 w-40 rounded-full bg-white/10 blur-3xl animate-float-slow" />
        <div className="absolute right-[20%] top-[40%] h-24 w-24 rounded-2xl border-2 border-white/20 rotate-12 animate-float" />
        <div className="absolute left-[20%] bottom-[30%] h-20 w-20 rounded-full border-2 border-white/20 animate-float-slow" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center text-center text-white">
          <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-base animate-delay-100">
            26 · 27 · 28 Feb 2026
          </p>
          <h1 className="animate-fade-in-up mt-4 text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl animate-delay-200">
            Build.
            <br />
            <span className="relative">
              Code.
              <span className="absolute -inset-1 bg-white/20 blur-xl" />
            </span>
            <br />
            Innovate.
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-xl text-lg text-white/95 sm:text-xl animate-delay-300">
            Join the hackathon. Form your team of 4–5. Build solutions that matter.
          </p>
          <div className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5 animate-delay-400">
            <button
              onClick={() => scrollTo("register")}
              className="min-w-[180px] rounded-2xl bg-white px-8 py-4 font-bold text-[#ff6b35] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
            >
              Register Now
            </button>
            <button
              onClick={() => scrollTo("formteam")}
              className="min-w-[180px] rounded-2xl border-2 border-white bg-white/10 px-8 py-4 font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/25 hover:shadow-xl active:scale-100"
            >
              Form Team
            </button>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section id="prerequisites" className="border-b border-orange-100 bg-[#fff5f0] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Prerequisites</h2>
          <p className="mt-2 text-gray-600">
            Please ensure you have the following before participating:
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {["Laptop", "VSCode", "Node.js installed", "Git installed"].map((item, i) => (
              <li
                key={item}
                className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100/50 hover:ring-[#ff6b35]/50"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white transition-transform duration-300 group-hover:scale-110">
                  ✓
                </span>
                <span className="font-medium group-hover:text-[#ff6b35] transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem Statements */}
      <section id="problemstatements" className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Problem Statements</h2>
          <p className="mt-2 text-gray-600">
            Choose based on your year. More features = better chance in the prize pool!
          </p>
          <Link
            href="/queries-tech"
            className="mt-2 inline-block text-sm font-medium text-[#ff6b35] underline-offset-2 transition hover:underline"
          >
            View Queries & Tech Stack →
          </Link>
          <div className="mt-8 space-y-6">
            {[
              { year: "First Year", title: "Human Nutrition Tips", desc: "Web application frontend for nutrition guidance." },
              { year: "Second Year", title: "Health Management System", desc: "Full-stack health management solution." },
              { year: "Third Year", title: "Tenant Architecture of Health Management System", desc: "Multi-tenant architecture for health systems." },
            ].map((p) => (
              <div
                key={p.year}
                className="group rounded-xl border-2 border-orange-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ff6b35] hover:shadow-lg hover:shadow-orange-100/50"
              >
                <span className="rounded-full bg-[#ff6b35] px-3 py-1 text-sm font-semibold text-white transition group-hover:scale-105">
                  {p.year}
                </span>
                <h3 className="mt-4 text-xl font-semibold transition group-hover:text-[#ff6b35]">{p.title}</h3>
                <p className="mt-2 text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register Form */}
      <section id="register" className="border-t border-orange-100 bg-[#fff5f0] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Individual Registration</h2>
          <p className="mt-2 text-gray-600">
            Register first. Then form your team with 4–5 members using roll numbers.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                required
                value={formData.rollNo}
                onChange={(e) => setFormData((p) => ({ ...p, rollNo: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
                placeholder="e.g. 21CS001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                required
                value={formData.year}
                onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select
                required
                value={formData.branch}
                onChange={(e) => setFormData((p) => ({ ...p, branch: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 transition-all"
              >
                <option value="">Select branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
                placeholder="10-digit mobile"
              />
            </div>

            {/* Payment */}
            <div className="rounded-xl border-2 border-orange-200 bg-white p-4 transition-all duration-300 hover:border-[#ff6b35] hover:shadow-md">
              <label className="block text-sm font-medium text-gray-700">Payment (₹{REGISTRATION_FEE})</label>
              <p className="mt-1 text-sm text-gray-500">UPI: {UPI_ID}</p>
              <button
                type="button"
                onClick={handlePayClick}
                className="mt-3 flex items-center gap-2 rounded-lg bg-[#ff6b35] px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#e55a2b] hover:shadow-lg"
              >
                Pay with PhonePe / UPI →
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Complete payment, take a screenshot of the success screen, then paste or upload below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Screenshot (paste or upload)
              </label>
              <div
                onPaste={handleScreenshotPaste}
                className="mt-1 flex min-h-[120px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-all duration-300 hover:border-[#ff6b35] hover:bg-orange-50/30"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotFile}
                  className="text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">Or paste (Ctrl+V) your screenshot here</p>
                {formData.screenshot && (
                  <img
                    src={formData.screenshot}
                    alt="Payment proof"
                    className="mt-2 max-h-32 rounded object-contain"
                  />
                )}
              </div>
            </div>

            {regMessage && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  regMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {regMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.screenshot}
              className="w-full rounded-xl bg-[#ff6b35] py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#e55a2b] hover:shadow-lg disabled:scale-100 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </section>

      {/* Form Team */}
      <section id="formteam" className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Form Your Team</h2>
          <p className="mt-2 text-gray-600">
            After registering, form a team of 4–5 members. Enter roll numbers of your teammates. Each
            student can only be in one team.
          </p>

          <form onSubmit={handleTeamSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Name</label>
              <input
                required
                value={teamForm.teamName}
                onChange={(e) => setTeamForm((p) => ({ ...p, teamName: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
                placeholder="e.g. CodeNinjas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Roll Numbers (4–5, comma or space separated)
              </label>
              <input
                required
                value={teamForm.rollNumbers}
                onChange={(e) => setTeamForm((p) => ({ ...p, rollNumbers: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30 hover:border-orange-200"
                placeholder="21CS001, 21CS002, 21CS003, 21CS004"
              />
            </div>

            {teamMessage && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  teamMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {teamMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ff6b35] py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#e55a2b] hover:shadow-lg disabled:scale-100 disabled:opacity-50"
            >
              {loading ? "Creating Team..." : "Create Team"}
            </button>
          </form>
        </div>
      </section>

      {/* Teams - list of registered teams */}
      <section id="teams" className="border-t border-orange-100 bg-[#fff5f0] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Registered Teams</h2>
          <p className="mt-2 text-gray-600">
            {teams.length} {teams.length === 1 ? "team" : "teams"} registered
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-xl border border-orange-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="font-semibold text-[#ff6b35]">{team.name}</h3>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  {team.students.map((s) => (
                    <li key={s.name}>{s.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {teams.length === 0 && (
            <p className="mt-6 text-center text-gray-500">No teams registered yet.</p>
          )}
        </div>
      </section>

      {/* Contact - attractive design */}
      <section id="contact" className="relative overflow-hidden border-t border-orange-100 bg-gradient-to-b from-[#fff9f7] to-[#fff5f0] px-4 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,107,53,0.08) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Get in Touch</h2>
            <p className="mt-3 text-lg text-gray-600">Have questions? We&apos;re here to help.</p>
            <Link
              href="/team"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              View Full Team
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {/* Frontend card */}
            <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/20 sm:p-8">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-transparent transition group-hover:scale-150" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Frontend Team</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {FRONTEND_TEAM.map((m) => (
                    <li key={m.name} className="rounded-xl p-4 transition hover:bg-orange-50/80">
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <a href={`tel:${m.mobile.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff6b35]">
                        <span className="text-[#ff6b35]">📞</span> {m.mobile}
                      </a>
                      <a href={`mailto:${m.email}`} className="mt-0.5 flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff6b35]">
                        <span className="text-[#ff6b35]">✉</span> {m.email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Backend card */}
            <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/20 sm:p-8">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-transparent transition group-hover:scale-150" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#e55a2b] text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Backend Team</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {BACKEND_TEAM.map((m) => (
                    <li key={m.name} className="rounded-xl p-4 transition hover:bg-orange-50/80">
                      <p className="font-semibold text-gray-900">{m.name}</p>
                      <a href={`tel:${m.mobile.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff6b35]">
                        <span className="text-[#ff6b35]">📞</span> {m.mobile}
                      </a>
                      <a href={`mailto:${m.email}`} className="mt-0.5 flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff6b35]">
                        <span className="text-[#ff6b35]">✉</span> {m.email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 bg-gray-900 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold text-[#ff6b35]">Hackathon 2K26</p>
          <p className="mt-1 text-sm text-gray-400">26 · 27 · 28 February</p>
        </div>
      </footer>
    </div>
  );
}
