import API from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

export const useBookExperience = () => {
  return useMutation({
    mutationFn: async ({
      id,
      bookingData,
    }: {
      id: string;
      bookingData: any;
    }) => {
      const res = await API.post(`experiences/${id}/book`, bookingData);
      return res.data;
    },
  });
};
