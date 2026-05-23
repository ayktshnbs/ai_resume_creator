"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  as: Tag = "button",
  href,
  onClick,
  type = "button",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;

      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      el.style.transition = "transform 0.15s ease-out";
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0) scale(1)";
    el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, []);

  const props = {
    ref: ref as React.RefObject<never>,
    className,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    ...(Tag === "button" ? { type, disabled } : {}),
    ...(Tag === "a" ? { href } : {}),
  };

  return <Tag {...props}>{children}</Tag>;
}
