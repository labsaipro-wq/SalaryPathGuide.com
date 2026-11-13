/**
 * Programmatic SEO (pSEO) Static Page Generator for SalaryPathGuide.com
 * Reads data/careerData.js and generates:
 *  - 18 Role Compensation & Leveling Hub pages (/salaries/<slug>/index.html)
 *  - 4 High-Intent Tool Landing pages (/tools/<slug>/index.html)
 *  - Clean canonical sitemap.xml
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT_DIR = path.resolve(__dirname, "..");
const SITE_URL = "https://salarypathguide.com";
const TODAY = "2026-11-13";

function loadCareerData() {
  const dataPath = path.join(ROOT_DIR, "data", "careerData.js");
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  if (!sandbox.window.CAREER_DATA || !Array.isArray(sandbox.window.CAREER_DATA.roles)) {
    throw new Error("Failed to load window.CAREER_DATA from data/careerData.js");
  }
  return sandbox.window.CAREER_DATA;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtUsd(num) {
  return "$" + Math.round(Number(num) || 0).toLocaleString("en-US");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function renderNavbar() {
  return `
  <header class="navbar" id="navbar">
    <div class="container">
      <a href="/" class="nav-brand">
        <div class="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
        <div class="brand-text">SalaryPath<span>Guide</span></div>
      </a>
      <nav aria-label="Primary">
        <ul class="nav-links">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/#calculator" class="nav-link">Calculator</a></li>
          <li><a href="/#offer-evaluator" class="nav-link">Offer Evaluator</a></li>
          <li><a href="/#career-paths" class="nav-link">Leveling Ladders</a></li>
          <li><a href="/#negotiation" class="nav-link">Negotiation</a></li>
        </ul>
      </nav>
      <div class="nav-actions">
        <a href="/#calculator" class="btn btn-emerald btn-sm">Launch Modeler</a>
      </div>
    </div>
  </header>`;
}

function renderFooter(roles) {
  const roleLinks = roles
    .slice(0, 8)
    .map(
      (r) =>
        `<li><a href="/salaries/${slugify(r.title)}/">${escapeHtml(r.title)}</a></li>`
    )
    .join("\n            ");

  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-brand" style="margin-bottom: 1rem;">
            <div class="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <div class="brand-text">SalaryPath<span>Guide</span></div>
          </div>
          <p class="footer-desc">Career compensation intelligence, 5-year trajectory modeling, and cross-company leveling benchmarks.</p>
        </div>
        <div>
          <h4 class="footer-col-title">2026 Salary Hubs</h4>
          <ul class="footer-links">
            ${roleLinks}
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Compensation Tools</h4>
          <ul class="footer-links">
            <li><a href="/tools/sign-on-cliff-detector/">Year 2 Sign-On Cliff Detector</a></li>
            <li><a href="/tools/83b-election-calculator/">83(b) &amp; Startup Exit Matrix</a></li>
            <li><a href="/tools/fire-compensation-projector/">FIRE Wealth Projector</a></li>
            <li><a href="/tools/geo-arbitrage-calculator/">Geo-Arbitrage Calculator</a></li>
            <li><a href="/#calculator">Interactive 5-Year Calculator</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2026 SalaryPathGuide.com. Benchmarked against 2026 market compensation data.</div>
        <div><a href="/" style="color: var(--emerald-light);">Return to Full Interactive Engine &rarr;</a></div>
      </div>
    </div>
  </footer>`;
}

function renderHead({ title, description, canonicalUrl, schemaGraph }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="SalaryPathGuide">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${SITE_URL}/assets/og-card.jpg">
  <meta property="og:image:type" content="image/jpeg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/assets/og-card.jpg">

  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/assets/icon-192.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
  <meta name="theme-color" content="#0A1128">

  <script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph }, null, 2)}
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css?v=3.9">
</head>`;
}

function renderRolePage(role, allRoles) {
  const slug = slugify(role.title);
  const canonicalUrl = `${SITE_URL}/salaries/${slug}/`;
  const entryLvl = role.levels[0];
  const topLvl = role.levels[role.levels.length - 1];
  const entryTc = entryLvl.base.p50 * (1 + entryLvl.bonusPct / 100) + entryLvl.equityAnnual;
  const topTc = topLvl.base.p50 * (1 + topLvl.bonusPct / 100) + topLvl.equityAnnual;

  const title = `${role.title} Salary Bands & 5-Year Career Path (2026) | SalaryPathGuide`;
  const description = `2026 ${role.title} (${role.category}) total compensation bands from ${entryLvl.code} (${fmtUsd(entryTc)} median TC) to ${topLvl.code} (${fmtUsd(topTc)} median TC). Explore base, bonus, equity, and 5-year compounding.`;

  const faqs = [
    {
      q: `What is the median ${role.title} salary in 2026?`,
      a: `Across ${role.levels.length} career levels, median ${role.title} base salary ranges from ${fmtUsd(entryLvl.base.p50)} at ${entryLvl.code} (${entryLvl.yoe}) to ${fmtUsd(topLvl.base.p50)} at ${topLvl.code} (${topLvl.yoe}), with annual total compensation reaching ${fmtUsd(topTc)}+.`
    },
    {
      q: `How fast are ${role.title} salaries growing?`,
      a: `Current 2026 market demand for ${role.title} is tracking at ${role.marketGrowth} YoY across top specialties including ${role.topSpecialties.join(", ")}.`
    },
    {
      q: `How can I model my 5-year ${role.title} compensation trajectory?`,
      a: `Launch the interactive SalaryPathGuide 5-Year Trajectory Calculator pre-loaded with ${role.title} benchmarks to customize annual raises, promotion cycles, RSU vesting, and FIRE wealth projections.`
    }
  ];

  const schemaGraph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: role.category, item: `${SITE_URL}/#career-paths` },
        { "@type": "ListItem", position: 3, name: role.title, item: canonicalUrl }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const rowsHtml = role.levels
    .map((lvl) => {
      const medianTc = lvl.base.p50 * (1 + lvl.bonusPct / 100) + lvl.equityAnnual;
      return `
              <tr>
                <td><span class="level-tag">${escapeHtml(lvl.code)}</span></td>
                <td><strong>${escapeHtml(lvl.name)}</strong><br><span style="font-size:0.75rem;color:var(--slate-text-muted);">${escapeHtml(lvl.yoe)}</span></td>
                <td class="mono">${fmtUsd(lvl.base.p25)}</td>
                <td class="mono"><strong>${fmtUsd(lvl.base.p50)}</strong></td>
                <td class="mono">${fmtUsd(lvl.base.p75)}</td>
                <td class="mono">${fmtUsd(lvl.base.p90)}</td>
                <td class="mono">${lvl.bonusPct}% / ${fmtUsd(lvl.equityAnnual)}</td>
                <td class="mono table-total">${fmtUsd(medianTc)}</td>
              </tr>`;
    })
    .join("");

  const levelCardsHtml = role.levels
    .map(
      (lvl) => `
          <div class="level-card" style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">
              <span class="level-tag">${escapeHtml(lvl.code)} &middot; ${escapeHtml(lvl.yoe)}</span>
              <span class="mono" style="font-weight:700;color:var(--emerald-dark);">Median Base: ${fmtUsd(lvl.base.p50)}</span>
            </div>
            <h3 style="font-size:1.125rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.5rem;">${escapeHtml(lvl.name)}</h3>
            <p style="font-size:0.9rem;color:var(--slate-text-muted);margin-bottom:0.9rem;">${escapeHtml(lvl.scope)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
              ${lvl.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("")}
            </div>
          </div>`
    )
    .join("");

  const relatedRoles = allRoles
    .filter((r) => r.id !== role.id && r.category === role.category)
    .concat(allRoles.filter((r) => r.id !== role.id && r.category !== role.category))
    .slice(0, 6);

  const relatedHtml = relatedRoles
    .map(
      (r) =>
        `<a href="/salaries/${slugify(r.title)}/" class="trend-pill" style="background:#FFFFFF;color:var(--navy-dark);border-color:var(--slate-border);">${escapeHtml(r.title)} (${escapeHtml(r.marketGrowth)})</a>`
    )
    .join("\n          ");

  return `${renderHead({ title, description, canonicalUrl, schemaGraph })}
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderNavbar()}

  <main id="main-content">
    <section class="hero-section" style="padding: 4rem 0 3.25rem;">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            2026 Compensation Benchmark &bull; ${escapeHtml(role.category)} &bull; ${escapeHtml(role.marketGrowth)}
          </div>
          <h1 class="hero-title" style="font-size:clamp(2rem,4vw,3.15rem);">${escapeHtml(role.title)} <span>Salary Bands &amp; Trajectory</span></h1>
          <p class="hero-subtitle" style="margin-bottom:2rem;">${escapeHtml(role.shortDesc)}</p>
          <div style="display:flex;justify-content:center;gap:0.85rem;flex-wrap:wrap;">
            <a href="/?r=${encodeURIComponent(role.id)}#calculator" class="btn btn-emerald btn-lg">Model 5-Year ${escapeHtml(role.title)} Trajectory &rarr;</a>
            <a href="/?erole=${encodeURIComponent(role.id)}#offer-evaluator" class="btn btn-outline-white btn-lg">Evaluate Written Offer</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-slate">
      <div class="container">
        <div class="section-header" style="margin-bottom:2rem;">
          <span class="section-tag">2026 Percentile Bands (Tier 1 US Benchmark)</span>
          <h2 class="section-title">${escapeHtml(role.title)} Leveling &amp; Total Comp Matrix</h2>
          <p class="section-desc">Base salary percentiles, target annual bonus, annual equity grant, and median total compensation across ${role.levels.length} career levels.</p>
        </div>

        <div class="matrix-table-wrap" style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);margin-bottom:2.5rem;">
          <table class="progression-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Title &amp; Experience</th>
                <th>25th %ile Base</th>
                <th>Median Base (P50)</th>
                <th>75th %ile Base</th>
                <th>90th %ile Base</th>
                <th>Bonus / Equity</th>
                <th>Median Total Comp</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}
            </tbody>
          </table>
        </div>

        <h2 style="font-size:1.5rem;font-weight:800;color:var(--navy-dark);margin-bottom:1.25rem;">Scope, Competencies &amp; Promotion Criteria</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:1.25rem;margin-bottom:3rem;">
          ${levelCardsHtml}
        </div>

        <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);padding:2rem;margin-bottom:2.5rem;">
          <h2 style="font-size:1.35rem;font-weight:800;color:var(--navy-dark);margin-bottom:1rem;">Frequently Asked Questions</h2>
          ${faqs
            .map(
              (f) => `
          <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--slate-border-subtle);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--navy-dark);margin-bottom:0.35rem;">${escapeHtml(f.q)}</h3>
            <p style="font-size:0.9375rem;color:var(--slate-text-muted);">${escapeHtml(f.a)}</p>
          </div>`
            )
            .join("")}
        </div>

        ${CITY_ROLE_IDS.includes(role.id) ? `
        <div style="margin-bottom:2rem;">
          <h3 style="font-size:1.125rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.85rem;">${escapeHtml(role.title)} Salaries by Metro (2026)</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;">
            ${SEO_CITIES.map((c) => `<a href="/salaries/${slug}/${c.slug}/" class="trend-pill" style="background:#FFFFFF;color:var(--emerald-dark);border-color:rgba(16,185,129,0.35);">${escapeHtml(c.shortName)} (${Math.round(c.multiplier * 100)}% Band)</a>`).join("\n            ")}
          </div>
        </div>` : ""}

        <div>
          <h3 style="font-size:1.125rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.85rem;">Explore Related 2026 Compensation Tracks</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;">
            ${relatedHtml}
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(allRoles)}
</body>
</html>`;
}

function renderToolPage(tool, allRoles) {
  const canonicalUrl = `${SITE_URL}/tools/${tool.slug}/`;
  const schemaGraph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: tool.name, item: canonicalUrl }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  return `${renderHead({ title: tool.title, description: tool.description, canonicalUrl, schemaGraph })}
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderNavbar()}

  <main id="main-content">
    <section class="hero-section" style="padding: 4rem 0 3.25rem;">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge"><span class="pulse-dot"></span> ${escapeHtml(tool.badge)}</div>
          <h1 class="hero-title" style="font-size:clamp(2rem,4vw,3.15rem);">${escapeHtml(tool.headline)} <span>${escapeHtml(tool.highlight)}</span></h1>
          <p class="hero-subtitle" style="margin-bottom:2rem;">${escapeHtml(tool.description)}</p>
          <a href="${tool.ctaHref}" class="btn btn-emerald btn-lg">${escapeHtml(tool.ctaLabel)} &rarr;</a>
        </div>
      </div>
    </section>

    <section class="section section-slate">
      <div class="container container-narrow">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:2.5rem;">
          ${tool.highlights
            .map(
              (h) => `
          <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.5rem;">
            <h2 style="font-size:1.1rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.5rem;">${escapeHtml(h.title)}</h2>
            <p style="font-size:0.9rem;color:var(--slate-text-muted);">${escapeHtml(h.body)}</p>
          </div>`
            )
            .join("")}
        </div>

        <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);padding:2rem;">
          <h2 style="font-size:1.35rem;font-weight:800;color:var(--navy-dark);margin-bottom:1rem;">Key Questions Answered</h2>
          ${tool.faqs
            .map(
              (f) => `
          <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--slate-border-subtle);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--navy-dark);margin-bottom:0.35rem;">${escapeHtml(f.q)}</h3>
            <p style="font-size:0.9375rem;color:var(--slate-text-muted);">${escapeHtml(f.a)}</p>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(allRoles)}
</body>
</html>`;
}

const TOOL_PAGES = [
  {
    slug: "sign-on-cliff-detector",
    name: "Year 2 Sign-On Cliff Detector",
    badge: "Offer Diagnostic Engine",
    headline: "Detect Year 2",
    highlight: "Sign-On Compensation Cliffs",
    title: "Year 2 Sign-On Cliff Detector & Offer Evaluator (2026) | SalaryPathGuide",
    description: "Spot hidden Year 2 compensation drops caused by expiring sign-on bonuses or backloaded 5/15/40/40 RSU schedules, and generate counter-offer scripts.",
    ctaHref: "/#offer-evaluator",
    ctaLabel: "Open Written Offer Evaluator",
    highlights: [
      { title: "Spot Year-2 Dropoffs", body: "Model Year 1 through Year 4 cash + vested equity side by side so expiring signing bonuses never catch you off guard." },
      { title: "Amazon vs. Standard Vesting", body: "Compare 5/15/40/40 backloaded grants against 25% uniform schedules and AI Lab 15/25/30/30 tender tracks." },
      { title: "Instant Counter-Offer Scripts", body: "Generate tailored recruiter counter-proposals asking for refresher guarantees or Year-2 cash bridges." }
    ],
    faqs: [
      { q: "What is a Year 2 sign-on cliff?", a: "When a large Year 1 signing bonus expires without an offsetting equity vest or base raise in Year 2, total annual compensation drops sharply." },
      { q: "How do I negotiate around a sign-on cliff?", a: "Request a Year 2 cash bridge, an increased initial equity grant, or a written target annual refresher commitment." }
    ]
  },
  {
    slug: "83b-election-calculator",
    name: "83(b) Election & Startup Exit Calculator",
    badge: "Startup Equity & Tax Arbitrage",
    headline: "Model Startup Options &",
    highlight: "83(b) Tax Arbitrage",
    title: "83(b) Election & Startup Equity Exit Calculator (2026) | SalaryPathGuide",
    description: "Compare 1x, 3x, 5x, and 10x startup exit payouts with and without an IRS 83(b) election to quantify long-term capital gains savings.",
    ctaHref: "/?eq=1&eqv=startup#calculator",
    ctaLabel: "Launch Startup Equity Exit Matrix",
    highlights: [
      { title: "1x to 10x Exit Matrix", body: "Stress-test your startup option grant across Downside (0x), Flat (1x), Series C/IPO (3x), Breakout (5x), and Unicorn (10x) outcomes." },
      { title: "83(b) Ordinary vs. LTCG Spread", body: "Quantify the exact federal tax savings of locking in Long-Term Capital Gains within 30 days of early exercise." },
      { title: "Public RSU Volatility Mode", body: "Switch seamlessly to public RSU appreciation scenarios (-20% Bear to +30% Hypergrowth) with stacking refreshers." }
    ],
    faqs: [
      { q: "When must an 83(b) election be filed?", a: "Within exactly 30 calendar days of your stock grant or early exercise date—there are no extensions." },
      { q: "How much tax can an 83(b) election save?", a: "By shifting future appreciation from ~37% ordinary income rates to ~20% long-term capital gains, early-stage employees can save tens or hundreds of thousands on a 5x–10x exit." }
    ]
  },
  {
    slug: "fire-compensation-projector",
    name: "Compounding Wealth & FIRE Engine",
    badge: "5-Year Net Worth Engine",
    headline: "Turn Salary Growth Into",
    highlight: "FIRE Financial Independence",
    title: "5-Year Salary to FIRE Wealth Projector (2026) | SalaryPathGuide",
    description: "Project how your 5-year salary, bonus, and equity savings compound toward CoastFIRE, LeanFIRE, Full FIRE, and 4% safe withdrawal income.",
    ctaHref: "/#calculator",
    ctaLabel: "Launch FIRE Wealth Engine",
    highlights: [
      { title: "4% Safe Withdrawal Tracker", body: "See the exact perpetual annual and monthly passive income generated by your projected Year 5 portfolio." },
      { title: "CoastFIRE to FatFIRE Milestones", body: "Track progress against $400K CoastFIRE, $1.0M LeanFIRE, $2.0M Full FIRE, and $3.5M+ FatFIRE thresholds." },
      { title: "Dual-Income Household Mode", body: "Combine two career trajectories to model accelerated household wealth accumulation." }
    ],
    faqs: [
      { q: "How does SalaryPathGuide calculate FIRE milestones?", a: "It compounds your starting invested portfolio plus annual post-tax savings from base, bonus, and vested equity at your chosen real market return rate." },
      { q: "What is the Trinity 4% Safe Withdrawal Rule?", a: "A benchmark estimating that withdrawing 4% of your invested portfolio annually sustains a 30+ year retirement horizon." }
    ]
  },
  {
    slug: "geo-arbitrage-calculator",
    name: "Cost-of-Living Geo-Arbitrage Calculator",
    badge: "Relocation & Tax Surplus",
    headline: "Compare Take-Home",
    highlight: "Geo-Arbitrage Surplus",
    title: "Tech Salary Cost-of-Living & Geo-Arbitrage Calculator (2026) | SalaryPathGuide",
    description: "Compare net disposable income and housing-adjusted wealth surplus across SF, NYC, Seattle, Austin, Denver, Miami, Chicago, London, and Toronto.",
    ctaHref: "/#geo-arbitrage",
    ctaLabel: "Compare Cities in Geo-Arbitrage",
    highlights: [
      { title: "Zero-Tax State Arbitrage", body: "Quantify the immediate post-tax savings of relocating from CA/NY to zero-income-tax hubs like Seattle, Austin, or Miami." },
      { title: "Rent & Housing Parity", body: "Factor metro cost-of-living and median home prices into real annual wealth accumulation." },
      { title: "Remote Pay Tier Modeling", body: "Test Tier 1 (100%), Tier 2 (90%), and Tier 3 (82%) remote pay adjustments against lower living expenses." }
    ],
    faqs: [
      { q: "How much can geo-arbitrage save per year?", a: "Earning Tier 1 or Tier 2 compensation in a lower-cost or zero-state-tax metro frequently adds $25,000 to $65,000+ in annual post-tax surplus." },
      { q: "Which cities are included?", a: "San Francisco, New York City, Seattle, Austin, Denver, Miami, Chicago, London, Toronto, and US Remote hubs." }
    ]
  }
];

const CITY_ROLE_IDS = ["swe", "ml_platform", "ai_research", "pm", "ds", "quant", "dentist", "attorney"];

const SEO_CITIES = [
  { id: "sf", slug: "san-francisco", shortName: "San Francisco", name: "San Francisco / Bay Area, CA", multiplier: 1.00, stateTax: 9.3, colIndex: 100, housingMedian: "$1,380,000" },
  { id: "nyc", slug: "new-york", shortName: "New York City", name: "New York City, NY", multiplier: 1.00, stateTax: 10.9, colIndex: 98, housingMedian: "$1,250,000" },
  { id: "sea", slug: "seattle", shortName: "Seattle", name: "Seattle / Bellevue, WA", multiplier: 1.00, stateTax: 0.0, colIndex: 88, housingMedian: "$890,000" },
  { id: "atx", slug: "austin", shortName: "Austin", name: "Austin, TX", multiplier: 0.90, stateTax: 0.0, colIndex: 72, housingMedian: "$560,000" },
  { id: "den", slug: "denver", shortName: "Denver", name: "Denver / Boulder, CO", multiplier: 0.82, stateTax: 4.4, colIndex: 76, housingMedian: "$620,000" },
  { id: "lon", slug: "london", shortName: "London", name: "London, UK", multiplier: 0.74, stateTax: 40.0, colIndex: 82, housingMedian: "£650,000" }
];

function renderRoleCityPage(role, city, allRoles) {
  const roleSlug = slugify(role.title);
  const canonicalUrl = `${SITE_URL}/salaries/${roleSlug}/${city.slug}/`;
  const m = city.multiplier;
  const entryLvl = role.levels[0];
  const topLvl = role.levels[role.levels.length - 1];
  const midLvl = role.levels[Math.min(2, role.levels.length - 1)];
  const midTc = (midLvl.base.p50 * m) * (1 + midLvl.bonusPct / 100) + (midLvl.equityAnnual * m);
  const topTc = (topLvl.base.p50 * m) * (1 + topLvl.bonusPct / 100) + (topLvl.equityAnnual * m);
  const estStateTaxOnMid = midTc * (city.stateTax / 100);
  const purchasingPowerVsSf = Math.round(((m * (1 - city.stateTax / 100)) / (city.colIndex / 100)) / (1 * (1 - 0.093) / 1) * 100);

  const title = `${role.title} Salary in ${city.shortName} (2026 Bands & Tax) | SalaryPathGuide`;
  const description = `2026 ${role.title} total compensation in ${city.name}: ${midLvl.code} median TC ${fmtUsd(midTc)}, up to ${fmtUsd(topTc)} at ${topLvl.code}. Includes ${city.stateTax}% state/local tax and COL index (${city.colIndex}).`;

  const faqs = [
    {
      q: `How much does a ${role.title} make in ${city.shortName} in 2026?`,
      a: `Adjusted for ${city.shortName} (${Math.round(m * 100)}% market tier), median ${role.title} total compensation spans from ${fmtUsd((entryLvl.base.p50 * m) * (1 + entryLvl.bonusPct / 100) + entryLvl.equityAnnual * m)} at ${entryLvl.code} to ${fmtUsd(topTc)} at ${topLvl.code}.`
    },
    {
      q: `How do taxes and cost of living affect ${role.title} pay in ${city.shortName}?`,
      a: `${city.shortName} carries an estimated ${city.stateTax}% state/regional income tax rate and a ${city.colIndex}/100 cost-of-living index (median home ${city.housingMedian}), giving roughly ${purchasingPowerVsSf}% real purchasing power compared to San Francisco.`
    }
  ];

  const schemaGraph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: role.title, item: `${SITE_URL}/salaries/${roleSlug}/` },
        { "@type": "ListItem", position: 3, name: city.shortName, item: canonicalUrl }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const rowsHtml = role.levels
    .map((lvl) => {
      const p25 = lvl.base.p25 * m;
      const p50 = lvl.base.p50 * m;
      const p75 = lvl.base.p75 * m;
      const p90 = lvl.base.p90 * m;
      const eq = lvl.equityAnnual * m;
      const tc = p50 * (1 + lvl.bonusPct / 100) + eq;
      return `
              <tr>
                <td><span class="level-tag">${escapeHtml(lvl.code)}</span></td>
                <td><strong>${escapeHtml(lvl.name)}</strong><br><span style="font-size:0.75rem;color:var(--slate-text-muted);">${escapeHtml(lvl.yoe)}</span></td>
                <td class="mono">${fmtUsd(p25)}</td>
                <td class="mono"><strong>${fmtUsd(p50)}</strong></td>
                <td class="mono">${fmtUsd(p75)}</td>
                <td class="mono">${fmtUsd(p90)}</td>
                <td class="mono">${lvl.bonusPct}% / ${fmtUsd(eq)}</td>
                <td class="mono table-total">${fmtUsd(tc)}</td>
              </tr>`;
    })
    .join("");

  return `${renderHead({ title, description, canonicalUrl, schemaGraph })}
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderNavbar()}

  <main id="main-content">
    <section class="hero-section" style="padding: 4rem 0 3.25rem;">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge"><span class="pulse-dot"></span> ${escapeHtml(city.name)} &bull; ${Math.round(m * 100)}% Geo-Band &bull; ${city.stateTax}% State/Regional Tax</div>
          <h1 class="hero-title" style="font-size:clamp(2rem,4vw,3.15rem);">${escapeHtml(role.title)} Salary in <span>${escapeHtml(city.shortName)}</span></h1>
          <p class="hero-subtitle" style="margin-bottom:2rem;">2026 local compensation bands, state tax drag (${fmtUsd(estStateTaxOnMid)}/yr at ${midLvl.code}), and purchasing power benchmarks.</p>
          <div style="display:flex;justify-content:center;gap:0.85rem;flex-wrap:wrap;">
            <a href="/?r=${encodeURIComponent(role.id)}&loc=${m}#calculator" class="btn btn-emerald btn-lg">Model ${escapeHtml(city.shortName)} 5-Year Trajectory &rarr;</a>
            <a href="/salaries/${roleSlug}/" class="btn btn-outline-white btn-lg">All ${escapeHtml(role.title)} Bands</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-slate">
      <div class="container">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:2rem;">
          <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.25rem;">
            <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--slate-text-muted);">${escapeHtml(midLvl.code)} Median Total Comp</div>
            <div class="mono" style="font-size:1.5rem;font-weight:800;color:var(--emerald-dark);margin-top:0.25rem;">${fmtUsd(midTc)}</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.25rem;">
            <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--slate-text-muted);">Cost of Living Index</div>
            <div class="mono" style="font-size:1.5rem;font-weight:800;color:var(--navy-dark);margin-top:0.25rem;">${city.colIndex} / 100</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.25rem;">
            <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--slate-text-muted);">Real Purchasing Power vs SF</div>
            <div class="mono" style="font-size:1.5rem;font-weight:800;color:var(--navy-dark);margin-top:0.25rem;">${purchasingPowerVsSf}%</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-lg);padding:1.25rem;">
            <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--slate-text-muted);">Median Home Price</div>
            <div class="mono" style="font-size:1.5rem;font-weight:800;color:var(--navy-dark);margin-top:0.25rem;">${escapeHtml(city.housingMedian)}</div>
          </div>
        </div>

        <div class="matrix-table-wrap" style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);margin-bottom:2.5rem;">
          <table class="progression-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Title &amp; Experience</th>
                <th>25th %ile Base</th>
                <th>Median Base (P50)</th>
                <th>75th %ile Base</th>
                <th>90th %ile Base</th>
                <th>Bonus / Equity</th>
                <th>Median Total Comp</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}
            </tbody>
          </table>
        </div>

        <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);padding:2rem;margin-bottom:2rem;">
          <h2 style="font-size:1.35rem;font-weight:800;color:var(--navy-dark);margin-bottom:1rem;">${escapeHtml(city.shortName)} Compensation FAQs</h2>
          ${faqs
            .map(
              (f) => `
          <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--slate-border-subtle);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--navy-dark);margin-bottom:0.35rem;">${escapeHtml(f.q)}</h3>
            <p style="font-size:0.9375rem;color:var(--slate-text-muted);">${escapeHtml(f.a)}</p>
          </div>`
            )
            .join("")}
        </div>

        <div>
          <h3 style="font-size:1.125rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.85rem;">Compare ${escapeHtml(role.title)} in Other Metros</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;">
            ${SEO_CITIES.filter((c) => c.id !== city.id)
              .map((c) => `<a href="/salaries/${roleSlug}/${c.slug}/" class="trend-pill" style="background:#FFFFFF;color:var(--navy-dark);border-color:var(--slate-border);">${escapeHtml(c.shortName)} (${Math.round(c.multiplier * 100)}%)</a>`)
              .join("\n            ")}
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(allRoles)}
</body>
</html>`;
}

const COMPARE_PAGES = [
  {
    slug: "google-vs-meta-levels",
    name: "Google vs. Meta Engineering Levels & Pay",
    badge: "Cross-Company Leveling Comparison",
    headline: "Google vs. Meta",
    highlight: "Leveling & Compensation (2026)",
    title: "Google L3–L7 vs. Meta E3–E7 Levels & Salary Comparison (2026) | SalaryPathGuide",
    description: "Side-by-side comparison of Google (L3–L7) and Meta (E3–E7) engineering levels, 2026 median total compensation bands, and promotion velocity.",
    ctaHref: "/#career-paths",
    ctaLabel: "Open Full Cross-Company Matrix",
    headers: ["Standard Tier", "Google Level", "Meta Level", "2026 Median TC Band"],
    rows: [
      ["Entry (0–2 Yrs)", "L3 (SWE II)", "E3 (Software Engineer)", "$165,000 – $198,000"],
      ["Mid-Level (2–5 Yrs)", "L4 (SWE III)", "E4 (Software Engineer)", "$240,000 – $315,000"],
      ["Senior (5–8 Yrs)", "L5 (Senior SWE)", "E5 (Senior SWE)", "$360,000 – $445,000"],
      ["Staff (8–12 Yrs)", "L6 (Staff SWE)", "E6 (Staff SWE)", "$540,000 – $720,000"],
      ["Principal (12+ Yrs)", "L7+ (Senior Staff)", "E7+ (Senior Staff)", "$850,000 – $1,350,000+"]
    ],
    faqs: [
      { q: "Is Google L5 equal to Meta E5?", a: "Yes. Both represent Senior Software Engineer (terminal level for many ICs), though Meta E5 typically carries faster performance-driven refresher upside while Google L5 offers steadier refreshers and lower baseline volatility." },
      { q: "Which company pays more at Staff (L6/E6)?", a: "At L6/E6, Meta and Google bands overlap heavily ($540K–$720K+ median TC), with Meta's bonus multipliers and stock performance often pushing top-rating E6 packages higher." }
    ]
  },
  {
    slug: "amazon-vs-google-vesting",
    name: "Amazon 5/15/40/40 vs. Google 25% Vesting",
    badge: "Equity Vesting & Cashflow Comparison",
    headline: "Amazon 5/15/40/40 vs.",
    highlight: "Google 25% RSU Vesting",
    title: "Amazon 5/15/40/40 vs. Google 25% RSU Vesting & Sign-On Cliff (2026) | SalaryPathGuide",
    description: "Compare Amazon's backloaded 5/15/40/40 vesting + Year 1–2 cash sign-on bridge against Google's uniform 25% annual RSU schedule.",
    ctaHref: "/?eq=1&vs=amazon&eg=200000#calculator",
    ctaLabel: "Simulate Amazon Vesting in Calculator",
    headers: ["Grant Year", "Amazon RSU Vest %", "Google RSU Vest %", "Cashflow Impact on $200K Grant"],
    rows: [
      ["Year 1", "5% ($10,000)", "25% ($50,000)", "Amazon relies on Yr-1 cash sign-on bridge (-$40K stock)"],
      ["Year 2", "15% ($30,000)", "25% ($50,000)", "Watch for Year 2/3 sign-on cliff if stock stays flat"],
      ["Year 3", "40% ($80,000)", "25% ($50,000)", "Amazon vests semi-annually (+$30K stock vs Google)"],
      ["Year 4", "40% ($80,000)", "25% ($50,000)", "Both reach 100% vested ($200K cumulative)"]
    ],
    faqs: [
      { q: "Why does Amazon use 5/15/40/40 vesting?", a: "Amazon backloads equity into Years 3 and 4 and compensates in Years 1 and 2 with cash signing bonuses, assuming 15% annual stock appreciation in internal total comp targets." },
      { q: "What happens if I leave Amazon before Year 3?", a: "You only vest 20% of your initial equity grant after 2 full years (vs. 50% at Google or Meta), making upfront cash sign-on negotiation critical." }
    ]
  },
  {
    slug: "seattle-vs-san-francisco-tech-pay",
    name: "Seattle vs. San Francisco Tech Pay",
    badge: "Geo-Arbitrage Comparison",
    headline: "Seattle vs. San Francisco",
    highlight: "Net Take-Home & Housing Parity",
    title: "Seattle vs. San Francisco Tech Salary & Take-Home Pay (2026) | SalaryPathGuide",
    description: "Compare Tier 1 tech compensation in Seattle (0% state income tax) vs. San Francisco (9.3%+ CA state tax) and housing costs.",
    ctaHref: "/#geo-arbitrage",
    ctaLabel: "Open Geo-Arbitrage Calculator",
    headers: ["Metric (2026 Benchmark)", "Seattle / Bellevue, WA", "San Francisco / Bay Area, CA", "Net Advantage"],
    rows: [
      ["Compensation Tier", "Tier 1 (100%)", "Tier 1 (100%)", "Parity on Big Tech bands"],
      ["State Income Tax", "0.0%", "9.3% – 13.3%", "+$25,000–$45,000/yr saved in WA"],
      ["Cost of Living Index", "88 / 100", "100 / 100", "12% lower baseline COL"],
      ["Median Home Price", "$890,000", "$1,380,000", "$490,000 lower entry housing"]
    ],
    faqs: [
      { q: "Do Big Tech companies pay the same in Seattle as San Francisco?", a: "Most Tier 1 tech firms (Amazon, Microsoft, Meta, Google) keep Seattle in their top 100% compensation tier, making Seattle one of the highest after-tax wealth hubs in the US." }
    ]
  },
  {
    slug: "austin-vs-new-york-take-home",
    name: "Austin vs. New York City Take-Home Pay",
    badge: "Geo-Arbitrage Comparison",
    headline: "Austin vs. New York City",
    highlight: "Tax & Wealth Surplus (2026)",
    title: "Austin vs. New York City Tech Salary & Take-Home Comparison (2026) | SalaryPathGuide",
    description: "Compare Austin (Tier 2 90% pay, 0% TX state tax) against New York City (Tier 1 100% pay, 10.9% state/city tax, 98 COL).",
    ctaHref: "/#geo-arbitrage",
    ctaLabel: "Compare Austin vs NYC Live",
    headers: ["Metric (2026 Benchmark)", "Austin, TX", "New York City, NY", "Net Surplus Takeaway"],
    rows: [
      ["Compensation Tier", "Tier 2 (90%)", "Tier 1 (100%)", "-10% gross headline band"],
      ["State + Local Tax", "0.0%", "~10.9%", "Zero state/city income tax offsets pay gap"],
      ["Cost of Living Index", "72 / 100", "98 / 100", "26-point COL advantage"],
      ["Median Home Price", "$560,000", "$1,250,000", "2.2x more affordable housing"]
    ],
    faqs: [
      { q: "Does Austin beat NYC in net savings despite a 10% lower band?", a: "For most L4–L6 engineers and PMs, saving 10.9% in NY state/city taxes plus ~26% lower housing and living costs leaves Austin ahead on net annual savings." }
    ]
  }
];

function renderComparePage(cmp, allRoles) {
  const canonicalUrl = `${SITE_URL}/compare/${cmp.slug}/`;
  const schemaGraph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: cmp.name, item: canonicalUrl }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: cmp.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  return `${renderHead({ title: cmp.title, description: cmp.description, canonicalUrl, schemaGraph })}
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderNavbar()}

  <main id="main-content">
    <section class="hero-section" style="padding: 4rem 0 3.25rem;">
      <div class="hero-glow"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge"><span class="pulse-dot"></span> ${escapeHtml(cmp.badge)}</div>
          <h1 class="hero-title" style="font-size:clamp(2rem,4vw,3.15rem);">${escapeHtml(cmp.headline)} <span>${escapeHtml(cmp.highlight)}</span></h1>
          <p class="hero-subtitle" style="margin-bottom:2rem;">${escapeHtml(cmp.description)}</p>
          <a href="${cmp.ctaHref}" class="btn btn-emerald btn-lg">${escapeHtml(cmp.ctaLabel)} &rarr;</a>
        </div>
      </div>
    </section>

    <section class="section section-slate">
      <div class="container container-narrow">
        <div class="matrix-table-wrap" style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);margin-bottom:2.5rem;">
          <table class="progression-table">
            <thead>
              <tr>${cmp.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${cmp.rows.map((r) => `<tr>${r.map((cell, idx) => `<td${idx === r.length - 1 ? ' class="table-total"' : ""}>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("\n              ")}
            </tbody>
          </table>
        </div>

        <div style="background:#FFFFFF;border:1px solid var(--slate-border);border-radius:var(--radius-xl);padding:2rem;margin-bottom:2rem;">
          <h2 style="font-size:1.35rem;font-weight:800;color:var(--navy-dark);margin-bottom:1rem;">Comparison FAQs</h2>
          ${cmp.faqs
            .map(
              (f) => `
          <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--slate-border-subtle);">
            <h3 style="font-size:1rem;font-weight:700;color:var(--navy-dark);margin-bottom:0.35rem;">${escapeHtml(f.q)}</h3>
            <p style="font-size:0.9375rem;color:var(--slate-text-muted);">${escapeHtml(f.a)}</p>
          </div>`
            )
            .join("")}
        </div>

        <div>
          <h3 style="font-size:1.125rem;font-weight:800;color:var(--navy-dark);margin-bottom:0.85rem;">More Compensation Comparisons</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;">
            ${COMPARE_PAGES.filter((c) => c.slug !== cmp.slug)
              .map((c) => `<a href="/compare/${c.slug}/" class="trend-pill" style="background:#FFFFFF;color:var(--navy-dark);border-color:var(--slate-border);">${escapeHtml(c.name)}</a>`)
              .join("\n            ")}
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter(allRoles)}
</body>
</html>`;
}

function main() {
  const careerData = loadCareerData();
  const roles = careerData.roles;
  const sitemapUrls = [{ loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.00" }];

  // 1. Generate 18 role pages + 48 Role x City pages
  let roleCityCount = 0;
  for (const role of roles) {
    const slug = slugify(role.title);
    const outDir = path.join(ROOT_DIR, "salaries", slug);
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), renderRolePage(role, roles), "utf8");
    sitemapUrls.push({
      loc: `${SITE_URL}/salaries/${slug}/`,
      changefreq: "weekly",
      priority: "0.85"
    });

    if (CITY_ROLE_IDS.includes(role.id)) {
      for (const city of SEO_CITIES) {
        const cityDir = path.join(outDir, city.slug);
        ensureDir(cityDir);
        fs.writeFileSync(path.join(cityDir, "index.html"), renderRoleCityPage(role, city, roles), "utf8");
        sitemapUrls.push({
          loc: `${SITE_URL}/salaries/${slug}/${city.slug}/`,
          changefreq: "weekly",
          priority: "0.80"
        });
        roleCityCount++;
      }
    }
  }

  // 2. Generate 4 tool pages
  for (const tool of TOOL_PAGES) {
    const outDir = path.join(ROOT_DIR, "tools", tool.slug);
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), renderToolPage(tool, roles), "utf8");
    sitemapUrls.push({
      loc: `${SITE_URL}/tools/${tool.slug}/`,
      changefreq: "weekly",
      priority: "0.90"
    });
  }

  // 3. Generate 4 comparison pages
  for (const cmp of COMPARE_PAGES) {
    const outDir = path.join(ROOT_DIR, "compare", cmp.slug);
    ensureDir(outDir);
    fs.writeFileSync(path.join(outDir, "index.html"), renderComparePage(cmp, roles), "utf8");
    sitemapUrls.push({
      loc: `${SITE_URL}/compare/${cmp.slug}/`,
      changefreq: "weekly",
      priority: "0.85"
    });
  }

  // 4. Write clean canonical sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT_DIR, "sitemap.xml"), sitemapXml, "utf8");

  console.log(`Generated ${roles.length} role pages, ${roleCityCount} role-city pages, ${TOOL_PAGES.length} tool pages, ${COMPARE_PAGES.length} compare pages, and ${sitemapUrls.length} sitemap URLs.`);
}

main();
