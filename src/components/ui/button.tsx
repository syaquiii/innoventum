import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "light"
    | "normal"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
      default: "bg-dark text-white hover:bg-dark-hover active:bg-dark-active",
      light: "bg-light text-dark hover:bg-light-hover active:bg-light-active",
      normal:
        "bg-normal text-white hover:bg-normal-hover active:bg-normal-active",
      outline:
        "border-2 border-dark bg-transparent text-dark hover:bg-dark hover:text-white",
      ghost: "text-dark hover:bg-light active:bg-light-active",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
      link: "text-normal underline-offset-4 hover:underline hover:text-normal-hover",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
