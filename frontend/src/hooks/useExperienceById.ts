import API from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

export const useExperienceById = (id: string) => {
  return useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const res = await API.get(`/experiences/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
