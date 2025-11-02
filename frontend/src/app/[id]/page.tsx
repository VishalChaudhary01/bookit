"use client";
import { ArrowLeft, MapPin, Clock, Plus, Minus } from "lucide-react";
import { useExperienceById } from "@/hooks/useExperienceById";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useBookingStore } from "@/store/bookingStore";

interface ISlot {
  time: string;
  available: number;
}

interface IDates {
  date: string;
  slots: ISlot[];
}

export default function ExperienceDetails() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const { data, error, isLoading } = useExperienceById(id);
  const experience = data?.experience;

  const { setBooking } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    setBooking({ experienceId: id, selectedDate, selectedSlot, quantity });

    router.push(`/${id}/checkout`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading experience details...
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Failed to load experience details.
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl shadow-sm overflow-hidden">
            <Image
              src={experience.imageUrl}
              alt={experience.title}
              width={1200}
              height={600}
              className="w-full h-96 object-cover"
              priority
            />
          </div>

          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-[#161616] mb-4">
                {experience.title}
              </h1>
              <p className="text-base text-[#6C6C6C]">
                {experience.description}
              </p>
            </div>

            <div className="">
              <h2 className="text-lg font-medium text-[#161616] mb-3">
                Choose date
              </h2>
              <div className="flex items-center flex-wrap gap-2.5">
                {experience.dates.map((d: IDates) => (
                  <button
                    key={d.date}
                    onClick={() => {
                      setSelectedDate(d.date);
                      setSelectedSlot(null);
                    }}
                    className={`px-3 py-2 rounded-sm text-sm transition-colors ${
                      selectedDate === d.date
                        ? "bg-[#FFD643] text-[#161616]"
                        : "border border-[#BDBDBD] text-[#838383]"
                    }`}
                  >
                    {new Date(d.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-[#161616] mb-3">
                  Choose time
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {experience.dates
                    .find((d: any) => d.date === selectedDate)
                    ?.slots.map((slot: ISlot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedSlot(slot.time)}
                        disabled={!slot.available}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-sm transition-colors text-sm ${
                          selectedSlot === slot.time
                            ? "bg-[#FFD643] text-[#161616]"
                            : "border border-[#BDBDBD] text-[#838383]"
                        }`}
                      >
                        {slot.time}
                        <span className="text-[#FF4C0A] text-[10px] font-medium">
                          {slot.available} left
                        </span>
                      </button>
                    ))}
                </div>
                <p className="text-sx text-[#838383]">
                  All times are in IST (GMT +5:30)
                </p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-medium text-[#161616] mb-3">About</h2>
              <p className="text-[#838383] text-xs leading-relaxed px-3 py-2 rounded-md bg-[#EEEEEE]">
                Scenic routes, trained guides, and safety briefing. Minimum age
                10.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#EFEFEF] p-6 rounded-xl">
            <div className="mb-3 pb-3 space-y-5 border-b border-[#D9D9D9]">
              {/* Base Price */}
              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Start at</span>
                <span className="text-lg text-[#161616]">
                  ₹{experience.price}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Quantity</span>
                <div className="text-lg text-[#161616] flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Subtotal</span>
                <span className="text-lg text-[#161616]">
                  ₹{experience.price * quantity}
                </span>
              </div>

              {/* Taxes */}
              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Taxes</span>
                <span className="text-lg text-[#161616]">
                  ₹{experience.taxes * quantity}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 flex items-center justify-between text-lg text-[#161616] font-medium">
              <span>Total</span>
              <span>₹{(experience.price + experience.taxes) * quantity}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedSlot}
              className={`w-full text-base px-5 py-3 rounded-lg font-semibold transition-colors ${
                selectedDate && selectedSlot
                  ? "bg-[#FFD643] text-[#161616]"
                  : "bg-[#D7D7D7] text-[#7F7F7F]"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
