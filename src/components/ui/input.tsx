import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, placeholder, ...props }: React.ComponentProps<"input">) {
  const labelText = placeholder || props.name || ""
  const letters = labelText.split("")

  return (
    <div className={cn("relative w-full pt-4 mt-2", className)}>
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "peer bg-transparent border-0 border-b-2 border-muted-foreground/50 block w-full py-2 text-base outline-none focus:border-primary focus:ring-0 text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          type !== "date" && "placeholder-transparent"
        )}
        onClick={(e) => {
          if (type === "date" && 'showPicker' in HTMLInputElement.prototype) {
            try {
              (e.currentTarget as HTMLInputElement).showPicker();
            } catch (err) {}
          }
          if (props.onClick) props.onClick(e);
        }}
        placeholder={type === "date" ? "" : " "}
        {...props}
      />
      <label className="absolute top-6 left-0 pointer-events-none flex z-10">
        {letters.map((char, index) => (
          <span
            key={index}
            style={{ transitionDelay: `${index * 30}ms` }}
            className={cn(
              "inline-block min-w-[4px] transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
              type === "date"
                ? "-translate-y-6 text-sm text-muted-foreground" // always floating for date inputs
                : "-translate-y-6 text-sm text-muted-foreground peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-primary peer-focus:text-sm peer-autofill:-translate-y-6 peer-autofill:text-primary peer-autofill:text-sm"
            )}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </label>
    </div>
  )
}

export { Input }
