import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "secondary";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const getVariantClasses = (variant: BadgeVariant) => {
    switch (variant) {
      case "success":
        return "bg-primary-02/10 text-primary-02 border border-primary-02/20";
      case "warning":
        return "bg-primary-03/10 text-primary-03 border border-primary-03/20";
      case "error":
        return "bg-primary-05/10 text-primary-05 border border-primary-05/20";
      case "secondary":
        return "bg-b-surface2 text-t-secondary border border-s-stroke2";
      default:
        return "bg-b-surface1 text-t-primary border border-s-stroke2";
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses(variant)} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;