import type { HTMLAttributes } from "react";

const iconMap = {
  add: "add",
  analytics: "analytics",
  arrowRight: "arrow_forward",
  close: "close",
  dashboard: "dashboard",
  delete: "delete",
  document: "description",
  edit: "edit",
  palette: "palette",
  photo: "image",
  person: "person",
  resume: "description",
  settings: "settings",
  sparkle: "auto_awesome",
  subject: "subject",
  template: "grid_view",
  upload: "upload_file",
  user: "person",
  visibility: "visibility",
  work: "work"
} as const;

export type IconName = 
  | "add"
  | "analytics"
  | "arrowRight"
  | "close"
  | "dashboard"
  | "delete"
  | "document"
  | "edit"
  | "palette"
  | "photo"
  | "person"
  | "resume"
  | "settings"
  | "sparkle"
  | "subject"
  | "template"
  | "upload"
  | "user"
  | "visibility"
  | "work";

export function Icon({
  className = "",
  name,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  name: IconName;
}) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined notranslate ${className}`} style={{ display: 'inline-block' }} {...props}>
      {iconMap[name as keyof typeof iconMap]}
    </span>
  );
}
