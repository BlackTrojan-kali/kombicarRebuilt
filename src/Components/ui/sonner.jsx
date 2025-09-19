import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group bg-background"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }
