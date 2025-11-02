import API from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useExperiences = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: ["experiences", search],
    queryFn: async () => {
      const res = await API.get("/experiences", {
        params: { search },
      });
      return res.data;
    },
  });
};
