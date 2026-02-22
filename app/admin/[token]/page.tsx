"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Student = {
  id: string;
  name: string;
  rollNo: string;
  year: number;
  branch: string;
  phone: string;
  screenshot: string | null;
  teamId: string | null;
  createdAt: string;
  team: { id: string; name: string } | null;
};

export default function AdminRegistrationsPage() {
  const params = useParams();
  const token = params.token as string;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/admin/registrations?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Access denied");
        return r.json();
      })
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Invalid URL</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
        <p className="text-red-600">Access denied or invalid link</p>
        <Link href="/" className="text-[#ff6b35] hover:underline">Back to home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">All Registrations</h1>
          <Link href="/" className="text-sm text-[#ff6b35] hover:underline">← Back to site</Link>
        </div>

        <p className="mb-6 text-gray-600">{students.length} registration(s)</p>

        <div className="space-y-6">
          {students.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Name</p>
                  <p className="font-semibold">{s.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Roll No</p>
                  <p>{s.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Year</p>
                  <p>{s.year}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Branch</p>
                  <p>{s.branch}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Phone</p>
                  <a href={`tel:${s.phone}`} className="text-[#ff6b35] hover:underline">{s.phone}</a>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-400">Team</p>
                  <p>{s.team?.name ?? "—"}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase text-gray-400">Payment Screenshot</p>
                {s.screenshot ? (
                  <a
                    href={s.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-xs"
                  >
                    <img
                      src={s.screenshot}
                      alt="Payment proof"
                      className="max-h-48 rounded-lg border object-contain"
                    />
                  </a>
                ) : (
                  <p className="text-gray-400">No screenshot</p>
                )}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Registered: {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <p className="text-center text-gray-500">No registrations yet.</p>
        )}
      </div>
    </div>
  );
}
