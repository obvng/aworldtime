import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("country time route", () => {
  it("prebuilds only the eight approved country slugs", async () => {
    const { generateStaticParams } = await import("@/app/time-in/[country]/page");

    expect(await generateStaticParams()).toEqual([
      { country: "brazil" },
      { country: "bangladesh" },
      { country: "turkey" },
      { country: "chile" },
      { country: "japan" },
      { country: "germany" },
      { country: "algeria" },
      { country: "france" },
    ]);
  });

  it("builds stable, self-canonical country metadata", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const brazil = await generateMetadata({ params: Promise.resolve({ country: "brazil" }) });
    const chile = await generateMetadata({ params: Promise.resolve({ country: "chile" }) });

    expect(brazil.title).toEqual({ absolute: "Time in Brazil Now: Current Local Times by Region" });
    expect(brazil.description).toBe("Brazil spans several time zones across the mainland and its Atlantic islands. See all 16 IANA zones with current times, UTC offsets and DST rules.");
    expect(brazil.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/brazil");
    expect(chile.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/chile");
    expect(brazil.description).not.toMatch(/UTC[+-]\d|\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December)/);
  });

  it("uses distinct stable catalogue data in country descriptions", async () => {
    const { generateMetadata } = await import("@/app/time-in/[country]/page");
    const brazil = await generateMetadata({ params: Promise.resolve({ country: "brazil" }) });
    const bangladesh = await generateMetadata({ params: Promise.resolve({ country: "bangladesh" }) });

    expect(bangladesh.description).toBe("Bangladesh uses one national time zone. See its current local time, UTC offset, DST rules and next clock change.");
    expect(brazil.description).not.toBe(bangladesh.description);
    expect(`${brazil.description} ${bangladesh.description}`).not.toMatch(/UTC[+-]\d|in effect|not in effect|\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December)/i);
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

  it("explains that Algeria has no scheduled seasonal change", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "algeria" }) }));

    expect(screen.getByText(/No seasonal clock change is scheduled/)).toBeVisible();
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

    const saoPauloZone = screen.getByText("America/Sao_Paulo").closest("article");
    expect(saoPauloZone).not.toBeNull();
    expect(within(saoPauloZone!).getByRole("link", { name: "São Paulo" })).toHaveAttribute("href", "/world-clock/sao-paulo");
    expect(within(saoPauloZone!).getByRole("link", { name: "Rio de Janeiro" })).toHaveAttribute("href", "/world-clock/rio-de-janeiro");
    expect(within(saoPauloZone!).getByRole("link", { name: "Brasília" })).toHaveAttribute("href", "/world-clock/brasilia");
  });

  it("links a single-zone country to its catalogue city", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "bangladesh" }) }));

    expect(screen.getByRole("link", { name: "Dhaka" })).toHaveAttribute("href", "/world-clock/dhaka");
  });

  it("does not render an empty city-link group for an unrepresented zone", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "brazil" }) }));

    const noronhaZone = screen.getByText("America/Noronha").closest("article");
    expect(noronhaZone).not.toBeNull();
    expect(within(noronhaZone!).queryByLabelText("City clocks in Atlantic islands")).not.toBeInTheDocument();
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
