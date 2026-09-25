import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";
import { GOOGLE_ANALYTICS_ID } from "@/lib/analytics";

describe("Google Analytics", () => {
  it("loads and configures the production measurement ID on every page", () => {
    const layout = RootLayout({ children: <main>Page</main> }) as ReactElement<{
      children: ReactElement<{ children: ReactNode }>;
    }>;
    const body = layout.props.children;
    const bodyChildren = Children.toArray(body.props.children);
    const analytics = bodyChildren.find(
      (child) => isValidElement(child) && child.props && typeof child.props === "object" && "gaId" in child.props,
    ) as ReactElement<{ gaId: string }> | undefined;

    expect(GOOGLE_ANALYTICS_ID).toBe("G-SELQTQQ3FY");
    expect(analytics?.props.gaId).toBe("G-SELQTQQ3FY");
  });
});
