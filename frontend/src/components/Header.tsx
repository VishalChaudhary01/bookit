"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const trimmed = searchQuery.trim();

    const params = new URLSearchParams(window.location.search);
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center space-x-2"
          >
            <Image
              src="/logo.png"
              alt="Bookit Logo"
              width={100}
              height={55}
              priority
            />
          </div>
          <div className="relative max-w-2xl flex items-center gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-3 bg-[#EDEDED] rounded-md text-[#161616] focus:outline-none focus:ring-1 focus:ring-[#FFD643] w-[180px] md:w-[340px]"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-[#FFD643] text-sm font-medium text-[#161616] rounded-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
