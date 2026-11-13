/**
 * SalaryPathGuide.com - Application Controller
 * Handles 5-Year Salary Trajectory Calculations, Interactive Charts,
 * Multi-Currency Conversions, CSV Exports, Autocomplete Search,
 * Career Directory Rendering, and Negotiation Scripts.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure CAREER_DATA is available
  if (typeof window.CAREER_DATA === "undefined") {
    console.error("CAREER_DATA not found. Please check data/careerData.js.");
    return;
  }

  const { roles, locationTiers, negotiationPlaybook, resources, currencies } = window.CAREER_DATA;

  // Google Sheets Webhook URL for crowd-sourced submissions
  const GOOGLE_SHEET_WEBHOOK_URL = window.SALARYPATH_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycby7Gc0q95IjeXdccE5r5EP1HNfC_VBlHKBN_l3f5NGrG5g1jpRrABN2-Brd0MsfBjQV/exec";

  /* ==========================================================================
     Global State
     ========================================================================== */
  const state = {
    selectedRoleId: "swe",
    currentBaseSalary: 112000,
    annualRaisePct: 4.0,
    promoInterval: 2, // every 2 years
    promoBumpPct: 15,
    bonusPct: 10,
    calcLocationMultiplier: 1.00,
    directoryLocationMultiplier: 1.00,
    activeCategory: "all",
    activePlaybookId: "initial-offer",
    currency: "USD",
    adjustForInflation: false,
    inflationRate: 0.028, // 2.8% annual inflation
    taxMode: "gross", // "gross" or "net"
    enableHousehold: false,
    partnerRoleId: "dentist",
    partnerBaseSalary: 120000,
    partnerRaisePct: 4.0,
    enableEquity: false,
    equityVehicleType: "rsu",
    equityInitialGrant: 160000,
    equityVestingSchedule: "standard",
    equityRefresherGrant: 35000,
    equityStockGrowth: 0,
    equityExitMultiple: 3,
    equity83b: true,
    currentTrajectoryData: [],
    // Compounding Wealth & FIRE Projector
    wealthSavingsRate: 35,
    wealthReturnRate: 0.075,
    wealthStartingNetWorth: 50000,
    // Script customizer defaults
    scriptCompany: "Acme Cloud",
    scriptTargetBase: 165000,
    scriptCompetingOffer: 175000,
    scriptTargetEquity: 55000,
    scriptTargetSignon: 25000,
    scriptKeySkill: "Distributed Systems & Cloud Architecture"
  };

  let trajectoryChartInstance = null;

  /* ==========================================================================
     DOM Elements Cache
     ========================================================================== */
  const elements = {
    // Navigation & Currency
    navbar: document.getElementById("navbar"),
    currencySelector: document.getElementById("currencySelector"),
    mobileCurrencySelector: document.getElementById("mobileCurrencySelector"),
    currencySymbol: document.querySelector(".currency-symbol"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    mobileDrawer: document.getElementById("mobileDrawer"),
    navCompareBtn: document.getElementById("navCompareBtn"),
    mobileCompareBtn: document.getElementById("mobileCompareBtn"),
    navSubmitOfferBtn: document.getElementById("navSubmitOfferBtn"),
    mobileSubmitOfferBtn: document.getElementById("mobileSubmitOfferBtn"),
    footerCompareTrigger: document.getElementById("footerCompareTrigger"),
    footerSubmitOfferTrigger: document.getElementById("footerSubmitOfferTrigger"),
    communityTicker: document.getElementById("communityTicker"),
    tickerContentText: document.getElementById("tickerContentText"),
    printDateDossier: document.getElementById("printDateDossier"),

    // Search
    roleSearchInput: document.getElementById("roleSearchInput"),
    searchResultsDropdown: document.getElementById("searchResultsDropdown"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    searchSubmitBtn: document.getElementById("searchSubmitBtn"),
    trendingChips: document.querySelectorAll(".chip-btn"),

    // Calculator Inputs
    taxModeSwitch: document.getElementById("taxModeSwitch"),
    calcJobTitle: document.getElementById("calcJobTitle"),
    calcTrackBadge: document.getElementById("calcTrackBadge"),
    calcBaseSalary: document.getElementById("calcBaseSalary"),
    calcBaseSalarySlider: document.getElementById("calcBaseSalarySlider"),
    calcBaseBadge: document.getElementById("calcBaseBadge"),
    calcAnnualRaise: document.getElementById("calcAnnualRaise"),
    calcRaiseBadge: document.getElementById("calcRaiseBadge"),
    calcPromoInterval: document.getElementById("calcPromoInterval"),
    calcPromoBadge: document.getElementById("calcPromoBadge"),
    calcPromoBump: document.getElementById("calcPromoBump"),
    calcBumpBadge: document.getElementById("calcBumpBadge"),
    calcBonusPct: document.getElementById("calcBonusPct"),
    calcBonusBadge: document.getElementById("calcBonusBadge"),
    calcLocationTier: document.getElementById("calcLocationTier"),
    calcInflationToggle: document.getElementById("calcInflationToggle"),
    advancedToggleBtn: document.getElementById("advancedToggleBtn"),
    advancedOptionsPanel: document.getElementById("advancedOptionsPanel"),
    advArrow: document.getElementById("advArrow"),
    resetCalcBtn: document.getElementById("resetCalcBtn"),
    copySummaryBtn: document.getElementById("copySummaryBtn"),
    downloadCsvBtn: document.getElementById("downloadCsvBtn"),
    printReportBtn: document.getElementById("printReportBtn"),
    geoArbitrageTriggerBtn: document.getElementById("geoArbitrageTriggerBtn"),

    // Calculator Outputs
    kpiTotalEarnings: document.getElementById("kpiTotalEarnings"),
    kpiCompoundedGrowth: document.getElementById("kpiCompoundedGrowth"),
    kpiEndingBase: document.getElementById("kpiEndingBase"),
    kpiPromoAdvantage: document.getElementById("kpiPromoAdvantage"),
    progressionTableBody: document.getElementById("progressionTableBody"),
    chartCanvas: document.getElementById("trajectoryChart"),

    // Compounding Wealth & FIRE Projector
    wealthY5Invested: document.getElementById("wealthY5Invested"),
    wealthTimeToOneMil: document.getElementById("wealthTimeToOneMil"),
    wealthTimeToFire: document.getElementById("wealthTimeToFire"),
    wealthSavingsRate: document.getElementById("wealthSavingsRate"),
    wealthSavingsBadge: document.getElementById("wealthSavingsBadge"),
    wealthReturnRate: document.getElementById("wealthReturnRate"),
    wealthStartingNetWorth: document.getElementById("wealthStartingNetWorth"),
    wealthFireBar: document.getElementById("wealthFireBar"),
    wealthFireProgressPct: document.getElementById("wealthFireProgressPct"),
    wealthInsightCallout: document.getElementById("wealthInsightCallout"),

    // Offer Evaluator
    evalRoleSelect: document.getElementById("evalRoleSelect"),
    evalCompany: document.getElementById("evalCompany"),
    evalBaseSalary: document.getElementById("evalBaseSalary"),
    evalBonusPct: document.getElementById("evalBonusPct"),
    evalEquityTotal: document.getElementById("evalEquityTotal"),
    evalSignonBonus: document.getElementById("evalSignonBonus"),
    evalCompetingOffer: document.getElementById("evalCompetingOffer"),
    evalRecalculateBtn: document.getElementById("evalRecalculateBtn"),
    evalYear1TC: document.getElementById("evalYear1TC"),
    evalYear2TC: document.getElementById("evalYear2TC"),
    evalCliffDiff: document.getElementById("evalCliffDiff"),
    evalPercentileRank: document.getElementById("evalPercentileRank"),
    evalBenchmarkLabel: document.getElementById("evalBenchmarkLabel"),
    evalCliffAlert: document.getElementById("evalCliffAlert"),
    evalCliffText: document.getElementById("evalCliffText"),
    evalPercentileBadge: document.getElementById("evalPercentileBadge"),
    evalPercentileBar: document.getElementById("evalPercentileBar"),
    evalTickP25: document.getElementById("evalTickP25"),
    evalTickP50: document.getElementById("evalTickP50"),
    evalTickP75: document.getElementById("evalTickP75"),
    evalTickP90: document.getElementById("evalTickP90"),
    evalVestingGrid: document.getElementById("evalVestingGrid"),
    counterEmailPre: document.getElementById("counterEmailPre"),
    copyCounterEmailBtn: document.getElementById("copyCounterEmailBtn"),
    evalPrintBtn: document.getElementById("evalPrintBtn"),

    // Offer Leverage Diagnostic Elements
    evalSourceSelect: document.getElementById("evalSourceSelect"),
    evalPipelineSelect: document.getElementById("evalPipelineSelect"),
    evalTimelineSelect: document.getElementById("evalTimelineSelect"),
    evalLeverageScoreBadge: document.getElementById("evalLeverageScoreBadge"),
    evalRiskScoreBadge: document.getElementById("evalRiskScoreBadge"),
    evalLeverageBar: document.getElementById("evalLeverageBar"),
    evalLeverageAdvice: document.getElementById("evalLeverageAdvice"),

    // Directory & Cross-Company Matrix
    categoryFilterGroup: document.getElementById("categoryFilterGroup"),
    directoryLocationTier: document.getElementById("directoryLocationTier"),
    careerRolesContainer: document.getElementById("careerRolesContainer"),
    viewModeLaddersBtn: document.getElementById("viewModeLaddersBtn"),
    viewModeMatrixBtn: document.getElementById("viewModeMatrixBtn"),
    crossCompanyMatrixContainer: document.getElementById("crossCompanyMatrixContainer"),
    matrixTableBody: document.getElementById("matrixTableBody"),
    directoryToolbar: document.getElementById("directoryToolbar"),

    // Playbook
    playbookTabs: document.getElementById("playbookTabs"),
    playbookContent: document.getElementById("playbookContent"),

    // Resources
    resourcesGrid: document.getElementById("resourcesGrid"),

    // Modals & Toast
    compareModal: document.getElementById("compareModal"),
    compareModalClose: document.getElementById("compareModalClose"),
    compareRoleA: document.getElementById("compareRoleA"),
    compareLevelA: document.getElementById("compareLevelA"),
    compareRoleB: document.getElementById("compareRoleB"),
    compareLevelB: document.getElementById("compareLevelB"),
    compareResultView: document.getElementById("compareResultView"),
    tabCompareBandsBtn: document.getElementById("tabCompareBandsBtn"),
    tabCompareOffersBtn: document.getElementById("tabCompareOffersBtn"),
    compareBandsView: document.getElementById("compareBandsView"),
    compareOffersView: document.getElementById("compareOffersView"),
    showdownCompanyA: document.getElementById("showdownCompanyA"),
    showdownLocationA: document.getElementById("showdownLocationA"),
    showdownBaseA: document.getElementById("showdownBaseA"),
    showdownBonusA: document.getElementById("showdownBonusA"),
    showdownEquityA: document.getElementById("showdownEquityA"),
    showdownSignonA: document.getElementById("showdownSignonA"),
    showdownCompanyB: document.getElementById("showdownCompanyB"),
    showdownLocationB: document.getElementById("showdownLocationB"),
    showdownBaseB: document.getElementById("showdownBaseB"),
    showdownBonusB: document.getElementById("showdownBonusB"),
    showdownEquityB: document.getElementById("showdownEquityB"),
    showdownSignonB: document.getElementById("showdownSignonB"),
    showdownResultsContainer: document.getElementById("showdownResultsContainer"),
    arbitrageModal: document.getElementById("arbitrageModal"),
    arbitrageModalClose: document.getElementById("arbitrageModalClose"),
    arbOriginCity: document.getElementById("arbOriginCity"),
    arbDestCity: document.getElementById("arbDestCity"),
    arbSalary: document.getElementById("arbSalary"),
    arbitrageResultsContainer: document.getElementById("arbitrageResultsContainer"),

    // Household Modeler Elements
    householdToggleBtn: document.getElementById("householdToggleBtn"),
    householdOptionsPanel: document.getElementById("householdOptionsPanel"),
    householdArrow: document.getElementById("householdArrow"),
    enableHouseholdToggle: document.getElementById("enableHouseholdToggle"),
    householdInputsWrap: document.getElementById("householdInputsWrap"),
    partnerJobTitle: document.getElementById("partnerJobTitle"),
    partnerBaseSalary: document.getElementById("partnerBaseSalary"),
    partnerBaseBadge: document.getElementById("partnerBaseBadge"),
    partnerRaise: document.getElementById("partnerRaise"),
    partnerRaiseBadge: document.getElementById("partnerRaiseBadge"),
    fireMilestoneText: document.getElementById("fireMilestoneText"),

    // Submit Offer Modal Elements
    submitOfferModal: document.getElementById("submitOfferModal"),
    submitOfferModalClose: document.getElementById("submitOfferModalClose"),
    submitOfferCancelBtn: document.getElementById("submitOfferCancelBtn"),
    submitOfferForm: document.getElementById("submitOfferForm"),
    subCompany: document.getElementById("subCompany"),
    subRole: document.getElementById("subRole"),
    subLevel: document.getElementById("subLevel"),
    subLocation: document.getElementById("subLocation"),
    subBase: document.getElementById("subBase"),
    subBonus: document.getElementById("subBonus"),
    subEquity: document.getElementById("subEquity"),
    subSignon: document.getElementById("subSignon"),
    subNotes: document.getElementById("subNotes"),

    // Share Trajectory & Scenario Elements
    shareTrajectoryBtn: document.getElementById("shareTrajectoryBtn"),
    evalShareBtn: document.getElementById("evalShareBtn"),
    shareModal: document.getElementById("shareModal"),
    shareModalTitle: document.getElementById("shareModalTitle"),
    shareModalClose: document.getElementById("shareModalClose"),
    shareUrlInput: document.getElementById("shareUrlInput"),
    copyShareUrlBtn: document.getElementById("copyShareUrlBtn"),
    copyShareBtnText: document.getElementById("copyShareBtnText"),
    shareSnapshotRole: document.getElementById("shareSnapshotRole"),
    shareSnapshotBadge: document.getElementById("shareSnapshotBadge"),
    shareSnapshotStartBase: document.getElementById("shareSnapshotStartBase"),
    shareSnapshotTotal: document.getElementById("shareSnapshotTotal"),
    shareSnapshotWealth: document.getElementById("shareSnapshotWealth"),
    shareTwitterBtn: document.getElementById("shareTwitterBtn"),
    shareLinkedInBtn: document.getElementById("shareLinkedInBtn"),
    shareEmailBtn: document.getElementById("shareEmailBtn"),
    shareTextSummaryBtn: document.getElementById("shareTextSummaryBtn"),

    // Shared Scenario Banner Elements
    sharedScenarioBanner: document.getElementById("sharedScenarioBanner"),
    sharedBannerTitle: document.getElementById("sharedBannerTitle"),
    sharedBannerSubtitle: document.getElementById("sharedBannerSubtitle"),
    sharedBannerResetBtn: document.getElementById("sharedBannerResetBtn"),
    sharedBannerCloseBtn: document.getElementById("sharedBannerCloseBtn"),

    // Equity Vesting & Exit Simulator Elements
    equityToggleBtn: document.getElementById("equityToggleBtn"),
    equityOptionsPanel: document.getElementById("equityOptionsPanel"),
    equityArrow: document.getElementById("equityArrow"),
    enableEquityToggle: document.getElementById("enableEquityToggle"),
    equityInputsWrap: document.getElementById("equityInputsWrap"),
    equityVehicleType: document.getElementById("equityVehicleType"),
    equityInitialGrant: document.getElementById("equityInitialGrant"),
    equityInitialBadge: document.getElementById("equityInitialBadge"),
    equityVestingSchedule: document.getElementById("equityVestingSchedule"),
    equityRefresherGrant: document.getElementById("equityRefresherGrant"),
    equityRefresherBadge: document.getElementById("equityRefresherBadge"),
    equityStockGrowthGroup: document.getElementById("equityStockGrowthGroup"),
    equityStockGrowth: document.getElementById("equityStockGrowth"),
    equityStartupControlsGroup: document.getElementById("equityStartupControlsGroup"),
    equityExitMultiple: document.getElementById("equityExitMultiple"),
    equity83bToggle: document.getElementById("equity83bToggle"),
    equityExitMatrixCard: document.getElementById("equityExitMatrixCard"),
    equityMatrixTitle: document.getElementById("equityMatrixTitle"),
    equityMatrixBadge: document.getElementById("equityMatrixBadge"),
    equityScenariosGrid: document.getElementById("equityScenariosGrid"),
    equityTaxCallout: document.getElementById("equityTaxCallout"),

    // Glossary & Lead Magnet Elements
    glossaryModal: document.getElementById("glossaryModal"),
    glossaryModalClose: document.getElementById("glossaryModalClose"),
    glossaryGrid: document.getElementById("glossaryGrid"),
    leadMagnetForm: document.getElementById("leadMagnetForm"),
    leadEmail: document.getElementById("leadEmail"),

    // Report Whitepaper Modal Elements
    reportModal: document.getElementById("reportModal"),
    reportModalClose: document.getElementById("reportModalClose"),
    previewReportBtn: document.getElementById("previewReportBtn"),
    modalPrintReportBtn: document.getElementById("modalPrintReportBtn"),
    footerPrintReportBtn: document.getElementById("footerPrintReportBtn"),

    toastNotice: document.getElementById("toastNotice"),
    toastMessage: document.getElementById("toastMessage")
  };

  /* ==========================================================================
     Helper Utilities & Multi-Currency Engine
     ========================================================================== */
  const getCurrencyInfo = () => {
    if (currencies && currencies[state.currency]) {
      return currencies[state.currency];
    }
    return { code: "USD", symbol: "$", rate: 1.00, label: "USD ($)" };
  };

  const formatCurrency = (valUsd) => {
    const info = getCurrencyInfo();
    const converted = valUsd * info.rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: info.code,
      maximumFractionDigits: 0
    }).format(converted);
  };

  const showToast = (message, duration = 3000) => {
    if (!elements.toastNotice || !elements.toastMessage) return;
    elements.toastMessage.textContent = message;
    elements.toastNotice.classList.add("show");
    setTimeout(() => {
      elements.toastNotice.classList.remove("show");
    }, duration);
  };

  /* ==========================================================================
     1. Search & Autocomplete Initialization
     ========================================================================== */
  const initSearch = () => {
    const input = elements.roleSearchInput;
    const dropdown = elements.searchResultsDropdown;
    const clearBtn = elements.searchClearBtn;

    const renderResults = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        dropdown.innerHTML = "";
        dropdown.classList.remove("active");
        clearBtn.style.display = "none";
        return;
      }

      clearBtn.style.display = "block";

      const matchedRoles = roles.filter(role => {
        return (
          role.title.toLowerCase().includes(q) ||
          role.category.toLowerCase().includes(q) ||
          role.topSpecialties.some(s => s.toLowerCase().includes(q)) ||
          role.levels.some(l => l.skills.some(sk => sk.toLowerCase().includes(q)))
        );
      });

      if (matchedRoles.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 1rem 1.25rem; color: #94A3B8; font-size: 0.875rem;">
            No roles matching "<strong>${escapeHtml(query)}</strong>". Try searching "QA", "Software", "Quant", or "Product".
          </div>
        `;
        dropdown.classList.add("active");
        return;
      }

      dropdown.innerHTML = matchedRoles.map(role => {
        const midLevel = role.levels.find(l => l.code === "L4" || l.code === "M4") || role.levels[1] || role.levels[0];
        const salaryText = midLevel ? `Mid (L4): ${formatCurrency(midLevel.base.p50)}` : "";
        return `
          <div class="search-result-item" data-role-id="${role.id}">
            <div class="search-result-info">
              <span class="search-result-title">${escapeHtml(role.title)}</span>
              <span class="search-result-category">${role.category} • ${role.marketGrowth}</span>
            </div>
            <div class="search-result-salary">${salaryText}</div>
          </div>
        `;
      }).join("");

      dropdown.classList.add("active");

      // Bind click events on result items
      dropdown.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", () => {
          const roleId = item.getAttribute("data-role-id");
          selectRoleAndNavigate(roleId);
          dropdown.classList.remove("active");
          input.value = "";
          clearBtn.style.display = "none";
        });
      });
    };

    input.addEventListener("input", (e) => {
      renderResults(e.target.value);
    });

    // Handle Enter key on search input
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstItem = dropdown.querySelector(".search-result-item");
        if (firstItem) {
          const roleId = firstItem.getAttribute("data-role-id");
          selectRoleAndNavigate(roleId);
          dropdown.classList.remove("active");
          input.value = "";
          clearBtn.style.display = "none";
        } else {
          elements.searchSubmitBtn.click();
        }
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      renderResults("");
      input.focus();
    });

    elements.searchSubmitBtn.addEventListener("click", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      const matched = roles.find(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
      if (matched) {
        selectRoleAndNavigate(matched.id);
        dropdown.classList.remove("active");
      }
    });

    // Close search dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        dropdown.classList.remove("active");
      }
    });

    // Trending chips
    elements.trendingChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const roleId = chip.getAttribute("data-role");
        selectRoleAndNavigate(roleId);
      });
    });
  };

  const selectRoleAndNavigate = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    // Update state & calculator
    state.selectedRoleId = role.id;
    if (elements.calcJobTitle) {
      elements.calcJobTitle.value = role.id;
    }

    // Pre-fill mid level salary
    const mid = role.levels.find(l => l.code === "L4" || l.code === "M4" || l.code === "D2" || l.code === "M2" || l.code === "J2" || l.code === "F2") || role.levels[1] || role.levels[0];
    if (mid) {
      updateBaseSalary(mid.base.p50);
    }

    runTrajectoryCalculations();

    // Ensure the role card is visible in the active category filter
    if (state.activeCategory !== "all" && role.category !== state.activeCategory) {
      setCategoryFilter("all");
    }

    // Scroll to career path card in directory
    const cardEl = document.getElementById(`role-card-${role.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
      cardEl.style.transition = "box-shadow 0.4s ease, border-color 0.4s ease";
      cardEl.style.borderColor = "var(--emerald-primary)";
      cardEl.style.boxShadow = "0 0 0 3px var(--emerald-glow), var(--shadow-xl)";
      setTimeout(() => {
        cardEl.style.borderColor = "";
        cardEl.style.boxShadow = "";
      }, 2500);
    }

    showToast(`Loaded ${role.title} compensation ladder!`);
  };

  /* ==========================================================================
     2. 5-Year Trajectory Calculator Engine
     ========================================================================== */
  const initCalculator = () => {
    // Populate Role Dropdown in Calculator
    elements.calcJobTitle.innerHTML = roles.map(role => {
      return `<option value="${role.id}" ${role.id === state.selectedRoleId ? "selected" : ""}>${role.title} (${role.category})</option>`;
    }).join("");

    // Sync input handlers
    elements.calcJobTitle.addEventListener("change", (e) => {
      state.selectedRoleId = e.target.value;
      const role = roles.find(r => r.id === state.selectedRoleId);
      if (role) {
        elements.calcTrackBadge.textContent = role.category;
        const mid = role.levels.find(l => l.code === "L4" || l.code === "M4" || l.code === "D2" || l.code === "M2" || l.code === "J2" || l.code === "F2") || role.levels[1] || role.levels[0];
        if (mid) {
          updateBaseSalary(mid.base.p50);
        }
      }
      runTrajectoryCalculations();
    });

    // Base salary number input & slider sync
    elements.calcBaseSalary.addEventListener("input", (e) => {
      const val = Math.max(30000, Math.min(800000, Number(e.target.value) || 0));
      state.currentBaseSalary = val;
      elements.calcBaseSalarySlider.value = Math.min(350000, val);
      elements.calcBaseBadge.textContent = formatCurrency(val);
      runTrajectoryCalculations();
    });

    elements.calcBaseSalarySlider.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      state.currentBaseSalary = val;
      elements.calcBaseSalary.value = val;
      elements.calcBaseBadge.textContent = formatCurrency(val);
      runTrajectoryCalculations();
    });

    // Annual Raise %
    elements.calcAnnualRaise.addEventListener("input", (e) => {
      state.annualRaisePct = Number(e.target.value);
      elements.calcRaiseBadge.textContent = `${state.annualRaisePct.toFixed(1)}%`;
      runTrajectoryCalculations();
    });

    // Promotion Interval
    elements.calcPromoInterval.addEventListener("change", (e) => {
      state.promoInterval = Number(e.target.value);
      const textMap = {
        1: "Every 1 Year",
        2: "Every 2 Years",
        3: "Every 3 Years",
        0: "None"
      };
      elements.calcPromoBadge.textContent = textMap[state.promoInterval] || "Custom";
      runTrajectoryCalculations();
    });

    // Promotion Bump %
    elements.calcPromoBump.addEventListener("input", (e) => {
      state.promoBumpPct = Number(e.target.value);
      elements.calcBumpBadge.textContent = `${state.promoBumpPct}%`;
      runTrajectoryCalculations();
    });

    // Bonus %
    elements.calcBonusPct.addEventListener("input", (e) => {
      state.bonusPct = Number(e.target.value);
      elements.calcBonusBadge.textContent = `${state.bonusPct}%`;
      runTrajectoryCalculations();
    });

    // Location Tier
    elements.calcLocationTier.addEventListener("change", (e) => {
      state.calcLocationMultiplier = Number(e.target.value);
      runTrajectoryCalculations();
    });

    // Inflation toggle
    if (elements.calcInflationToggle) {
      elements.calcInflationToggle.addEventListener("change", (e) => {
        state.adjustForInflation = e.target.checked;
        runTrajectoryCalculations();
        showToast(state.adjustForInflation ? "Displaying Real (Inflation-Adjusted @ 2.8%/yr) figures" : "Displaying Nominal figures");
      });
    }

    // Tax Mode Switch (Gross vs Net Take-Home)
    if (elements.taxModeSwitch) {
      elements.taxModeSwitch.querySelectorAll(".mode-switch-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          elements.taxModeSwitch.querySelectorAll(".mode-switch-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          state.taxMode = btn.getAttribute("data-mode");
          runTrajectoryCalculations();
          showToast(state.taxMode === "net" ? "Displaying Estimated Net Take-Home (Post-Tax & 401k)" : "Displaying Gross Pre-Tax Total Comp");
        });
      });
    }

    // Advanced toggle accordion
    elements.advancedToggleBtn.addEventListener("click", () => {
      const isOpen = elements.advancedOptionsPanel.classList.toggle("open");
      elements.advArrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
    });

    // Reset button
    elements.resetCalcBtn.addEventListener("click", () => {
      state.selectedRoleId = "swe";
      state.annualRaisePct = 4.0;
      state.promoInterval = 2;
      state.promoBumpPct = 15;
      state.bonusPct = 10;
      state.calcLocationMultiplier = 1.00;
      state.adjustForInflation = false;
      state.wealthSavingsRate = 35;
      state.wealthReturnRate = 0.075;
      state.wealthStartingNetWorth = 50000;

      if (elements.calcInflationToggle) elements.calcInflationToggle.checked = false;
      if (elements.wealthSavingsRate) elements.wealthSavingsRate.value = 35;
      if (elements.wealthSavingsBadge) elements.wealthSavingsBadge.textContent = "35%";
      if (elements.wealthReturnRate) elements.wealthReturnRate.value = "0.075";
      if (elements.wealthStartingNetWorth) elements.wealthStartingNetWorth.value = 50000;
      elements.calcJobTitle.value = "swe";
      elements.calcTrackBadge.textContent = "Engineering";
      elements.calcAnnualRaise.value = 4;
      elements.calcRaiseBadge.textContent = "4.0%";
      elements.calcPromoInterval.value = 2;
      elements.calcPromoBadge.textContent = "Every 2 Years";
      elements.calcPromoBump.value = 15;
      elements.calcBumpBadge.textContent = "15%";
      elements.calcBonusPct.value = 10;
      elements.calcBonusBadge.textContent = "10%";
      elements.calcLocationTier.value = "1.00";

      updateBaseSalary(112000);
      runTrajectoryCalculations();
      showToast("Calculator reset to tech benchmark defaults.");
    });

    // Copy Summary button
    elements.copySummaryBtn.addEventListener("click", () => {
      copyTrajectorySummaryToClipboard();
    });

    // Download CSV button
    if (elements.downloadCsvBtn) {
      elements.downloadCsvBtn.addEventListener("click", () => {
        exportTrajectoryToCsv();
      });
    }

    // Household Modeler Setup
    if (elements.partnerJobTitle) {
      elements.partnerJobTitle.innerHTML = roles.map(role => {
        return `<option value="${role.id}" ${role.id === state.partnerRoleId ? "selected" : ""}>${role.title} (${role.category})</option>`;
      }).join("");

      elements.partnerJobTitle.addEventListener("change", (e) => {
        state.partnerRoleId = e.target.value;
        const partnerRole = roles.find(r => r.id === state.partnerRoleId);
        if (partnerRole) {
          const mid = partnerRole.levels.find(l => l.code === "L4" || l.code === "M4" || l.code === "D2" || l.code === "M2" || l.code === "J2" || l.code === "F2") || partnerRole.levels[1] || partnerRole.levels[0];
          if (mid && elements.partnerBaseSalary) {
            state.partnerBaseSalary = mid.base.p50;
            elements.partnerBaseSalary.value = mid.base.p50;
            if (elements.partnerBaseBadge) elements.partnerBaseBadge.textContent = formatCurrency(mid.base.p50);
          }
        }
        runTrajectoryCalculations();
      });
    }

    if (elements.householdToggleBtn) {
      elements.householdToggleBtn.addEventListener("click", () => {
        const isHidden = elements.householdOptionsPanel.style.display === "none";
        elements.householdOptionsPanel.style.display = isHidden ? "block" : "none";
        if (elements.householdArrow) {
          elements.householdArrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        }
      });
    }

    if (elements.enableHouseholdToggle) {
      elements.enableHouseholdToggle.addEventListener("change", (e) => {
        state.enableHousehold = e.target.checked;
        if (elements.householdInputsWrap) {
          elements.householdInputsWrap.style.display = state.enableHousehold ? "flex" : "none";
        }
        runTrajectoryCalculations();
        showToast(state.enableHousehold ? "Dual-Income Household Modeler activated!" : "Reverted to single earner trajectory.");
      });
    }

    if (elements.partnerBaseSalary) {
      elements.partnerBaseSalary.addEventListener("input", (e) => {
        state.partnerBaseSalary = Math.max(0, Number(e.target.value) || 0);
        if (elements.partnerBaseBadge) elements.partnerBaseBadge.textContent = formatCurrency(state.partnerBaseSalary);
        runTrajectoryCalculations();
      });
    }

    if (elements.partnerRaise) {
      elements.partnerRaise.addEventListener("input", (e) => {
        state.partnerRaisePct = Number(e.target.value);
        if (elements.partnerRaiseBadge) elements.partnerRaiseBadge.textContent = `${state.partnerRaisePct.toFixed(1)}%`;
        runTrajectoryCalculations();
      });
    }

    if (elements.printDateDossier) {
      elements.printDateDossier.textContent = "Generated: " + new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }

    // Share Trajectory Button
    if (elements.shareTrajectoryBtn) {
      elements.shareTrajectoryBtn.addEventListener("click", () => {
        shareTrajectoryLink();
      });
    }

    // Share Evaluated Offer Button
    if (elements.evalShareBtn) {
      elements.evalShareBtn.addEventListener("click", () => {
        shareOfferEvaluationLink();
      });
    }

    // Equity Vesting & Refresher Simulator Setup
    if (elements.equityToggleBtn) {
      elements.equityToggleBtn.addEventListener("click", () => {
        const isHidden = elements.equityOptionsPanel.style.display === "none";
        elements.equityOptionsPanel.style.display = isHidden ? "block" : "none";
        if (elements.equityArrow) {
          elements.equityArrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        }
      });
    }

    if (elements.enableEquityToggle) {
      elements.enableEquityToggle.addEventListener("change", (e) => {
        state.enableEquity = e.target.checked;
        if (elements.equityInputsWrap) {
          elements.equityInputsWrap.style.display = state.enableEquity ? "flex" : "none";
        }
        runTrajectoryCalculations();
        showToast(state.enableEquity ? "Equity Vesting & Refresher Simulator enabled!" : "Reverted to cash-only trajectory.");
      });
    }

    if (elements.equityInitialGrant) {
      elements.equityInitialGrant.addEventListener("input", (e) => {
        state.equityInitialGrant = Math.max(0, Number(e.target.value) || 0);
        if (elements.equityInitialBadge) elements.equityInitialBadge.textContent = formatCurrency(state.equityInitialGrant);
        runTrajectoryCalculations();
      });
    }

    if (elements.equityVestingSchedule) {
      elements.equityVestingSchedule.addEventListener("change", (e) => {
        state.equityVestingSchedule = e.target.value;
        runTrajectoryCalculations();
      });
    }

    if (elements.equityRefresherGrant) {
      elements.equityRefresherGrant.addEventListener("input", (e) => {
        state.equityRefresherGrant = Math.max(0, Number(e.target.value) || 0);
        if (elements.equityRefresherBadge) elements.equityRefresherBadge.textContent = `${formatCurrency(state.equityRefresherGrant)} / yr`;
        runTrajectoryCalculations();
      });
    }

    if (elements.equityVehicleType) {
      elements.equityVehicleType.addEventListener("change", (e) => {
        state.equityVehicleType = e.target.value;
        const isStartup = state.equityVehicleType === "startup";
        if (elements.equityStockGrowthGroup) elements.equityStockGrowthGroup.style.display = isStartup ? "none" : "block";
        if (elements.equityStartupControlsGroup) elements.equityStartupControlsGroup.style.display = isStartup ? "flex" : "none";
        runTrajectoryCalculations();
        showToast(isStartup ? "🚀 Switched to Startup Stock Options & Exit Multiple Simulator" : "📈 Switched to Public RSU Volatility Simulator");
      });
    }

    if (elements.equityStockGrowth) {
      elements.equityStockGrowth.addEventListener("change", (e) => {
        state.equityStockGrowth = Number(e.target.value) || 0;
        runTrajectoryCalculations();
      });
    }

    if (elements.equityExitMultiple) {
      elements.equityExitMultiple.addEventListener("change", (e) => {
        state.equityExitMultiple = Number(e.target.value);
        runTrajectoryCalculations();
      });
    }

    if (elements.equity83bToggle) {
      elements.equity83bToggle.addEventListener("change", (e) => {
        state.equity83b = e.target.checked;
        runTrajectoryCalculations();
      });
    }

    // Compounding Wealth & FIRE Projector inputs
    if (elements.wealthSavingsRate) {
      elements.wealthSavingsRate.addEventListener("input", (e) => {
        state.wealthSavingsRate = Number(e.target.value);
        if (elements.wealthSavingsBadge) {
          elements.wealthSavingsBadge.textContent = `${state.wealthSavingsRate}%`;
        }
        runTrajectoryCalculations();
      });
    }

    if (elements.wealthReturnRate) {
      elements.wealthReturnRate.addEventListener("change", (e) => {
        state.wealthReturnRate = Number(e.target.value);
        runTrajectoryCalculations();
      });
    }

    if (elements.wealthStartingNetWorth) {
      elements.wealthStartingNetWorth.addEventListener("input", (e) => {
        state.wealthStartingNetWorth = Math.max(0, Number(e.target.value) || 0);
        runTrajectoryCalculations();
      });
    }

    // Print Report button
    elements.printReportBtn.addEventListener("click", () => {
      window.print();
    });

    // Initial calculation run
    runTrajectoryCalculations();
  };

  const updateBaseSalary = (val) => {
    state.currentBaseSalary = val;
    elements.calcBaseSalary.value = val;
    elements.calcBaseSalarySlider.value = Math.min(350000, val);
    elements.calcBaseBadge.textContent = formatCurrency(val);
  };

  // Trajectory Math & Visualization Core
  const runTrajectoryCalculations = () => {
    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    const initialBase = state.currentBaseSalary * state.calcLocationMultiplier;
    const raiseRate = state.annualRaisePct / 100;
    const promoRate = state.promoBumpPct / 100;
    const bonusRate = state.bonusPct / 100;
    const promoInterval = state.promoInterval;

    // Determine starting leveling tier
    let currentLevelIndex = 1; // default mid-level L4
    for (let i = 0; i < role.levels.length; i++) {
      if (initialBase >= role.levels[i].base.p25 && initialBase <= role.levels[i].base.p90) {
        currentLevelIndex = i;
        break;
      }
    }

    const yearData = [];
    let runningBase = initialBase;
    let cumulativeComp = 0;

    // Baseline calculation without promotions (for comparison metric)
    let baselineRunningBase = initialBase;
    let baselineCumulativeComp = 0;

    for (let y = 1; y <= 5; y++) {
      // Baseline calculation (merit raises only)
      const baselineMeritInc = baselineRunningBase * raiseRate;
      baselineRunningBase += baselineMeritInc;
      const baselineBonus = baselineRunningBase * bonusRate;
      baselineCumulativeComp += (baselineRunningBase + baselineBonus);

      // Trajectory calculation
      const meritIncrease = runningBase * raiseRate;
      runningBase += meritIncrease;

      let promoIncrease = 0;
      let isPromoted = false;
      let promoLevelCode = "";

      if (promoInterval > 0 && y % promoInterval === 0) {
        isPromoted = true;
        promoIncrease = runningBase * promoRate;
        runningBase += promoIncrease;
        currentLevelIndex = Math.min(currentLevelIndex + 1, role.levels.length - 1);
        promoLevelCode = role.levels[currentLevelIndex].code;
      }

      const annualBonus = runningBase * bonusRate;
      let totalAnnualComp = runningBase + annualBonus;

      // Real vs Nominal adjustment
      let adjustedBaseSalary = runningBase;
      let adjustedTotalComp = totalAnnualComp;
      if (state.adjustForInflation) {
        const discountFactor = Math.pow(1 + state.inflationRate, y);
        adjustedBaseSalary = runningBase / discountFactor;
        adjustedTotalComp = totalAnnualComp / discountFactor;
      }

      // Net Take-Home Mode adjustment (Est. 28% blended deductions)
      const netMultiplier = state.taxMode === "net" ? 0.72 : 1.0;
      adjustedBaseSalary *= netMultiplier;
      adjustedTotalComp *= netMultiplier;

      // Dual-Income Household Modeler Addition
      if (state.enableHousehold) {
        const partnerRaiseRate = (state.partnerRaisePct || 4.0) / 100;
        let pNominal = state.partnerBaseSalary * Math.pow(1 + partnerRaiseRate, y - 1);
        if (state.adjustForInflation) {
          pNominal = pNominal / Math.pow(1 + state.inflationRate, y);
        }
        const partnerAnnualComp = pNominal * netMultiplier;
        adjustedTotalComp += partnerAnnualComp;
      }

      // Equity & Stock Refresher Simulation
      let annualEquityVested = 0;
      if (state.enableEquity) {
        const scheduleMap = {
          standard: [0.25, 0.25, 0.25, 0.25, 0.0],
          amazon: [0.05, 0.15, 0.40, 0.40, 0.0],
          frontloaded: [0.33, 0.33, 0.22, 0.12, 0.0],
          ai_lab: [0.15, 0.25, 0.30, 0.30, 0.0],
          uniform: [0.20, 0.20, 0.20, 0.20, 0.20]
        };
        const rates = scheduleMap[state.equityVestingSchedule] || scheduleMap.standard;
        const initialVested = (state.equityInitialGrant || 0) * (rates[y - 1] || 0);

        // Stacking performance refreshers granted annually starting Year 2 (4-yr vest)
        let refresherVested = 0;
        const refGrant = state.equityRefresherGrant || 0;
        if (y >= 2) {
          const activeRefresherCount = (y - 1);
          refresherVested = activeRefresherCount * (refGrant * 0.25);
        }

        let totalEquityNominal = initialVested + refresherVested;

        if (state.equityVehicleType === "startup") {
          const mult = state.equityExitMultiple !== undefined ? Number(state.equityExitMultiple) : 3;
          totalEquityNominal *= mult;
        } else {
          const growth = Number(state.equityStockGrowth) || 0;
          totalEquityNominal *= Math.pow(1 + growth, y - 0.5);
        }

        if (state.adjustForInflation) {
          totalEquityNominal = totalEquityNominal / Math.pow(1 + state.inflationRate, y);
        }

        if (state.taxMode === "net" && state.equityVehicleType === "startup") {
          const startupNetFactor = state.equity83b ? 0.80 : 0.63; // 20% LTCG vs 37% Ordinary/AMT
          annualEquityVested = totalEquityNominal * startupNetFactor;
        } else {
          annualEquityVested = totalEquityNominal * netMultiplier;
        }
        adjustedTotalComp += annualEquityVested;
      }

      cumulativeComp += adjustedTotalComp;

      const levelObj = role.levels[currentLevelIndex];

      yearData.push({
        year: y,
        levelCode: levelObj.code,
        levelName: levelObj.name,
        isPromoted,
        promoBumpPct: state.promoBumpPct,
        baseSalary: adjustedBaseSalary,
        nominalBaseSalary: runningBase,
        meritIncrease: meritIncrease * netMultiplier,
        promoIncrease: promoIncrease * netMultiplier,
        annualBonus: (state.adjustForInflation ? (annualBonus / Math.pow(1 + state.inflationRate, y)) : annualBonus) * netMultiplier,
        annualEquityVested,
        totalAnnualComp: adjustedTotalComp,
        cumulativeComp
      });
    }

    state.currentTrajectoryData = yearData;

    // KPI Outputs
    const total5YrEarnings = cumulativeComp;
    const startingBase = initialBase * (state.taxMode === "net" ? 0.72 : 1.0);
    const endingBase = yearData[4].baseSalary;
    const compoundedGrowth = ((endingBase - startingBase) / startingBase) * 100;
    const promoAdvantage = Math.max(0, cumulativeComp - (state.adjustForInflation ? (baselineCumulativeComp / Math.pow(1 + state.inflationRate, 3)) : baselineCumulativeComp) * (state.taxMode === "net" ? 0.72 : 1.0));

    elements.kpiTotalEarnings.textContent = formatCurrency(total5YrEarnings) + (state.enableHousehold ? " (Household)" : "");
    elements.kpiCompoundedGrowth.textContent = `+${compoundedGrowth.toFixed(1)}%`;
    elements.kpiEndingBase.textContent = `Ending Base: ${formatCurrency(endingBase)} / yr${state.adjustForInflation ? " (Real)" : ""}${state.taxMode === "net" ? " (Net)" : ""}`;
    elements.kpiPromoAdvantage.textContent = `+${formatCurrency(promoAdvantage)}`;

    // FIRE Milestone Forecast
    if (elements.fireMilestoneText) {
      const avgAnnualHousehold = cumulativeComp / 5;
      const annualSavings = avgAnnualHousehold * 0.35; // 35% savings rate
      const r = 0.07; // 7% annual real return in index funds
      let yearsTo1M = Math.log(1 + (1000000 * r) / (annualSavings || 1)) / Math.log(1 + r);
      let yearsTo2M = Math.log(1 + (2000000 * r) / (annualSavings || 1)) / Math.log(1 + r);
      yearsTo1M = Math.max(1, Math.min(25, yearsTo1M)).toFixed(1);
      yearsTo2M = Math.max(1, Math.min(35, yearsTo2M)).toFixed(1);

      elements.fireMilestoneText.innerHTML = `At a 35% household savings rate (${formatCurrency(annualSavings)}/yr invested @ 7%), projected to reach <strong>$1,000,000</strong> in liquid wealth in <strong>~${yearsTo1M} years</strong> (and $2,000,000 in ~${yearsTo2M} years)!`;
    }

    // Compounding Wealth & FIRE Projector Calculation
    if (elements.wealthY5Invested) {
      let portfolio = Number(state.wealthStartingNetWorth) || 0;
      const sRate = (Number(state.wealthSavingsRate) || 35) / 100;
      const rRate = Number(state.wealthReturnRate) || 0.075;

      for (let y = 1; y <= 5; y++) {
        const annualComp = yearData[y - 1].totalAnnualComp;
        const annualSavings = annualComp * sRate;
        // Continuous mid-year dollar-cost averaging model:
        portfolio = portfolio * (1 + rRate) + annualSavings * (1 + rRate / 2);
      }

      const avgAnnualSavings = (total5YrEarnings / 5) * sRate;
      const startPort = Number(state.wealthStartingNetWorth) || 0;

      const calcYearsToMilestone = (targetAmount) => {
        if (startPort >= targetAmount) return 0;
        if (avgAnnualSavings <= 0 && startPort <= 0) return 99;
        const numerator = targetAmount * rRate + avgAnnualSavings;
        const denominator = startPort * rRate + avgAnnualSavings;
        if (denominator <= 0 || numerator <= 0) return 99;
        const yrs = Math.log(numerator / denominator) / Math.log(1 + rRate);
        return Math.max(0, yrs);
      };

      const yrsTo1M = calcYearsToMilestone(1000000);
      const yrsToFire = calcYearsToMilestone(2000000);

      elements.wealthY5Invested.textContent = formatCurrency(Math.round(portfolio));
      elements.wealthTimeToOneMil.textContent = yrsTo1M <= 0 ? "Achieved! 🏆" : (yrsTo1M >= 40 ? "40+ Yrs" : `~${yrsTo1M.toFixed(1)} Yrs`);
      elements.wealthTimeToFire.textContent = yrsToFire <= 0 ? "FIRE Freedom! 🚀" : (yrsToFire >= 50 ? "50+ Yrs" : `~${yrsToFire.toFixed(1)} Yrs`);

      // Progress bar towards Full FIRE ($2.0M target)
      const fireTarget = 2000000;
      const progressPct = Math.min(100, Math.max(0, Math.round((portfolio / fireTarget) * 100)));
      if (elements.wealthFireBar) {
        elements.wealthFireBar.style.width = `${progressPct}%`;
      }
      if (elements.wealthFireProgressPct) {
        if (portfolio >= fireTarget) {
          elements.wealthFireProgressPct.textContent = `100% — Full FIRE Reached ($2.0M+)! 🎯`;
        } else {
          elements.wealthFireProgressPct.textContent = `${progressPct}% of Full FIRE ($2.0M)`;
        }
      }

      // Dynamic Institutional Wealth Insight
      if (elements.wealthInsightCallout) {
        const annualPassiveIncome = Math.round(portfolio * 0.04);
        const monthlyPassiveIncome = Math.round(annualPassiveIncome / 12);

        let milestoneNote = "";
        if (yrsTo1M <= 5) {
          milestoneNote = `On this trajectory, you will cross the <strong>$1,000,000 liquid milestone within Year ${Math.ceil(yrsTo1M)}</strong>!`;
        } else {
          const acceleratedSavings = avgAnnualSavings + (total5YrEarnings / 5) * 0.10;
          const numAcc = 2000000 * rRate + acceleratedSavings;
          const denAcc = startPort * rRate + acceleratedSavings;
          const acceleratedYrs = Math.max(0, Math.log(numAcc / denAcc) / Math.log(1 + rRate));
          const yearsSaved = Math.max(0.5, yrsToFire - acceleratedYrs).toFixed(1);
          milestoneNote = `Reaching $1.0M in ~${yrsTo1M.toFixed(1)} yrs. Boosting your savings rate by +10% would shave <strong>${yearsSaved} years</strong> off your full FIRE timeline!`;
        }

        elements.wealthInsightCallout.innerHTML = `
          <strong>💡 Institutional Wealth Projection:</strong> By Year 5, your projected portfolio of <strong>${formatCurrency(Math.round(portfolio))}</strong> generates <strong>${formatCurrency(annualPassiveIncome)}/year</strong> (${formatCurrency(monthlyPassiveIncome)}/month) in perpetual passive income under the Trinity 4% Safe Withdrawal Rule. ${milestoneNote}
        `;
      }
    }

    // Render Progression Table
    renderProgressionTable(yearData);

    // Render / Update Chart
    renderTrajectoryChart(yearData);

    // Render Public RSU & Startup Exit Scenario Matrix
    renderEquityExitMatrix(yearData);

    // Debounced URL state sync for seamless deep-linking
    if (typeof syncUrlStateDebounced === "function") {
      syncUrlStateDebounced();
    }
  };

  const renderEquityExitMatrix = (yearData) => {
    if (!elements.equityExitMatrixCard) return;

    if (!state.enableEquity) {
      elements.equityExitMatrixCard.style.display = "none";
      return;
    }

    elements.equityExitMatrixCard.style.display = "block";

    // Compute baseline 5-year unmultiplied vested equity grant sum
    const scheduleMap = {
      standard: [0.25, 0.25, 0.25, 0.25, 0.0],
      amazon: [0.05, 0.15, 0.40, 0.40, 0.0],
      frontloaded: [0.33, 0.33, 0.22, 0.12, 0.0],
      ai_lab: [0.15, 0.25, 0.30, 0.30, 0.0],
      uniform: [0.20, 0.20, 0.20, 0.20, 0.20]
    };
    const rates = scheduleMap[state.equityVestingSchedule] || scheduleMap.standard;
    const baseByYear = [];
    let totalBaselineEquity = 0;

    for (let y = 1; y <= 5; y++) {
      const initV = (state.equityInitialGrant || 0) * (rates[y - 1] || 0);
      const refV = y >= 2 ? (y - 1) * ((state.equityRefresherGrant || 0) * 0.25) : 0;
      const yrSum = initV + refV;
      baseByYear.push(yrSum);
      totalBaselineEquity += yrSum;
    }

    if (state.equityVehicleType === "startup") {
      if (elements.equityMatrixTitle) {
        elements.equityMatrixTitle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
          </svg>
          Startup Options Exit Multiple &amp; 83(b) Tax Arbitrage Matrix
        `;
      }
      if (elements.equityMatrixBadge) {
        elements.equityMatrixBadge.textContent = state.equity83b ? "83(b) LTCG (20% Tax)" : "Ordinary / AMT (37% Tax)";
      }

      const multiples = [
        { mult: 0, label: "0x Underwater" },
        { mult: 1, label: "1x Flat Exit" },
        { mult: 3, label: "3x M&A Exit" },
        { mult: 5, label: "5x Breakout" },
        { mult: 10, label: "10x Unicorn IPO" }
      ];

      const activeMult = Number(state.equityExitMultiple);
      const taxRate = state.equity83b ? 0.20 : 0.37;

      if (elements.equityScenariosGrid) {
        elements.equityScenariosGrid.innerHTML = multiples.map(m => {
          const gross = Math.round(totalBaselineEquity * m.mult);
          const net = Math.round(gross * (1 - taxRate));
          const isActive = m.mult === activeMult ? "active-scenario" : "";
          return `
            <div class="equity-scenario-box ${isActive}">
              <div class="equity-scenario-tag">${m.label}</div>
              <div class="equity-scenario-val">${formatCurrency(gross)}</div>
              <div class="equity-scenario-sub">Net Post-Tax: ${formatCurrency(net)}</div>
            </div>
          `;
        }).join("");
      }

      const activeGross = Math.round(totalBaselineEquity * activeMult);
      const taxWithout83b = Math.round(activeGross * 0.37);
      const taxWith83b = Math.round(activeGross * 0.20);
      const taxSavings83b = Math.max(0, taxWithout83b - taxWith83b);

      if (elements.equityTaxCallout) {
        elements.equityTaxCallout.innerHTML = `
          <strong>💡 83(b) Election &amp; Liquidity Analysis:</strong> At a <strong>${activeMult}x exit</strong> on ${formatCurrency(totalBaselineEquity)} of vested strike equity, your gross payout is <strong>${formatCurrency(activeGross)}</strong>. Filing an 83(b) election at grant locks in Long-Term Capital Gains (20%) vs. Ordinary/AMT rates (37%), saving you <strong>${formatCurrency(taxSavings83b)} in federal taxes</strong> upon exit!
        `;
      }
    } else {
      // Public RSU Volatility Modeling
      if (elements.equityMatrixTitle) {
        elements.equityMatrixTitle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
          Public RSU Stock Volatility &amp; Appreciation Matrix
        `;
      }
      if (elements.equityMatrixBadge) {
        elements.equityMatrixBadge.textContent = "5-Year Vested RSU Value";
      }

      const scenarios = [
        { rate: -0.20, label: "Bear (-20%/yr)" },
        { rate: 0, label: "Flat (0%/yr)" },
        { rate: 0.15, label: "Bull (+15%/yr)" },
        { rate: 0.30, label: "Hypergrowth (+30%)" }
      ];

      const activeRate = Number(state.equityStockGrowth) || 0;

      if (elements.equityScenariosGrid) {
        elements.equityScenariosGrid.innerHTML = scenarios.map(s => {
          let sumVal = 0;
          for (let y = 1; y <= 5; y++) {
            sumVal += baseByYear[y - 1] * Math.pow(1 + s.rate, y - 0.5);
          }
          const delta = sumVal - totalBaselineEquity;
          const deltaSign = delta >= 0 ? "+" : "";
          const isActive = Math.abs(s.rate - activeRate) < 0.001 ? "active-scenario" : "";
          return `
            <div class="equity-scenario-box ${isActive}">
              <div class="equity-scenario-tag">${s.label}</div>
              <div class="equity-scenario-val">${formatCurrency(Math.round(sumVal))}</div>
              <div class="equity-scenario-sub">${delta === 0 ? "Grant Baseline" : `${deltaSign}${formatCurrency(Math.round(delta))} vs Flat`}</div>
            </div>
          `;
        }).join("");
      }

      let activeSum = 0;
      for (let y = 1; y <= 5; y++) {
        activeSum += baseByYear[y - 1] * Math.pow(1 + activeRate, y - 0.5);
      }
      const swing = Math.round(activeSum - totalBaselineEquity);

      if (elements.equityTaxCallout) {
        elements.equityTaxCallout.innerHTML = `
          <strong>📈 RSU Appreciation Impact:</strong> Against a flat grant baseline of <strong>${formatCurrency(Math.round(totalBaselineEquity))}</strong>, a <strong>${(activeRate * 100).toFixed(0)}%/yr</strong> stock trajectory shifts your 5-year vested equity wealth to <strong>${formatCurrency(Math.round(activeSum))}</strong> (${swing >= 0 ? "+" : ""}${formatCurrency(swing)} net variance).
        `;
      }
    }
  };

  const renderProgressionTable = (yearData) => {
    elements.progressionTableBody.innerHTML = yearData.map(d => {
      const levelBadge = d.isPromoted
        ? `<span class="level-tag level-tag-promoted">🎉 ${d.levelCode} (+${d.promoBumpPct}%)</span>`
        : `<span class="level-tag level-tag-normal">${d.levelCode}</span>`;

      const promoCell = d.isPromoted
        ? `<span class="table-num" style="color: var(--emerald-dark);">+${formatCurrency(d.promoIncrease)}</span>`
        : `<span style="color: var(--slate-text-light);">&mdash;</span>`;

      return `
        <tr>
          <td><strong>Year ${d.year}</strong></td>
          <td>${levelBadge} <span style="font-size: 0.8125rem; color: var(--slate-text-muted); margin-left: 0.35rem;">${d.levelName}</span></td>
          <td class="table-num">${formatCurrency(d.baseSalary)}</td>
          <td class="table-num" style="color: #64748B;">+${formatCurrency(d.meritIncrease)}</td>
          <td>${promoCell}</td>
          <td class="table-num" style="color: var(--emerald-dark);">${formatCurrency(d.annualBonus)}</td>
          <td class="table-num table-total">${formatCurrency(d.totalAnnualComp)}</td>
          <td class="table-num" style="font-weight: 700;">${formatCurrency(d.cumulativeComp)}</td>
        </tr>
      `;
    }).join("");
  };

  const renderTrajectoryChart = (yearData) => {
    if (!elements.chartCanvas) return;

    if (typeof Chart === "undefined") {
      renderSvgChartFallback(yearData);
      return;
    }

    const info = getCurrencyInfo();
    // Labels & Datasets
    const labels = yearData.map(d => `Year ${d.year} (${d.levelCode})`);
    const baseSalaries = yearData.map(d => Math.round(d.baseSalary * info.rate));
    const annualBonuses = yearData.map(d => Math.round(d.annualBonus * info.rate));
    const equityGrants = yearData.map(d => Math.round((d.annualEquityVested || 0) * info.rate));

    if (trajectoryChartInstance) {
      trajectoryChartInstance.data.labels = labels;
      trajectoryChartInstance.data.datasets[0].data = baseSalaries;
      trajectoryChartInstance.data.datasets[1].data = annualBonuses;

      if (state.enableEquity) {
        if (!trajectoryChartInstance.data.datasets[2]) {
          trajectoryChartInstance.data.datasets.push({
            label: `Equity & Stock Refreshers (${info.code})`,
            data: equityGrants,
            backgroundColor: "#2563EB",
            borderRadius: 6,
            stack: "Stack 0",
            maxBarThickness: 55
          });
        } else {
          trajectoryChartInstance.data.datasets[2].data = equityGrants;
        }
      } else if (trajectoryChartInstance.data.datasets[2]) {
        trajectoryChartInstance.data.datasets.pop();
      }

      trajectoryChartInstance.options.scales.y.ticks.callback = (value) => `${info.symbol}${Math.round(value / 1000)}k`;
      trajectoryChartInstance.update();
      return;
    }

    // Chart.js instantiation with modern fintech navy & emerald styling
    const ctx = elements.chartCanvas.getContext("2d");
    const initialDatasets = [
      {
        label: `Base Salary (${info.code})`,
        data: baseSalaries,
        backgroundColor: "#0A1128",
        borderRadius: 6,
        stack: "Stack 0",
        maxBarThickness: 55
      },
      {
        label: `Annual Performance Bonus (${info.code})`,
        data: annualBonuses,
        backgroundColor: "#10B981",
        borderRadius: 6,
        stack: "Stack 0",
        maxBarThickness: 55
      }
    ];

    if (state.enableEquity) {
      initialDatasets.push({
        label: `Equity & Stock Refreshers (${info.code})`,
        data: equityGrants,
        backgroundColor: "#2563EB",
        borderRadius: 6,
        stack: "Stack 0",
        maxBarThickness: 55
      });
    }

    trajectoryChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: initialDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#0A1128",
            titleFont: { size: 13, family: "Inter", weight: "bold" },
            bodyFont: { size: 12, family: "JetBrains Mono" },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const val = formatCurrency(context.parsed.y / info.rate);
                return ` ${label}: ${val}`;
              },
              afterBody: (context) => {
                const index = context[0].dataIndex;
                const d = yearData[index];
                const total = formatCurrency(d.totalAnnualComp);
                const promoNote = d.isPromoted ? `\n🎉 Promotion Milestone: ${d.levelCode} (+${d.promoBumpPct}%)` : "";
                return `\nTotal Target Comp: ${total}${promoNote}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              font: { family: "Inter", size: 12, weight: "600" },
              color: "#475569"
            }
          },
          y: {
            stacked: true,
            grid: { color: "#F1F5F9" },
            ticks: {
              font: { family: "JetBrains Mono", size: 11 },
              color: "#64748B",
              callback: (value) => `${info.symbol}${Math.round(value / 1000)}k`
            }
          }
        }
      }
    });
  };

  const renderSvgChartFallback = (yearData) => {
    const container = elements.chartCanvas.parentElement;
    if (!container) return;

    const info = getCurrencyInfo();
    const maxVal = Math.max(...yearData.map(d => d.totalAnnualComp)) * 1.15;
    const height = 240;
    const width = 600;
    const barWidth = 60;
    const spacing = 110;
    const startX = 65;

    const barsSvg = yearData.map((d, i) => {
      const x = startX + i * spacing;
      const baseH = (d.baseSalary / maxVal) * (height - 60);
      const bonusH = (d.annualBonus / maxVal) * (height - 60);
      const baseY = height - 30 - baseH;
      const bonusY = baseY - bonusH;

      return `
        <g class="svg-bar-group">
          <!-- Base bar -->
          <rect x="${x}" y="${baseY}" width="${barWidth}" height="${baseH}" rx="4" fill="#0A1128"></rect>
          <!-- Bonus bar -->
          <rect x="${x}" y="${bonusY}" width="${barWidth}" height="${bonusH}" rx="4" fill="#10B981"></rect>
          <!-- Total label -->
          <text x="${x + barWidth / 2}" y="${bonusY - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="#0F172A" font-family="JetBrains Mono, monospace">
            ${info.symbol}${Math.round((d.totalAnnualComp * info.rate) / 1000)}k
          </text>
          <!-- Year label -->
          <text x="${x + barWidth / 2}" y="${height - 12}" text-anchor="middle" font-size="12" font-weight="600" fill="#475569" font-family="Inter, sans-serif">
            Yr ${d.year} (${d.levelCode})
          </text>
        </g>
      `;
    }).join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <line x1="40" y1="${height - 30}" x2="${width - 20}" y2="${height - 30}" stroke="#CBD5E1" stroke-width="1.5"></line>
        ${barsSvg}
      </svg>
    `;
  };

  const copyTrajectorySummaryToClipboard = () => {
    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    const totalEarnings = elements.kpiTotalEarnings.textContent;
    const growth = elements.kpiCompoundedGrowth.textContent;
    const endingBase = elements.kpiEndingBase.textContent;
    const promoAdvantage = elements.kpiPromoAdvantage.textContent;
    const info = getCurrencyInfo();

    const summaryText = [
      `=== SalaryPathGuide Trajectory Summary (${info.code}) ===`,
      `Role: ${role.title} (${role.category})`,
      `Starting Base: ${formatCurrency(state.currentBaseSalary)}`,
      `Annual Raise: ${state.annualRaisePct}% | Promo Interval: Every ${state.promoInterval || "None"} Years (+${state.promoBumpPct}%)`,
      `5-Year Total Projected Earnings: ${totalEarnings}`,
      `Compounded Growth: ${growth} (${endingBase})`,
      `Promotion Value Added: ${promoAdvantage}`,
      elements.wealthY5Invested ? `5-Year Projected Invested Wealth: ${elements.wealthY5Invested.textContent} (${state.wealthSavingsRate}% savings @ ${(state.wealthReturnRate * 100).toFixed(1)}% real return)` : "",
      elements.wealthTimeToFire ? `Full FIRE Horizon: ${elements.wealthTimeToFire.textContent}` : "",
      `Mode: ${state.adjustForInflation ? "Real (Inflation-Adjusted @ 2.8%/yr)" : "Nominal"}`,
      `Benchmark verified at SalaryPathGuide.com`
    ].join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast(`5-Year Trajectory Summary (${info.code}) copied to clipboard!`))
        .catch(() => fallbackCopyToClipboard(summaryText));
    } else {
      fallbackCopyToClipboard(summaryText);
    }
  };

  const exportTrajectoryToCsv = () => {
    if (!state.currentTrajectoryData || state.currentTrajectoryData.length === 0) return;
    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    const info = getCurrencyInfo();

    const headers = [
      "Year",
      "Level Code",
      "Level Name",
      "Promoted",
      `Base Salary (${info.code})`,
      `Merit Raise (${info.code})`,
      `Promo Bump (${info.code})`,
      `Annual Bonus (${info.code})`,
      `Total Annual Comp (${info.code})`,
      `Cumulative Comp (${info.code})`
    ];

    const rows = state.currentTrajectoryData.map(d => [
      `Year ${d.year}`,
      d.levelCode,
      `"${d.levelName}"`,
      d.isPromoted ? `Yes (+${d.promoBumpPct}%)` : "No",
      Math.round(d.baseSalary * info.rate),
      Math.round(d.meritIncrease * info.rate),
      Math.round(d.promoIncrease * info.rate),
      Math.round(d.annualBonus * info.rate),
      Math.round(d.totalAnnualComp * info.rate),
      Math.round(d.cumulativeComp * info.rate)
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SalaryPathGuide-${role.id}-5yr-trajectory-${info.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded 5-Year Trajectory CSV in ${info.code}!`);
  };

  const fallbackCopyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("Trajectory summary copied to clipboard!");
    } catch (err) {
      console.error(err);
      showToast("Unable to copy summary.");
    }
    document.body.removeChild(textarea);
  };

  /* ==========================================================================
     3. Programmatic Career Path Directory
     ========================================================================== */
  const initDirectory = () => {
    // Category filter pills
    elements.categoryFilterGroup.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        elements.categoryFilterGroup.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.activeCategory = pill.getAttribute("data-category");
        renderCareerDirectory();
      });
    });

    // Location Tier selector
    elements.directoryLocationTier.addEventListener("change", (e) => {
      state.directoryLocationMultiplier = Number(e.target.value);
      renderCareerDirectory();
    });

    renderCareerDirectory();
  };

  const setCategoryFilter = (cat) => {
    state.activeCategory = cat;
    elements.categoryFilterGroup.querySelectorAll(".filter-pill").forEach(p => {
      if (p.getAttribute("data-category") === cat) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
    renderCareerDirectory();
  };

  const renderCareerDirectory = () => {
    const container = elements.careerRolesContainer;
    const multiplier = state.directoryLocationMultiplier;

    const filteredRoles = roles.filter(role => {
      if (state.activeCategory === "all") return true;
      return role.category === state.activeCategory;
    });

    if (filteredRoles.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: #FFFFFF; border-radius: 16px; border: 1px solid var(--slate-border);">
          <p style="color: var(--slate-text-muted); font-size: 1.125rem;">No roles match the selected category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredRoles.map(role => {
      const iconSvg = getRoleIcon(role.id);

      const levelsHtml = role.levels.map(level => {
        const p25 = Math.round(level.base.p25 * multiplier);
        const p50 = Math.round(level.base.p50 * multiplier);
        const p75 = Math.round(level.base.p75 * multiplier);
        const p90 = Math.round(level.base.p90 * multiplier);

        const estBonus = Math.round(p50 * (level.bonusPct / 100));
        const estEquity = Math.round((level.equityAnnual || 0) * multiplier);
        const totalTargetComp = p50 + estBonus + estEquity;

        const skillsTags = level.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("");
        const upskillItems = level.upskillPath.map(u => `<li>${escapeHtml(u)}</li>`).join("");

        return `
          <div class="level-card">
            <div class="level-card-top">
              <div>
                <span class="level-code-pill">${level.code}</span>
              </div>
              <span class="level-yoe-badge">${level.yoe}</span>
            </div>

            <h4 class="level-card-title">${escapeHtml(level.name)}</h4>

            <!-- Salary Band Box -->
            <div class="salary-band-box">
              <div class="salary-band-main">
                <span class="salary-band-label">Median Base</span>
                <span class="salary-band-median">${formatCurrency(p50)}</span>
              </div>

              <div class="salary-range-bar-wrap">
                <div class="salary-range-bar">
                  <div class="salary-range-fill"></div>
                </div>
                <div class="salary-range-labels">
                  <span>p25: ${formatCurrency(p25)}</span>
                  <span>p75: ${formatCurrency(p75)}</span>
                </div>
              </div>

              <div class="ttc-pill">
                <span class="label">Total Target Comp (TTC):</span>
                <span class="value">${formatCurrency(totalTargetComp)} / yr</span>
              </div>
            </div>

            <!-- Scope -->
            <p class="level-scope">${escapeHtml(level.scope)}</p>

            <!-- Skills -->
            <div class="level-skills-wrap">
              <span class="level-skills-title">Core Competencies</span>
              <div class="skills-tags-cluster">
                ${skillsTags}
              </div>
            </div>

            <!-- Upskill Checklist to Next Tier -->
            <div class="upskill-container">
              <div class="upskill-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                Upskill Roadmap to Next Tier
              </div>
              <ul class="upskill-list">
                ${upskillItems}
              </ul>
            </div>

            <!-- Action Button: Load into Calculator -->
            <div class="level-card-actions">
              <button 
                type="button" 
                class="btn btn-outline-dark btn-sm btn-load-calc" 
                data-role-id="${role.id}" 
                data-salary="${p50}"
                data-level="${level.code}"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                Model in Calculator
              </button>
            </div>
          </div>
        `;
      }).join("");

      const specialtiesHtml = role.topSpecialties.map(s => `<span class="specialty-tag">${escapeHtml(s)}</span>`).join("");

      return `
        <div class="role-path-card" id="role-card-${role.id}">
          <div class="role-path-header">
            <div class="role-path-title-group">
              <div class="role-path-icon">${iconSvg}</div>
              <div>
                <h3 class="role-path-title">${escapeHtml(role.title)}</h3>
                <div class="role-path-meta">
                  <span class="meta-badge">${role.category}</span>
                  <span class="meta-badge growth">${role.marketGrowth}</span>
                  <span>${role.levels.length} Career Tiers</span>
                </div>
              </div>
            </div>

            <div>
              <button class="btn btn-outline-white btn-sm btn-compare-role" data-role-id="${role.id}">
                Compare This Track
              </button>
            </div>
          </div>

          <div class="role-path-desc">
            <div>${escapeHtml(role.shortDesc)}</div>
            <div class="specialties-list">
              <strong style="font-size: 0.75rem; color: var(--navy-dark); text-transform: uppercase;">Focus Areas:</strong>
              ${specialtiesHtml}
            </div>
          </div>

          <div class="levels-grid">
            ${levelsHtml}
          </div>
        </div>
      `;
    }).join("");

    // Bind "Model in Calculator" buttons
    container.querySelectorAll(".btn-load-calc").forEach(btn => {
      btn.addEventListener("click", () => {
        const roleId = btn.getAttribute("data-role-id");
        const salary = Number(btn.getAttribute("data-salary"));
        const level = btn.getAttribute("data-level");

        state.selectedRoleId = roleId;
        elements.calcJobTitle.value = roleId;
        const role = roles.find(r => r.id === roleId);
        if (role) elements.calcTrackBadge.textContent = role.category;

        updateBaseSalary(salary);
        runTrajectoryCalculations();

        document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
        showToast(`Loaded ${role.title} (${level}) median base of ${formatCurrency(salary)} into Calculator!`);
      });
    });

    // Bind "Compare This Track" buttons
    container.querySelectorAll(".btn-compare-role").forEach(btn => {
      btn.addEventListener("click", () => {
        const roleId = btn.getAttribute("data-role-id");
        openCompareModalWithRole(roleId);
      });
    });
  };

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case "swe":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
      case "qa":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`;
      case "pm":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
      case "da":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
      case "ds":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`;
      case "devops":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;
      case "cyber":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
      case "em":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
      case "mobile":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`;
      case "quant":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`;
      case "dentist":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 1.5 8 2.5 12 .5 2 2 2.5 3.5 1 1-1 1-1 2 0 1.5 1.5 3 1 3.5-1 1-4 2.5-8.5 2.5-12 0-3.5-2.5-6-6-6z"></path><path d="M9 7c1 1.5 5 1.5 6 0"></path></svg>`;
      case "physician":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>`;
      case "attorney":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M4 7l4 8M12 7l-4 8M12 7l4 8M20 7l-4 8"></path><circle cx="4" cy="7" r="1"></circle><circle cx="20" cy="7" r="1"></circle></svg>`;
      case "ib":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
      default:
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
    }
  };

  /* ==========================================================================
     4. Salary Negotiation Playbook & Script Generator
     ========================================================================== */
  const initNegotiationPlaybook = () => {
    elements.playbookTabs.innerHTML = negotiationPlaybook.map((scenario) => {
      const activeClass = scenario.id === state.activePlaybookId ? "active" : "";
      return `
        <button class="playbook-tab-btn ${activeClass}" data-scenario-id="${scenario.id}">
          ${escapeHtml(scenario.title)}
        </button>
      `;
    }).join("");

    elements.playbookTabs.querySelectorAll(".playbook-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        elements.playbookTabs.querySelectorAll(".playbook-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.activePlaybookId = btn.getAttribute("data-scenario-id");
        renderActivePlaybookScenario();
      });
    });

    renderActivePlaybookScenario();
  };

  const renderActivePlaybookScenario = () => {
    const scenario = negotiationPlaybook.find(s => s.id === state.activePlaybookId) || negotiationPlaybook[0];
    const container = elements.playbookContent;

    const dosHtml = scenario.dos.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const dontsHtml = scenario.donts.map(item => `<li>${escapeHtml(item)}</li>`).join("");

    const populatedPhone = populateScript(scenario.scriptPhone);
    const populatedEmail = populateScript(scenario.scriptEmail);

    container.innerHTML = `
      <div class="playbook-scenario-header">
        <span class="playbook-scenario-badge">${scenario.badge}</span>
        <h3 class="playbook-scenario-title">${escapeHtml(scenario.title)}</h3>
        <p class="playbook-scenario-summary">${escapeHtml(scenario.summary)}</p>
      </div>

      <!-- Dos & Don'ts Checklist -->
      <div class="dodont-grid">
        <div class="dodont-card dodont-card-do">
          <h4 class="dodont-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Tactical Dos (Best Practices)
          </h4>
          <ul class="dodont-list">${dosHtml}</ul>
        </div>

        <div class="dodont-card dodont-card-dont">
          <h4 class="dodont-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Tactical Don'ts (Red Lines)
          </h4>
          <ul class="dodont-list">${dontsHtml}</ul>
        </div>
      </div>

      <!-- Script Customizer Controls -->
      <div class="script-customizer-box">
        <div class="script-customizer-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Customize Script Placeholders Live
        </div>
        <div class="script-inputs-grid">
          <div class="form-group">
            <label class="form-label" style="font-size: 0.75rem;">Target Company</label>
            <input type="text" id="scriptInputCompany" class="form-input" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" value="${escapeHtml(state.scriptCompany)}">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size: 0.75rem;">Target Base Salary ($)</label>
            <input type="number" id="scriptInputBase" class="form-input" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" value="${state.scriptTargetBase}">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size: 0.75rem;">Competing Offer ($ Total)</label>
            <input type="number" id="scriptInputCompeting" class="form-input" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" value="${state.scriptCompetingOffer}">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size: 0.75rem;">Key Specialty / Skill</label>
            <input type="text" id="scriptInputSkill" class="form-input" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" value="${escapeHtml(state.scriptKeySkill)}">
          </div>
        </div>
      </div>

      <!-- Verbatim Scripts Wrap -->
      <div class="script-boxes-wrap">
        <!-- Phone Script -->
        <div class="script-card">
          <div class="script-card-header">
            <div class="script-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Verbatim Phone Dialogue Script
            </div>
            <div style="display: flex; gap: 0.45rem; align-items: center;">
              <button type="button" id="playPhoneScriptBtn" class="btn-audio-speak">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                Listen to Delivery
              </button>
              <button type="button" class="btn btn-outline-dark btn-sm btn-copy-script" data-type="phone">
                Copy Phone Script
              </button>
            </div>
          </div>
          <div class="script-content-pre" id="phoneScriptPre">${populatedPhone}</div>
        </div>

        <!-- Email Script -->
        <div class="script-card">
          <div class="script-card-header">
            <div class="script-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Verbatim Email Follow-up Template
            </div>
            <button type="button" class="btn btn-emerald btn-sm btn-copy-script" data-type="email">
              Copy Email Script
            </button>
          </div>
          <div class="script-content-pre" id="emailScriptPre">${populatedEmail}</div>
        </div>
      </div>
    `;

    const inputCompany = document.getElementById("scriptInputCompany");
    const inputBase = document.getElementById("scriptInputBase");
    const inputCompeting = document.getElementById("scriptInputCompeting");
    const inputSkill = document.getElementById("scriptInputSkill");

    const refreshScripts = () => {
      state.scriptCompany = inputCompany.value || "Acme Cloud";
      state.scriptTargetBase = Number(inputBase.value) || 165000;
      state.scriptCompetingOffer = Number(inputCompeting.value) || 175000;
      state.scriptKeySkill = inputSkill.value || "Technical Architecture";

      document.getElementById("phoneScriptPre").innerHTML = populateScript(scenario.scriptPhone);
      document.getElementById("emailScriptPre").innerHTML = populateScript(scenario.scriptEmail);
    };

    [inputCompany, inputBase, inputCompeting, inputSkill].forEach(inp => {
      inp.addEventListener("input", refreshScripts);
    });

    const playPhoneBtn = document.getElementById("playPhoneScriptBtn");
    if (playPhoneBtn) {
      playPhoneBtn.addEventListener("click", () => {
        const el = document.getElementById("phoneScriptPre");
        if (el) {
          const plainText = el.innerText || el.textContent;
          speakText(plainText, playPhoneBtn);
        }
      });
    }

    container.querySelectorAll(".btn-copy-script").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-type");
        const el = type === "phone" ? document.getElementById("phoneScriptPre") : document.getElementById("emailScriptPre");
        if (el) {
          const plainText = el.innerText || el.textContent;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(plainText)
              .then(() => showToast(`Negotiation ${type} script copied to clipboard!`))
              .catch(() => fallbackCopyToClipboard(plainText));
          } else {
            fallbackCopyToClipboard(plainText);
          }
        }
      });
    });
  };

  /* ==========================================================================
     Web Speech Audio Coach & Recruiter Objection Roleplay Simulator
     ========================================================================== */
  let currentSpeakingBtn = null;
  const speakText = (rawText, btnEl) => {
    if (!("speechSynthesis" in window)) {
      showToast("🔇 Audio playback is not supported in this browser.");
      return;
    }

    const wasSameBtn = currentSpeakingBtn === btnEl && window.speechSynthesis.speaking;
    window.speechSynthesis.cancel();

    document.querySelectorAll(".btn-audio-speak.speaking").forEach(b => {
      b.classList.remove("speaking");
      if (b.dataset.defaultHtml) b.innerHTML = b.dataset.defaultHtml;
    });

    if (wasSameBtn) {
      currentSpeakingBtn = null;
      return;
    }

    const cleanText = rawText.replace(/\s+/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    if (btnEl) {
      if (!btnEl.dataset.defaultHtml) btnEl.dataset.defaultHtml = btnEl.innerHTML;
      btnEl.classList.add("speaking");
      btnEl.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg> Stop Audio`;
      currentSpeakingBtn = btnEl;
    }

    const resetBtn = () => {
      if (btnEl) {
        btnEl.classList.remove("speaking");
        if (btnEl.dataset.defaultHtml) btnEl.innerHTML = btnEl.dataset.defaultHtml;
      }
      currentSpeakingBtn = null;
    };

    utterance.onend = resetBtn;
    utterance.onerror = resetBtn;

    window.speechSynthesis.speak(utterance);
  };

  const initRoleplaySimulator = () => {
    const pillsContainer = document.getElementById("roleplayScenarioPills");
    const quoteEl = document.getElementById("roleplayRecruiterQuote");
    const hearRecruiterBtn = document.getElementById("roleplayHearRecruiterBtn");
    const choicesGrid = document.getElementById("roleplayChoicesGrid");
    const feedbackPanel = document.getElementById("roleplayFeedbackPanel");
    const masteryBadge = document.getElementById("roleplayMasteryBadge");

    if (!pillsContainer || !quoteEl || !choicesGrid) return;

    const objections = [
      {
        id: "band-ceiling",
        label: "1. Band Ceiling",
        recruiterQuote: "We really want you on the team, but we're already at the absolute top of the base salary band for this level. HR simply won't approve a higher base.",
        choices: [
          {
            letter: "A",
            tier: "weak",
            score: "35/100 · Premature Concession",
            text: "Oh, I completely understand. If that's the top of the band, I'll go ahead and sign the offer as-is.",
            verdict: "You left $20,000–$60,000 in non-base levers on the table.",
            psychology: "When recruiters cite 'top of the base band', 80% of the time they still have discretionary budget for Sign-On Bonuses, RSU grants, or accelerated 6-month review cycles."
          },
          {
            letter: "B",
            tier: "mid",
            score: "62/100 · Rigid Pushback",
            text: "Are you sure there's no exception? I really need at least $15,000 more in base salary to cover my living expenses.",
            verdict: "Friction without a constructive path forward.",
            psychology: "Framing around personal expenses weakens your positioning, and pushing solely on a capped HR base band stalls the recruiter instead of turning them into an ally."
          },
          {
            letter: "C",
            tier: "elite",
            score: "98/100 · Elite Total-Comp Pivot",
            text: "I completely respect internal base bands. If base is capped at this level, let's look at bridging the total compensation gap through an increased 4-year RSU grant or an additional sign-on bonus so we can hit our target number and I can sign right away.",
            verdict: "Masterclass Pivot — Collaborative, Data-Driven & Actionable!",
            psychology: "You validated the recruiter's constraint while immediately pivoting to flexible comp buckets (RSUs & Sign-On) that Compensation Committees routinely approve without breaking level parity."
          }
        ]
      },
      {
        id: "exploding-deadline",
        label: "2. Exploding Deadline",
        recruiterQuote: "The hiring manager needs your signed acceptance by Friday at 5 PM, otherwise we have to extend the offer to another finalist.",
        choices: [
          {
            letter: "A",
            tier: "weak",
            score: "25/100 · Pressure Collapse",
            text: "Okay, I don't want to lose the role—I'll cancel my remaining final-round interviews and sign by Friday.",
            verdict: "You surrendered your single greatest source of leverage.",
            psychology: "Artificial deadlines are designed to prevent competing offers from materializing. Canceling final rounds eliminates your BATNA (Best Alternative to a Negotiated Agreement)."
          },
          {
            letter: "B",
            tier: "mid",
            score: "60/100 · Unanchored Delay",
            text: "Friday is really tight for me. Can you please give me two more weeks to think it over?",
            verdict: "Too vague and too long; triggers flight-risk alarms.",
            psychology: "Asking for 2 full weeks without a clear milestone makes hiring managers assume you're stalling or waiting for something unlikely."
          },
          {
            letter: "C",
            tier: "elite",
            score: "97/100 · High-Conviction Extension",
            text: "I'm genuinely excited about the team and want to make a well-informed, long-term commitment. Because I'm wrapping up final conversations early next week, could we extend the deadline to Wednesday? Having those extra 3 business days ensures I can sign with 100% conviction.",
            verdict: "Optimal Framing — Flips Scarcity into Mutual Certainty!",
            psychology: "Recruiters rarely pull offers from their #1 finalist over 3 business days. Signaling active late-stage pipelines also subtly boosts your market value."
          }
        ]
      },
      {
        id: "competing-pushback",
        label: "3. Competing Offer",
        recruiterQuote: "We reviewed your competing offer, but we're a stronger long-term brand with higher equity upside—we don't match other companies dollar-for-dollar.",
        choices: [
          {
            letter: "A",
            tier: "weak",
            score: "30/100 · Value Surrender",
            text: "That makes sense, your stock upside is probably worth more in the long run anyway.",
            verdict: "Accepted speculative upside in place of guaranteed cash.",
            psychology: "Companies love selling 'long-term upside' because it costs them zero guaranteed budget today."
          },
          {
            letter: "B",
            tier: "mid",
            score: "55/100 · Ultimatum Trap",
            text: "Their cash is guaranteed, so unless you match their exact dollar figure, I'm going to decline.",
            verdict: "High rescission/stalemate risk due to adversarial ultimatum.",
            psychology: "Hard ultimatums force recruiters into a defensive corner rather than problem-solving with you."
          },
          {
            letter: "C",
            tier: "elite",
            score: "99/100 · Collaborative Gap-Bridge",
            text: "I definitely value the long-term equity upside here, which is why you're my top choice. At the same time, the competing offer creates a $35,000 guaranteed Year 1 cash gap. If we can bridge even half of that gap via a sign-on bonus or equity bump, it makes my decision easy.",
            verdict: "Executive Close — Separates Preference from Math!",
            psychology: "Reaffirming them as your #1 choice removes ego friction, while asking to 'meet in the middle' gives the Compensation Committee an easy, face-saving win."
          }
        ]
      },
      {
        id: "verbal-promise",
        label: "4. Verbal Promise",
        recruiterQuote: "Don't worry about the Year 2 dip after your sign-on rolls off—high performers here always get huge equity refreshers and an early promotion review at 6 months.",
        choices: [
          {
            letter: "A",
            tier: "weak",
            score: "20/100 · Unwritten Risk",
            text: "That sounds reassuring! Thanks for sharing how refreshers work—I trust the process.",
            verdict: "Exposed yourself to a guaranteed Year 2 compensation cliff.",
            psychology: "Managers change, budgets freeze, and verbal expectations are never legally or HR-binding. If it's not in the written offer letter, it doesn't exist."
          },
          {
            letter: "B",
            tier: "mid",
            score: "58/100 · Cynical Tone",
            text: "I don't really trust verbal promises unless they're written in a contract.",
            verdict: "Right instinct, wrong tone—damages rapport.",
            psychology: "Implying the recruiter or manager is untrustworthy creates unnecessary interpersonal friction."
          },
          {
            letter: "C",
            tier: "elite",
            score: "98/100 · Contractual Memorialization",
            text: "That's great to hear about the performance culture! Since verbal expectations aren't always carried over if org structures shift, could we memorialize a guaranteed 6-month compensation review checkpoint—or add a Year 2 retention refresher—directly in the written offer letter?",
            verdict: "Institutional Protection — Polite, Objective & Bulletproof!",
            psychology: "Blaming 'organizational shifts' instead of people keeps everyone on the same side while ensuring your Year 2 total comp is protected in writing."
          }
        ]
      },
      {
        id: "salary-trap",
        label: "5. Early Salary Trap",
        recruiterQuote: "Before we move you to the hiring manager interview, what is your current compensation and what are your exact salary expectations?",
        choices: [
          {
            letter: "A",
            tier: "weak",
            score: "15/100 · Anchored Low",
            text: "I currently make $135,000, and I'd be happy with $145,000.",
            verdict: "You just capped your own offer potentially $50k+ below market.",
            psychology: "Revealing current pay anchors the company to your past salary rather than the market value of the new role (and is even illegal for employers to require in many states)."
          },
          {
            letter: "B",
            tier: "mid",
            score: "65/100 · Awkward Deflection",
            text: "I'm not comfortable sharing my numbers right now. Can you tell me what the range is first?",
            verdict: "Safe from anchoring low, but slightly defensive.",
            psychology: "Good to ask for the band, though pairing it with an assertive market benchmark sounds far more senior."
          },
          {
            letter: "C",
            tier: "elite",
            score: "96/100 · P75 Market Anchor Flip",
            text: "I'm focused on finding the right scope and impact first. Based on 2026 market benchmarks for this level and my experience, I'm targeting total compensation in the P75 range—around $240k to $270k depending on the equity and bonus structure. Does that align with your budgeted band for this role?",
            verdict: "Senior Positioning — Anchors High & Qualifies Budget Early!",
            psychology: "You bypassed current compensation completely, anchored to P75 external market data, and prompted the recruiter to confirm the role's true ceiling."
          }
        ]
      }
    ];

    let activeIdx = 0;
    const clearedIds = new Set();

    const updateMasteryBadge = () => {
      if (masteryBadge) {
        masteryBadge.textContent = `Readiness: ${clearedIds.size} / ${objections.length} Objections Cleared`;
      }
    };

    const renderScenario = (idx) => {
      activeIdx = idx;
      const item = objections[idx];
      if (!item) return;

      // Render pills
      pillsContainer.innerHTML = objections.map((obj, i) => {
        const isActive = i === idx ? "active" : "";
        const isCleared = clearedIds.has(obj.id) ? "cleared" : "";
        const check = clearedIds.has(obj.id) ? "✓ " : "";
        return `<button type="button" class="roleplay-pill-btn ${isActive} ${isCleared}" data-idx="${i}">${check}${obj.label}</button>`;
      }).join("");

      pillsContainer.querySelectorAll(".roleplay-pill-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          window.speechSynthesis && window.speechSynthesis.cancel();
          renderScenario(Number(btn.getAttribute("data-idx")));
        });
      });

      // Render recruiter quote
      quoteEl.textContent = `"${item.recruiterQuote}"`;
      if (hearRecruiterBtn) {
        hearRecruiterBtn.classList.remove("speaking");
        hearRecruiterBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Hear Recruiter Audio`;
        hearRecruiterBtn.dataset.defaultHtml = hearRecruiterBtn.innerHTML;
      }

      // Hide previous feedback
      if (feedbackPanel) feedbackPanel.style.display = "none";

      // Render choices
      choicesGrid.innerHTML = item.choices.map((c, cIdx) => `
        <button type="button" class="roleplay-choice-btn" data-choice-idx="${cIdx}">
          <span class="roleplay-choice-letter">${c.letter}</span>
          <span class="roleplay-choice-text">"${escapeHtml(c.text)}"</span>
        </button>
      `).join("");

      choicesGrid.querySelectorAll(".roleplay-choice-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const cIdx = Number(btn.getAttribute("data-choice-idx"));
          const chosen = item.choices[cIdx];

          // Clear previous choice states
          choicesGrid.querySelectorAll(".roleplay-choice-btn").forEach(b => {
            b.classList.remove("selected-elite", "selected-mid", "selected-weak");
          });
          btn.classList.add(`selected-${chosen.tier}`);

          if (chosen.tier === "elite") {
            clearedIds.add(item.id);
            updateMasteryBadge();
            // Refresh pills to show checkmark
            pillsContainer.querySelectorAll(".roleplay-pill-btn").forEach((pBtn, pI) => {
              if (clearedIds.has(objections[pI].id)) {
                pBtn.classList.add("cleared");
                if (!pBtn.textContent.startsWith("✓")) {
                  pBtn.textContent = "✓ " + objections[pI].label;
                }
              }
            });
          }

          // Find elite choice for playback/copy
          const eliteChoice = item.choices.find(c => c.tier === "elite") || chosen;

          if (feedbackPanel) {
            feedbackPanel.className = `roleplay-feedback-panel tier-${chosen.tier}`;
            feedbackPanel.style.display = "block";
            feedbackPanel.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                <strong style="font-size: 0.9375rem; color: var(--navy-dark);">${chosen.score}</strong>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button type="button" id="roleplayHearOptimalBtn" class="btn-audio-speak">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    Hear Optimal Delivery
                  </button>
                  <button type="button" id="roleplayCopyOptimalBtn" class="btn btn-outline-dark btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">
                    Copy Optimal Response
                  </button>
                </div>
              </div>
              <div style="font-weight: 700; font-size: 0.875rem; margin-bottom: 0.35rem; color: ${chosen.tier === "elite" ? "var(--emerald-dark)" : (chosen.tier === "mid" ? "#B45309" : "#DC2626")};">
                ${chosen.verdict}
              </div>
              <p style="font-size: 0.875rem; color: var(--slate-text); line-height: 1.5; margin: 0;">
                <strong>Recruiter Psychology:</strong> ${chosen.psychology}
              </p>
            `;

            const hearOptBtn = document.getElementById("roleplayHearOptimalBtn");
            if (hearOptBtn) {
              hearOptBtn.addEventListener("click", () => {
                speakText(eliteChoice.text, hearOptBtn);
              });
            }

            const copyOptBtn = document.getElementById("roleplayCopyOptimalBtn");
            if (copyOptBtn) {
              copyOptBtn.addEventListener("click", () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(eliteChoice.text).then(() => {
                    showToast("📋 Optimal counter-response copied to clipboard!");
                  });
                }
              });
            }
          }
        });
      });
    };

    if (hearRecruiterBtn) {
      hearRecruiterBtn.addEventListener("click", () => {
        const item = objections[activeIdx];
        if (item) speakText(item.recruiterQuote, hearRecruiterBtn);
      });
    }

    renderScenario(0);
    updateMasteryBadge();
  };

  const populateScript = (template) => {
    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    const info = getCurrencyInfo();
    const targetBaseFormatted = Math.round(Number(state.scriptTargetBase) * info.rate).toLocaleString();
    const competingFormatted = Math.round(Number(state.scriptCompetingOffer) * info.rate).toLocaleString();
    const targetEquityFormatted = Math.round(Number(state.scriptTargetEquity) * info.rate).toLocaleString();
    const targetSignonFormatted = Math.round(Number(state.scriptTargetSignon) * info.rate).toLocaleString();

    let text = escapeHtml(template);

    text = text.replace(/\[Company\]/g, `<span class="script-highlight">${escapeHtml(state.scriptCompany)}</span>`);
    text = text.replace(/\[Recruiter Name\]/g, `<span class="script-highlight">Sarah</span>`);
    text = text.replace(/\[Manager Name\]/g, `<span class="script-highlight">Alex</span>`);
    text = text.replace(/\[Job Title\]/g, `<span class="script-highlight">${escapeHtml(role.title)}</span>`);
    text = text.replace(/\[Target Level\]/g, `<span class="script-highlight">Senior (L5)</span>`);
    text = text.replace(/\[New Level Title\]/g, `<span class="script-highlight">Senior ${escapeHtml(role.title)}</span>`);
    text = text.replace(/\$\[Target Base\]/g, `<span class="script-highlight">${info.symbol}${targetBaseFormatted}</span>`);
    text = text.replace(/\$\[Target Equity\]/g, `<span class="script-highlight">${info.symbol}${targetEquityFormatted}</span>`);
    text = text.replace(/\$\[Target Signon\]/g, `<span class="script-highlight">${info.symbol}${targetSignonFormatted}</span>`);
    text = text.replace(/\$\[Competing Total Comp\]/g, `<span class="script-highlight">${info.symbol}${competingFormatted}</span>`);
    text = text.replace(/\$\[Target Total Comp\]/g, `<span class="script-highlight">${info.symbol}${competingFormatted}</span>`);
    text = text.replace(/\$\[Competing Base\]/g, `<span class="script-highlight">${info.symbol}${Math.round(state.scriptCompetingOffer * 0.7 * info.rate).toLocaleString()}</span>`);
    text = text.replace(/\$\[Competing Equity\]/g, `<span class="script-highlight">${info.symbol}${Math.round(state.scriptCompetingOffer * 0.3 * info.rate).toLocaleString()}</span>`);
    text = text.replace(/\[Key Skill\]/g, `<span class="script-highlight">${escapeHtml(state.scriptKeySkill)}</span>`);
    text = text.replace(/\[Key Competency Area\]/g, `<span class="script-highlight">${escapeHtml(state.scriptKeySkill)}</span>`);
    text = text.replace(/\[Key Achievement\]/g, `<span class="script-highlight">reducing latency by 35% across core APIs</span>`);
    text = text.replace(/\[Project \/ Mission\]/g, `<span class="script-highlight">next-generation core services</span>`);
    text = text.replace(/\[Your Name\]/g, `<span class="script-highlight">[Your Name]</span>`);
    text = text.replace(/\[Date\]/g, `<span class="script-highlight">Thursday</span>`);

    return text;
  };

  /* ==========================================================================
     5. Career Resources & Monetization CTAs
     ========================================================================== */
  const initResources = () => {
    elements.resourcesGrid.innerHTML = resources.map(res => {
      const iconSvg = getResourceIcon(res.icon);
      return `
        <div class="resource-card">
          <div>
            <span class="resource-top-badge">${res.badge}</span>
            <div class="resource-icon-wrap">${iconSvg}</div>
            <h3 class="resource-title">${escapeHtml(res.title)}</h3>
            <p class="resource-desc">${escapeHtml(res.description)}</p>
          </div>

          <div>
            <div class="resource-stats">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${res.stats}
            </div>
            <div class="resource-partner-tag">Partnered with ${res.partner} &bull; ${res.highlight}</div>
            <button type="button" class="btn btn-emerald btn-sm resource-btn" data-res-id="${res.id}">
              ${res.cta} →
            </button>
          </div>
        </div>
      `;
    }).join("");

    elements.resourcesGrid.querySelectorAll(".resource-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const resId = btn.getAttribute("data-res-id");
        const res = resources.find(r => r.id === resId);
        showToast(`Redirecting to partner offer: ${res.partner}...`);
      });
    });
  };

  const getResourceIcon = (iconName) => {
    switch (iconName) {
      case "file-text":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
      case "cpu":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
      case "code":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
      case "trending-up":
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`;
      default:
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
    }
  };

  /* ==========================================================================
     6. Side-by-Side Level Comparison & Dual-Offer Showdown Modal
     ========================================================================== */
  const initCompareModal = () => {
    const populateRoleSelect = (el, defaultVal) => {
      el.innerHTML = roles.map(r => `<option value="${r.id}" ${r.id === defaultVal ? "selected" : ""}>${r.title}</option>`).join("");
    };

    const populateLevelSelect = (roleSelectEl, levelSelectEl, defaultLevelCode) => {
      const role = roles.find(r => r.id === roleSelectEl.value) || roles[0];
      levelSelectEl.innerHTML = role.levels.map(l => `<option value="${l.code}">${l.code} &bull; ${l.name}</option>`).join("");
      const hasMatch = role.levels.some(l => l.code === defaultLevelCode);
      if (hasMatch) {
        levelSelectEl.value = defaultLevelCode;
      } else {
        levelSelectEl.value = (role.levels[1] || role.levels[0]).code;
      }
    };

    populateRoleSelect(elements.compareRoleA, "swe");
    populateRoleSelect(elements.compareRoleB, "swe");
    populateLevelSelect(elements.compareRoleA, elements.compareLevelA, "L4");
    populateLevelSelect(elements.compareRoleB, elements.compareLevelB, "L5");

    elements.compareRoleA.addEventListener("change", () => {
      populateLevelSelect(elements.compareRoleA, elements.compareLevelA, "L4");
      renderComparison();
    });

    elements.compareLevelA.addEventListener("change", renderComparison);

    elements.compareRoleB.addEventListener("change", () => {
      populateLevelSelect(elements.compareRoleB, elements.compareLevelB, "L5");
      renderComparison();
    });

    elements.compareLevelB.addEventListener("change", renderComparison);

    // Tab Switching: Bands vs Offers
    if (elements.tabCompareBandsBtn && elements.tabCompareOffersBtn) {
      elements.tabCompareBandsBtn.addEventListener("click", () => {
        elements.tabCompareBandsBtn.classList.add("active");
        elements.tabCompareOffersBtn.classList.remove("active");
        if (elements.compareBandsView) elements.compareBandsView.style.display = "block";
        if (elements.compareOffersView) elements.compareOffersView.style.display = "none";
        renderComparison();
      });

      elements.tabCompareOffersBtn.addEventListener("click", () => {
        elements.tabCompareOffersBtn.classList.add("active");
        elements.tabCompareBandsBtn.classList.remove("active");
        if (elements.compareBandsView) elements.compareBandsView.style.display = "none";
        if (elements.compareOffersView) elements.compareOffersView.style.display = "block";
        renderShowdown();
      });
    }

    // Showdown real-time inputs listener
    const showdownInputs = [
      elements.showdownCompanyA, elements.showdownLocationA, elements.showdownBaseA,
      elements.showdownBonusA, elements.showdownEquityA, elements.showdownSignonA,
      elements.showdownCompanyB, elements.showdownLocationB, elements.showdownBaseB,
      elements.showdownBonusB, elements.showdownEquityB, elements.showdownSignonB
    ];
    showdownInputs.forEach(input => {
      if (input) {
        input.addEventListener("input", renderShowdown);
        input.addEventListener("change", renderShowdown);
      }
    });

    const openModal = () => {
      elements.compareModal.classList.add("open", "active");
      if (elements.tabCompareOffersBtn && elements.tabCompareOffersBtn.classList.contains("active")) {
        renderShowdown();
      } else {
        renderComparison();
      }
    };

    const closeModal = () => {
      elements.compareModal.classList.remove("open", "active");
    };

    elements.navCompareBtn.addEventListener("click", openModal);
    elements.mobileCompareBtn.addEventListener("click", () => {
      elements.mobileDrawer.classList.add("hidden");
      openModal();
    });
    elements.footerCompareTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
    elements.compareModalClose.addEventListener("click", closeModal);

    elements.compareModal.addEventListener("click", (e) => {
      if (e.target === elements.compareModal) closeModal();
    });

    renderComparison();
    renderShowdown();
  };

  const openCompareModalWithRole = (roleId) => {
    elements.compareRoleA.value = roleId;
    const role = roles.find(r => r.id === roleId) || roles[0];
    elements.compareLevelA.innerHTML = role.levels.map(l => `<option value="${l.code}">${l.code} &bull; ${l.name}</option>`).join("");
    elements.compareLevelA.value = role.levels[1] ? role.levels[1].code : role.levels[0].code;

    elements.compareRoleB.value = roleId;
    elements.compareLevelB.innerHTML = role.levels.map(l => `<option value="${l.code}">${l.code} &bull; ${l.name}</option>`).join("");
    elements.compareLevelB.value = role.levels[2] ? role.levels[2].code : role.levels[role.levels.length - 1].code;

    elements.compareModal.classList.add("open");
    renderComparison();
  };

  const renderComparison = () => {
    const roleA = roles.find(r => r.id === elements.compareRoleA.value) || roles[0];
    const levelA = roleA.levels.find(l => l.code === elements.compareLevelA.value) || roleA.levels[0];

    const roleB = roles.find(r => r.id === elements.compareRoleB.value) || roles[0];
    const levelB = roleB.levels.find(l => l.code === elements.compareLevelB.value) || roleB.levels[1];

    const medianA = levelA.base.p50;
    const medianB = levelB.base.p50;
    const delta = medianB - medianA;
    const deltaPct = ((delta / medianA) * 100).toFixed(1);

    const ttcA = medianA + Math.round(medianA * (levelA.bonusPct / 100)) + (levelA.equityAnnual || 0);
    const ttcB = medianB + Math.round(medianB * (levelB.bonusPct / 100)) + (levelB.equityAnnual || 0);
    const ttcDelta = ttcB - ttcA;

    elements.compareResultView.innerHTML = `
      <div style="background: #F8FAFC; border: 1px solid var(--slate-border); border-radius: 12px; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-text-muted); text-transform: uppercase;">Median Base Difference</span>
          <span style="font-size: 1.25rem; font-weight: 800; font-family: var(--font-mono); color: ${delta >= 0 ? 'var(--emerald-dark)' : '#DC2626'}">
            ${delta >= 0 ? '+' : ''}${formatCurrency(delta)} (${delta >= 0 ? '+' : ''}${deltaPct}%)
          </span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem;">
          <span style="color: var(--slate-text-muted);">Total Comp (TTC) Leap:</span>
          <strong style="font-family: var(--font-mono); color: var(--navy-dark);">${delta >= 0 ? '+' : ''}${formatCurrency(ttcDelta)} / yr</strong>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        <!-- Side A -->
        <div style="border: 1px solid var(--slate-border); border-radius: 12px; padding: 1.25rem; background: #FFFFFF;">
          <div style="font-weight: 800; font-size: 1.0625rem; color: var(--navy-dark); margin-bottom: 0.25rem;">${levelA.code} &bull; ${levelA.name}</div>
          <div style="font-size: 0.8125rem; color: var(--slate-text-muted); margin-bottom: 1rem;">${roleA.title} (${levelA.yoe})</div>
          
          <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
            <strong>Base Salary:</strong> <span style="font-family: var(--font-mono);">${formatCurrency(levelA.base.p25)} - ${formatCurrency(levelA.base.p75)}</span>
          </div>
          <div style="font-size: 0.875rem; margin-bottom: 0.75rem;">
            <strong>Target Total Comp:</strong> <span style="font-family: var(--font-mono); font-weight: 700; color: var(--emerald-dark);">${formatCurrency(ttcA)} / yr</span>
          </div>
          
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--slate-text-muted); margin-bottom: 0.35rem;">Key Competencies</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${levelA.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("")}
          </div>
        </div>

        <!-- Side B -->
        <div style="border: 1px solid var(--slate-border); border-radius: 12px; padding: 1.25rem; background: #FFFFFF;">
          <div style="font-weight: 800; font-size: 1.0625rem; color: var(--navy-dark); margin-bottom: 0.25rem;">${levelB.code} &bull; ${levelB.name}</div>
          <div style="font-size: 0.8125rem; color: var(--slate-text-muted); margin-bottom: 1rem;">${roleB.title} (${levelB.yoe})</div>
          
          <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
            <strong>Base Salary:</strong> <span style="font-family: var(--font-mono);">${formatCurrency(levelB.base.p25)} - ${formatCurrency(levelB.base.p75)}</span>
          </div>
          <div style="font-size: 0.875rem; margin-bottom: 0.75rem;">
            <strong>Target Total Comp:</strong> <span style="font-family: var(--font-mono); font-weight: 700; color: var(--emerald-dark);">${formatCurrency(ttcB)} / yr</span>
          </div>
          
          <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--slate-text-muted); margin-bottom: 0.35rem;">Key Competencies</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${levelB.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  };

  const renderShowdown = () => {
    if (!elements.showdownResultsContainer) return;

    const companyA = (elements.showdownCompanyA && elements.showdownCompanyA.value.trim()) || "Offer A";
    const baseA = Number(elements.showdownBaseA && elements.showdownBaseA.value) || 0;
    const bonusPctA = Number(elements.showdownBonusA && elements.showdownBonusA.value) || 0;
    const equityA = Number(elements.showdownEquityA && elements.showdownEquityA.value) || 0;
    const signonA = Number(elements.showdownSignonA && elements.showdownSignonA.value) || 0;
    const taxRateA = Number(elements.showdownLocationA && elements.showdownLocationA.value) || 0;

    const companyB = (elements.showdownCompanyB && elements.showdownCompanyB.value.trim()) || "Offer B";
    const baseB = Number(elements.showdownBaseB && elements.showdownBaseB.value) || 0;
    const bonusPctB = Number(elements.showdownBonusB && elements.showdownBonusB.value) || 0;
    const equityB = Number(elements.showdownEquityB && elements.showdownEquityB.value) || 0;
    const signonB = Number(elements.showdownSignonB && elements.showdownSignonB.value) || 0;
    const taxRateB = Number(elements.showdownLocationB && elements.showdownLocationB.value) || 0;

    // Calculations Offer A
    const annualBonusA = baseA * (bonusPctA / 100);
    const annualEquityA = equityA / 4;
    const y1A = baseA + annualBonusA + annualEquityA + signonA;
    const y2A = baseA + annualBonusA + annualEquityA;
    const gross4YrA = y1A + (y2A * 3);
    const taxDrag4YrA = gross4YrA * (taxRateA / 100);
    const net4YrA = gross4YrA - taxDrag4YrA;

    // Calculations Offer B
    const annualBonusB = baseB * (bonusPctB / 100);
    const annualEquityB = equityB / 4;
    const y1B = baseB + annualBonusB + annualEquityB + signonB;
    const y2B = baseB + annualBonusB + annualEquityB;
    const gross4YrB = y1B + (y2B * 3);
    const taxDrag4YrB = gross4YrB * (taxRateB / 100);
    const net4YrB = gross4YrB - taxDrag4YrB;

    const netDelta = net4YrB - net4YrA;
    const isWinnerB = netDelta >= 0;
    const winnerCompany = isWinnerB ? companyB : companyA;
    const loserCompany = isWinnerB ? companyA : companyB;
    const absNetDelta = Math.abs(netDelta);

    let cliffNote = "";
    if (signonA > signonB && isWinnerB) {
      cliffNote = `${companyA} has a -$${Math.round(signonA).toLocaleString()} cliff in Year 2, whereas ${companyB} sustains higher recurring baseline earnings.`;
    } else if (signonB > signonA && !isWinnerB) {
      cliffNote = `${companyB} has a -$${Math.round(signonB).toLocaleString()} cliff in Year 2, whereas ${companyA} sustains higher recurring baseline earnings.`;
    }

    elements.showdownResultsContainer.innerHTML = `
      <div class="showdown-verdict-banner">
        <div class="showdown-verdict-icon">🏆</div>
        <div>
          <div class="showdown-verdict-title">Showdown Verdict: ${winnerCompany} Leads by +${formatCurrency(absNetDelta)}</div>
          <p class="showdown-verdict-desc">
            Over a 4-year horizon, <strong>${winnerCompany}</strong> generates <strong>+${formatCurrency(absNetDelta)}</strong> more in estimated post-tax net wealth compared to ${loserCompany}. ${cliffNote}
          </p>
        </div>
      </div>

      <div style="border: 1px solid var(--slate-border); border-radius: 8px; overflow-x: auto; background: #FFFFFF; margin-bottom: 1rem;">
        <table class="showdown-table">
          <thead>
            <tr>
              <th>Metric / Dimension</th>
              <th>${companyA}</th>
              <th>${companyB}</th>
              <th>Comparison Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Base Salary</strong></td>
              <td class="${baseA >= baseB ? 'winner-val' : ''}">${formatCurrency(baseA)}</td>
              <td class="${baseB >= baseA ? 'winner-val' : ''}">${formatCurrency(baseB)}</td>
              <td>${baseB >= baseA ? `+${formatCurrency(baseB - baseA)} (${companyB})` : `+${formatCurrency(baseA - baseB)} (${companyA})`}</td>
            </tr>
            <tr>
              <td><strong>Annual Performance Bonus</strong></td>
              <td>${bonusPctA}% (${formatCurrency(annualBonusA)})</td>
              <td>${bonusPctB}% (${formatCurrency(annualBonusB)})</td>
              <td>${annualBonusB >= annualBonusA ? `+${formatCurrency(annualBonusB - annualBonusA)}` : `+${formatCurrency(annualBonusA - annualBonusB)}`}</td>
            </tr>
            <tr>
              <td><strong>4-Year Equity Grant (Total)</strong></td>
              <td class="${equityA >= equityB ? 'winner-val' : ''}">${formatCurrency(equityA)}</td>
              <td class="${equityB >= equityA ? 'winner-val' : ''}">${formatCurrency(equityB)}</td>
              <td>${equityB >= equityA ? `+${formatCurrency(equityB - equityA)} (${companyB})` : `+${formatCurrency(equityA - equityB)} (${companyA})`}</td>
            </tr>
            <tr>
              <td><strong>Year 1 Cash Signing Bonus</strong></td>
              <td>${formatCurrency(signonA)}</td>
              <td>${formatCurrency(signonB)}</td>
              <td>${signonA !== signonB ? `${signonA > signonB ? companyA : companyB} upfront cliff` : 'Equal'}</td>
            </tr>
            <tr style="background: rgba(16, 185, 129, 0.05);">
              <td><strong>Year 1 Total Comp (Gross)</strong></td>
              <td class="${y1A >= y1B ? 'winner-val' : ''}"><strong>${formatCurrency(y1A)}</strong></td>
              <td class="${y1B >= y1A ? 'winner-val' : ''}"><strong>${formatCurrency(y1B)}</strong></td>
              <td><strong>${y1B >= y1A ? `+${formatCurrency(y1B - y1A)}` : `+${formatCurrency(y1A - y1B)}`}</strong></td>
            </tr>
            <tr>
              <td><strong>Year 2–4 Recurring Comp (Normalized)</strong></td>
              <td class="${y2A >= y2B ? 'winner-val' : ''}">${formatCurrency(y2A)} / yr</td>
              <td class="${y2B >= y2A ? 'winner-val' : ''}">${formatCurrency(y2B)} / yr</td>
              <td>${y2B >= y2A ? `+${formatCurrency(y2B - y2A)} / yr` : `+${formatCurrency(y2A - y2B)} / yr`}</td>
            </tr>
            <tr>
              <td><strong>4-Year Cumulative Gross Comp</strong></td>
              <td class="${gross4YrA >= gross4YrB ? 'winner-val' : ''}">${formatCurrency(gross4YrA)}</td>
              <td class="${gross4YrB >= gross4YrA ? 'winner-val' : ''}">${formatCurrency(gross4YrB)}</td>
              <td>${gross4YrB >= gross4YrA ? `+${formatCurrency(gross4YrB - gross4YrA)}` : `+${formatCurrency(gross4YrA - gross4YrB)}`}</td>
            </tr>
            <tr>
              <td><strong>Est. 4-Year State Tax Drag</strong></td>
              <td style="color: #DC2626;">-${formatCurrency(taxDrag4YrA)} (${taxRateA}%)</td>
              <td style="color: #DC2626;">-${formatCurrency(taxDrag4YrB)} (${taxRateB}%)</td>
              <td style="color: var(--emerald-dark); font-weight: 700;">${taxDrag4YrA > taxDrag4YrB ? `Save +${formatCurrency(taxDrag4YrA - taxDrag4YrB)} in ${companyB}` : `Save +${formatCurrency(taxDrag4YrB - taxDrag4YrA)} in ${companyA}`}</td>
            </tr>
            <tr style="background: rgba(10, 17, 40, 0.05); font-weight: 800;">
              <td><strong>4-Year Net Wealth Surplus (Est.)</strong></td>
              <td class="${net4YrA >= net4YrB ? 'winner-val' : ''}" style="font-size: 0.9375rem;">${formatCurrency(net4YrA)}</td>
              <td class="${net4YrB >= net4YrA ? 'winner-val' : ''}" style="font-size: 0.9375rem;">${formatCurrency(net4YrB)}</td>
              <td style="color: var(--emerald-dark); font-size: 0.9375rem;">+${formatCurrency(absNetDelta)} (${winnerCompany})</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background: var(--slate-surface); border-left: 3px solid var(--emerald-primary); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.8125rem; color: var(--slate-text); line-height: 1.5;">
        <strong>Tactical Negotiation Play:</strong> Counter <strong>${loserCompany}</strong> citing ${winnerCompany}'s superior ${equityB > equityA ? 'equity package' : 'take-home wealth'}. Ask ${loserCompany} to match ${winnerCompany}'s numbers to secure your immediate acceptance.
      </div>
    `;
  };

  /* ==========================================================================
     7. Mobile Navigation & Currency Switcher
     ========================================================================== */
  const initNavigation = () => {
    // Currency Switcher sync
    const handleCurrencyChange = (newCurr) => {
      state.currency = newCurr;
      if (elements.currencySelector) elements.currencySelector.value = newCurr;
      if (elements.mobileCurrencySelector) elements.mobileCurrencySelector.value = newCurr;

      const info = getCurrencyInfo();
      if (elements.currencySymbol) {
        elements.currencySymbol.textContent = info.symbol;
      }

      runTrajectoryCalculations();
      renderCareerDirectory();
      renderComparison();
      renderActivePlaybookScenario();

      showToast(`Switched currency to ${info.code} (${info.symbol})`);
    };

    if (elements.currencySelector) {
      elements.currencySelector.addEventListener("change", (e) => handleCurrencyChange(e.target.value));
    }

    if (elements.mobileCurrencySelector) {
      elements.mobileCurrencySelector.addEventListener("change", (e) => handleCurrencyChange(e.target.value));
    }

    // Mobile hamburger menu toggle
    elements.mobileMenuBtn.addEventListener("click", () => {
      const isHidden = elements.mobileDrawer.classList.toggle("hidden");
      elements.mobileMenuBtn.setAttribute("aria-expanded", String(!isHidden));
    });

    elements.mobileDrawer.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        elements.mobileDrawer.classList.add("hidden");
        elements.mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });

    document.querySelectorAll(".footer-role-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const roleId = link.getAttribute("data-role");
        selectRoleAndNavigate(roleId);
      });
    });

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links .nav-link");

    window.addEventListener("scroll", () => {
      let currentSectionId = "";
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    });
  };

  /* HTML Escape Utility */
  const escapeHtml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  /* ==========================================================================
     Offer Evaluator & Counter-Offer Generator
     ========================================================================== */
  const initOfferEvaluator = () => {
    if (!elements.evalRoleSelect) return;

    // Populate role and level selector
    const options = [];
    roles.forEach(r => {
      r.levels.forEach(l => {
        options.push(`<option value="${r.id}_${l.code}" ${r.id === "swe" && l.code === "L5" ? "selected" : ""}>${r.title} — ${l.code} (${l.name})</option>`);
      });
    });
    elements.evalRoleSelect.innerHTML = options.join("");

    const calculateEvaluation = () => {
      const base = Number(elements.evalBaseSalary.value) || 0;
      const bonusPct = Number(elements.evalBonusPct.value) || 0;
      const equityTotal = Number(elements.evalEquityTotal.value) || 0;
      const signon = Number(elements.evalSignonBonus.value) || 0;
      const competing = Number(elements.evalCompetingOffer.value) || 0;
      const company = (elements.evalCompany.value || "").trim() || "the hiring team";

      const annualBonus = base * (bonusPct / 100);
      const annualEquity = equityTotal / 4;
      const year1TC = base + annualBonus + annualEquity + signon;
      const year2TC = base + annualBonus + annualEquity;
      const cliffDiff = signon;

      elements.evalYear1TC.textContent = formatCurrency(year1TC);
      elements.evalYear2TC.textContent = formatCurrency(year2TC);

      if (cliffDiff > 0) {
        elements.evalCliffDiff.textContent = `-${formatCurrency(cliffDiff)} drop in Year 2`;
        elements.evalCliffAlert.style.display = "flex";
        elements.evalCliffText.innerHTML = `<strong>Sign-On Cliff Detected:</strong> Total compensation drops by <span style="font-family: var(--font-mono); font-weight: 700;">${formatCurrency(cliffDiff)}</span> in Year 2 because the sign-on bonus is non-recurring. Propose an equity refresh or Year 2 retention bonus to bridge this gap.`;
      } else {
        elements.evalCliffDiff.textContent = "Stable annual recurring comp";
        elements.evalCliffAlert.style.display = "none";
      }

      // Percentile lookup
      const [roleId, levelCode] = (elements.evalRoleSelect.value || "swe_L5").split("_");
      const role = roles.find(r => r.id === roleId) || roles[0];
      const level = role.levels.find(l => l.code === levelCode) || role.levels[2] || role.levels[0];

      const p25TC = level.base.p25 * (1 + (level.bonusPct || 10) / 100) + (level.equityAnnual || 0);
      const p50TC = level.base.p50 * (1 + (level.bonusPct || 10) / 100) + (level.equityAnnual || 0);
      const p75TC = level.base.p75 * (1 + (level.bonusPct || 10) / 100) + (level.equityAnnual || 0);
      const p90TC = level.base.p90 * (1 + (level.bonusPct || 10) / 100) + (level.equityAnnual || 0);

      elements.evalTickP25.textContent = `25th: ${formatCurrency(p25TC)}`;
      elements.evalTickP50.textContent = `50th: ${formatCurrency(p50TC)}`;
      elements.evalTickP75.textContent = `75th: ${formatCurrency(p75TC)}`;
      elements.evalTickP90.textContent = `90th: ${formatCurrency(p90TC)}`;

      let pctRank = 50;
      if (year1TC <= p25TC) {
        pctRank = Math.max(10, Math.round((year1TC / p25TC) * 25));
      } else if (year1TC <= p50TC) {
        pctRank = Math.round(25 + ((year1TC - p25TC) / (p50TC - p25TC)) * 25);
      } else if (year1TC <= p75TC) {
        pctRank = Math.round(50 + ((year1TC - p50TC) / (p75TC - p50TC)) * 25);
      } else if (year1TC <= p90TC) {
        pctRank = Math.round(75 + ((year1TC - p75TC) / (p90TC - p75TC)) * 15);
      } else {
        pctRank = Math.min(99, Math.round(90 + ((year1TC - p90TC) / (p90TC * 0.3)) * 9));
      }

      elements.evalPercentileRank.textContent = `${pctRank}th %ile`;
      elements.evalPercentileBar.style.width = `${Math.min(100, Math.max(5, pctRank))}%`;
      elements.evalPercentileBadge.textContent = pctRank >= 75 ? `Top ${100 - pctRank}% Tier Offer` : (pctRank >= 50 ? "Competitive Market Median" : "Below Market Median - Negotiate Up");
      elements.evalBenchmarkLabel.textContent = `${role.title} (${level.code})`;

      // Vesting schedule
      const vestingYears = [
        { year: "Year 1", cash: base + annualBonus + signon, equity: annualEquity },
        { year: "Year 2", cash: base + annualBonus, equity: annualEquity },
        { year: "Year 3", cash: base + annualBonus, equity: annualEquity },
        { year: "Year 4", cash: base + annualBonus, equity: annualEquity }
      ];

      elements.evalVestingGrid.innerHTML = vestingYears.map(v => `
        <div class="vesting-card">
          <div class="vesting-year">${v.year}</div>
          <div class="vesting-cash">${formatCurrency(v.cash)}</div>
          <div class="vesting-equity">+${formatCurrency(v.equity)} Equity</div>
        </div>
      `).join("");

      // Offer Leverage & Rescission Risk Diagnostic Calculation
      const sourceType = (elements.evalSourceSelect && elements.evalSourceSelect.value) || "inbound";
      const pipelineType = (elements.evalPipelineSelect && elements.evalPipelineSelect.value) || "competing";
      const timelineType = (elements.evalTimelineSelect && elements.evalTimelineSelect.value) || "flexible";

      let leverageScore = 40;
      if (sourceType === "inbound") leverageScore += 25;
      else if (sourceType === "referral") leverageScore += 15;
      else if (sourceType === "direct") leverageScore += 5;

      if (pipelineType === "competing") leverageScore += 30;
      else if (pipelineType === "final_rounds") leverageScore += 18;
      else if (pipelineType === "sole") leverageScore += 8;
      else if (pipelineType === "urgent") leverageScore -= 10;

      if (timelineType === "flexible") leverageScore += 10;
      else if (timelineType === "standard") leverageScore += 5;
      else if (timelineType === "exploding") leverageScore -= 5;

      if (year1TC < p50TC) leverageScore += 10;
      else if (year1TC >= p75TC) leverageScore -= 5;

      leverageScore = Math.min(98, Math.max(18, leverageScore));

      let rescissionRisk = "Rescission Risk: < 0.2% (Safe)";
      let leverageLabel = "Dominant Leverage Position";
      let leverageAdvice = "You hold dominant negotiating leverage. Sunk hiring costs and competing alternatives mean the recruiter is motivated to retain you. Counter confidently for a 12–15% package bump and an equity refresher commitment.";

      if (leverageScore >= 80) {
        rescissionRisk = "Rescission Risk: < 0.2% (Safe)";
        leverageLabel = "High Leverage Position";
        leverageAdvice = "You hold dominant negotiating leverage. Sunk hiring costs and competing options mean the recruiter is motivated to retain you. Counter confidently for a 12–15% package bump and an equity refresher commitment.";
      } else if (leverageScore >= 60) {
        rescissionRisk = "Rescission Risk: < 0.8% (Negligible)";
        leverageLabel = "Solid Leverage Foundation";
        leverageAdvice = "You hold solid negotiation leverage. Anchor strictly on third-party market data (Levels.fyi / Radford P75) and request a sign-on bonus bridge or review schedule to protect against the Year 2 cliff.";
      } else {
        rescissionRisk = "Rescission Risk: ~2.1% (Collaborative Stance)";
        leverageLabel = "Delicate / Exploratory Leverage";
        leverageAdvice = "Approach with an inquisitive, collaborative posture rather than firm ultimatums. Express genuine enthusiasm, highlight specific impact areas, and ask if there is flexibility on signing incentives or early performance reviews.";
      }

      if (elements.evalLeverageScoreBadge) {
        elements.evalLeverageScoreBadge.textContent = `Leverage: ${leverageScore} / 100`;
      }
      if (elements.evalRiskScoreBadge) {
        elements.evalRiskScoreBadge.textContent = rescissionRisk;
      }
      if (elements.evalLeverageBar) {
        elements.evalLeverageBar.style.width = `${leverageScore}%`;
      }
      if (elements.evalLeverageAdvice) {
        elements.evalLeverageAdvice.innerHTML = `<strong>Diagnostic Recommendation (${leverageLabel}):</strong> ${leverageAdvice}`;
      }

      // Counter-Offer Email Script
      const targetAnchor = Math.max(competing, Math.round(year1TC * 1.12 / 1000) * 1000);
      const counterBaseTarget = Math.round(base * 1.08 / 1000) * 1000;
      const counterEquityTarget = Math.round((equityTotal + (cliffDiff > 0 ? cliffDiff * 2 : 40000)) / 1000) * 1000;

      let pipelineClause = "";
      if (competing > 0) {
        pipelineClause = `\n2. Competing Consideration: I am concurrently evaluating an active competing offer calibrated at approximately ${formatCurrency(competing)} Year 1 total compensation.`;
      } else if (pipelineType === "final_rounds") {
        pipelineClause = `\n2. Pipeline Context: I am currently in final-round discussions for a peer role, but ${company} remains my unequivocal top preference.`;
      }

      const emailScript = `Dear ${company} Recruiting Team,

Thank you so much for extending the written offer for the ${level.name} (${level.code}) opportunity. I loved discussing the team's engineering standards and 2026 technical vision throughout the interview process.

After analyzing the total compensation structure and calibrating against market benchmarks for this leveling scope, I would like to propose a tailored adjustment to bring our numbers into optimal alignment:

1. Base Salary: Proposing an adjustment from ${formatCurrency(base)} to ${formatCurrency(counterBaseTarget)}, reflecting my track record in high-leverage execution.${pipelineClause}
${pipelineClause ? "3" : "2"}. Equity & Retention Alignment: Looking at the 4-year schedule, there is a ${formatCurrency(cliffDiff)} step-down in Year 2 when the sign-on bonus concludes. To ensure steady year-over-year compensation, I would welcome either increasing the 4-year equity grant from ${formatCurrency(equityTotal)} to ${formatCurrency(counterEquityTarget)} or structuring an agreed Year 2 retention grant.

${company} is my unequivocal top choice. If we can solidify these adjustments to reach approximately ${formatCurrency(targetAnchor)} in Year 1 total compensation, I am prepared to sign the offer letter immediately and withdraw from all other interview loops.

Thank you again for your partnership and advocacy throughout this process. I look forward to finalizing our start date!

Warm regards,
[Your Name]`;

      elements.counterEmailPre.textContent = emailScript;
    };

    // Event listeners
    [
      elements.evalRoleSelect, elements.evalBaseSalary, elements.evalBonusPct,
      elements.evalEquityTotal, elements.evalSignonBonus, elements.evalCompetingOffer,
      elements.evalCompany, elements.evalSourceSelect, elements.evalPipelineSelect, elements.evalTimelineSelect
    ].forEach(input => {
      if (input) input.addEventListener("input", calculateEvaluation);
      if (input) input.addEventListener("change", calculateEvaluation);
    });

    if (elements.evalRecalculateBtn) {
      elements.evalRecalculateBtn.addEventListener("click", () => {
        calculateEvaluation();
        showToast("Offer evaluated and counter-offer letter generated!");
      });
    }

    if (elements.copyCounterEmailBtn) {
      elements.copyCounterEmailBtn.addEventListener("click", () => {
        const text = elements.counterEmailPre.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            showToast("Counter-offer email script copied to clipboard!");
          });
        }
      });
    }

    if (elements.evalPrintBtn) {
      elements.evalPrintBtn.addEventListener("click", () => {
        const company = (elements.evalCompany.value || "").trim() || "Target Employer";
        const roleLevel = elements.evalBenchmarkLabel ? elements.evalBenchmarkLabel.textContent : "Software Engineer";
        const y1 = elements.evalYear1TC ? elements.evalYear1TC.textContent : "$0";
        const y2 = elements.evalYear2TC ? elements.evalYear2TC.textContent : "$0";
        const cliff = elements.evalCliffDiff ? elements.evalCliffDiff.textContent : "Stable";
        const percentile = elements.evalPercentileRank ? elements.evalPercentileRank.textContent : "50th";
        const leverage = elements.evalLeverageScoreBadge ? elements.evalLeverageScoreBadge.textContent : "Leverage: 80/100";
        const risk = elements.evalRiskScoreBadge ? elements.evalRiskScoreBadge.textContent : "Risk: Safe";
        const advice = elements.evalLeverageAdvice ? elements.evalLeverageAdvice.innerHTML : "";
        const email = elements.counterEmailPre ? elements.counterEmailPre.textContent : "";
        const vestingHtml = elements.evalVestingGrid ? elements.evalVestingGrid.innerHTML : "";

        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (!printWindow) {
          window.print();
          return;
        }

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Executive Job Offer Evaluation Dossier — ${company} — SalaryPathGuide</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0F172A; padding: 2rem; margin: 0; line-height: 1.5; font-size: 10pt; }
              .header { background: #0A1128 !important; color: #FFFFFF !important; padding: 1.25rem 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .header-badge { font-size: 8pt; font-weight: bold; color: #10B981 !important; text-transform: uppercase; margin-bottom: 0.25rem; }
              .header-title { font-size: 15pt; font-weight: 800; margin: 0; color: #FFFFFF !important; }
              .meta-row { display: flex; gap: 1.5rem; font-size: 8.5pt; color: #CBD5E1 !important; margin-top: 0.5rem; }
              .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
              .kpi-card { border: 1px solid #CBD5E1; background: #F8FAFC !important; border-radius: 6px; padding: 0.85rem; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .kpi-val { font-size: 14pt; font-weight: 800; color: #0A1128; font-family: monospace; }
              .kpi-label { font-size: 8pt; text-transform: uppercase; color: #64748B; font-weight: 600; margin-top: 0.2rem; }
              .section-box { border: 1px solid #CBD5E1; border-radius: 6px; padding: 1rem; margin-bottom: 1.25rem; page-break-inside: avoid; }
              .section-title { font-size: 10.5pt; font-weight: 800; color: #0A1128; margin: 0 0 0.5rem 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.35rem; }
              .vesting-timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
              .vesting-card { background: #F8FAFC !important; border: 1px solid #CBD5E1; padding: 0.5rem; text-align: center; border-radius: 4px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .vesting-year { font-size: 7.5pt; font-weight: bold; color: #64748B; }
              .vesting-cash { font-size: 9.5pt; font-weight: bold; color: #0A1128; font-family: monospace; }
              .vesting-equity { font-size: 7.5pt; color: #059669 !important; font-weight: 600; }
              pre { background: #F8FAFC !important; border: 1px solid #CBD5E1; padding: 0.85rem; border-radius: 4px; font-family: monospace; font-size: 8pt; white-space: pre-wrap; margin: 0; }
              .footer { text-align: center; font-size: 7.5pt; color: #94A3B8; margin-top: 2rem; border-top: 1px solid #E2E8F0; padding-top: 0.75rem; }
              @page { margin: 1.2cm; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-badge">Confidential Candidate Compensation Intelligence Dossier</div>
              <h1 class="header-title">${company} Written Offer Analysis</h1>
              <div class="meta-row">
                <span><strong>Role / Level:</strong> ${roleLevel}</span>
                <span><strong>Market Percentile:</strong> ${percentile}</span>
                <span><strong>Evaluation Date:</strong> ${new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-val">${y1}</div>
                <div class="kpi-label">Year 1 Total Comp</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-val">${y2}</div>
                <div class="kpi-label">Year 2–4 Normalized (${cliff})</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-val" style="color: #059669;">${leverage}</div>
                <div class="kpi-label">${risk}</div>
              </div>
            </div>

            <div class="section-box">
              <div class="section-title">4-Year Vesting &amp; Cashflow Schedule</div>
              <div class="vesting-timeline-grid">${vestingHtml}</div>
            </div>

            <div class="section-box">
              <div class="section-title">Negotiation Leverage &amp; Tactical Guidance</div>
              <div style="font-size: 8.5pt; color: #334155; line-height: 1.5;">${advice}</div>
            </div>

            <div class="section-box">
              <div class="section-title">Tailored Counter-Offer Proposal Letter</div>
              <pre>${email}</pre>
            </div>

            <div class="footer">
              &copy; 2026 SalaryPathGuide.com &bull; Certified Compensation Intelligence Engine &bull; Confidential
            </div>
            <script>
              window.onload = function() { window.print(); };
            <\/script>
          </body>
          </html>
        `);
        printWindow.document.close();
      });
    }

    calculateEvaluation();
  };

  /* ==========================================================================
     Cross-Company Leveling Equivalence Matrix
     ========================================================================== */
  const initLevelingMatrix = () => {
    if (!elements.viewModeLaddersBtn || !elements.viewModeMatrixBtn) return;

    elements.viewModeLaddersBtn.addEventListener("click", () => {
      elements.viewModeLaddersBtn.classList.add("active");
      elements.viewModeMatrixBtn.classList.remove("active");
      elements.careerRolesContainer.style.display = "block";
      if (elements.directoryToolbar) elements.directoryToolbar.style.display = "flex";
      elements.crossCompanyMatrixContainer.style.display = "none";
    });

    elements.viewModeMatrixBtn.addEventListener("click", () => {
      elements.viewModeMatrixBtn.classList.add("active");
      elements.viewModeLaddersBtn.classList.remove("active");
      elements.careerRolesContainer.style.display = "none";
      if (elements.directoryToolbar) elements.directoryToolbar.style.display = "none";
      elements.crossCompanyMatrixContainer.style.display = "block";
    });

    // Populate matrix table
    const matrix = (window.CAREER_DATA && window.CAREER_DATA.companyEquivalence) || [];
    elements.matrixTableBody.innerHTML = matrix.map(m => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--navy-dark);">${m.standardLevel}</div>
          <div style="font-size: 0.75rem; color: var(--slate-text-muted); margin-top: 0.25rem;">${m.scope}</div>
        </td>
        <td><span class="matrix-level-badge">${m.google}</span></td>
        <td><span class="matrix-level-badge">${m.meta}</span></td>
        <td><span class="matrix-level-badge">${m.amazon}</span></td>
        <td><span class="matrix-level-badge">${m.microsoft}</span></td>
        <td><span class="matrix-level-badge">${m.apple}</span></td>
        <td><span class="matrix-level-badge">${m.finance} / ${m.legal}</span></td>
        <td><span class="matrix-level-badge">${m.healthcare}</span></td>
        <td><span class="matrix-comp-badge">${m.medianTC}</span></td>
      </tr>
    `).join("");
  };

  /* ==========================================================================
     Cost-of-Living & Geo-Arbitrage Relocation Calculator
     ========================================================================== */
  const initGeoArbitrage = () => {
    if (!elements.geoArbitrageTriggerBtn || !elements.arbitrageModal) return;

    const cities = (window.CAREER_DATA && window.CAREER_DATA.geoArbitrage && window.CAREER_DATA.geoArbitrage.cities) || [];

    // Populate dropdowns
    elements.arbOriginCity.innerHTML = cities.map(c => `<option value="${c.id}" ${c.id === "sf" ? "selected" : ""}>${c.name} (${c.tag})</option>`).join("");
    elements.arbDestCity.innerHTML = cities.map(c => `<option value="${c.id}" ${c.id === "atx" ? "selected" : ""}>${c.name} (${c.tag})</option>`).join("");

    const updateArbitrage = () => {
      const originId = elements.arbOriginCity.value;
      const destId = elements.arbDestCity.value;
      const salary = Number(elements.arbSalary.value) || 185000;

      const origin = cities.find(c => c.id === originId) || cities[0];
      const dest = cities.find(c => c.id === destId) || cities[3];

      const taxSavings = salary * ((origin.stateTax - dest.stateTax) / 100);
      const colRatio = dest.colIndex / origin.colIndex;
      const equivalentSalary = Math.round(salary * colRatio);
      const annualPurchasingAdvantage = salary - equivalentSalary;
      const fiveYearWealthSurplus = Math.max(0, Math.round((annualPurchasingAdvantage + Math.max(0, taxSavings)) * 5));

      elements.arbitrageResultsContainer.innerHTML = `
        <div class="arbitrage-card">
          <div class="arbitrage-comparison-grid">
            <div class="arbitrage-city-box">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-text-muted); text-transform: uppercase;">Origin Metro</div>
              <div style="font-weight: 800; font-size: 1.125rem; color: var(--navy-dark); margin: 0.25rem 0 0.75rem;">${origin.name}</div>
              <div class="arbitrage-stat-row">
                <span>State Income Tax:</span>
                <strong style="color: #EF4444;">${origin.stateTax}%</strong>
              </div>
              <div class="arbitrage-stat-row">
                <span>Cost of Living Index:</span>
                <strong>${origin.colIndex} / 100</strong>
              </div>
              <div class="arbitrage-stat-row">
                <span>Median Home Price:</span>
                <strong>${origin.housingMedian}</strong>
              </div>
            </div>

            <div class="arbitrage-city-box">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--slate-text-muted); text-transform: uppercase;">Destination Metro</div>
              <div style="font-weight: 800; font-size: 1.125rem; color: var(--navy-dark); margin: 0.25rem 0 0.75rem;">${dest.name}</div>
              <div class="arbitrage-stat-row">
                <span>State Income Tax:</span>
                <strong style="color: var(--emerald-dark);">${dest.stateTax}%</strong>
              </div>
              <div class="arbitrage-stat-row">
                <span>Cost of Living Index:</span>
                <strong>${dest.colIndex} / 100</strong>
              </div>
              <div class="arbitrage-stat-row">
                <span>Median Home Price:</span>
                <strong>${dest.housingMedian}</strong>
              </div>
            </div>
          </div>

          <div style="margin-top: 1.25rem; padding: 1.25rem; background: #F8FAFC; border-radius: var(--radius-md); border: 1px solid var(--slate-border);">
            <div style="font-weight: 700; font-size: 0.9375rem; color: var(--navy-dark); margin-bottom: 0.5rem;">
              Purchasing Power &amp; Tax Summary
            </div>
            <p style="font-size: 0.875rem; color: var(--slate-text-main); line-height: 1.6;">
              A <strong>${formatCurrency(salary)}</strong> compensation in <strong>${origin.name}</strong> only requires <strong>${formatCurrency(equivalentSalary)}</strong> in <strong>${dest.name}</strong> to afford the same lifestyle.
              ${taxSavings > 0 ? ` Relocating saves approximately <strong style="color: var(--emerald-dark);">${formatCurrency(taxSavings)} / year</strong> in state income taxes alone.` : ""}
            </p>
            <div class="arbitrage-surplus-badge">
              🚀 Estimated 5-Year Geo-Arbitrage Wealth Surplus: +${formatCurrency(fiveYearWealthSurplus)}
            </div>
          </div>
        </div>
      `;
    };

    elements.geoArbitrageTriggerBtn.addEventListener("click", () => {
      elements.arbitrageModal.classList.add("open");
      elements.arbitrageModal.classList.add("active");
      updateArbitrage();
    });

    elements.arbitrageModalClose.addEventListener("click", () => {
      elements.arbitrageModal.classList.remove("open");
      elements.arbitrageModal.classList.remove("active");
    });

    elements.arbitrageModal.addEventListener("click", (e) => {
      if (e.target === elements.arbitrageModal) {
        elements.arbitrageModal.classList.remove("open");
        elements.arbitrageModal.classList.remove("active");
      }
    });

    elements.arbOriginCity.addEventListener("change", updateArbitrage);
    elements.arbDestCity.addEventListener("change", updateArbitrage);
    elements.arbSalary.addEventListener("input", updateArbitrage);
  };

  /* ==========================================================================
     Submit Anonymous Offer Modal & Community Ticker
     ========================================================================== */
  const initSubmitOfferModal = () => {
    if (!elements.submitOfferModal) return;

    // Populate roles dropdown in modal
    if (elements.subRole) {
      elements.subRole.innerHTML = roles.map(r => `<option value="${r.title}">${r.title} (${r.category})</option>`).join("");
    }

    const openModal = () => {
      elements.submitOfferModal.classList.add("open");
      elements.submitOfferModal.classList.add("active");
    };

    const closeModal = () => {
      elements.submitOfferModal.classList.remove("open");
      elements.submitOfferModal.classList.remove("active");
    };

    if (elements.navSubmitOfferBtn) {
      elements.navSubmitOfferBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
    if (elements.mobileSubmitOfferBtn) {
      elements.mobileSubmitOfferBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (elements.mobileDrawer) elements.mobileDrawer.classList.add("hidden");
        openModal();
      });
    }
    if (elements.footerSubmitOfferTrigger) {
      elements.footerSubmitOfferTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }

    if (elements.submitOfferModalClose) {
      elements.submitOfferModalClose.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    }
    if (elements.submitOfferCancelBtn) {
      elements.submitOfferCancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    elements.submitOfferModal.addEventListener("click", (e) => {
      if (e.target === elements.submitOfferModal) {
        closeModal();
      }
    });

    // Delegated click listener as fail-safe for modal triggers
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("#navSubmitOfferBtn, #mobileSubmitOfferBtn, #footerSubmitOfferTrigger");
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    // Escape key listener to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        if (elements.arbitrageModal) {
          elements.arbitrageModal.classList.remove("open");
          elements.arbitrageModal.classList.remove("active");
        }
        if (elements.compareModal) {
          elements.compareModal.classList.remove("open");
        }
      }
    });

    if (elements.submitOfferForm) {
      elements.submitOfferForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const comp = (elements.subCompany && elements.subCompany.value.trim()) || "Anonymous Tech";
        const role = (elements.subRole && elements.subRole.value) || "Software Engineer";
        const lvl = (elements.subLevel && elements.subLevel.value.trim()) || "L4";
        const loc = (elements.subLocation && elements.subLocation.value.trim()) || "US";
        const base = Number(elements.subBase && elements.subBase.value) || 150000;
        const bonusPct = Number(elements.subBonus && elements.subBonus.value) || 0;
        const equity = Number(elements.subEquity && elements.subEquity.value) || 0;
        const signon = Number(elements.subSignon && elements.subSignon.value) || 0;
        const notes = (elements.subNotes && elements.subNotes.value.trim()) || "";
        const firstYearTC = Math.round(base + (base * (bonusPct / 100)) + (equity / 4) + signon);

        const payload = {
          timestamp: new Date().toISOString(),
          company: comp,
          role: role,
          level: lvl,
          location: loc,
          baseSalary: base,
          bonusPct: bonusPct,
          equity: equity,
          signon: signon,
          totalCompYear1: firstYearTC,
          notes: notes
        };

        // 1. Instant local persistence in visitor's localStorage
        try {
          const stored = JSON.parse(localStorage.getItem("spg_submissions") || "[]");
          stored.unshift(payload);
          localStorage.setItem("spg_submissions", JSON.stringify(stored.slice(0, 100)));
        } catch (storageErr) {}

        // 2. Dispatch to Google Sheets Webhook in background (no-cors mode for Apps Script redirect)
        const webhookUrl = GOOGLE_SHEET_WEBHOOK_URL || localStorage.getItem("spg_webhook_url");
        if (webhookUrl && webhookUrl.startsWith("http")) {
          try {
            fetch(webhookUrl, {
              method: "POST",
              mode: "no-cors",
              headers: { "Content-Type": "text/plain" },
              body: JSON.stringify(payload)
            }).catch(() => {});
          } catch (netErr) {}
        }

        // 3. Update Hero Live Intel ticker in real time
        if (elements.tickerContentText) {
          const newTickerItem = `<strong>${comp}</strong> (${loc}) &bull; ${role} ${lvl}: <strong style="color: var(--emerald-dark);">${formatCurrency(firstYearTC)}/yr TC</strong> (Base ${formatCurrency(base)}) &bull; Verified Just Now`;
          elements.tickerContentText.innerHTML = `${newTickerItem} &nbsp;&bull;&nbsp; ${elements.tickerContentText.innerHTML}`;
        }

        closeModal();
        elements.submitOfferForm.reset();
        showToast("🔒 Anonymous offer submitted! Saved to live 2026 verification queue.");
      });
    }

    // Admin & Developer helpers
    window.setSalaryWebhook = (url) => {
      localStorage.setItem("spg_webhook_url", url);
      console.log("SalaryPathGuide Webhook configured to:", url);
      return "Webhook configured successfully!";
    };
    window.getSalarySubmissions = () => {
      return JSON.parse(localStorage.getItem("spg_submissions") || "[]");
    };
  };

  /* ==========================================================================
     Share Trajectory & URL State Loader (Viral Loop)
     ========================================================================== */
  let urlSyncTimeout = null;
  const syncUrlStateDebounced = () => {
    if (urlSyncTimeout) clearTimeout(urlSyncTimeout);
    urlSyncTimeout = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("r", state.selectedRoleId);
      params.set("b", Math.round(state.currentBaseSalary));
      params.set("raise", state.annualRaisePct);
      params.set("promo", state.promoInterval);
      params.set("bump", state.promoBumpPct);
      params.set("bonus", state.bonusPct);
      params.set("loc", state.calcLocationMultiplier);
      if (state.adjustForInflation) params.set("inf", "1");
      if (state.taxMode === "net") params.set("tax", "net");
      if (state.enableHousehold) {
        params.set("hh", "1");
        params.set("pr", state.partnerRoleId);
        params.set("pb", Math.round(state.partnerBaseSalary));
        params.set("pra", state.partnerRaisePct);
      }
      if (state.enableEquity) {
        params.set("eq", "1");
        params.set("eqv", state.equityVehicleType || "rsu");
        params.set("eg", Math.round(state.equityInitialGrant));
        params.set("vs", state.equityVestingSchedule);
        params.set("er", Math.round(state.equityRefresherGrant));
        params.set("eqg", state.equityStockGrowth || 0);
        params.set("eqm", state.equityExitMultiple !== undefined ? state.equityExitMultiple : 3);
        params.set("eq83b", state.equity83b ? "1" : "0");
      }
      params.set("sav", state.wealthSavingsRate || 35);
      params.set("ret", state.wealthReturnRate || 0.075);
      params.set("port", Math.round(state.wealthStartingNetWorth || 50000));

      const newUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}${window.location.hash || ""}`;
      window.history.replaceState({}, "", newUrl);
    }, 400);
  };

  const getTrajectoryShareUrl = () => {
    const params = new URLSearchParams();
    params.set("r", state.selectedRoleId);
    params.set("b", Math.round(state.currentBaseSalary));
    params.set("raise", state.annualRaisePct);
    params.set("promo", state.promoInterval);
    params.set("bump", state.promoBumpPct);
    params.set("bonus", state.bonusPct);
    params.set("loc", state.calcLocationMultiplier);
    if (state.adjustForInflation) params.set("inf", "1");
    if (state.taxMode === "net") params.set("tax", "net");
    if (state.enableHousehold) {
      params.set("hh", "1");
      params.set("pr", state.partnerRoleId);
      params.set("pb", Math.round(state.partnerBaseSalary));
      params.set("pra", state.partnerRaisePct);
    }
    if (state.enableEquity) {
      params.set("eq", "1");
      params.set("eqv", state.equityVehicleType || "rsu");
      params.set("eg", Math.round(state.equityInitialGrant));
      params.set("vs", state.equityVestingSchedule);
      params.set("er", Math.round(state.equityRefresherGrant));
      params.set("eqg", state.equityStockGrowth || 0);
      params.set("eqm", state.equityExitMultiple !== undefined ? state.equityExitMultiple : 3);
      params.set("eq83b", state.equity83b ? "1" : "0");
    }
    params.set("sav", state.wealthSavingsRate || 35);
    params.set("ret", state.wealthReturnRate || 0.075);
    params.set("port", Math.round(state.wealthStartingNetWorth || 50000));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const updateDynamicSeoMeta = (shareUrlOverride) => {
    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    const totalStr = elements.kpiTotalEarnings ? elements.kpiTotalEarnings.textContent : formatCurrency(state.currentBaseSalary * 5);
    const startStr = formatCurrency(state.currentBaseSalary);
    const title = `${role.title} 5-Year Trajectory (${totalStr} Total) | SalaryPathGuide`;
    const desc = `Interactive 5-year compensation model for ${role.title} starting at ${startStr} base${state.enableEquity ? " with equity & exit scenarios" : ""}. Projected 5-year cumulative comp: ${totalStr}.`;
    const activeUrl = shareUrlOverride || window.location.href;

    document.title = title;
    const setMeta = (selector, attr, val) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", activeUrl);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:url"]', "content", activeUrl);
  };

  const shareTrajectoryLink = () => {
    const shareUrl = getTrajectoryShareUrl();
    window.history.replaceState({}, "", shareUrl);
    updateDynamicSeoMeta(shareUrl);

    const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
    if (elements.shareModalTitle) {
      elements.shareModalTitle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share Customized Compensation Scenario
      `;
    }
    if (elements.shareUrlInput) elements.shareUrlInput.value = shareUrl;
    if (elements.shareSnapshotRole) elements.shareSnapshotRole.textContent = `${role.title} (${role.category})`;
    if (elements.shareSnapshotBadge) {
      elements.shareSnapshotBadge.textContent = `${state.adjustForInflation ? "Real" : "Nominal"} · ${state.taxMode === "net" ? "Net" : "Gross"} · ${state.enableHousehold ? "Household" : (state.enableEquity ? "With Equity" : "Cash Only")}`;
    }
    if (elements.shareSnapshotStartBase) elements.shareSnapshotStartBase.textContent = formatCurrency(state.currentBaseSalary);
    if (elements.shareSnapshotTotal) elements.shareSnapshotTotal.textContent = elements.kpiTotalEarnings ? elements.kpiTotalEarnings.textContent : "$0";
    if (elements.shareSnapshotWealth) elements.shareSnapshotWealth.textContent = elements.wealthY5Invested ? elements.wealthY5Invested.textContent : "$0";

    if (elements.shareModal) elements.shareModal.classList.add("open", "active");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("🔗 Custom trajectory link copied to clipboard!");
      }).catch(() => {});
    }
  };

  const shareOfferEvaluationLink = () => {
    const params = new URLSearchParams();
    if (elements.evalRoleSelect) params.set("erole", elements.evalRoleSelect.value);
    if (elements.evalCompany) params.set("ecomp", elements.evalCompany.value);
    if (elements.evalBaseSalary) params.set("ebase", elements.evalBaseSalary.value);
    if (elements.evalBonusPct) params.set("ebonus", elements.evalBonusPct.value);
    if (elements.evalEquityTotal) params.set("eequity", elements.evalEquityTotal.value);
    if (elements.evalSignonBonus) params.set("esignon", elements.evalSignonBonus.value);
    if (elements.evalCompetingOffer) params.set("ecompete", elements.evalCompetingOffer.value);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}#offer-evaluator`;
    window.history.replaceState({}, "", shareUrl);

    if (elements.shareModalTitle) {
      elements.shareModalTitle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share Evaluated Job Offer
      `;
    }
    if (elements.shareUrlInput) elements.shareUrlInput.value = shareUrl;
    if (elements.shareSnapshotRole) elements.shareSnapshotRole.textContent = `${elements.evalCompany && elements.evalCompany.value ? elements.evalCompany.value : "Tech"} Offer Evaluation`;
    if (elements.shareSnapshotBadge) elements.shareSnapshotBadge.textContent = elements.evalPercentileRank ? elements.evalPercentileRank.textContent : "Evaluated Offer";
    if (elements.shareSnapshotStartBase) elements.shareSnapshotStartBase.textContent = formatCurrency(Number(elements.evalBaseSalary ? elements.evalBaseSalary.value : 0) || 0);
    if (elements.shareSnapshotTotal) elements.shareSnapshotTotal.textContent = elements.evalYear1TC ? elements.evalYear1TC.textContent : "$0";
    if (elements.shareSnapshotWealth) elements.shareSnapshotWealth.textContent = elements.evalYear2TC ? elements.evalYear2TC.textContent : "$0";

    if (elements.shareModal) elements.shareModal.classList.add("open", "active");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("🔗 Offer evaluation link copied to clipboard!");
      }).catch(() => {});
    }
  };

  const initShareModalListeners = () => {
    if (elements.shareModalClose && elements.shareModal) {
      elements.shareModalClose.addEventListener("click", () => {
        elements.shareModal.classList.remove("open", "active");
      });
      elements.shareModal.addEventListener("click", (e) => {
        if (e.target === elements.shareModal) {
          elements.shareModal.classList.remove("open", "active");
        }
      });
    }

    if (elements.copyShareUrlBtn && elements.shareUrlInput) {
      elements.copyShareUrlBtn.addEventListener("click", () => {
        const url = elements.shareUrlInput.value;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            if (elements.copyShareBtnText) elements.copyShareBtnText.textContent = "Copied! ✓";
            showToast("🔗 Direct scenario link copied to clipboard!");
            setTimeout(() => {
              if (elements.copyShareBtnText) elements.copyShareBtnText.textContent = "Copy Link";
            }, 2000);
          });
        } else {
          elements.shareUrlInput.select();
          document.execCommand("copy");
          showToast("🔗 Direct scenario link copied to clipboard!");
        }
      });
    }

    if (elements.shareTwitterBtn) {
      elements.shareTwitterBtn.addEventListener("click", () => {
        const url = elements.shareUrlInput ? elements.shareUrlInput.value : window.location.href;
        const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
        const text = `I just modeled a 5-year compensation trajectory & FIRE horizon for a ${role.title} on @SalaryPathGuide! Check out the scenario:`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
      });
    }

    if (elements.shareLinkedInBtn) {
      elements.shareLinkedInBtn.addEventListener("click", () => {
        const url = elements.shareUrlInput ? elements.shareUrlInput.value : window.location.href;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "width=600,height=500");
      });
    }

    if (elements.shareEmailBtn) {
      elements.shareEmailBtn.addEventListener("click", () => {
        const url = elements.shareUrlInput ? elements.shareUrlInput.value : window.location.href;
        const role = roles.find(r => r.id === state.selectedRoleId) || roles[0];
        const subject = `5-Year Compensation & Wealth Trajectory: ${role.title}`;
        const body = `Hi,\n\nI created a customized 5-year career compensation and FIRE milestone model on SalaryPathGuide:\n\nRole: ${role.title}\nStarting Base: ${formatCurrency(state.currentBaseSalary)}\n5-Year Projected Total Comp: ${elements.kpiTotalEarnings ? elements.kpiTotalEarnings.textContent : ""}\n5-Year Projected Invested Wealth: ${elements.wealthY5Invested ? elements.wealthY5Invested.textContent : ""}\n\nView the full interactive scenario and math here:\n${url}\n`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }

    if (elements.shareTextSummaryBtn) {
      elements.shareTextSummaryBtn.addEventListener("click", () => {
        copyTrajectorySummaryToClipboard();
      });
    }
  };

  const initUrlStateLoader = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return;

    let isCustomTrajectory = false;

    if (params.has("r")) {
      const r = params.get("r");
      if (roles.some(role => role.id === r)) {
        state.selectedRoleId = r;
        if (elements.calcJobTitle) elements.calcJobTitle.value = r;
        const roleObj = roles.find(ro => ro.id === r);
        if (roleObj && elements.calcTrackBadge) elements.calcTrackBadge.textContent = roleObj.category;
        isCustomTrajectory = true;
      }
    }
    if (params.has("b")) {
      const b = Number(params.get("b"));
      if (!isNaN(b) && b > 0) {
        updateBaseSalary(b);
        isCustomTrajectory = true;
      }
    }
    if (params.has("raise")) {
      const val = Number(params.get("raise"));
      if (!isNaN(val)) {
        state.annualRaisePct = val;
        if (elements.calcAnnualRaise) elements.calcAnnualRaise.value = val;
        if (elements.calcRaiseBadge) elements.calcRaiseBadge.textContent = `${val.toFixed(1)}%`;
        isCustomTrajectory = true;
      }
    }
    if (params.has("promo")) {
      const val = Number(params.get("promo"));
      if (!isNaN(val)) {
        state.promoInterval = val;
        if (elements.calcPromoInterval) elements.calcPromoInterval.value = val;
        const textMap = { 1: "Every 1 Year", 2: "Every 2 Years", 3: "Every 3 Years", 0: "None" };
        if (elements.calcPromoBadge) elements.calcPromoBadge.textContent = textMap[val] || "Custom";
        isCustomTrajectory = true;
      }
    }
    if (params.has("bump")) {
      const val = Number(params.get("bump"));
      if (!isNaN(val)) {
        state.promoBumpPct = val;
        if (elements.calcPromoBump) elements.calcPromoBump.value = val;
        if (elements.calcBumpBadge) elements.calcBumpBadge.textContent = `${val}%`;
        isCustomTrajectory = true;
      }
    }
    if (params.has("bonus")) {
      const val = Number(params.get("bonus"));
      if (!isNaN(val)) {
        state.bonusPct = val;
        if (elements.calcBonusPct) elements.calcBonusPct.value = val;
        if (elements.calcBonusBadge) elements.calcBonusBadge.textContent = `${val}%`;
        isCustomTrajectory = true;
      }
    }
    if (params.has("loc")) {
      const val = Number(params.get("loc"));
      if (!isNaN(val)) {
        state.calcLocationMultiplier = val;
        if (elements.calcLocationTier) elements.calcLocationTier.value = val.toString();
        isCustomTrajectory = true;
      }
    }
    if (params.has("inf")) {
      state.adjustForInflation = params.get("inf") === "1";
      if (elements.calcInflationToggle) elements.calcInflationToggle.checked = state.adjustForInflation;
      isCustomTrajectory = true;
    }
    if (params.has("tax") && params.get("tax") === "net") {
      state.taxMode = "net";
      if (elements.taxModeSwitch) {
        elements.taxModeSwitch.querySelectorAll(".mode-switch-btn").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-mode") === "net");
        });
      }
      isCustomTrajectory = true;
    }
    if (params.has("hh")) {
      state.enableHousehold = params.get("hh") === "1";
      if (elements.enableHouseholdToggle) elements.enableHouseholdToggle.checked = state.enableHousehold;
      if (elements.householdInputsWrap) elements.householdInputsWrap.style.display = state.enableHousehold ? "flex" : "none";
      if (elements.householdOptionsPanel) elements.householdOptionsPanel.style.display = state.enableHousehold ? "block" : "none";
      if (params.has("pr")) state.partnerRoleId = params.get("pr");
      if (params.has("pb")) {
        state.partnerBaseSalary = Number(params.get("pb")) || 120000;
        if (elements.partnerBaseSalary) elements.partnerBaseSalary.value = state.partnerBaseSalary;
        if (elements.partnerBaseBadge) elements.partnerBaseBadge.textContent = formatCurrency(state.partnerBaseSalary);
      }
      if (params.has("pra")) {
        state.partnerRaisePct = Number(params.get("pra")) || 4.0;
        if (elements.partnerRaise) elements.partnerRaise.value = state.partnerRaisePct;
        if (elements.partnerRaiseBadge) elements.partnerRaiseBadge.textContent = `${state.partnerRaisePct.toFixed(1)}%`;
      }
      isCustomTrajectory = true;
    }
    if (params.has("eq")) {
      state.enableEquity = params.get("eq") === "1";
      if (elements.enableEquityToggle) elements.enableEquityToggle.checked = state.enableEquity;
      if (elements.equityInputsWrap) elements.equityInputsWrap.style.display = state.enableEquity ? "flex" : "none";
      if (elements.equityOptionsPanel) elements.equityOptionsPanel.style.display = state.enableEquity ? "block" : "none";
      if (params.has("eqv")) {
        state.equityVehicleType = params.get("eqv") === "startup" ? "startup" : "rsu";
        if (elements.equityVehicleType) elements.equityVehicleType.value = state.equityVehicleType;
        const isStartup = state.equityVehicleType === "startup";
        if (elements.equityStockGrowthGroup) elements.equityStockGrowthGroup.style.display = isStartup ? "none" : "block";
        if (elements.equityStartupControlsGroup) elements.equityStartupControlsGroup.style.display = isStartup ? "flex" : "none";
      }
      if (params.has("eg")) {
        state.equityInitialGrant = Number(params.get("eg")) || 160000;
        if (elements.equityInitialGrant) elements.equityInitialGrant.value = state.equityInitialGrant;
        if (elements.equityInitialBadge) elements.equityInitialBadge.textContent = formatCurrency(state.equityInitialGrant);
      }
      if (params.has("vs")) {
        state.equityVestingSchedule = params.get("vs");
        if (elements.equityVestingSchedule) elements.equityVestingSchedule.value = state.equityVestingSchedule;
      }
      if (params.has("er")) {
        state.equityRefresherGrant = Number(params.get("er")) || 35000;
        if (elements.equityRefresherGrant) elements.equityRefresherGrant.value = state.equityRefresherGrant;
        if (elements.equityRefresherBadge) elements.equityRefresherBadge.textContent = `${formatCurrency(state.equityRefresherGrant)} / yr`;
      }
      if (params.has("eqg")) {
        state.equityStockGrowth = Number(params.get("eqg")) || 0;
        if (elements.equityStockGrowth) elements.equityStockGrowth.value = state.equityStockGrowth.toString();
      }
      if (params.has("eqm")) {
        state.equityExitMultiple = Number(params.get("eqm"));
        if (elements.equityExitMultiple) elements.equityExitMultiple.value = state.equityExitMultiple.toString();
      }
      if (params.has("eq83b")) {
        state.equity83b = params.get("eq83b") === "1";
        if (elements.equity83bToggle) elements.equity83bToggle.checked = state.equity83b;
      }
      isCustomTrajectory = true;
    }

    // Wealth & FIRE Projector URL Parameters
    if (params.has("sav")) {
      const val = Number(params.get("sav"));
      if (!isNaN(val) && val >= 10 && val <= 75) {
        state.wealthSavingsRate = val;
        if (elements.wealthSavingsRate) elements.wealthSavingsRate.value = val;
        if (elements.wealthSavingsBadge) elements.wealthSavingsBadge.textContent = `${val}%`;
        isCustomTrajectory = true;
      }
    }
    if (params.has("ret")) {
      const val = Number(params.get("ret"));
      if (!isNaN(val)) {
        state.wealthReturnRate = val;
        if (elements.wealthReturnRate) elements.wealthReturnRate.value = val.toString();
        isCustomTrajectory = true;
      }
    }
    if (params.has("port")) {
      const val = Number(params.get("port"));
      if (!isNaN(val) && val >= 0) {
        state.wealthStartingNetWorth = val;
        if (elements.wealthStartingNetWorth) elements.wealthStartingNetWorth.value = val;
        isCustomTrajectory = true;
      }
    }

    // Offer Evaluator URL Parameters
    if (params.has("erole") || params.has("ebase")) {
      if (params.has("erole") && elements.evalRoleSelect) elements.evalRoleSelect.value = params.get("erole");
      if (params.has("ecomp") && elements.evalCompany) elements.evalCompany.value = params.get("ecomp");
      if (params.has("ebase") && elements.evalBaseSalary) elements.evalBaseSalary.value = params.get("ebase");
      if (params.has("ebonus") && elements.evalBonusPct) elements.evalBonusPct.value = params.get("ebonus");
      if (params.has("eequity") && elements.evalEquityTotal) elements.evalEquityTotal.value = params.get("eequity");
      if (params.has("esignon") && elements.evalSignonBonus) elements.evalSignonBonus.value = params.get("esignon");
      if (params.has("ecompete") && elements.evalCompetingOffer) elements.evalCompetingOffer.value = params.get("ecompete");
      if (typeof evaluateOffer === "function") evaluateOffer();
      if (window.location.hash === "#offer-evaluator") {
        setTimeout(() => {
          const evalSec = document.getElementById("offer-evaluator");
          if (evalSec) evalSec.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }

    runTrajectoryCalculations();
    if (isCustomTrajectory) updateDynamicSeoMeta(window.location.href);

    // Show Shared Scenario Banner if customized trajectory params present
    if (isCustomTrajectory && elements.sharedScenarioBanner) {
      elements.sharedScenarioBanner.style.display = "flex";
      const roleObj = roles.find(r => r.id === state.selectedRoleId) || roles[0];
      if (elements.sharedBannerTitle) {
        elements.sharedBannerTitle.textContent = `Custom Shared Scenario: ${roleObj.title}`;
      }
      if (elements.sharedBannerSubtitle) {
        elements.sharedBannerSubtitle.textContent = `Starting at ${formatCurrency(state.currentBaseSalary)} · ${state.wealthSavingsRate}% annual savings rate (@ ${(state.wealthReturnRate * 100).toFixed(1)}% return).`;
      }

      if (elements.sharedBannerResetBtn) {
        elements.sharedBannerResetBtn.addEventListener("click", () => {
          window.history.replaceState({}, "", window.location.pathname);
          if (elements.sharedScenarioBanner) elements.sharedScenarioBanner.style.display = "none";
          if (elements.resetCalcBtn) elements.resetCalcBtn.click();
        });
      }

      if (elements.sharedBannerCloseBtn) {
        elements.sharedBannerCloseBtn.addEventListener("click", () => {
          if (elements.sharedScenarioBanner) elements.sharedScenarioBanner.style.display = "none";
        });
      }

      showToast("✨ Loaded custom shared trajectory!");
    }
  };

  /* ==========================================================================
     Compensation Glossary Modal
     ========================================================================== */
  const initGlossaryModal = () => {
    if (!elements.glossaryGrid || !window.CAREER_DATA || !window.CAREER_DATA.glossary) return;

    elements.glossaryGrid.innerHTML = window.CAREER_DATA.glossary.map(item => `
      <div class="glossary-card">
        <div class="glossary-card-header">
          <span class="glossary-term">${item.term}</span>
          <span class="glossary-acronym">${item.acronym}</span>
        </div>
        <p class="glossary-def">${item.definition}</p>
        <div class="glossary-tip"><strong>Negotiation Tip:</strong> ${item.tip}</div>
      </div>
    `).join("");

    if (elements.glossaryModalClose) {
      elements.glossaryModalClose.addEventListener("click", (e) => {
        e.preventDefault();
        elements.glossaryModal.classList.remove("open", "active");
      });
    }

    if (elements.glossaryModal) {
      elements.glossaryModal.addEventListener("click", (e) => {
        if (e.target === elements.glossaryModal) {
          elements.glossaryModal.classList.remove("open", "active");
        }
      });
    }
  };

  /* ==========================================================================
     Lead Magnet & 2026 Compensation Report Whitepaper
     ========================================================================== */
  const initLeadMagnet = () => {
    const openReportModal = () => {
      if (elements.reportModal) {
        elements.reportModal.classList.add("open", "active");
        document.body.style.overflow = "hidden";
      }
    };

    const closeReportModal = () => {
      if (elements.reportModal) {
        elements.reportModal.classList.remove("open", "active");
        document.body.style.overflow = "";
      }
    };

    const printBenchmarkReport = () => {
      const modalBody = elements.reportModal ? elements.reportModal.querySelector(".modal-body") : null;
      const content = modalBody ? modalBody.innerHTML : "";
      const printWindow = window.open("", "_blank", "width=900,height=900");
      if (!printWindow) {
        window.print();
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>2026 Executive Compensation Benchmark Report — SalaryPathGuide</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; padding: 2rem; margin: 0; line-height: 1.5; font-size: 10pt; background: #FFFFFF; }
            .report-header-banner { background: #0A1128 !important; color: #FFFFFF !important; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-header-badge { font-size: 8pt; font-weight: bold; color: #10B981 !important; text-transform: uppercase; margin-bottom: 0.5rem; }
            .report-title { font-size: 16pt; font-weight: 800; color: #FFFFFF !important; margin: 0 0 0.5rem 0; }
            .report-meta-row { display: flex; gap: 1.5rem; font-size: 8pt; color: #CBD5E1 !important; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.5rem; margin-top: 0.75rem; }
            .report-section-block { border: 1px solid #CBD5E1; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; page-break-inside: avoid; }
            .report-section-title { font-size: 12pt; font-weight: 800; color: #0A1128; margin: 0 0 0.75rem 0; }
            .report-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 0.5rem; }
            .report-table th { background: #F1F5F9 !important; color: #0A1128; text-align: left; padding: 6px 8px; border-bottom: 2px solid #CBD5E1; font-size: 7.5pt; text-transform: uppercase; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-table td { padding: 6px 8px; border-bottom: 1px solid #E2E8F0; }
            .report-keypoints { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
            .report-keypoint-item { background: #F8FAFC !important; border-left: 3px solid #10B981 !important; padding: 0.75rem; border-radius: 4px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-keypoint-item h5 { margin: 0 0 0.25rem 0; font-size: 9pt; color: #0A1128; font-weight: 700; }
            .report-keypoint-item p { margin: 0; font-size: 8pt; color: #475569; }
            .print-footer { text-align: center; margin-top: 2rem; font-size: 8pt; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 1rem; }
            @page { margin: 1.5cm; size: auto; }
          </style>
        </head>
        <body>
          ${content}
          <div class="print-footer">
            &copy; 2026 SalaryPathGuide.com &bull; Confidential Executive Compensation Benchmark Whitepaper &bull; Generated from live verified dataset
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    };

    // Trigger buttons
    if (elements.previewReportBtn) {
      elements.previewReportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openReportModal();
      });
    }

    if (elements.modalPrintReportBtn) {
      elements.modalPrintReportBtn.addEventListener("click", printBenchmarkReport);
    }
    if (elements.footerPrintReportBtn) {
      elements.footerPrintReportBtn.addEventListener("click", printBenchmarkReport);
    }

    if (elements.reportModalClose) {
      elements.reportModalClose.addEventListener("click", closeReportModal);
    }

    if (elements.reportModal) {
      elements.reportModal.addEventListener("click", (e) => {
        if (e.target === elements.reportModal) {
          closeReportModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && elements.reportModal.classList.contains("open")) {
          closeReportModal();
        }
      });
    }

    if (!elements.leadMagnetForm) return;

    elements.leadMagnetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (elements.leadEmail && elements.leadEmail.value.trim()) || "";
      if (!email) return;

      const payload = {
        timestamp: new Date().toISOString(),
        company: "Report Subscriber: " + email,
        role: "2026 Compensation Report Lead",
        level: "Subscriber",
        location: email,
        baseSalary: 0,
        bonusPct: 0,
        equity: 0,
        signon: 0,
        totalCompYear1: 0,
        notes: "Requested 2026 Executive Compensation Benchmark PDF"
      };

      const webhookUrl = GOOGLE_SHEET_WEBHOOK_URL || localStorage.getItem("spg_webhook_url");
      if (webhookUrl && webhookUrl.startsWith("http")) {
        try {
          fetch(webhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload)
          }).catch(() => {});
        } catch (err) {}
      }

      showToast("🎉 Opening your 2026 Executive Compensation Whitepaper...");
      openReportModal();
      elements.leadMagnetForm.reset();
    });
  };

  /* ==========================================================================
     Service Worker Registration & Installable PWA Engine
     ========================================================================== */
  const registerServiceWorker = () => {
    const pwaStatusBadge = document.getElementById("pwaStatusBadge");
    const pwaInstallBtn = document.getElementById("pwaInstallBtn");
    let deferredPrompt = null;

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
          if (pwaStatusBadge) {
            pwaStatusBadge.textContent = navigator.onLine ? "⚡ Offline-Ready PWA (Active)" : "📡 Offline Mode (Cached)";
          }
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  showToast("🔄 New SalaryPathGuide version cached for offline use!");
                }
              });
            }
          });
        }).catch(() => {});
      });
    }

    window.addEventListener("online", () => {
      if (pwaStatusBadge) pwaStatusBadge.textContent = "⚡ Offline-Ready PWA (Active)";
      showToast("🌐 Back online!");
    });

    window.addEventListener("offline", () => {
      if (pwaStatusBadge) pwaStatusBadge.textContent = "📡 Offline Mode (Cached)";
      showToast("📡 You are offline — SalaryPathGuide continues running from cache.");
    });

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (pwaInstallBtn) {
        pwaInstallBtn.style.display = "inline-flex";
      }
    });

    if (pwaInstallBtn) {
      pwaInstallBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          showToast("📲 SalaryPathGuide installed to your device!");
          pwaInstallBtn.style.display = "none";
        }
        deferredPrompt = null;
      });
    }

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      if (pwaInstallBtn) pwaInstallBtn.style.display = "none";
    });
  };

  /* ==========================================================================
     Accessible Modal Focus Trap & Keyboard Navigation Controller
     ========================================================================== */
  const initAccessibleModals = () => {
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastTriggerEl = null;

    const getOpenModal = () => document.querySelector(".modal-overlay.open, .modal-overlay.active");

    const getFocusableInside = (container) => {
      return Array.from(container.querySelectorAll(focusableSelector)).filter(
        el => el.offsetParent !== null || el === document.activeElement
      );
    };

    const closeAllModals = () => {
      document.querySelectorAll(".modal-overlay.open, .modal-overlay.active").forEach(modal => {
        modal.classList.remove("open", "active");
      });
      if (lastTriggerEl && typeof lastTriggerEl.focus === "function") {
        lastTriggerEl.focus();
        lastTriggerEl = null;
      }
    };

    document.querySelectorAll(".modal-overlay").forEach(modal => {
      let wasOpen = modal.classList.contains("open") || modal.classList.contains("active");
      const observer = new MutationObserver(() => {
        const isOpen = modal.classList.contains("open") || modal.classList.contains("active");
        if (isOpen && !wasOpen) {
          wasOpen = true;
          if (document.activeElement && !modal.contains(document.activeElement)) {
            lastTriggerEl = document.activeElement;
          }
          requestAnimationFrame(() => {
            const focusables = getFocusableInside(modal);
            if (focusables.length > 0) focusables[0].focus();
          });
        } else if (!isOpen && wasOpen) {
          wasOpen = false;
          if (!getOpenModal() && lastTriggerEl && typeof lastTriggerEl.focus === "function") {
            lastTriggerEl.focus();
            lastTriggerEl = null;
          }
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ["class"] });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openModal = getOpenModal();
        if (openModal) {
          e.preventDefault();
          closeAllModals();
          return;
        }
        if (elements.mobileDrawer && !elements.mobileDrawer.classList.contains("hidden")) {
          elements.mobileDrawer.classList.add("hidden");
          if (elements.mobileMenuBtn) {
            elements.mobileMenuBtn.setAttribute("aria-expanded", "false");
            elements.mobileMenuBtn.focus();
          }
        }
        return;
      }

      if (e.key === "Tab") {
        const openModal = getOpenModal();
        if (!openModal) return;
        const focusables = getFocusableInside(openModal);
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl || !openModal.contains(document.activeElement)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else if (document.activeElement === lastEl || !openModal.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });
  };

  /* ==========================================================================
     Bootstrap Application
     ========================================================================== */
  initSearch();
  initCalculator();
  initOfferEvaluator();
  initLevelingMatrix();
  initGeoArbitrage();
  initSubmitOfferModal();
  initGlossaryModal();
  initLeadMagnet();
  initDirectory();
  initNegotiationPlaybook();
  initRoleplaySimulator();
  initResources();
  initCompareModal();
  initNavigation();
  initUrlStateLoader();
  initShareModalListeners();
  initAccessibleModals();
  registerServiceWorker();
});
