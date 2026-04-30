import { Actor, log } from 'apify';
import c from 'chalk';

interface Input {
    maxItems?: number;
    jurisdiction?: string;
    inUseOnly?: boolean;
    courtName?: string;
}

const STARTUP = ['⚖️ Pulling federal courts…', '🏛️ Crawling court directory…', '📚 Reading PACER catalog…'];
const DONE = ['🎉 Courts delivered.', '✅ Court directory ready.', '🚀 Locator captured.'];
const pick = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;

await Actor.init();
const input = (await Actor.getInput<Input>()) ?? {};
const userIsPaying = Boolean(Actor.getEnv()?.userIsPaying);
const isPayPerEvent = Actor.getChargingManager().getPricingInfo().isPayPerEvent;

let effectiveMaxItems = input.maxItems ?? 10;
if (!userIsPaying) {
    if (!effectiveMaxItems || effectiveMaxItems > 10) {
        effectiveMaxItems = 10;
        log.warning([
            '',
            `${c.dim('        *  .  ✦        .    *       .')}`,
            `${c.dim('  .        *')}    🛰️  ${c.dim('.        *   .    ✦')}`,
            `${c.dim('     ✦  .        .       *        .')}`,
            '',
            `${c.yellow("  You're on a free plan — limited to 10 items.")}`,
            `${c.cyan('  Upgrade to a paid plan for up to 1,000,000 items.')}`,
            '',
            `  ✦ ${c.green.underline('https://console.apify.com/sign-up?fpr=vmoqkp')}`,
            '',
        ].join('\n'));
    }
}

const jurisdiction = input.jurisdiction ?? 'FD';
const inUseOnly = input.inUseOnly !== false;
const nameFilter = (input.courtName ?? '').trim().toLowerCase();

console.log(c.cyan('\n🛰️  Arguments:'));
console.log(c.green(`   🟩 jurisdiction : ${jurisdiction}`));
console.log(c.green(`   🟩 inUseOnly : ${inUseOnly}`));
if (nameFilter) console.log(c.green(`   🟩 courtName : ${nameFilter}`));
console.log(c.green(`   🟩 maxItems : ${effectiveMaxItems}`));
console.log('');
console.log(c.magenta(`📬 ${pick(STARTUP)}\n`));

let pushed = 0;
let nextUrl: string | null = `https://www.courtlistener.com/api/rest/v4/courts/?format=json&page_size=100${jurisdiction !== 'all' ? `&jurisdiction=${jurisdiction}` : ''}`;

while (nextUrl && pushed < effectiveMaxItems) {
    log.info(`📡 ${nextUrl.split('?')[0]}`);
    try {
        const r = await fetch(nextUrl, { headers: { 'User-Agent': 'ApifyPACERLocator/1.0' } });
        if (!r.ok) {
            log.error(`HTTP ${r.status}`);
            break;
        }
        const data = (await r.json()) as { results?: any[]; next?: string };
        for (const ct of data.results ?? []) {
            if (pushed >= effectiveMaxItems) break;
            if (inUseOnly && !ct.in_use) continue;
            if (nameFilter && !((ct.full_name ?? '') + ' ' + (ct.short_name ?? '')).toLowerCase().includes(nameFilter)) continue;

            const record = {
                courtId: ct.id,
                pacerCourtId: ct.pacer_court_id,
                fjcCourtId: ct.fjc_court_id || null,
                shortName: ct.short_name,
                fullName: ct.full_name,
                citationString: ct.citation_string,
                jurisdiction: ct.jurisdiction,
                courtUrl: ct.url || null,
                pacerHasRssFeed: ct.pacer_has_rss_feed ?? null,
                pacerRssEntryTypes: ct.pacer_rss_entry_types || null,
                inUse: ct.in_use,
                hasOpinionScraper: ct.has_opinion_scraper,
                hasOralArgumentScraper: ct.has_oral_argument_scraper,
                position: ct.position,
                startDate: ct.start_date,
                endDate: ct.end_date,
                parentCourt: ct.parent_court || null,
                resourceUri: ct.resource_uri,
                scrapedAt: new Date().toISOString(),
            };
            if (isPayPerEvent) await Actor.pushData([record], 'result-item');
            else await Actor.pushData([record]);
            pushed += 1;
        }
        nextUrl = data.next ?? null;
    } catch (err: any) {
        log.error(err.message);
        break;
    }
}

if (pushed === 0) await Actor.pushData([{ error: 'No courts matched.' }]);
log.info(c.green(`✅ Pushed ${pushed} courts`));
console.log(c.magenta(`\n${pick(DONE)}`));
await Actor.exit();
