export type MainPageSeo = {
  path: "/" | "/world-clock" | "/converter" | "/meeting-planner" | "/blog" | "/utc";
  label: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
};

export const MAIN_PAGE_SEO: MainPageSeo[] = [
  {
    path: "/",
    label: "Home",
    title: "World Clock, Time Zone Converter & Meeting Planner",
    description: "Check your local time, compare clocks worldwide, convert time zones, and find practical meeting times across countries.",
  },
  {
    path: "/world-clock",
    label: "World clock directory",
    title: "World Clock: Current Time Around the World",
    description: "Check the current local time and time-zone offset for major cities around the world in one clear global clock.",
  },
  {
    path: "/converter",
    label: "Time-zone converter",
    title: "Time Zone Converter: Compare Times Worldwide",
    description: "Convert a date and time between cities worldwide and see the corresponding local time across international time zones.",
  },
  {
    path: "/meeting-planner",
    label: "Meeting planner",
    title: "World Meeting Planner Across Time Zones",
    description: "Compare working hours across cities and time zones to find a practical meeting time for people in different countries.",
  },
  {
    path: "/blog",
    label: "Time guides",
    title: "Time Zone, Travel and Meeting Guides",
    description: "Read practical guides about time zones, daylight saving changes, international meetings, calendars, and global travel planning.",
  },
  {
    path: "/utc",
    label: "UTC time",
    title: "UTC Time Now: Current Coordinated Universal Time",
    description: "See the current UTC time and compare major world time zones against Coordinated Universal Time.",
    absoluteTitle: true,
  },
];

export function mainPageSeoByPath(path: string) {
  return MAIN_PAGE_SEO.find((page) => page.path === path);
}
