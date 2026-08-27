import Image from "next/image";

type Size = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-7 w-7 p-1 bottom-1.5 right-1.5",
  md: "h-9 w-9 p-1.5 bottom-2 right-2",
  lg: "h-11 w-11 p-2 bottom-3 right-3",
};

export function ImageWatermark({ size = "sm" }: { size?: Size }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-10 flex items-center justify-center rounded-lg bg-white/90 shadow-md ring-1 ring-black/5 backdrop-blur-sm ${SIZE_CLASSES[size]}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
