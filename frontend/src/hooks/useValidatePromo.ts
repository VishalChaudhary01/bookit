import API from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

export const useValidatePromo = () => {
  return useMutation({
    mutationFn: async ({
      code,
      totalAmount,
    }: {
      code: string;
      totalAmount: number;
    }) => {
      const res = await API.post("/promo/validate", { code, totalAmount });
      return res.data;
    },
  });
};
