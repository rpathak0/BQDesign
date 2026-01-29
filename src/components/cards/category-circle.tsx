import { Category } from "@/data/bqData";
import { SafeImage } from "@/components/shared/safe-image";

interface CategoryCircleProps {
  category: Category;
}

export function CategoryCircle({ category }: CategoryCircleProps) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer w-full shrink-0">
      <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(99,101,239,0.4)] glass-3d">
        <SafeImage 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>
      <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </div>
  );
}
