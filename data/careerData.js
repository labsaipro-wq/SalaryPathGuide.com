// SalaryPathGuide Career & Compensation Intelligence Dataset
// Benchmarked against 2025-2026 tech compensation data (Levels.fyi, Radford, Carta, Glassdoor, CompGauge)

const CAREER_DATA = {
  roles: [
    {
      id: "swe",
      title: "Software Engineer",
      category: "Engineering",
      shortDesc: "Designs, constructs, tests, and maintains scalable software applications, backend services, and cloud systems.",
      marketGrowth: "+7.4% YoY",
      topSpecialties: ["Backend Distributed Systems", "Full-Stack Web", "Mobile (iOS/Android)", "Cloud Infrastructure"],
      levels: [
        {
          code: "L3",
          name: "Junior / Entry Software Engineer",
          yoe: "0 - 2 Years",
          base: { p25: 75000, p50: 88000, p75: 105000, p90: 125000 },
          bonusPct: 8,
          equityAnnual: 12000,
          scope: "Executes well-defined tasks, squashes bugs, writes unit tests, and contributes clean code under senior mentorship.",
          skills: ["Data Structures & Algorithms", "Git & CI/CD", "TypeScript / Python / Go", "REST APIs", "Unit Testing"],
          upskillPath: [
            "Take end-to-end ownership of a medium-sized microservice or feature module.",
            "Deepen debugging and root-cause analysis (profiling, tracing, log analytics).",
            "Actively participate in code reviews and practice system design fundamentals."
          ]
        },
        {
          code: "L4",
          name: "Mid-Level Software Engineer",
          yoe: "2 - 5 Years",
          base: { p25: 110000, p50: 128000, p75: 152000, p90: 175000 },
          bonusPct: 10,
          equityAnnual: 25000,
          scope: "Autonomously scopes and delivers complex multi-week features, designs schema & APIs, mentors L3 engineers.",
          skills: ["Distributed Systems", "SQL & NoSQL Database Optimization", "Cloud Architecture (AWS/GCP)", "Docker & Kubernetes", "System Design"],
          upskillPath: [
            "Lead cross-functional technical initiatives involving multiple team dependencies.",
            "Write comprehensive Technical Design Documents (RFCs) addressing scale and failure modes.",
            "Mentor junior engineers and champion testing/observability best practices."
          ]
        },
        {
          code: "L5",
          name: "Senior Software Engineer",
          yoe: "5 - 8 Years",
          base: { p25: 155000, p50: 182000, p75: 215000, p90: 255000 },
          bonusPct: 15,
          equityAnnual: 55000,
          scope: "Defines architectural standards for the squad, drives technical roadmaps, eliminates cross-service bottlenecks, and sets code quality bars.",
          skills: ["High-Throughput Architecture", "Event-Driven Systems (Kafka)", "Resilience Engineering", "Mentorship", "Cost Optimization"],
          upskillPath: [
            "Architect business-critical systems that span multiple teams and orgs.",
            "Influence engineering strategy by aligning tech debt retirement with business ROI.",
            "Build organizational leverage by speaking at tech summits and authoring architectural RFCs."
          ]
        },
        {
          code: "L6",
          name: "Staff / Principal Software Engineer",
          yoe: "8 - 12+ Years",
          base: { p25: 210000, p50: 245000, p75: 295000, p90: 345000 },
          bonusPct: 20,
          equityAnnual: 110000,
          scope: "Acts as a technical authority across entire business domains. Solves company-wide scaling bottlenecks, shapes 3-year tech strategy.",
          skills: ["Strategic System Design", "Org-wide Technical Alignment", "Multi-Region Cloud Reliability", "Executive Communication", "Tech Due Diligence"],
          upskillPath: [
            "Partner directly with C-Suite/VP of Engineering on next-generation platform migration.",
            "Represent company engineering in open source communities and industry standards.",
            "Drive talent retention and senior talent acquisition."
          ]
        },
        {
          code: "L7",
          name: "Senior Staff / Distinguished Architect",
          yoe: "12+ Years",
          base: { p25: 275000, p50: 320000, p75: 390000, p90: 460000 },
          bonusPct: 25,
          equityAnnual: 220000,
          scope: "Industry-recognized visionary guiding company-wide technological destiny and IP portfolio.",
          skills: ["Enterprise Architecture", "Transformational Tech Strategy", "Multi-Cloud Governance", "Board-level Advisory"],
          upskillPath: [
            "Pioneer novel patents, high-impact proprietary algorithms, or company-defining platform bets.",
            "Establish global engineering culture and strategic partner alliances."
          ]
        }
      ]
    },
    {
      id: "qa",
      title: "QA Automation Engineer / SDET",
      category: "Engineering",
      shortDesc: "Architects automated testing frameworks, CI/CD quality gates, performance test suites, and continuous validation pipelines.",
      marketGrowth: "+6.8% YoY",
      topSpecialties: ["Cypress / Playwright E2E", "API Contract Testing", "Performance & Load Testing (k6)", "CI/CD Test Ops"],
      levels: [
        {
          code: "L3",
          name: "QA Automation Engineer I",
          yoe: "0 - 2 Years",
          base: { p25: 68000, p50: 78000, p75: 92000, p90: 108000 },
          bonusPct: 7,
          equityAnnual: 8000,
          scope: "Writes and maintains UI/API automated test scripts, reproduces bugs, conducts manual regression when necessary.",
          skills: ["Python / JavaScript", "Selenium / Playwright basics", "Postman & REST API Testing", "Jira / TestRail", "Git basics"],
          upskillPath: [
            "Transition from UI-heavy scripts to robust API-level mock and contract testing.",
            "Learn containerized test execution with Docker and GitHub Actions.",
            "Understand test design patterns (Page Object Model, Component Testing, Fixtures)."
          ]
        },
        {
          code: "L4",
          name: "QA Automation Engineer II / SDET",
          yoe: "2 - 5 Years",
          base: { p25: 95000, p50: 112000, p75: 130000, p90: 148000 },
          bonusPct: 10,
          equityAnnual: 18000,
          scope: "Architects scalable test automation suites from scratch, integrates automated gates into CI/CD, isolates flaky tests.",
          skills: ["Playwright / Cypress", "Postman / Newman / Pact", "CI/CD Pipeline Integration", "Dockerized Test Rigs", "SQL Data Validation"],
          upskillPath: [
            "Build automated performance & stress testing using k6 or Locust.",
            "Implement synthetic production monitoring and observability alerts.",
            "Champion Shift-Left testing culture by pair-programming with backend developers."
          ]
        },
        {
          code: "L5",
          name: "Senior SDET / QA Lead",
          yoe: "5 - 8 Years",
          base: { p25: 135000, p50: 155000, p75: 180000, p90: 210000 },
          bonusPct: 15,
          equityAnnual: 42000,
          scope: "Owns the entire engineering quality philosophy and metrics (MTTR, Defect Escape Rate), leads framework modernization.",
          skills: ["Enterprise Test Frameworks", "Chaos & Resilience Testing", "Security Testing (OWASP ZAP)", "Test Data Management", "Cross-Squad Quality Governance"],
          upskillPath: [
            "Architect zero-downtime regression testing for microservices and asynchronous events.",
            "Reduce CI test execution runtimes by 50%+ through intelligent test sharding and parallelization.",
            "Establish automated compliance and security verification in deployment pipelines."
          ]
        },
        {
          code: "L6",
          name: "Lead SDET / Quality Architect",
          yoe: "8 - 12+ Years",
          base: { p25: 180000, p50: 210000, p75: 250000, p90: 290000 },
          bonusPct: 18,
          equityAnnual: 85000,
          scope: "Company-wide authority on testing architectures, developer productivity tooling, and release verification infrastructure.",
          skills: ["Developer Velocity Tooling", "Cloud-Scale Emulation", "AI-Assisted Test Generation", "Strategic Vendor Evaluation", "Executive Quality Dashboards"],
          upskillPath: [
            "Design company-wide ephemeral staging environments with sanitized production data.",
            "Evaluate and deploy AI-driven test healing and self-maintaining regression engines.",
            "Partner with VP of Engineering on developer ergonomics and release cadence acceleration."
          ]
        }
      ]
    },
    {
      id: "pm",
      title: "Product Manager",
      category: "Product",
      shortDesc: "Translates customer insights and business strategies into clear product requirements, leading squads through execution.",
      marketGrowth: "+6.1% YoY",
      topSpecialties: ["B2B SaaS Platforms", "Consumer Growth & Retention", "AI Product Management", "Fintech & Payments"],
      levels: [
        {
          code: "L3",
          name: "Associate Product Manager (APM)",
          yoe: "0 - 2 Years",
          base: { p25: 78000, p50: 92000, p75: 110000, p90: 130000 },
          bonusPct: 10,
          equityAnnual: 15000,
          scope: "Drafts PRDs for small features, tracks sprint backlog, analyzes user feedback and telemetry metrics.",
          skills: ["Product Analytics (Mixpanel/Amplitude)", "Agile Sprint Grooming", "User Interviewing", "SQL for PMs", "Wireframing"],
          upskillPath: [
            "Demonstrate end-to-end launch of a customer-facing feature that moves a North Star metric.",
            "Build rock-solid trust with engineering counterparts by writing crystal-clear acceptance criteria.",
            "Master unit economics and customer acquisition funnels."
          ]
        },
        {
          code: "L4",
          name: "Product Manager (PM II)",
          yoe: "2 - 5 Years",
          base: { p25: 115000, p50: 135000, p75: 160000, p90: 185000 },
          bonusPct: 12,
          equityAnnual: 30000,
          scope: "Owns a full product pod or feature suite; formulates quarterly roadmap, balances user delight with business revenue.",
          skills: ["Roadmap Prioritization (RICE)", "A/B Experimentation", "Go-To-Market (GTM) Strategy", "Competitive Intelligence", "Stakeholder Alignment"],
          upskillPath: [
            "Tie product roadmaps directly to P&L improvements or cost-saving operational efficiencies.",
            "Run statistically rigorous A/B experiments that optimize activation and retention.",
            "Navigate complex cross-team dependencies without managerial authority."
          ]
        },
        {
          code: "L5",
          name: "Senior Product Manager",
          yoe: "5 - 8 Years",
          base: { p25: 160000, p50: 185000, p75: 220000, p90: 260000 },
          bonusPct: 15,
          equityAnnual: 65000,
          scope: "Drives multi-product vision, orchestrates multi-quarter strategic bets, aligns sales, design, and engineering.",
          skills: ["Strategic Vision", "Executive Storytelling", "Monetization & Pricing Models", "Platform Thinking", "Talent Mentorship"],
          upskillPath: [
            "Conceptualize and incubate an entirely new line of business or zero-to-one product vertical.",
            "Present product narratives persuasively to board members and enterprise clients.",
            "Coach APMs and PMs into high performers."
          ]
        },
        {
          code: "L6",
          name: "Principal PM / Group Product Manager (GPM)",
          yoe: "8 - 12+ Years",
          base: { p25: 215000, p50: 250000, p75: 305000, p90: 365000 },
          bonusPct: 20,
          equityAnnual: 125000,
          scope: "Leads a portfolio of product pods or manages a team of 4-8 PMs; shapes annual budget and multi-year product strategy.",
          skills: ["Org Design & Team Building", "Corporate Strategy", "M&A Integration", "High-Stakes Partner Negotiation"],
          upskillPath: [
            "Scale business line to $50M+ ARR or hundreds of millions in transacted volume.",
            "Build resilient product operating cadences that sustain company-wide velocity."
          ]
        },
        {
          code: "L7",
          name: "Director of Product / VP Product",
          yoe: "12+ Years",
          base: { p25: 280000, p50: 335000, p75: 410000, p90: 490000 },
          bonusPct: 30,
          equityAnnual: 250000,
          scope: "Accountable for company product portfolio success, investor updates, cross-functional organization leadership.",
          skills: ["Executive Leadership", "Market Positioning", "Organizational Scaling", "Board Advisory"],
          upskillPath: ["Drive enterprise valuation expansion and category market leadership."]
        }
      ]
    },
    {
      id: "da",
      title: "Data Analyst & Analytics Engineer",
      category: "Data & AI",
      shortDesc: "Transforms raw data into executive intelligence, builds dbt data transformation pipelines, and powers data-driven business decisions.",
      marketGrowth: "+7.1% YoY",
      topSpecialties: ["dbt & Modern Data Stack", "Executive BI (Tableau/Looker)", "Product Analytics", "Financial & Revenue Modeling"],
      levels: [
        {
          code: "L3",
          name: "Junior Data Analyst",
          yoe: "0 - 2 Years",
          base: { p25: 65000, p50: 76000, p75: 90000, p90: 105000 },
          bonusPct: 7,
          equityAnnual: 8000,
          scope: "Builds SQL queries, cleans datasets, creates reports and Tableau/PowerBI dashboards for department leads.",
          skills: ["Advanced SQL", "Excel / Google Sheets modeling", "Tableau / Looker", "Python (Pandas) basics", "Data Hygiene"],
          upskillPath: [
            "Transition from manual SQL queries to declarative data modeling using dbt and Git.",
            "Learn dimensional modeling (star schema, fact & dimension tables).",
            "Present analytical findings with clear business recommendations rather than just chart screenshots."
          ]
        },
        {
          code: "L4",
          name: "Data Analyst II / Analytics Engineer",
          yoe: "2 - 5 Years",
          base: { p25: 92000, p50: 110000, p75: 132000, p90: 152000 },
          bonusPct: 10,
          equityAnnual: 18000,
          scope: "Designs scalable semantic data models, validates data pipelines, partners directly with Product & Marketing leaders.",
          skills: ["dbt (Data Build Tool)", "Snowflake / BigQuery", "Advanced Python Data Analytics", "Cohort & LTV Modeling", "Airflow / Dagster"],
          upskillPath: [
            "Establish self-serve data infrastructure enabling business stakeholders to explore data safely.",
            "Implement automated data quality testing and alerting (Great Expectations / Monte Carlo).",
            "Translate ambiguous business queries into clean statistical experiments."
          ]
        },
        {
          code: "L5",
          name: "Senior Analytics Engineer / Lead Analyst",
          yoe: "5 - 8 Years",
          base: { p25: 138000, p50: 160000, p75: 190000, p90: 220000 },
          bonusPct: 15,
          equityAnnual: 45000,
          scope: "Architects enterprise data models, mentors junior analysts, leads company-wide KPI governance and metrics definitions.",
          skills: ["Enterprise Semantic Layers", "Data Governance & Lineage", "Advanced Statistical Inference", "Cloud Warehouse Cost Control", "Cross-Exec Communication"],
          upskillPath: [
            "Unify disjointed source systems into a unified single source of truth for the company.",
            "Drive warehouse query cost reduction while slashing query latency.",
            "Establish predictive analytics pipelines for customer churn and revenue forecasting."
          ]
        },
        {
          code: "L6",
          name: "Principal Analytics Architect / Data Director",
          yoe: "8 - 12+ Years",
          base: { p25: 190000, p50: 225000, p75: 270000, p90: 320000 },
          bonusPct: 20,
          equityAnnual: 90000,
          scope: "Shapes enterprise data strategy, oversees data engineering infrastructure, acts as strategic advisor to CFO and CEO.",
          skills: ["Data Strategy", "Data Mesh Architectures", "C-Suite Financial Alignment", "Enterprise Compliance (GDPR/HIPAA)"],
          upskillPath: ["Guide strategic M&A data migrations and steer predictive AI investments."]
        }
      ]
    },
    {
      id: "ds",
      title: "Data Scientist & Machine Learning Engineer",
      category: "Data & AI",
      shortDesc: "Develops predictive models, LLM applications, deep learning architectures, and scalable inference pipelines.",
      marketGrowth: "+11.2% YoY",
      topSpecialties: ["Generative AI & LLM Fine-Tuning", "Recommendation Engines", "Computer Vision", "MLOps & Cloud Serving"],
      levels: [
        {
          code: "L3",
          name: "Associate Data Scientist / ML Engineer",
          yoe: "0 - 2 Years",
          base: { p25: 85000, p50: 102000, p75: 122000, p90: 140000 },
          bonusPct: 10,
          equityAnnual: 18000,
          scope: "Assists in feature engineering, model training, baseline benchmarking, and data curation.",
          skills: ["Python (PyTorch / Scikit-Learn)", "SQL & Feature Stores", "Statistics & Probability", "Jupyter Notebooks", "Hugging Face"],
          upskillPath: [
            "Learn containerized model deployment (FastAPI, Docker, Triton/TorchServe).",
            "Transition from proof-of-concept notebooks to production-grade, testable Python packages.",
            "Grasp A/B testing statistical validity and offline-to-online metric correlation."
          ]
        },
        {
          code: "L4",
          name: "Data Scientist / ML Engineer II",
          yoe: "2 - 5 Years",
          base: { p25: 125000, p50: 148000, p75: 178000, p90: 205000 },
          bonusPct: 12,
          equityAnnual: 35000,
          scope: "Owns production ML pipelines, tunes models for inference latency & accuracy, conducts rigorous online A/B evaluations.",
          skills: ["MLOps (Kubeflow / MLflow)", "LLM Fine-Tuning & RAG", "Distributed Training", "Vector Databases (Pinecone/Milvus)", "Model Monitoring"],
          upskillPath: [
            "Deploy high-throughput, sub-50ms model serving infrastructure at cloud scale.",
            "Design novel loss functions or embeddings that demonstrably improve conversion or engagement.",
            "Implement automated model retraining, drift detection, and shadow deployment pipelines."
          ]
        },
        {
          code: "L5",
          name: "Senior Machine Learning Engineer",
          yoe: "5 - 8 Years",
          base: { p25: 175000, p50: 208000, p75: 250000, p90: 295000 },
          bonusPct: 18,
          equityAnnual: 75000,
          scope: "Architects core AI platform, directs algorithmic strategy, aligns AI initiatives with core business revenue drivers.",
          skills: ["Large-Scale Distributed Systems", "Agentic AI Architectures", "GPU Fleet Optimization", "Algorithmic Fairness & Guardrails", "Mentorship"],
          upskillPath: [
            "Optimize GPU utilization, slashing inference computing costs by 40%+.",
            "Architect multimodal AI solutions that open net-new commercial products.",
            "Author company patents and speak at AI research conferences (NeurIPS/ICML/CVPR)."
          ]
        },
        {
          code: "L6",
          name: "Staff / Principal AI Scientist",
          yoe: "8 - 12+ Years",
          base: { p25: 240000, p50: 285000, p75: 350000, p90: 420000 },
          bonusPct: 22,
          equityAnnual: 160000,
          scope: "Sets company-wide AI vision, evaluates foundational model partners, pioneers proprietary proprietary architecture.",
          skills: ["State-of-the-Art Model Research", "Platform AI Strategy", "AI Governance & IP", "Executive Tech Leadership"],
          upskillPath: ["Drive fundamental technological breakthroughs that secure multi-year competitive moats."]
        }
      ]
    },
    {
      id: "devops",
      title: "Cloud & DevOps / SRE Engineer",
      category: "Engineering",
      shortDesc: "Automates multi-cloud infrastructure, ensures 99.99% uptime, optimizes container orchestration and deployment safety.",
      marketGrowth: "+8.3% YoY",
      topSpecialties: ["Kubernetes & Platform Eng", "Terraform & IaC", "Observability (Datadog/Grafana)", "Zero Trust Cloud Security"],
      levels: [
        {
          code: "L3",
          name: "Junior Cloud / DevOps Engineer",
          yoe: "0 - 2 Years",
          base: { p25: 72000, p50: 84000, p75: 98000, p90: 115000 },
          bonusPct: 8,
          equityAnnual: 10000,
          scope: "Maintains CI/CD build scripts, monitors server alerts, updates DNS and SSL certificates, provisions basic VMs.",
          skills: ["Linux Systems & Shell", "Terraform fundamentals", "AWS / Azure Basics", "Docker", "GitOps (GitHub Actions)"],
          upskillPath: [
            "Gain deep hands-on expertise with Kubernetes pod scheduling, ingresses, and Helm charts.",
            "Automate infrastructure drift detection and immutable infrastructure patterns.",
            "Participate in on-call rotations and write clear incident post-mortems."
          ]
        },
        {
          code: "L4",
          name: "DevOps / SRE Engineer II",
          yoe: "2 - 5 Years",
          base: { p25: 112000, p50: 132000, p75: 156000, p90: 180000 },
          bonusPct: 12,
          equityAnnual: 26000,
          scope: "Builds self-service developer platforms, tunes SLOs/SLAs, manages Kubernetes clusters across staging and production.",
          skills: ["Kubernetes (EKS/GKE)", "Terraform & Terragrunt", "Prometheus / Grafana / Datadog", "ArgoCD", "Python / Go Automation"],
          upskillPath: [
            "Engineer multi-region failover and disaster recovery drills with near-zero RPO/RTO.",
            "Implement Cloud FinOps routines to trim idle cloud spend without compromising reliability.",
            "Standardize Internal Developer Platforms (IDP) to slash onboarding time."
          ]
        },
        {
          code: "L5",
          name: "Senior SRE / Cloud Architect",
          yoe: "5 - 8 Years",
          base: { p25: 158000, p50: 186000, p75: 222000, p90: 260000 },
          bonusPct: 15,
          equityAnnual: 58000,
          scope: "Guarantees high-availability for tier-0 services, leads Incident Command, architects resilient distributed topologies.",
          skills: ["Reliability Engineering (SLOs/Error Budgets)", "Chaos Engineering", "Zero-Trust Mesh (Istio)", "Multi-Cloud Governance", "Incident Leadership"],
          upskillPath: [
            "Spearhead cloud modernization that scales system traffic by 10x with zero downtime.",
            "Establish culture of blameless post-mortems and proactive automated remediation.",
            "Lead FinOps initiatives delivering $500k+ in annual infrastructure savings."
          ]
        },
        {
          code: "L6",
          name: "Principal SRE / Staff Platform Engineer",
          yoe: "8 - 12+ Years",
          base: { p25: 215000, p50: 252000, p75: 305000, p90: 355000 },
          bonusPct: 20,
          equityAnnual: 115000,
          scope: "Sets enterprise platform vision, negotiates multi-million dollar cloud vendor contracts, defines disaster recovery protocols.",
          skills: ["Enterprise Infrastructure Strategy", "Vendor Contract Negotiation", "Global Compliance & Resilience", "Executive Risk Advisory"],
          upskillPath: ["Drive global infrastructure consolidation and next-gen bare-metal/edge computing initiatives."]
        }
      ]
    },
    {
      id: "cyber",
      title: "Cyber Security Engineer",
      category: "Security & Ops",
      shortDesc: "Protects enterprise assets, hunts threats, audits code & infrastructure, and builds automated DevSecOps pipelines.",
      marketGrowth: "+9.5% YoY",
      topSpecialties: ["Application Security (AppSec)", "Cloud Security (CSPM)", "Threat Hunting & SOC", "Identity & Access Management (IAM)"],
      levels: [
        {
          code: "L3",
          name: "Security Analyst / Associate Security Eng",
          yoe: "0 - 2 Years",
          base: { p25: 74000, p50: 86000, p75: 102000, p90: 120000 },
          bonusPct: 8,
          equityAnnual: 10000,
          scope: "Triage vulnerability scans, monitor SIEM security alerts, review phishing reports, run standard audits.",
          skills: ["SIEM (Splunk/Elastic)", "Vulnerability Scanning (Nessus/Snyk)", "Network Security Basics", "Linux & Scripting", "OWASP Top 10"],
          upskillPath: [
            "Perform manual code audits to identify injection and authentication flaws.",
            "Automate SAST/DAST scanner integrations inside CI/CD pipelines.",
            "Earn industry certifications (CompTIA Security+, CISSP associate, AWS Security Specialist)."
          ]
        },
        {
          code: "L4",
          name: "Cyber Security Engineer II",
          yoe: "2 - 5 Years",
          base: { p25: 112000, p50: 134000, p75: 158000, p90: 182000 },
          bonusPct: 12,
          equityAnnual: 25000,
          scope: "Architects secure cloud baselines, conducts threat modeling for new product features, leads incident response.",
          skills: ["Cloud Security (AWS IAM/GuardDuty)", "DevSecOps Automation", "Threat Modeling (STRIDE)", "Penetration Testing", "Python/Go for SecOps"],
          upskillPath: [
            "Build automated guardrails that prevent misconfigurations before cloud deployment.",
            "Lead red-team/blue-team purple exercises across core infrastructure.",
            "Partner with software engineers to resolve complex cryptographic and auth challenges."
          ]
        },
        {
          code: "L5",
          name: "Senior Security Engineer / AppSec Lead",
          yoe: "5 - 8 Years",
          base: { p25: 162000, p50: 190000, p75: 225000, p90: 265000 },
          bonusPct: 15,
          equityAnnual: 60000,
          scope: "Defines enterprise security architecture, oversees penetration testing vendor audits, guides compliance (SOC2/ISO27001).",
          skills: ["Enterprise Cryptography", "Zero Trust Architecture", "SOC 2 Type II / FedRAMP Compliance", "Advanced Incident Command", "Executive Risk Advisory"],
          upskillPath: [
            "Architect zero-trust networking and passwordless enterprise identity.",
            "Establish automated Bug Bounty program and incident post-mortem governance.",
            "Present threat posture to Audit Committees and executive leadership."
          ]
        },
        {
          code: "L6",
          name: "Principal Security Architect / Deputy CISO",
          yoe: "8 - 12+ Years",
          base: { p25: 220000, p50: 260000, p75: 315000, p90: 375000 },
          bonusPct: 20,
          equityAnnual: 125000,
          scope: "Directs organizational security strategy, protects enterprise reputation, handles high-stakes regulatory relationships.",
          skills: ["Strategic Risk Governance", "C-Suite Advisory", "Regulatory Strategy", "Defense-in-Depth Enterprise Architecture"],
          upskillPath: ["Guide companies through public IPO security audits and international data sovereignty defense."]
        }
      ]
    },
    {
      id: "em",
      title: "Engineering Manager",
      category: "Management",
      shortDesc: "Leads engineering squads, conducts career coaching, balances technical debt with business velocity, and manages budgets.",
      marketGrowth: "+6.5% YoY",
      topSpecialties: ["High-Output People Management", "Agile Execution & Delivery", "Hiring & Talent Calibration", "Tech Strategy & Budgeting"],
      levels: [
        {
          code: "M4",
          name: "Tech Lead Manager / EM I",
          yoe: "5 - 7 Years",
          base: { p25: 150000, p50: 175000, p75: 205000, p90: 235000 },
          bonusPct: 15,
          equityAnnual: 50000,
          scope: "Directly manages 4-7 engineers while contributing ~20% technical leadership; runs 1-on-1s and sprint delivery.",
          skills: ["1-on-1 Coaching & Mentorship", "Agile Sprint Delivery", "Technical Architecture Oversight", "Performance Reviews", "Hiring & Interviewing"],
          upskillPath: [
            "Delegate code execution completely to empower team members and focus on operational leverage.",
            "Master performance calibrations and manage difficult under-performance scenarios with empathy and clarity.",
            "Align team deliverables with broader company OKRs."
          ]
        },
        {
          code: "M5",
          name: "Engineering Manager II",
          yoe: "7 - 10 Years",
          base: { p25: 185000, p50: 218000, p75: 255000, p90: 295000 },
          bonusPct: 18,
          equityAnnual: 80000,
          scope: "Manages 8-15 engineers or multiple small pods; partners with Product & Design directors, drives high retention.",
          skills: ["Cross-Pod Coordination", "Talent Succession Planning", "Conflict Resolution", "Quarterly Capacity Planning", "Culture Building"],
          upskillPath: [
            "Manage senior engineers and tech leads effectively without micromanagement.",
            "Drive organization-wide hiring initiatives and establish standardized leveling rubrics.",
            "Handle headcount budgets and vendor tooling allocations."
          ]
        },
        {
          code: "M6",
          name: "Senior EM / Director of Engineering",
          yoe: "10 - 14+ Years",
          base: { p25: 240000, p50: 280000, p75: 340000, p90: 410000 },
          bonusPct: 25,
          equityAnnual: 160000,
          scope: "Manages 3-5 managers and a total org of 25-50+ engineers; shapes department culture, organizational structure, and multi-year budget.",
          skills: ["Manager-of-Managers", "Organizational Design", "Multi-Million Dollar Budgeting", "Executive Alignment", "Crisis Management"],
          upskillPath: [
            "Structure engineering organizations for autonomous high velocity across geographical time zones.",
            "Partner with CEO / CTO on strategic roadmap, M&A due diligence, and enterprise vendor deals."
          ]
        }
      ]
    },
    {
      id: "mobile",
      title: "Mobile Software Engineer (iOS & Android)",
      category: "Engineering",
      shortDesc: "Builds high-performance native iOS (Swift/SwiftUI) and Android (Kotlin/Compose) consumer & enterprise applications.",
      marketGrowth: "+6.9% YoY",
      topSpecialties: ["Swift & SwiftUI", "Kotlin & Jetpack Compose", "React Native & Flutter", "Mobile Performance & Profiling"],
      levels: [
        {
          code: "L3",
          name: "Junior Mobile Engineer",
          yoe: "0 - 2 Years",
          base: { p25: 72000, p50: 84000, p75: 98000, p90: 118000 },
          bonusPct: 8,
          equityAnnual: 10000,
          scope: "Builds responsive views, implements API clients, fixes UI layout glitches, executes automated simulator tests.",
          skills: ["Swift / Kotlin", "UIKit / Android Views", "REST & JSON parsing", "Git", "XCTest / Espresso"],
          upskillPath: [
            "Transition to declarative UI paradigms (SwiftUI and Jetpack Compose).",
            "Master offline-first architecture with local SQLite/Room/CoreData persistence.",
            "Set up fastlane automated build signing and TestFlight deployment."
          ]
        },
        {
          code: "L4",
          name: "Mid-Level Mobile Engineer",
          yoe: "2 - 5 Years",
          base: { p25: 105000, p50: 124000, p75: 146000, p90: 168000 },
          bonusPct: 10,
          equityAnnual: 22000,
          scope: "Owns entire mobile feature modules; optimizes memory usage, battery consumption, and cold start latency.",
          skills: ["SwiftUI / Compose", "Combine / Kotlin Coroutines", "Modular App Architecture (MVVM/MVI)", "CI/CD (Fastlane)", "GraphQL / WebSockets"],
          upskillPath: [
            "Slash app cold start launch times by 40% through lazy initialization and binary optimization.",
            "Architect shared mobile design systems and reusable component packages.",
            "Drive telemetry and crash-free session metrics to 99.9%."
          ]
        },
        {
          code: "L5",
          name: "Senior Mobile Engineer",
          yoe: "5 - 8 Years",
          base: { p25: 150000, p50: 178000, p75: 210000, p90: 245000 },
          bonusPct: 15,
          equityAnnual: 52000,
          scope: "Defines overall client-side architecture, cross-platform technical roadmaps, and offline sync engines.",
          skills: ["Mobile Systems Architecture", "Performance Profiling (Instruments)", "Security & Biometric Auth", "Cross-Platform Strategy", "Mentorship"],
          upskillPath: [
            "Architect real-time collaborative mobile experiences with conflict resolution.",
            "Standardize cross-functional release trains across iOS and Android squads.",
            "Mentor mid-level engineers into technical leads."
          ]
        },
        {
          code: "L6",
          name: "Staff / Principal Mobile Architect",
          yoe: "8 - 12+ Years",
          base: { p25: 205000, p50: 240000, p75: 285000, p90: 335000 },
          bonusPct: 20,
          equityAnnual: 105000,
          scope: "Authority on company mobile footprint; directs mobile SDK frameworks and strategic app store partner relations.",
          skills: ["Enterprise Mobile Frameworks", "Edge AI & On-Device ML", "App Store Governance", "Executive Tech Roadmapping"],
          upskillPath: ["Pioneer next-gen on-device spatial computing, wearable integrations, and edge neural processing."]
        }
      ]
    },
    {
      id: "quant",
      title: "Quantitative Developer / FinTech Systems",
      category: "Engineering",
      shortDesc: "Engineers ultra-low-latency electronic trading systems, algorithmic pricing engines, and real-time market data pipelines.",
      marketGrowth: "+12.4% YoY",
      topSpecialties: ["Ultra-Low Latency C++", "Order Execution Engines", "FPGA & Hardware Acceleration", "Algorithmic Risk Management"],
      levels: [
        {
          code: "L3",
          name: "Associate Quantitative Developer",
          yoe: "0 - 2 Years",
          base: { p25: 110000, p50: 130000, p75: 155000, p90: 180000 },
          bonusPct: 20,
          equityAnnual: 25000,
          scope: "Builds backtesting data parsers, implements trading tool interfaces, and analyzes execution telemetry.",
          skills: ["Modern C++ (17/20)", "Python for Data/Finance", "Linux Systems Tuning", "Multithreading & Concurrency", "Financial Derivatives Basics"],
          upskillPath: [
            "Learn lock-free data structures and cache-line memory layout optimization.",
            "Build exchange protocol decoders (FIX, ITCH/OUCH).",
            "Profile sub-microsecond latency code paths using Linux perf and hardware counters."
          ]
        },
        {
          code: "L4",
          name: "Quantitative Developer II",
          yoe: "2 - 5 Years",
          base: { p25: 150000, p50: 180000, p75: 220000, p90: 260000 },
          bonusPct: 35,
          equityAnnual: 55000,
          scope: "Develops live trading strategies, low-latency market gateways, and risk guardrail engines handling millions of daily messages.",
          skills: ["Lock-Free Programming", "Kernel Bypass (Solarflare/DPDK)", "Market Data Feeds", "Options Pricing Algorithms", "Zero-Allocation C++"],
          upskillPath: [
            "Design sub-microsecond order routing gateways directly connecting to top Tier-1 exchanges.",
            "Implement high-throughput real-time portfolio risk checking before orders hit wire.",
            "Collaborate with quantitative researchers on converting alpha signals into deterministic code."
          ]
        },
        {
          code: "L5",
          name: "Senior Quant Developer / Trading Tech Lead",
          yoe: "5 - 8 Years",
          base: { p25: 210000, p50: 250000, p75: 310000, p90: 380000 },
          bonusPct: 50,
          equityAnnual: 120000,
          scope: "Architects firm-wide trading infrastructure; maximizes PnL efficiency and guarantees zero-downtime compliance across volatile markets.",
          skills: ["Nanosecond-Level Optimization", "Distributed Order Routing", "FPGA Systems Design", "C-Suite Risk Governance", "Trader Collaboration"],
          upskillPath: [
            "Pioneer hardware-accelerated FPGA order matching producing single-digit nanosecond execution.",
            "Direct quantitative tech budgets and co-location datacenter strategy (CME, Nasdaq, Eurex).",
            "Negotiate prime brokerage direct access pipes."
          ]
        },
        {
          code: "L6",
          name: "Principal Quantitative Architect / Partner",
          yoe: "8 - 12+ Years",
          base: { p25: 290000, p50: 360000, p75: 450000, p90: 550000 },
          bonusPct: 75,
          equityAnnual: 250000,
          scope: "Executive partner directing proprietary trading technology, alpha engine reliability, and institutional market dominance.",
          skills: ["Global Trading Architecture", "P&L Attribution Engineering", "Firm Partnership Advisory", "Extreme System Reliability"],
          upskillPath: ["Drive multi-billion dollar algorithmic trading throughput across global liquidity pools."]
        }
      ]
    },
    {
      id: "dentist",
      title: "General Dentist & Dental Specialist",
      category: "Healthcare",
      shortDesc: "Diagnoses, treats, and prevents oral health disorders; performs restorative dentistry, endodontics, prosthetics, and surgical implantology.",
      marketGrowth: "+7.8% YoY",
      topSpecialties: ["General & Restorative Dentistry", "Dental Implantology", "Rotary Endodontics", "Clear Aligner Orthodontics", "Practice Ownership & DSO Leadership"],
      levels: [
        {
          code: "D1",
          name: "Associate Dentist (Entry / GPR / AEGD Resident)",
          yoe: "0 - 2 Years",
          base: { p25: 135000, p50: 160000, p75: 185000, p90: 215000 },
          bonusPct: 15,
          equityAnnual: 0,
          scope: "Operates under senior clinical guidance; delivers comprehensive exams, posterior composites, single-unit crowns, and basic non-surgical extractions.",
          skills: ["DDS / DMD Degree & State Licensure", "Direct Composite Restorations", "Single-Unit Crown & Bridge", "Digital Intraoral Scanning (iTero/TRIOS)", "Simple Extractions", "Nitrous Oxide Sedation"],
          upskillPath: [
            "Increase daily chairside procedural speed while maintaining sub-millimeter marginal accuracy.",
            "Complete clinical CE continuums in rotary endodontics (WaveOne/ProTaper) to eliminate external root canal referrals.",
            "Attain certified Invisalign / ClearCorrect aligner accreditation to boost private collections."
          ]
        },
        {
          code: "D2",
          name: "Experienced Associate Dentist",
          yoe: "2 - 5 Years",
          base: { p25: 175000, p50: 205000, p75: 245000, p90: 285000 },
          bonusPct: 20,
          equityAnnual: 20000,
          scope: "Independently runs 2-3 operatory columns; executes multi-unit prosthetics, molar endodontics, surgical extractions with socket preservation, and aligner therapy.",
          skills: ["Molar Rotary Endodontics", "Surgical Extractions & Bone Grafting", "Clear Aligner Orthodontics", "Cone Beam CT (CBCT) 3D Diagnosis", "High-Acceptance Case Presentation", "Oral Conscious Sedation"],
          upskillPath: [
            "Complete surgical implant fellowship (AAID / ICOI) and place single and multi-unit implants.",
            "Master cosmetic veneers, digital smile design, and soft-tissue diode laser contouring.",
            "Negotiate 32-35% collection commission tiers or evaluate equity partnership buy-in options."
          ]
        },
        {
          code: "D3",
          name: "Senior Associate / Lead Clinical Dentist",
          yoe: "5 - 8 Years",
          base: { p25: 225000, p50: 265000, p75: 320000, p90: 380000 },
          bonusPct: 25,
          equityAnnual: 50000,
          scope: "Directs clinical standards across a multi-operatory dental clinic; mentors junior associates; performs full-mouth rehabilitations and implant-supported overdentures.",
          skills: ["Guided Implant Surgery (All-on-4)", "Full-Mouth Reconstruction", "Sedation Dentistry (IV Moderate)", "Clinical Staff Leadership", "PPO vs Fee-for-Service Optimization", "Laboratory Quality Control"],
          upskillPath: [
            "Acquire 25% to 50% equity stake in practice or establish private dental LLC.",
            "Integrate in-office 3D printing and CAD/CAM milling (CEREC) to slash lab overhead by 60%.",
            "Coach associate dentists to increase office productive chair-hours without increasing overhead."
          ]
        },
        {
          code: "D4",
          name: "Dental Practice Owner / Managing Partner",
          yoe: "8 - 14+ Years",
          base: { p25: 310000, p50: 385000, p75: 490000, p90: 650000 },
          bonusPct: 35,
          equityAnnual: 180000,
          scope: "Owns and operates a private practice or multi-location dental group; oversees hygiene schedules, associate compensation, P&L, and patient acquisition.",
          skills: ["Dental Practice EBITDA Optimization", "Practice Overhead & P&L Control", "Associate Recruiting & Production Tracking", "Comprehensive Implantology", "Dental Practice Valuation & M&A"],
          upskillPath: [
            "Scale practice EBITDA beyond $600k to position for high-multiple recapitalization or DSO equity roll-up.",
            "Establish multi-specialty group model with visiting oral surgeons and periodontists.",
            "Implement tax-advantaged cash-balance retirement plans and Section 179 equipment deductions."
          ]
        },
        {
          code: "D5",
          name: "Dental Specialist (Oral Surgery / Ortho / Endo / Perio)",
          yoe: "Post-Residency (3-6+ Years)",
          base: { p25: 340000, p50: 440000, p75: 580000, p90: 780000 },
          bonusPct: 40,
          equityAnnual: 220000,
          scope: "Board-certified dental specialist executing advanced surgical procedures (impacted wisdom teeth, orthognathic surgery, sinus lifts, complex microsurgical apicoectomies).",
          skills: ["Specialty Board Certification", "General Anesthesia & Deep Sedation", "Complex Bone Augmentation & Sinus Lifts", "Orthognathic Craniofacial Surgery", "Microsurgical Endodontics"],
          upskillPath: [
            "Build robust referral networks with 30+ regional general dentist practices.",
            "Accredit in-office surgical suite for hospital-grade outpatient procedures."
          ]
        }
      ]
    },
    {
      id: "physician",
      title: "Physician / Medical Doctor",
      category: "Healthcare",
      shortDesc: "Examines patients, diagnoses acute and chronic illnesses, prescribes medical treatments, and oversees multi-disciplinary clinical teams.",
      marketGrowth: "+6.4% YoY",
      topSpecialties: ["Internal Medicine & Hospitalist", "Family Medicine & Urgent Care", "Cardiology & Subspecialties", "Anesthesiology & Critical Care"],
      levels: [
        {
          code: "M1",
          name: "Resident Physician / Medical Fellow",
          yoe: "0 - 4 Years (Post-MD/DO)",
          base: { p25: 64000, p50: 72000, p75: 80000, p90: 88000 },
          bonusPct: 5,
          equityAnnual: 0,
          scope: "Completes ACGME residency training, manages hospital inpatients, performs supervised procedures, conducts clinical rounds.",
          skills: ["MD / DO Degree", "USMLE / COMLEX Board Exams", "Electronic Health Records (Epic)", "Acute Inpatient Care", "Diagnostic Reasoning"],
          upskillPath: [
            "Pass medical specialty licensing boards (ABIM / ABFM / specialty).",
            "Publish clinical research papers and present at medical society symposiums.",
            "Evaluate hospitalist employment vs outpatient clinical group partnerships."
          ]
        },
        {
          code: "M2",
          name: "Staff Attending Physician",
          yoe: "1 - 4 Years Post-Residency",
          base: { p25: 220000, p50: 255000, p75: 300000, p90: 350000 },
          bonusPct: 15,
          equityAnnual: 20000,
          scope: "Practices autonomously; manages clinical patient panels, diagnostic treatment plans, and emergency admissions; supervises residents and APPs.",
          skills: ["Board Certification", "Clinical Decision Making", "Complex Chronic Disease Management", "wRVU Productivity Metrics", "Interdisciplinary Coordination"],
          upskillPath: [
            "Exceed annual wRVU productivity benchmarks by 20% to capture maximum quarterly incentive bonuses.",
            "Obtain hospital committee leadership roles (Pharmacy & Therapeutics, Patient Safety).",
            "Transition into subspecialty or medical directorship."
          ]
        },
        {
          code: "M3",
          name: "Senior Attending / Department Subspecialist",
          yoe: "5 - 10 Years",
          base: { p25: 285000, p50: 340000, p75: 410000, p90: 490000 },
          bonusPct: 20,
          equityAnnual: 45000,
          scope: "Serves as senior clinical authority; leads specialized clinical service lines; mentors attendings and clinical fellows.",
          skills: ["Advanced Subspecialty Care", "High-Acuity Interventions", "Clinical Research Governance", "Quality Assurance Metrics", "Medical Staff Leadership"],
          upskillPath: [
            "Step into Department Chair or Clinical Service Line Medical Directorship.",
            "Establish private practice medical group or ambulatory surgery partnership.",
            "Secure national clinical grant funding or strategic medical advisory roles."
          ]
        },
        {
          code: "M4",
          name: "Medical Director / Chief Medical Officer (CMO)",
          yoe: "10 - 15+ Years",
          base: { p25: 380000, p50: 460000, p75: 560000, p90: 680000 },
          bonusPct: 30,
          equityAnnual: 120000,
          scope: "Directs health system medical policy, regulatory accreditation, clinical quality, physician credentialing, and multi-million dollar health system budgets.",
          skills: ["Healthcare System Governance", "Clinical Quality & Patient Safety (Joint Commission)", "Physician Retention & Contracting", "Executive Healthcare Leadership", "Value-Based Care Strategy"],
          upskillPath: ["Guide regional health systems through hospital network mergers and strategic healthcare transformations."]
        }
      ]
    },
    {
      id: "attorney",
      title: "Corporate Attorney / Legal Counsel",
      category: "Legal & Finance",
      shortDesc: "Structures commercial transactions, manages corporate governance, advises on IP and regulatory compliance, and mitigates legal exposure.",
      marketGrowth: "+6.1% YoY",
      topSpecialties: ["M&A & Corporate Transactions", "Commercial Contracts & Tech Licensing", "Securities & Capital Markets", "Intellectual Property & Litigation"],
      levels: [
        {
          code: "J1",
          name: "Junior Associate Attorney",
          yoe: "0 - 2 Years",
          base: { p25: 140000, p50: 175000, p75: 215000, p90: 245000 },
          bonusPct: 15,
          equityAnnual: 0,
          scope: "Drafts basic commercial agreements, conducts legal research, assists in corporate due diligence, reviews NDAs and discovery.",
          skills: ["JD Degree & State Bar Admission", "Legal Research (Westlaw/LexisNexis)", "Contract Drafting", "Due Diligence Review", "Bluebooking & Legal Citations"],
          upskillPath: [
            "Meet and exceed annual billable hours target (1,900 - 2,100 hours).",
            "Lead deal closings and transaction disclosure schedules independently.",
            "Develop niche specialization in tech privacy (GDPR/CCPA) or venture financing."
          ]
        },
        {
          code: "J2",
          name: "Mid-Level Associate / In-House Legal Counsel",
          yoe: "2 - 5 Years",
          base: { p25: 180000, p50: 220000, p75: 265000, p90: 310000 },
          bonusPct: 20,
          equityAnnual: 25000,
          scope: "Negotiates complex commercial master services agreements (MSAs), advises product teams on risk, manages outside counsel for disputes.",
          skills: ["Commercial Deal Negotiation", "M&A Purchase Agreements", "Corporate Governance & Board Resolutions", "Risk Mitigation", "Regulatory Compliance"],
          upskillPath: [
            "Lead multi-million dollar client negotiations directly with opposing general counsels.",
            "Establish strong internal client relationships with Product, Sales, and Finance VPs.",
            "Build originations or partner track dossier at law firm."
          ]
        },
        {
          code: "J3",
          name: "Senior Legal Counsel / Senior Associate",
          yoe: "5 - 8 Years",
          base: { p25: 240000, p50: 290000, p75: 350000, p90: 420000 },
          bonusPct: 25,
          equityAnnual: 70000,
          scope: "Oversees company-wide legal verticals; directs intellectual property portfolio; steers complex cross-border regulatory compliance.",
          skills: ["Strategic Dispute Resolution", "Cross-Border Regulatory Strategy", "Executive Risk Advisory", "Team Mentorship", "Outside Counsel Budget Management"],
          upskillPath: [
            "Step into Deputy General Counsel role managing a squad of attorneys and paralegals.",
            "Pioneer standardized self-serve contracting models that accelerate sales velocity by 50%."
          ]
        },
        {
          code: "J4",
          name: "General Counsel (GC) / Equity Partner",
          yoe: "8 - 14+ Years",
          base: { p25: 340000, p50: 430000, p75: 550000, p90: 750000 },
          bonusPct: 40,
          equityAnnual: 220000,
          scope: "Chief Legal Officer advising Board of Directors and CEO on IPO readiness, M&A acquisitions, SEC filings, and corporate defense.",
          skills: ["Board Advisory & Corporate Secretary", "IPO & Public Company Compliance", "Crisis Management & PR", "Executive Compensation Strategy", "Firm Partnership Management"],
          upskillPath: ["Guide companies through public market listings, defense against activist hedge funds, and transformational M&A deals."]
        }
      ]
    },
    {
      id: "ib",
      title: "Investment Banking & Private Equity",
      category: "Legal & Finance",
      shortDesc: "Builds complex discounted cash flow (DCF) financial models, executes M&A transactions, debt financings, and private equity buyout deals.",
      marketGrowth: "+8.5% YoY",
      topSpecialties: ["Mergers & Acquisitions (M&A)", "Leveraged Buyouts (LBO)", "Equity Capital Markets (IPO)", "Debt & Restructuring"],
      levels: [
        {
          code: "F1",
          name: "Financial Analyst (IB / PE)",
          yoe: "0 - 2 Years",
          base: { p25: 110000, p50: 125000, p75: 145000, p90: 165000 },
          bonusPct: 50,
          equityAnnual: 10000,
          scope: "Constructs 3-statement financial models, builds pitch books, performs valuation analyses (DCF, comparable companies, precedent transactions).",
          skills: ["Advanced Excel & LBO Modeling", "Three-Statement Financial Modeling", "PowerPoint Pitchbooks", "Capital IQ / Bloomberg Terminal", "Valuation Methodologies"],
          upskillPath: [
            "Master complex multi-scenario transaction models under tight 80-hour deal deadlines.",
            "Demonstrate impeccable attention to financial footnote details and investor decks.",
            "Prepare for Private Equity on-cycle megafund recruiting."
          ]
        },
        {
          code: "F2",
          name: "Investment Banking / PE Associate",
          yoe: "2 - 5 Years",
          base: { p25: 165000, p50: 195000, p75: 235000, p90: 265000 },
          bonusPct: 70,
          equityAnnual: 40000,
          scope: "Manages deal execution process; drives financial modeling workstreams; coordinates accounting, legal, and debt syndicate teams.",
          skills: ["Complex LBO Modeling", "Due Diligence Workstreams", "Deal Team Management", "Client Pitch Presentations", "Debt Financing Syndication"],
          upskillPath: [
            "Lead deal execution autonomously with minimal Vice President intervention.",
            "Build direct relationships with corporate CFOs and PE portfolio sponsors.",
            "Transition from technical executor to commercial deal champion."
          ]
        },
        {
          code: "F3",
          name: "Vice President (VP) - M&A / Private Equity",
          yoe: "5 - 8 Years",
          base: { p25: 240000, p50: 290000, p75: 350000, p90: 420000 },
          bonusPct: 100,
          equityAnnual: 120000,
          scope: "Directs entire transaction workflow; leads client relationship day-to-day; structures creative deal terms to bridge valuation gaps.",
          skills: ["Deal Structuring & Term Sheets", "Senior Client Management", "Fee Negotiation", "Junior Team Development", "Sector Deep-Dive Expertise"],
          upskillPath: [
            "Originate independent advisory mandates and private capital raises.",
            "Demonstrate high client trust resulting in repeat transaction retainers."
          ]
        },
        {
          code: "F4",
          name: "Managing Director (MD) / General Partner",
          yoe: "8 - 14+ Years",
          base: { p25: 350000, p50: 450000, p75: 600000, p90: 800000 },
          bonusPct: 150,
          equityAnnual: 350000,
          scope: "Senior institutional rainmaker driving multi-million dollar annual fee revenues; maintains board relationships with Fortune 500 CEOs and institutional PE sponsors.",
          skills: ["Origination & Rainmaking", "Boardroom C-Suite Advisory", "Institutional Relationship Capital", "Firm Strategic Direction"],
          upskillPath: ["Drive billion-dollar cross-border mega-mergers and lead private equity buyout fund closes."]
        }
      ]
    }
  ],

  // Supported Currencies & Live Exchange Calibration
  currencies: {
    USD: { code: "USD", symbol: "$", rate: 1.00, label: "USD ($) United States" },
    EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€) Eurozone" },
    GBP: { code: "GBP", symbol: "£", rate: 0.78, label: "GBP (£) United Kingdom" },
    CAD: { code: "CAD", symbol: "CA$", rate: 1.36, label: "CAD ($) Canada" },
    AUD: { code: "AUD", symbol: "A$", rate: 1.52, label: "AUD ($) Australia" }
  },

  // Cost of living and location multipliers
  locationTiers: [
    { id: "tier1", name: "Tier 1: SF Bay Area / New York / Seattle", multiplier: 1.00, tag: "Top Tier (100%)" },
    { id: "tier2", name: "Tier 2: Austin / Boston / LA / Chicago", multiplier: 0.90, tag: "High Cost (90%)" },
    { id: "tier3", name: "Tier 3: Denver / Atlanta / Dallas / Remote US", multiplier: 0.82, tag: "Standard US (82%)" },
    { id: "tier4", name: "Tier 4: London / Toronto / Berlin / Sydney", multiplier: 0.74, tag: "International Hub (74%)" }
  ],

  // Negotiation Playbook scripts and tips
  negotiationPlaybook: [
    {
      id: "initial-offer",
      title: "Counter-Offering an Initial Tech Job Offer",
      badge: "High Impact (+8% to +20%)",
      summary: "How to respond when the first written offer arrives, establishing high enthusiasm while tactfully expanding the total compensation envelope.",
      dos: [
        "Express genuine excitement about the team and mission before negotiating numbers.",
        "Anchor your request to objective market data (e.g. SalaryPathGuide / Radford percentiles).",
        "Negotiate the entire package (Base, Sign-on, Equity, Review cadence) rather than base alone."
      ],
      donts: [
        "Never accept on the phone in real-time. Always say: 'Thank you so much! May I have 48 hours to review the full written offer with my family?'",
        "Don't give an ultimatum or aggressive tone; treat it as collaborative problem-solving.",
        "Don't disclose your current or previous salary (many US states make this illegal to ask anyway)."
      ],
      scriptPhone: "Thank you so much for the offer, [Recruiter Name]! I'm genuinely thrilled about the opportunity to join [Company] and build [Project / Mission]. Based on my current skill set in [Key Skill], my track record of [Key Achievement], and current market benchmarks for this level, I was targeting a base salary closer to $[Target Base] or an expanded initial equity grant of $[Target Equity]. Is there flexibility in the compensation band to close that gap?",
      scriptEmail: "Hi [Recruiter Name],\n\nThank you again for extending the offer for the [Job Title] role. I remain deeply enthusiastic about the opportunity to partner with [Hiring Manager / Team] and accelerate [Key Project Objective].\n\nAfter reviewing the full package against current industry compensation benchmarks for [Job Title] at the [Target Level] tier—as well as the immediate impact I will deliver in [Key Competency Area]—I would love to explore closing the gap on base compensation to $[Target Base]. Alternatively, if base salary is strictly constrained by band guidelines, I would be very open to bridging this via an adjusted initial equity grant ($[Target Equity]) or a one-time sign-on bonus of $[Target Signon].\n\nIf we can align on these figures, I am ready to sign and look forward to hitting the ground running.\n\nWarm regards,\n[Your Name]"
    },
    {
      id: "competing-offer",
      title: "Leveraging Competing Offers without Burning Bridges",
      badge: "Maximum Leverage (+15% to +35%)",
      summary: "How to use a second active offer to safely accelerate decision-making and compel your preferred company to match or exceed top-of-market compensation.",
      dos: [
        "Reiterate that Company A is your clear #1 choice IF compensation parity can be met.",
        "Be completely honest about timelines and deadline pressures.",
        "Highlight that you want to sign immediately once the terms are aligned."
      ],
      donts: [
        "Never fabricate a fake competing offer—recruiters often know compensation leads at other tech firms.",
        "Don't sound arrogant or transactional; keep the conversation centered on genuine mutual fit."
      ],
      scriptPhone: "[Recruiter Name], I want to be fully transparent with you. I just received a formal offer from another firm at $[Competing Total Comp]. However, [Company] remains my absolute first choice because of the engineering culture and team mission. If [Company] can match this total compensation package at $[Target Total Comp], I am prepared to decline the other opportunity today and sign immediately.",
      scriptEmail: "Hi [Recruiter Name],\n\nI hope you are having a productive week. As promised, I wanted to maintain full transparency regarding my interview processes.\n\nI have received a formal offer for a [Role Title] position with total compensation valued at $[Competing Total Comp] ($[Competing Base] base + $[Competing Equity] annual equity).\n\nThat said, [Company] remains my top preference by a wide margin due to [Specific Technical Challenge or Cultural Aspect]. Would your team be able to adjust our current offer to $[Target Total Comp] so I can enthusiastically decline the other opportunity and sign with [Company] today?\n\nThank you so much for your advocacy throughout this process!\n\nBest,\n[Your Name]"
    },
    {
      id: "merit-increase",
      title: "Annual Merit Review & Out-of-Cycle Raise Ask",
      badge: "Internal Retention (+10% to +18%)",
      summary: "How to present a factual 'Brag Sheet' and business impact dossier to secure a top-tier raise during internal performance evaluations.",
      dos: [
        "Prepare 3 months prior to review cycle before departmental budgets are locked.",
        "Tie your contributions directly to company metrics (revenue generated, latency reduced, customers retained).",
        "Bring market compensation benchmarks from SalaryPathGuide showing your current market value."
      ],
      donts: [
        "Don't base your ask on personal expenses (rent increase, medical bills). Base it strictly on business value created.",
        "Don't spring it on your manager without warning—schedule a dedicated 1-on-1 focused purely on compensation and growth."
      ],
      scriptPhone: "[Manager Name], over the past 12 months, I've driven [Major Project 1] which increased [Metric] by [X]%, and led [Major Project 2] saving our team [Y] hours weekly. Given that my responsibilities have grown into the [Target Level] scope and current market median for our role is $[Target Base], I’d love to discuss calibrating my base salary to reflect this impact.",
      scriptEmail: "Hi [Manager Name],\n\nAhead of our upcoming quarterly compensation and growth review, I've summarized key business impact highlights from the past year:\n\n• Shipped [Project 1], driving [Metric improvement or revenue ROI]\n• Mentored [X] engineers and overhauled test infrastructure, cutting CI runtime by [Y]%\n• Took on primary on-call and architectural ownership of [Critical System]\n\nBased on these expanded responsibilities aligning with the [Target Level] expectations, as well as current industry salary benchmarks, I'd like to request a base salary adjustment to $[Target Base] during this cycle. I look forward to walking through the details in our 1-on-1 on [Date]!\n\nThanks,\n[Your Name]"
    },
    {
      id: "promotion-jump",
      title: "Level Promotion (e.g. L4 to L5) Pay Band Realignment",
      badge: "Level Up (+15% to +30%)",
      summary: "How to ensure a promotion comes with a true market-rate compensation bump rather than a minimal corporate standard 5% increase.",
      dos: [
        "Demonstrate that you have already been operating at the next level's expectations for 6+ months.",
        "Ask explicitly what percentile of the new band your promotion salary lands on.",
        "Ask for an equity refresh grant to match the new leveling tier."
      ],
      donts: [
        "Don't settle for 'Congratulations on the title change, compensation will be adjusted next year.'",
        "Don't assume promotion bands are automatic—always ask for the range."
      ],
      scriptPhone: "Thank you for recognizing my work with this promotion to [New Level Title]! I'm thrilled to step into this scope. What is the full salary band for this new level, and where does my new compensation sit within the range? I want to ensure my compensation is positioned at or above the midpoint to reflect the independent scope I've been delivering.",
      scriptEmail: "Hi [Manager Name] & [People Ops Partner],\n\nThank you so much for the promotion announcement to [New Level Title]! I am energized by the opportunity to continue driving high impact across our engineering organization.\n\nRegarding the compensation adjustment details: could you share the salary range (p25 to p75) for the [New Level Title] band? As I have been consistently operating at this level for the past two quarters, I want to ensure my base salary is aligned at $[Target Base] (at least the 50th percentile) alongside an updated equity refresh corresponding to this tier.\n\nThank you again for your leadership and sponsorship!\n\nBest,\n[Your Name]"
    },
    {
      id: "healthcare-contract",
      title: "Dental & Clinical Associate Contract Negotiation",
      badge: "Clinical Contract (+12% to +25%)",
      summary: "How to negotiate dental and clinical associate contracts, balancing daily minimum guarantees, % of collections/production, lab bill allocations, and future partnership buy-in rights.",
      dos: [
        "Request compensation based on adjusted net production rather than gross collections whenever possible, or ensure high collection rate accountability.",
        "Negotiate a firm 6-month daily minimum guarantee ($750 - $950/day) while building your chairside patient schedule.",
        "Ensure lab fee splits are capped (ideally 100% employer paid or no more than 50/50 on high-end lab prosthetics).",
        "Clarify who pays malpractice liability insurance and Continuing Education (CE) stipends ($3,000–$5,000/yr)."
      ],
      donts: [
        "Don't sign non-compete agreements with unreasonably wide geographic radii (keep it under 5-10 miles max).",
        "Don't accept restrictive covenants that penalize you for taking staff if you leave.",
        "Don't assume oral promises of 'future partnership buy-in' are binding—always demand clear EBITDA milestone terms in the agreement."
      ],
      scriptPhone: "Thank you for the associate offer, Dr. [Recruiter Name]! I love the clinical philosophy at [Company] and the team atmosphere. In reviewing the compensation schedule, I want to confirm our production tiers. Based on my advanced training in [Key Skill], I am targeting an initial 6-month minimum guarantee of $[Target Base] or 33% of adjusted collections, alongside a 50/50 lab split on crown/bridge. If we can solidify these terms, I am ready to finalize credentialing and join the practice.",
      scriptEmail: "Dear Dr. [Recruiter Name],\n\nThank you for extending the formal associateship agreement with [Company]. I am very excited about the clinical environment and the patient population we will be treating.\n\nAfter reviewing the contract terms, I would like to propose a few standard calibrations:\n\n1. Compensation Structure: A daily guarantee of $[Target Base] for the first 6 months, transitioning smoothly to 33% of adjusted collections (or production).\n2. Lab Fees: Standardize lab fee expenses at a 50/50 split (or 100% covered for standard diagnostic models and basic acrylics).\n3. Professional Growth: Inclusion of a $3,500 annual CE allowance and employer-covered malpractice coverage (occurrence policy).\n4. Future Equity: A defined clause establishing a 2-year pathway for practice equity partnership buy-in evaluation.\n\nWith these adjustments in place, I am eager to sign the agreement and begin the state board credentialing process immediately.\n\nWarm regards,\nDr. [Your Name]"
    }
  ],

  // Affiliate & Career Acceleration Resources
  resources: [
    {
      id: "res-1",
      badge: "Top Rated Tool",
      tag: "Resume & Portfolio",
      title: "Senior & Staff Tech CV Optimization Suite",
      description: "ATS-optimized resume templates engineered specifically for Senior (L5) and Staff (L6) engineering & product candidates. Includes 100+ vetted high-impact bullet formulas.",
      stats: "94% Interview Callback Rate",
      partner: "TechCareerPrep Pro",
      cta: "Explore Resume Templates",
      highlight: "Includes GitHub & Portfolio Rubrics",
      icon: "file-text"
    },
    {
      id: "res-2",
      badge: "Best Seller",
      tag: "System Design",
      title: "Distributed Systems & System Design Blueprint",
      description: "Comprehensive step-by-step masterclass covering scalable microservices, CAP theorem, distributed caching, database sharding, and real FAANG whiteboard case studies.",
      stats: "Over 45,000 Engineers Trained",
      partner: "SystemDesignMasters",
      cta: "Access System Design Prep",
      highlight: "Live Whiteboard Mock Simulations",
      icon: "cpu"
    },
    {
      id: "res-3",
      badge: "Trending in 2026",
      tag: "Coding & Algorithms",
      title: "Algorithmic Pattern Mastery & LeetCode Fast-Track",
      description: "Stop grinding 500 random problems. Learn the 14 essential algorithmic patterns (Sliding Window, Two Pointers, Monotonic Stack, Dynamic Programming) to ace any technical screen.",
      stats: "Average 3.5x Faster Prep Time",
      partner: "AlgoSprint Academy",
      cta: "View Pattern Masterclass",
      highlight: "Python, Go, Java & C++ Walkthroughs",
      icon: "code"
    },
    {
      id: "res-4",
      badge: "High ROI",
      tag: "1-on-1 Coaching",
      title: "Tech Offer Negotiation 1-on-1 Intensive",
      description: "Partner with an ex-Google and ex-Meta compensation partner to evaluate your offer letters, draft custom counter-proposals, and maximize your equity & sign-on bonus.",
      stats: "Avg. +$28,500 Increase Per Offer",
      partner: "NegotiateTech",
      cta: "Book Negotiation Strategist",
      highlight: "Guaranteed Higher Counter-Offer or Refund",
      icon: "trending-up"
    }
  ]
};

// Export to window for browser usage
if (typeof window !== "undefined") {
  window.CAREER_DATA = CAREER_DATA;
}
