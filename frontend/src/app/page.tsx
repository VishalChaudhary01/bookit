"use client";
import ExperienceCard from "@/components/ExperienceCard";
import LoadingPage from "./loading";
import { useExperiences } from "@/hooks/useExperiences";

export default function Home() {
  const { data, error, isLoading } = useExperiences();
  const experiences = data?.experiences || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load experiences.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-6 items-start justify-center sm:justify-start">
          {experiences.map((experience: any) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
}
