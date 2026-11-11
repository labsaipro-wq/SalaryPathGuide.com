# SalaryPathGuide (SalaryPathGuide.com)

**SalaryPathGuide** is a modern, high-trust career compensation intelligence portal and interactive 5-year salary trajectory tool designed for technology professionals, engineering managers, product leads, and data specialists.

The application benchmarks real-world tech compensation bands from Junior (L3) to Senior Staff / Director (L7), simulates 5-year compounding earnings potential across custom merit raise and promotion cadences, supports multi-currency conversions and CSV exports, and provides actionable negotiation scripts and career upskilling roadmaps.

---

## 🚀 Key Features

### 1. Multi-Currency Global Engine
- **Supported Currencies**: USD (`$`), EUR (`€`), GBP (`£`), CAD (`CA$`), and AUD (`A$`).
- **Live Conversion**: Dynamically converts all base salary bands, total comp figures, trajectory tables, KPI badges, and charts in real-time.
- **Synchronized Selectors**: Accessible from both top navigation and mobile drawer.

### 2. Hero Header & Quick-Search Directory
- **Headline & Subtitle**: High-impact fintech messaging with dark navy (`#0A1128`) and emerald growth branding (`#10B981`).
- **Autocomplete Job Title Search**: Instant auto-suggest with category tags, YoY market growth rates, and median base compensation benchmarks.
- **Trending Track Chips**: One-click quick jump across 10 in-demand career paths (QA Automation, Software Engineer, FinTech Quant, Mobile iOS/Android, Product Manager, Data Analyst, Machine Learning, DevOps / SRE).
- **Market Pulse Ticker**: Live compensation metrics benchmarked against 14,200+ verified tech offers.

### 3. Interactive 5-Year Salary Trajectory Calculator
- **Dynamic Parameter Controls**:
  - Current Job Title (synced across 10 specialized career tracks)
  - Current Annual Base Salary (number input & range slider bi-directionally linked)
  - Expected Annual Merit Raise % (1% to 15%, default: 4%)
  - Target Promotion Interval (Every 1 Year, Every 2 Years, Every 3 Years, or None)
  - Promotion Salary Bump % (5% to 30%, default: 15%)
  - Advanced Settings: Annual Performance Bonus % (0% to 30%), Location Cost-of-Living Tier multipliers (Tier 1 SF/NYC 100%, Tier 2 Austin/LA 90%, Tier 3 Remote US 82%, Tier 4 Intl 74%), and **Inflation-Adjusted Purchasing Power mode** (@ 2.8%/yr).
- **Real-Time Dynamic Outputs**:
  - **5-Year Cumulative Total Earnings**: Compounded multi-year sum of base salary and bonus.
  - **Compounded Growth Percentage**: Total income trajectory progression from Year 0 to Year 5 with ending base rate.
  - **Promotion Value Added**: Calculated monetary delta earned specifically due to promotions vs. staying at a flat tenure rate.
  - **Visual Trajectory Bar Chart**: Responsive Chart.js stacked bar chart showing annual base compensation and bonus layers (with automated SVG fallback for offline sandboxes).
  - **Year-by-Year Breakdown Table**: Granular line-item progression detailing Merit Raises, Promotion Bumps, Bonuses, and Cumulative Comp.
  - **Export Toolbar**: One-click "Copy Trajectory Summary" to clipboard, **"Download CSV"** spreadsheet export, and print-ready PDF styling (`window.print()`).

### 4. Programmatic Career Path Directory (14 Specialized Tracks Across Healthcare, Tech & Finance)
- **Comprehensive Leveling Stages**:
  - Healthcare / Dental: D1 Associate Dentist ($160k) through D4 Practice Owner ($385k - $650k+) & D5 Specialist ($440k - $780k+)
  - Medicine: M1 Resident ($72k) through M4 Medical Director / CMO ($460k - $680k+)
  - Legal & Finance: J1 Junior Associate ($175k) through J4 General Counsel / Equity Partner ($430k - $750k+), and F1 Analyst through F4 Managing Director ($450k - $800k+)
  - Tech & Engineering: L3 Junior ($88k) through L7 Senior Staff / Distinguished Architect ($320k - $460k+)
