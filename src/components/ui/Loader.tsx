import React from "react";

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-[#9A3412] border-t-transparent ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Memuat data..."
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white border border-[#E7DFD5] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-16 bg-stone-200" />
        <div className="h-4 w-3/4 bg-stone-200" />
        <div className="h-4 w-1/3 bg-stone-200 mt-2" />
      </div>
    </div>
  );
};

export default Spinner;
