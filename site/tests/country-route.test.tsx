import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getPageSeo: vi.fn(), listPublishedPosts: vi.fn() }));

vi.mock("@/lib/page-seo", () => ({ getPageSeo: mocks.getPageSeo }));
vi.mock("@/lib/posts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/posts")>()),
  listPublishedPosts: mocks.listPublishedPosts,
}));

describe("country time route", () => {
  beforeEach(() => {
    mocks.getPageSeo.mockResolvedValue(null);
    mocks.listPublishedPosts.mockResolvedValue([]);
  });
  it("prebuilds a route for every represented country", async () => {
    const { generateStaticParams } = await import("@/app/time-in/[country]/page");
    const { CITIES } = await import("@/lib/cities");

    expect(await generateStaticParams()).toHaveLength(new Set(CITIES.map((city) => city.countryCode)).size);
    expect(await generateStaticParams()).toEqual(expect.arrayContaining([
      { country: "brazil" },
      { country: "canada" },
      { country: "united-states" },
    ]));
  });

  it("builds stable, self-canonical country metadata", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const brazil = await generateMetadata({ params: Promise.resolve({ country: "brazil" }) });
    const chile = await generateMetadata({ params: Promise.resolve({ country: "chile" }) });

    expect(brazil.title).toEqual({ absolute: "Time in Brazil Now: 16 Time Zones and UTC Offsets" });
    expect(brazil.description).toMatch(/Brazil spans 16 IANA zones.*UTC/i);
    expect(brazil.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/brazil");
    expect(chile.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/chile");
    expect(brazil.description).not.toMatch(/\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December)/);
  });

  it("keeps every generated country meta description within 160 characters", async () => {
    const { COUNTRY_TIME_PAGES, countrySeoDescription } = await import("@/lib/country-times");

    for (const country of COUNTRY_TIME_PAGES) {
      expect(countrySeoDescription(country).length, country.slug).toBeLessThanOrEqual(160);
    }
  }, 15_000);

  it("uses distinct stable catalogue data in country descriptions", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const brazil = await generateMetadata({ params: Promise.resolve({ country: "brazil" }) });
    const bangladesh = await generateMetadata({ params: Promise.resolve({ country: "bangladesh" }) });

    expect(bangladesh.description).toMatch(/Bangladesh.*Asia\/Dhaka.*UTC\+06:00/i);
    expect(brazil.description).not.toBe(bangladesh.description);
    expect(`${brazil.description} ${bangladesh.description}`).not.toMatch(/in effect|not in effect|\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December)/i);
  });

  it("builds metadata from each country's zone facts", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const russia = await generateMetadata({ params: Promise.resolve({ country: "russia" }) });
    const nigeria = await generateMetadata({ params: Promise.resolve({ country: "nigeria" }) });

    expect(russia.title).toEqual({ absolute: expect.stringContaining("27 Time Zones") });
    expect(russia.description).toMatch(/27 IANA (?:time )?zones/i);
    expect(russia.description?.match(/27 IANA/gi)).toHaveLength(1);
    expect(russia.description).toMatch(/UTC[+-]\d{2}:\d{2}/);
    expect(nigeria.title).toEqual({ absolute: expect.stringMatching(/UTC\+01:00/) });
    expect(nigeria.description).toContain("Africa/Lagos");
  });

  it("uses a saved country title and description in public metadata", async () => {
    mocks.getPageSeo.mockResolvedValue({
      path: "/time-in/france",
      seo_title: "Time in France Now and Current UTC Offset",
      meta_description: "Check the current time in mainland France, its UTC offset, daylight-saving rules and next clock change.",
      updated_at: "2026-11-05T10:00:00.000Z",
    });
    const { generateMetadata } = await import("@/app/time-in/[country]/page");

    const france = await generateMetadata({ params: Promise.resolve({ country: "france" }) });

    expect(france.title).toEqual({ absolute: "Time in France Now and Current UTC Offset" });
    expect(france.description).toBe("Check the current time in mainland France, its UTC offset, daylight-saving rules and next clock change.");
  });

  it("does not describe all of France as a single IANA time zone", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const france = await generateMetadata({ params: Promise.resolve({ country: "france" }) });

    expect(france.description).toContain("mainland France");
    expect(france.description).not.toMatch(/France (uses|has|follows) (one|a single) (IANA )?time zone/i);
  });

  it("renders a useful single-zone Bangladesh page", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "bangladesh" }) }));

    expect(screen.getByRole("heading", { level: 1, name: /time in bangladesh/i })).toBeVisible();
    expect(screen.getAllByTestId("country-zone-card")).toHaveLength(1);
    expect(screen.getByText("Asia/Dhaka")).toBeVisible();
    expect(screen.getByText("All of Bangladesh")).toBeVisible();
    expect(screen.getByTestId("zone-live-time")).toHaveTextContent(/\d{2}:\d{2}:\d{2} (AM|PM)/);
  });

  it("renders country comparisons, FAQs and FAQ schema", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    const { container } = render(await CountryTimePage({ params: Promise.resolve({ country: "bangladesh" }) }));

    expect(screen.getByRole("heading", { name: "Time differences from Bangladesh" })).toBeVisible();
    expect(screen.getByText(/London/)).toBeVisible();
    expect(screen.getByText(/New York/)).toBeVisible();
    expect(screen.getByText(/Lagos/)).toBeVisible();
    expect(screen.getByRole("heading", { name: "Questions about time in Bangladesh" })).toBeVisible();
    expect(screen.getByText(/Does Bangladesh use daylight saving time\?/)).toBeVisible();

    const schemas = [...container.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent ?? "{}"));
    expect(schemas.find((schema) => schema["@type"] === "FAQPage")?.mainEntity).toHaveLength(4);
  });

  it("renders saved unique country text", async () => {
    mocks.getPageSeo.mockResolvedValue({
      path: "/time-in/bangladesh",
      seo_title: null,
      meta_description: null,
      country_text: "Bangladesh Standard Time is used nationwide, including Dhaka, Chattogram and Sylhet.",
      updated_at: "2026-11-25T10:00:00.000Z",
    });
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "bangladesh" }) }));

    expect(screen.getByText(/Bangladesh Standard Time is used nationwide/)).toBeVisible();
  });

  it("explains that Algeria has no scheduled seasonal change", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "algeria" }) }));

    expect(screen.getByText(/uses a permanent UTC\+01:00 offset/i)).toBeVisible();
  });

  it("renders all 16 Brazilian IANA zones without collapsing equal offsets", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));

    expect(screen.getAllByTestId("country-zone-card")).toHaveLength(16);
    expect(screen.getByText("America/Noronha")).toBeVisible();
    expect(screen.getByText("America/Rio_Branco")).toBeVisible();
  });

  it("links each represented zone to matching city pages", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));

    const directory = screen.getByRole("navigation", { name: "City clocks in Brazil" });
    expect(within(directory).getByRole("link", { name: "São Paulo" })).toHaveAttribute("href", "/world-clock/sao-paulo");
    expect(within(directory).getByRole("link", { name: "Rio de Janeiro" })).toHaveAttribute("href", "/world-clock/rio-de-janeiro");
    expect(within(directory).getByRole("link", { name: "Brasília" })).toHaveAttribute("href", "/world-clock/brasilia");

    for (const zoneCard of screen.getAllByTestId("country-zone-card")) {
      expect(within(zoneCard).getByRole("link", { name: /city clock/i })).toHaveAttribute("href", expect.stringMatching(/^\/world-clock\//));
    }
  });

  it("links a single-zone country to its catalogue city", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "bangladesh" }) }));

    const directory = screen.getByRole("navigation", { name: "City clocks in Bangladesh" });
    expect(within(directory).getByRole("link", { name: "Dhaka" })).toHaveAttribute("href", "/world-clock/dhaka");
  });

  it("renders one crawlable country-to-city directory and a matching published guide", async () => {
    const { fixturePost } = await import("@/lib/posts");
    mocks.listPublishedPosts.mockResolvedValue([
      fixturePost({ slug: "what-time-does-brazil-use", title: "What Time Does Brazil Use?" }),
    ]);
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));

    const directory = screen.getByRole("navigation", { name: "City clocks in Brazil" });
    expect(within(directory).getByRole("link", { name: "São Paulo" })).toHaveAttribute("href", "/world-clock/sao-paulo");
    expect(within(directory).getByRole("link", { name: "Rio de Janeiro" })).toHaveAttribute("href", "/world-clock/rio-de-janeiro");
    expect(screen.getByRole("link", { name: "What Time Does Brazil Use?" })).toHaveAttribute("href", "/blog/what-time-does-brazil-use");
  });

  it("links the Atlantic islands zone to its representative city clock", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));

    const noronhaZone = screen.getByText("America/Noronha").closest("article");
    expect(noronhaZone).not.toBeNull();
    expect(within(noronhaZone!).getByRole("link", { name: /fernando de noronha city clock/i })).toHaveAttribute("href", "/world-clock/fernando-de-noronha");
  });

  it("emits a country breadcrumb list with canonical URLs", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    const { container } = render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));
    const schemas = [...container.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent ?? "{}"));
    const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");

    expect(breadcrumb?.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: "Home", item: "https://www.aworldtime.com/" }),
      expect.objectContaining({ position: 2, name: "World clock", item: "https://www.aworldtime.com/world-clock" }),
      expect.objectContaining({ position: 3, name: "Brazil", item: "https://www.aworldtime.com/time-in/brazil" }),
    ]);
  });
});
