import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: Props) {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "md:items-center md:flex-col md:text-center" : ""
      }`}
    >
      <div className={`max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-3 text-[clamp(28px,4vw,46px)] leading-[1.05]">{title}</h2>
        {description && (
          <p className="mt-3 text-ink-soft text-[17px] max-w-[60ch]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
