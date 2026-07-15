export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES", { notation: "compact" }).format(value);
}

export function formatDate(value: string | null): string {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function humanizeStatus(value: string): string {
  return value.replaceAll("_", " ");
}
