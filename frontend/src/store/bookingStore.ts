import { create } from "zustand";

interface BookingState {
  experienceId: string | null;
  selectedDate: string | null;
  selectedSlot: string | null;
  quantity: number;
  setBooking: (data: {
    experienceId: string;
    selectedDate: string;
    selectedSlot: string;
    quantity: number;
  }) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  experienceId: null,
  selectedDate: null,
  selectedSlot: null,
  quantity: 1,
  setBooking: (data) => set(data),
  reset: () =>
    set({
      experienceId: null,
      selectedDate: null,
      selectedSlot: null,
      quantity: 1,
    }),
}));