- **Track Coverage**:
  1. **General Dentist & Dental Specialist** (D1 Associate to D4 Practice Owner / D5 Specialist)
  2. **Physician / Medical Doctor** (M1 Resident to M4 Medical Director / CMO)
  3. **Corporate Attorney / Legal Counsel** (J1 Associate to J4 General Counsel / Partner)
  4. **Investment Banking & Private Equity** (F1 Analyst to F4 Managing Director)
  5. Software Engineer (Full-Stack / Backend / Systems)
  6. QA Automation Engineer / SDET
  7. Product Manager (APM to Director)
  8. Data Analyst & Analytics Engineer
  9. Data Scientist & Machine Learning Engineer
  10. Cloud & DevOps / SRE Engineer
  11. Cyber Security Engineer
  12. Engineering Manager (EM I to Director)
  13. Mobile Software Engineer (iOS & Android)
  14. Quantitative Developer / FinTech Systems (High Frequency & Algorithmic Trading)
- **Granular Data Rubrics per Level**:
  - Base salary percentiles (25th percentile, Median 50th, 75th, and 90th percentile)
  - Total Target Comp (TTC) estimating annual equity/practice share and performance bonuses
  - Core clinical/technical competencies and scope of ownership
  - Step-by-step upskilling roadmap checklist to unlock the next leveling tier
  - **"Model in Calculator" CTA**: Instantly pre-fills the calculator with the selected role and median salary and smoothly scrolls to the simulation.

### 5. Salary Negotiation Playbook & Script Generator
- **5 Negotiation Scenarios**:
  - *Dental & Clinical Associate Contract Negotiation* (Daily Guarantee, Collections %, Lab Fees, Buy-in)
  - *Counter-Offering Initial Job Offer*
  - *Leveraging Competing Offers without Burning Bridges*
  - *Annual Merit Review & Out-of-Cycle Raise Ask*
  - *Level Promotion Pay Band Realignment*
- **Interactive Script Customizer**: Enter target practice/company, desired base salary/daily rate, competing offer, or key clinical specialization, and verbatim phone dialogues and email templates update live in the active currency.
- **Copy Script Buttons**: Instant one-click clipboard copying with toast confirmation.
- **Tactical Dos & Don'ts**: Strategic behavioral guidelines and "4 Golden Rules" of tech compensation negotiation.

### 6. Monetization & Resource CTA Section
- High-trust affiliate resource cards:
  - **Senior & Staff Tech CV Optimization Suite**
  - **Distributed Systems & System Design Blueprint**
  - **Algorithmic Pattern Mastery & LeetCode Fast-Track**
  - **Tech Offer Negotiation 1-on-1 Intensive**

### 7. Side-by-Side Compensation Band Comparator
- Interactive modal to compare any two roles or levels side-by-side (e.g., QA Automation L4 vs Software Engineer L4, or Mid-Level L4 vs Senior L5).
- Displays exact base salary differences ($ and %), Total Target Compensation difference, and comparative skill requirements.

---

## 🎨 UI/UX & Design System

- **Color Palette**:
  - Dark Navy Accent & Hero: `#0A1128`, `#162248`, `#111A38`
  - Emerald Action & Salary Growth: `#10B981`, `#059669`, `#34D399`
  - Slate Containers & Backgrounds: `#F8FAFC`, `#F1F5F9`, `#E2E8F0`
- **Typography**: Inter system font stack with JetBrains Mono for monetary figures.
- **Layout**: High-density scannable data layouts, glassmorphism cards, custom slider track styling, responsive mobile drawer menu, and clean print stylesheet.

---

## 📂 File Architecture

```
salarypathguide/
├── index.html            # Semantic HTML5 application structure & modal components
├── styles.css            # Fintech design system & responsive styling
├── app.js                # State machine, calculations, multi-currency, CSV export & charts
├── data/
│   └── careerData.js     # Curated 2026 tech compensation leveling dataset (10 tracks)
└── README.md             # Project documentation & run guide
```

---

## 💻 How to Run Locally

You can open `index.html` directly in any modern browser:

```bash
# Option 1: Open directly in Chrome/Edge/Firefox
start index.html

# Option 2: Run with any local server
npx serve .
# or
python -m http.server 8080
```

Navigate to `http://localhost:8080` in your web browser.

---

## 🛡️ License
Copyright © 2026 SalaryPathGuide.com. All rights reserved.
