# City pages implementation plan

1. Add failing catalogue and time-data tests, then create the 100-city catalogue and deterministic offset, transition and solar helpers.
2. Add failing route and metadata tests, then build the city page, live clock and internal directory links.
3. Add failing persistence tests, then add the `page_seo` migration, data access, admin form and save action.
4. Add failing converter tests, then read query parameters, keep a fixed canonical and log anonymous aggregate unordered pairs.
5. Update the homepage H1 and sitemap under failing tests.
6. Run the full unit suite, lint and production build. Review the complete diff before any push or deployment.
