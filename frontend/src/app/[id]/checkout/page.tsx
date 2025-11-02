"use client";
import { useBookExperience } from "@/hooks/useBookExperiences";
import { useExperienceById } from "@/hooks/useExperienceById";
import { useValidatePromo } from "@/hooks/useValidatePromo";
import { useBookingStore } from "@/store/bookingStore";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { experienceId, selectedDate, selectedSlot, quantity } =
    useBookingStore();

  const params = useParams();
  const id =
    experienceId ?? (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";

  const { data, error, isLoading } = useExperienceById(id);
  const experience = data?.experience;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [agreed, setAgreed] = useState(false);

  // error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    promo: "",
    agreed: "",
    global: "",
  });

  const { mutate: bookExperience, isPending } = useBookExperience();
  const { mutate: validatePromo, isPending: isValidatingPromo } =
    useValidatePromo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading checkout...
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Failed to load checkout details.
      </div>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = experience.taxes * quantity;
  const totalBeforeDiscount = subtotal + taxes;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discountValue);

  const handleApplyPromo = () => {
    setErrors((prev) => ({ ...prev, promo: "" }));

    if (!promo) {
      setErrors((prev) => ({ ...prev, promo: "Promo code is required" }));
      return;
    }

    if (appliedPromo) return;

    validatePromo(
      { code: promo, totalAmount: totalBeforeDiscount },
      {
        onSuccess: (res) => {
          const discount = res.data.discount;
          setDiscountValue(discount);
          setAppliedPromo(promo.toUpperCase());
        },
        onError: (err: any) => {
          setErrors((prev) => ({
            ...prev,
            promo:
              err.response?.data?.message || "Invalid promo code. Try again.",
          }));
        },
      }
    );
  };

  const handleCheckout = () => {
    let newErrors = { name: "", email: "", promo: "", agreed: "", global: "" };

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!agreed)
      newErrors.agreed = "You must agree to the terms and safety policy";

    if (newErrors.name || newErrors.email || newErrors.agreed) {
      setErrors(newErrors);
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setErrors((prev) => ({
        ...prev,
        global: "Please select a date and slot before checkout",
      }));
      return;
    }

    const bookingData = {
      name,
      email,
      date: selectedDate,
      slot: selectedSlot,
      guests: quantity,
      promoCode: appliedPromo || undefined,
      totalAmount: totalAfterDiscount,
    };

    bookExperience(
      { id, bookingData },
      {
        onSuccess: (res: any) => {
          router.push(`/${id}/checkout/success?ref=${res.booking._id}`);
        },
        onError: (err: any) => {
          setErrors((prev) => ({
            ...prev,
            global:
              err.response?.data?.message ||
              "Something went wrong. Please try again.",
          }));
        },
      }
    );
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#EFEFEF] p-6 rounded-xl space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckout();
              }}
              className="space-y-5"
            >
              {/* Name and Email */}
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex flex-col w-full">
                  <label className="text-sm text-gray-600 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={`px-4 py-3 bg-[#DDDDDD] rounded-md text-[#161616] w-full focus:outline-none ${
                      errors.name
                        ? "border border-red-500"
                        : "focus:ring-1 focus:ring-[#FFD643]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <label className="text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className={`px-4 py-3 bg-[#DDDDDD] rounded-md text-[#161616] w-full focus:outline-none ${
                      errors.email
                        ? "border border-red-500"
                        : "focus:ring-1 focus:ring-[#FFD643]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Promo code */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    disabled={!!appliedPromo}
                    className={`px-4 py-3 bg-[#DDDDDD] rounded-md text-[#161616] focus:outline-none w-full disabled:opacity-60 ${
                      errors.promo
                        ? "border border-red-500"
                        : "focus:ring-1 focus:ring-[#FFD643]"
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isValidatingPromo || !!appliedPromo}
                    onClick={handleApplyPromo}
                    className="px-4 py-3 bg-[#161616] rounded-md font-medium text-white/90 disabled:opacity-60"
                  >
                    {isValidatingPromo
                      ? "Checking..."
                      : appliedPromo
                      ? "Applied"
                      : "Apply"}
                  </button>
                </div>
                {errors.promo && (
                  <p className="text-red-500 text-sm">{errors.promo}</p>
                )}
              </div>

              {/* Agreement */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <p className="text-sm text-gray-700">
                  I agree to the terms and safety policy
                </p>
              </div>
              {errors.agreed && (
                <p className="text-red-500 text-sm">{errors.agreed}</p>
              )}

              {/* Global error */}
              {errors.global && (
                <p className="text-red-500 text-sm mt-3">{errors.global}</p>
              )}
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#EFEFEF] p-6 rounded-xl">
            <div className="mb-3 pb-3 space-y-2.5 border-b border-[#D9D9D9]">
              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Experience</span>
                <span className="text-lg text-[#161616] truncate max-w-[180px] text-right">
                  {experience.title}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Date</span>
                <span className="text-lg text-[#161616]">
                  {selectedDate
                    ? new Date(selectedDate).toISOString().split("T")[0]
                    : ""}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Slot</span>
                <span className="text-lg text-[#161616]">{selectedSlot}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Start at</span>
                <span className="text-lg text-[#161616]">
                  ₹{experience.price}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Quantity</span>
                <span className="text-lg text-[#161616]">{quantity}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Subtotal</span>
                <span className="text-lg text-[#161616]">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#656565]">Taxes</span>
                <span className="text-lg text-[#161616]">₹{taxes}</span>
              </div>

              {discountValue > 0 && (
                <div className="flex items-center justify-between text-green-600 font-medium">
                  <span>Discount ({appliedPromo})</span>
                  <span>-₹{discountValue}</span>
                </div>
              )}
            </div>

            <div className="mb-6 flex items-center justify-between text-lg text-[#161616] font-medium">
              <span>Total</span>
              <span>₹{totalAfterDiscount}</span>
            </div>

            {discountValue > 0 && (
              <p className="text-green-600 text-sm mb-4 text-center">
                You saved ₹{discountValue}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!selectedDate || !selectedSlot || isPending}
              className="w-full text-base px-5 py-3 rounded-lg font-semibold bg-[#FFD643] text-[#161616] disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Pay and Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
