import { useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { LuBrain } from "react-icons/lu";
import { useLayoutEffect, useState } from "react";
import { Content, SharedLinkRes } from "../interfaces/generic";
import { GetAllContentsByShareLink } from "../services/api/content.api";
import Card from "../components/ui/Card";
import { AxiosError } from "axios";

export default function Share() {
  const params = useParams();
  const [user, setUser] = useState<{ _id: string; userName: string } | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const getContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: SharedLinkRes = await GetAllContentsByShareLink({
          shareLink: params.shareLink || "",
        });

        if (response.ok) {
          const res = response.data;
          setUser(res.user);
          setContents(res.content);
        } else {
          setUser(null);
          setContents([]);
          setError(response.message || "Failed to load shared brain.");
        }
      } catch (err) {
        const message =
          ((err as AxiosError)?.response?.data as { message?: string })?.message ||
          "Something went wrong while fetching shared content.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getContent();
  }, [params]);

  // 🌀 Loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center px-4">
        <LuBrain size="3rem" color="#463ad6" />
        <p className="mt-3 text-xl font-semibold text-gray-800">Second Brain</p>
        <p className="mt-1 text-red-500 text-sm">{error}</p>
        <Button
          variant="primary"
          text="Go to Home"
          onClick={() => (window.location.href = "/")}
          className="mt-4"
        />
      </div>
    );
  }

  // 🧠 Empty state
  if (contents.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center px-4">
        <LuBrain size="3rem" color="#463ad6" />
        <p className="mt-3 text-xl font-semibold text-gray-800">
          {user ? `${user.userName}'s Second Brain` : "Second Brain"}
        </p>
        <p className="mt-2 text-gray-500 text-sm">No shared content available.</p>
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-8 md:px-12 py-8">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <LuBrain size="2rem" color="#463ad6" />
          <h3 className="text-2xl font-bold text-[#202b3c]">
            {user ? `${user.userName}'s Second Brain` : "Second Brain"}
          </h3>
        </div>

        <Button
          variant="primary"
          text="Sign In"
          onClick={() => window.open("/signin", "_blank")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium"
        />
      </header>

      {/* Shared content grid */}
      <main className="flex justify-center">
        <div className="grid w-full max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
          {contents.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              title={item.title}
              link={item.link}
              type={item.contentType}
              deleteCard={() => {}}
              isDelete={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
