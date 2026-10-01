export type ClassValue = string | false | null | undefined;

/** Minimal className joiner — keeps conditional class lists readable in JSX. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}