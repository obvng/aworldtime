import { render, screen } from "@testing-library/react";
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
    expect(brazil.description).toBe("See the current time across Brazil's IANA time zones, with regional coverage, UTC offsets and daylight-saving information.");
    expect(brazil.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/brazil");
    expect(chile.alternates?.canonical).toBe("https://www.aworldtime.com/time-in/chile");
    expect(brazil.description).not.toMatch(/UTC[+-]\d|\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December)/);
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
});
