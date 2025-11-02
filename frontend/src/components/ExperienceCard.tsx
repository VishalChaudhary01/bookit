import { useRouter } from "next/navigation";

interface ExperienceCardProps {
  experience: any;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/${experience._id}`)}
      className="bg-[#F0F0F0] rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden group max-w-[280px]"
    >
      <div className="h-[170px] overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-1">
            {experience.title}
          </h3>
          <span className="px-2 py-1 bg-[#D6D6D6] rounded-md text-[11px] font-medium">
            {experience.address}
          </span>
        </div>

        <p className="text-[#6C6C6C] text-[12px] mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>From</span>
            <span className="text-xl font-medium">₹{experience.price}</span>
          </div>
          <button className="bg-[#FFD643] hover:bg-[#FFD643] py-1.5 px-2 text-sm font-medium rounded-md cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
