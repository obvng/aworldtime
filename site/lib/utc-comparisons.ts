export type UtcComparisonZone = {
  label: string;
  timeZone: string;
};

export const UTC_COMPARISON_ZONES: UtcComparisonZone[] = [
  { label: "UTC", timeZone: "UTC" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Los Angeles", timeZone: "America/Los_Angeles" },
  { label: "London", timeZone: "Europe/London" },
  { label: "Paris", timeZone: "Europe/Paris" },
  { label: "Lagos", timeZone: "Africa/Lagos" },
  { label: "Cairo", timeZone: "Africa/Cairo" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Delhi", timeZone: "Asia/Kolkata" },
  { label: "Beijing", timeZone: "Asia/Shanghai" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Sydney", timeZone: "Australia/Sydney" },
];
