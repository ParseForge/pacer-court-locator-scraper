![ParseForge Banner](https://github.com/ParseForge/apify-assets/blob/ad35ccc13ddd068b9d6cba33f323962e39aed5b2/banner.jpg?raw=true)

# 🏛️ Federal Court Locator Scraper

> 🚀 **Pull every US federal court with PACER ID, RSS feed, citation, and jurisdiction.** Filter by court type, state, or name. No login, no API key.

> 🕒 **Last updated:** 2026-05-01 · **📊 18 fields** per court · **🏛️ 200+ federal courts** · **🇺🇸 all jurisdictions** · **🆓 Court Listener REST API**

The **Federal Court Locator Scraper** returns every US federal court (district, bankruptcy, appellate, special) with PACER court ID, FJC court ID, RSS feed status, court URL, jurisdiction code, citation string, parent court, and active flag. Each record also includes capability flags for opinion and oral argument scrapers, which Court Listener tracks per court.

The Court Listener REST API is the de-facto canonical machine-readable source for federal court structure, used by Free Law Project, RECAP, and many legal-tech tools. The official PACER court locator is JS-rendered and hard to scrape directly. This Actor leverages Court Listener's clean public API and returns federal court metadata as structured records in seconds.

| 🎯 Target Audience | 💡 Primary Use Cases |
|---|---|
| Legal tech engineers, journalists, docket aggregators, legal researchers | Court directory builds, RSS feed aggregation, jurisdiction lookup, legal mapping |

---

## 📋 What the Federal Court Locator Scraper does

Three filtering workflows in a single run:

- 🏛️ **Jurisdiction filter.** All, federal (`F`), federal district (`FD`), federal bankruptcy (`FB`), federal appellate, federal special.
- ⚙️ **Active-only flag.** Filter to courts currently in active use.
- 🔍 **Name filter.** Substring match on the full court name.

Each row reports the Court Listener slug ID, PACER court ID, FJC court ID, short and full court name, citation string, jurisdiction code, official court website URL, RSS feed availability and entry types, in-use flag, opinion and oral argument scraper capability, position number, start date, end date, parent court, and Court Listener resource URI.

> 💡 **Why it matters:** legal tech tools, docket aggregators, and journalism workflows all need a clean federal court directory. Building one from scratch means crawling JS-rendered PACER pages and hitting captchas. Court Listener publishes the same data as a free REST API, and this Actor turns it into one-click structured rows.

---

## 🎬 Full Demo

_🚧 Coming soon: a 3-minute walkthrough showing how to go from sign-up to a downloaded dataset._

---

## ⚙️ Input

<table>
<thead>
<tr><th>Input</th><th>Type</th><th>Default</th><th>Behavior</th></tr>
</thead>
<tbody>
<tr><td><code>maxItems</code></td><td>integer</td><td><code>10</code></td><td>Courts to return. Free plan caps at 10, paid plan at 1,000,000.</td></tr>
<tr><td><code>jurisdiction</code></td><td>string</td><td><code>"FD"</code></td><td><code>all</code>, <code>F</code>, <code>FD</code>, <code>FB</code>, <code>FBP</code>, <code>FS</code>, <code>FSP</code>.</td></tr>
<tr><td><code>inUseOnly</code></td><td>boolean</td><td><code>true</code></td><td>When <code>true</code>, only returns courts marked as currently in use.</td></tr>
<tr><td><code>courtName</code></td><td>string</td><td>empty</td><td>Case-insensitive substring match on full court name.</td></tr>
</tbody>
</table>

**Example: every active federal district court.**

```json
{
    "maxItems": 200,
    "jurisdiction": "FD",
    "inUseOnly": true
}
```

**Example: every court with "California" in its name.**

```json
{
    "maxItems": 50,
    "jurisdiction": "all",
    "courtName": "California"
}
```

> ⚠️ **Good to Know:** Court Listener's anonymous quota is 5,000 requests per hour per IP, comfortably above any reasonable scrape volume. The dataset has 3,358 entries total covering federal plus parent buckets, so very wide queries return that full list.

---

## 📊 Output

Each court record contains **18 fields**. Download as CSV, Excel, JSON, or XML.

### 🧾 Schema

| Field | Type | Example |
|---|---|---|
| 🆔 `courtId` | string | `"scotus"` |
| 🏛️ `pacerCourtId` | integer \| null | `null` |
| 🗂️ `fjcCourtId` | string \| null | `null` |
| 🏷️ `shortName` | string | `"Supreme Court"` |
| 📛 `fullName` | string | `"Supreme Court of the United States"` |
| 📚 `citationString` | string | `"SCOTUS"` |
| ⚖️ `jurisdiction` | string | `"F"` |
| 🌐 `courtUrl` | string \| null | `"http://supremecourt.gov/"` |
| 📡 `pacerHasRssFeed` | boolean \| null | `null` |
| 📰 `pacerRssEntryTypes` | string \| null | `null` |
| ✅ `inUse` | boolean | `true` |
| 📑 `hasOpinionScraper` | boolean | `true` |
| 🎤 `hasOralArgumentScraper` | boolean | `true` |
| 🔢 `position` | number | `1` |
| 📅 `startDate` | ISO date | `"1789-09-24"` |
| 📅 `endDate` | ISO date \| null | `null` |
| 🌳 `parentCourt` | string \| null | `null` |
| 🔗 `resourceUri` | string | `"https://www.courtlistener.com/api/rest/v4/courts/scotus/..."` |
| 🕒 `scrapedAt` | ISO 8601 | `"2026-05-01T02:00:10.503Z"` |

### 📦 Sample records

<details>
<summary><strong>🇺🇸 Supreme Court of the United States (top of the tree)</strong></summary>

```json
{
    "courtId": "scotus",
    "pacerCourtId": null,
    "shortName": "Supreme Court",
    "fullName": "Supreme Court of the United States",
    "citationString": "SCOTUS",
    "jurisdiction": "F",
    "courtUrl": "http://supremecourt.gov/",
    "inUse": true,
    "hasOpinionScraper": true,
    "hasOralArgumentScraper": true,
    "position": 1,
    "startDate": "1789-09-24",
    "endDate": null,
    "parentCourt": null,
    "resourceUri": "https://www.courtlistener.com/api/rest/v4/courts/scotus/?format=json",
    "scrapedAt": "2026-05-01T02:00:10.503Z"
}
```

</details>

<details>
<summary><strong>🏛️ District Court for the District of Columbia with PACER ID</strong></summary>

```json
{
    "courtId": "dcd",
    "pacerCourtId": 45,
    "fjcCourtId": "90",
    "shortName": "District of Columbia",
    "fullName": "District Court, District of Columbia",
    "citationString": "D.D.C.",
    "jurisdiction": "FD",
    "courtUrl": "http://www.dcd.uscourts.gov/",
    "pacerHasRssFeed": true,
    "pacerRssEntryTypes": "all",
    "inUse": true,
    "hasOpinionScraper": true,
    "parentCourt": "https://www.courtlistener.com/api/rest/v4/courts/usdistct/?format=json"
}
```

</details>

<details>
<summary><strong>📚 Bankruptcy court entry</strong></summary>

```json
{
    "courtId": "cacb",
    "pacerCourtId": 78,
    "shortName": "C.D. Cal. Bankruptcy",
    "fullName": "United States Bankruptcy Court, Central District of California",
    "citationString": "Bankr. C.D. Cal.",
    "jurisdiction": "FB",
    "courtUrl": "http://www.cacb.uscourts.gov/",
    "pacerHasRssFeed": true,
    "inUse": true
}
```

</details>

---

## ✨ Why choose this Actor

| | Capability |
|---|---|
| 🆓 | **Free public REST API.** Reads Court Listener's open data layer. |
| 🏛️ | **All federal jurisdictions.** District, bankruptcy, appellate, special, plus SCOTUS. |
| 🆔 | **PACER + FJC IDs.** Cross-reference with PACER docket tooling. |
| 📡 | **RSS feed flags.** Tells you which courts publish a docket RSS. |
| 🔍 | **Name filter.** Substring search on full court name. |
| 🚀 | **Sub-15-second runs.** Typical 100-court pulls finish in 9 to 15 seconds. |
| 🔗 | **Stable resource URIs.** Each record carries a Court Listener resource URI for follow-up calls. |

> 📊 In a single 14-second run the Actor returned 100 federal courts including SCOTUS, district, bankruptcy, and appellate.

---

## 📈 How it compares to alternatives

| Approach | Cost | Coverage | Refresh | Filters | Setup |
|---|---|---|---|---|---|
| Manual PACER locator scrape | Free | JS-rendered, blocked | Live | None | Engineer hours + browser |
| Paid legal-data subscriptions | $$$ subscription | Full | Daily | Built-in | Account setup |
| Self-curated CSV | Free | Stale | Manual refresh | None | Spreadsheet maintenance |
| **⭐ Federal Court Locator Scraper** *(this Actor)* | Pay-per-event | Every federal court | Live | Jurisdiction, name, in-use | None |

Same court directory Court Listener publishes openly, exposed as one-click structured rows.

---

## 🚀 How to use

1. 🆓 **Create a free Apify account.** [Sign up here](https://console.apify.com/sign-up?fpr=vmoqkp) and get $5 in free credit.
2. 🔍 **Open the Actor.** Search for "Federal Court Locator" in the Apify Store.
3. ⚙️ **Pick filters.** Jurisdiction, in-use flag, optional name filter.
4. ▶️ **Click Start.** A 100-court run typically completes in 10 to 20 seconds.
5. 📥 **Download.** Export as CSV, Excel, JSON, or XML.

> ⏱️ Total time from sign-up to first dataset: under five minutes.

---

## 💼 Business use cases

<table>
<tr>
<td width="50%">

### 💼 Legal tech
- Build a federal court picker for case-management apps
- Power court-aware document templates
- Drive jurisdiction-routing logic in legal workflows
- Pre-populate filing systems with court metadata

</td>
<td width="50%">

### 📡 Docket aggregation
- Identify which courts publish RSS feeds
- Build dashboards of new filings across districts
- Map RSS entry types per court
- Track new courts coming online

</td>
</tr>
<tr>
<td width="50%">

### 📰 Journalism
- Map cases by jurisdiction for series reporting
- Reference courts with citation strings
- Verify a court's existence before citing
- Build interactive court maps

</td>
<td width="50%">

### 📚 Research
- Dataset for empirical legal studies
- Longitudinal study of court activations
- Historical mapping using start and end dates
- Cross-reference with FJC research data

</td>
</tr>
</table>

---

## 🌟 Beyond business use cases

Data like this powers more than commercial workflows. The same structured records support research, education, civic projects, and personal initiatives.

<table>
<tr>
<td width="50%">

### 🎓 Research and academia
- Empirical datasets for papers, thesis work, and coursework
- Longitudinal studies tracking changes across snapshots
- Reproducible research with cited, versioned data pulls
- Classroom exercises on data analysis and ethical scraping

</td>
<td width="50%">

### 🎨 Personal and creative
- Side projects, portfolio demos, and indie app launches
- Data visualizations, dashboards, and infographics
- Content research for bloggers, YouTubers, and podcasters
- Hobbyist collections and personal trackers

</td>
</tr>
<tr>
<td width="50%">

### 🤝 Non-profit and civic
- Transparency reporting and accountability projects
- Advocacy campaigns backed by public-interest data
- Community-run databases for local issues
- Investigative journalism on public records

</td>
<td width="50%">

### 🧪 Experimentation
- Prototype AI and machine-learning pipelines with real data
- Validate product-market hypotheses before engineering spend
- Train small domain-specific models on niche corpora
- Test dashboard concepts with live input

</td>
</tr>
</table>

---

## 🔌 Automating Federal Court Locator Scraper

Run this Actor on a schedule, from your codebase, or inside another tool:

- **Node.js** SDK: see [Apify JavaScript client](https://docs.apify.com/api/client/js/) for programmatic runs.
- **Python** SDK: see [Apify Python client](https://docs.apify.com/api/client/python/) for the same flow in Python.
- **HTTP API**: see [Apify API docs](https://docs.apify.com/api/v2) for raw REST integration.

Schedule monthly refresh runs from the Apify Console to pick up new courts. Pipe results into Google Sheets, S3, BigQuery, or your own webhook with the built-in [integrations](https://docs.apify.com/platform/integrations).

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>🏛️ What jurisdictions are included?</strong></summary>

`F` (federal Supreme Court), `FD` (federal district), `FB` (federal bankruptcy), `FBP` (federal bankruptcy panel), `FS` (federal special), `FSP` (federal special panel). Pass `all` to get them all.

</details>

<details>
<summary><strong>🔢 What is the difference between courtId and pacerCourtId?</strong></summary>

`courtId` is Court Listener's slug like `dcd`. `pacerCourtId` is the integer ID PACER itself uses, e.g. `45` for D.D.C. The Actor returns both so you can cross-reference.

</details>

<details>
<summary><strong>📡 Why is pacerHasRssFeed important?</strong></summary>

Courts that publish RSS feeds let you watch new filings in real time. The Actor surfaces that flag and the entry types each feed exposes.

</details>

<details>
<summary><strong>📅 What are startDate and endDate?</strong></summary>

The dates the court entered or left service. Most active courts have a startDate but no endDate. Historical or merged courts may have both.

</details>

<details>
<summary><strong>📑 What does hasOpinionScraper mean?</strong></summary>

Court Listener flags whether they have an opinion scraper for that court. It's a useful proxy for "is full-text opinion data available."

</details>

<details>
<summary><strong>🌳 What is the parentCourt field?</strong></summary>

For specialized courts, Court Listener nests them under a parent court. District courts have parent `usdistct`, bankruptcy courts have parent `usbankruptcyct`, and so on.

</details>

<details>
<summary><strong>📦 How many courts can I pull?</strong></summary>

Free plan caps at 10. Paid plans up to 1,000,000. The dataset itself has 3,358 entries total.

</details>

<details>
<summary><strong>🛡️ Are there state courts too?</strong></summary>

Court Listener also tracks state courts. This Actor is scoped to federal jurisdictions; state-court coverage is a future enhancement.

</details>

<details>
<summary><strong>💼 Can I use this for commercial work?</strong></summary>

Yes. Court Listener data is published by Free Law Project under terms allowing commercial use with attribution.

</details>

<details>
<summary><strong>💳 Do I need a paid Apify plan?</strong></summary>

The free plan returns up to 10 records per run. Paid plans return up to 1,000,000.

</details>

<details>
<summary><strong>🔁 How fresh is the data?</strong></summary>

Live. Each run hits Court Listener at run time. Court Listener refreshes its court directory continuously based on FJC plus manual curation.

</details>

<details>
<summary><strong>⚖️ Is this legal?</strong></summary>

Yes. Court Listener publishes the data as a free public API specifically for programmatic access by legal-tech and research tools.

</details>

---

## 🔌 Integrate with any app

- [**Make**](https://apify.com/integrations/make) - drop run results into 1,800+ apps.
- [**Zapier**](https://apify.com/integrations/zapier) - trigger automations off completed runs.
- [**Slack**](https://apify.com/integrations/slack) - post run summaries to a channel.
- [**Google Sheets**](https://apify.com/integrations/google-sheets) - sync each run into a spreadsheet.
- [**Webhooks**](https://docs.apify.com/platform/integrations/webhooks) - notify your own services on run finish.
- [**Airbyte**](https://apify.com/integrations/airbyte) - load runs into Snowflake, BigQuery, or Postgres.

---

## 🔗 Recommended Actors

- [**⚖️ California State Bar Scraper**](https://apify.com/parseforge/california-state-bar-scraper) - look up California attorneys for a federal case.
- [**🔍 Skip Trace People Search**](https://apify.com/parseforge/skip-trace-scraper) - locate parties at past addresses for service.
- [**🅱️ Bing Search Scraper**](https://apify.com/parseforge/bing-search-scraper) - search the open web for case-related news.
- [**🦆 DuckDuckGo Search Scraper**](https://apify.com/parseforge/duckduckgo-search-scraper) - alternative SERP signal alongside court data.
- [**🕰️ Wayback Machine CDX Scraper**](https://apify.com/parseforge/wayback-cdx-scraper) - audit historical court website versions.

> 💡 **Pro Tip:** browse the complete [ParseForge collection](https://apify.com/parseforge) for more pre-built scrapers and data tools.

---

**🆘 Need Help?** [**Open our contact form**](https://tally.so/r/BzdKgA) and we'll route the question to the right person.

---

> PACER, FJC, and Court Listener are property of their respective owners. Court Listener is operated by Free Law Project, a 501(c)(3) non-profit. This Actor is not affiliated with or endorsed by PACER, FJC, or Free Law Project. It uses only the public Court Listener REST API.
