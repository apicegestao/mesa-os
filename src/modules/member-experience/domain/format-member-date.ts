/** Formats canonical YYYY-MM-DD dates without applying the browser's local timezone. */
export function formatMemberDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date).replaceAll(" de ", " ");
}
