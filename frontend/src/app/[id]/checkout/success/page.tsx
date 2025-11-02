"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const refId = searchParams.get("ref") || "HUF56&SO";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#24AC39] mb-6">
        <Check className="text-white w-10 h-10" />
      </div>

      <h1 className="text-2xl font-semibold text-[#161616] mb-2">
        Booking Confirmed
      </h1>
      <p className="text-gray-600 mb-8">Ref ID: {refId}</p>

      <button
        onClick={() => router.push("/")}
        className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
