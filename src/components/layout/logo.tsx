import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoVariants = cva("flex items-center  ", {
  variants: {
    variant: {
      textOnly: "justify-start",
      horizontal: "flex-row gap-2",
      vertical: "flex-col gap-2 text-center",
    },
    size: {
      xs: "text-md",
      sm: "text-md",
      md: "text-md",
      lg: "text-md md:text-lg",
    },
  },
  compoundVariants: [
    // textOnly variants
    {
      variant: "textOnly",
      size: "sm",
    },
    {
      variant: "textOnly",
      size: "lg",
    },
    {
      variant: "textOnly",
      size: "md",
    },
    // Horizontal variants
    {
      variant: "horizontal",
      size: "sm",
    },
    {
      variant: "horizontal",
      size: "md",
    },
    {
      variant: "horizontal",
      size: "lg",
    },
    // Vertical variants
    {
      variant: "vertical",
      size: "sm",
    },
    {
      variant: "vertical",
      size: "md",
    },
    {
      variant: "vertical",
      size: "lg",
    },
  ],
  defaultVariants: {
    variant: "horizontal",
    size: "lg",
  },
});

const avatarImageVariants = cva("", {
  variants: {
    size: {
      xs: "size-8",
      sm: "size-10",
      md: "size-12 md:size-14",
      lg: "size-[56px] md:size-[72px]",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  name?: string;
  showAvatar?: boolean;
}

export default function Logo({
  variant = "horizontal",
  size = "lg",
  className,
  name,
  showAvatar = true,
  ...props
}: LogoProps) {
  const shouldShowAvatar = showAvatar && variant !== "textOnly";

  return (
    <div className={cn(logoVariants({ variant, size }), className)} {...props}>
      {shouldShowAvatar && (
        <figure className={cn(avatarImageVariants({ size }))}>
          <svg
            width={'100%'}
            height={'100%'}
            viewBox="0 0 250 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M0 45.6731C1.20192 20.4327 20.4327 1.20192 45.6731 0H204.327C229.567 1.20192 248.798 20.4327 250 45.6731V204.327C248.798 229.567 229.567 248.798 204.327 250H45.6731C20.4327 248.798 1.20192 229.567 0 204.327V45.6731Z"
              fill="#030711"
            />
            <path
              d="M204.327 0C229.567 1.20192 248.798 20.4327 250 45.6731V204.327C248.798 229.567 229.567 248.798 204.327 250H45.6731C20.4327 248.798 1.20192 229.567 0 204.327V45.6731C1.20192 20.4327 20.4327 1.20192 45.6731 0H204.327ZM45.6731 7.21154C24.4314 7.21154 7.21154 24.4314 7.21154 45.6731V204.327C7.21154 225.569 24.4314 242.788 45.6731 242.788H204.327C225.569 242.788 242.788 225.569 242.788 204.327V45.6731C242.788 24.4314 225.569 7.21154 204.327 7.21154H45.6731Z"
              fill="#FFF9F2"
            />
            <path
              d="M175.579 39.2831C174.89 40.2039 174.22 41.1434 173.539 41.9962L173.538 41.9978C161.492 57.185 166.215 80.869 183.137 90.1094L183.137 90.1085C188.4 92.9876 193.093 94.2107 197.842 94.334C202.129 94.4453 206.44 93.6577 211.222 92.4189C208.928 95.1102 206.986 96.944 204.854 98.4663C202.419 100.206 199.716 101.552 195.91 103.302C186.768 106.256 178.403 106.501 169.5 102.446L169.501 102.447C161.124 98.6136 154.695 91.4703 151.729 82.6793C148.832 74.061 149.596 64.5913 153.841 56.5089L153.843 56.5064C158.744 47.0198 165.91 42.314 175.529 39.1294L175.579 39.2831Z"
              fill="#FFF9F2"
              stroke="#FFF9F2"
            />
          </svg>
        </figure>
      )}
      <span className="font-bold bg-linear-[var(--gradient-text-light)] dark:bg-linear-[var(--gradient-text-dark)] inline-block text-transparent bg-clip-text">
        {name}
      </span>
    </div>
  );
}
