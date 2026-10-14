export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const data = (err as { data?: { message?: string; error?: string } })?.data;
  return data?.message ?? data?.error ?? fallback;
}