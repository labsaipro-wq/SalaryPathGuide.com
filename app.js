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
    currentTrajectoryData: [],
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

      if (elements.calcInflationToggle) elements.calcInflationToggle.checked = false;
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

    // Render Progression Table
    renderProgressionTable(yearData);

    // Render / Update Chart
    renderTrajectoryChart(yearData);
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

    if (trajectoryChartInstance) {
      trajectoryChartInstance.data.labels = labels;
      trajectoryChartInstance.data.datasets[0].data = baseSalaries;
      trajectoryChartInstance.data.datasets[1].data = annualBonuses;
      trajectoryChartInstance.options.scales.y.ticks.callback = (value) => `${info.symbol}${Math.round(value / 1000)}k`;
      trajectoryChartInstance.update();
      return;
    }

    // Chart.js instantiation with modern fintech navy & emerald styling
    const ctx = elements.chartCanvas.getContext("2d");
    trajectoryChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
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
        ]
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
            <button type="button" class="btn btn-outline-dark btn-sm btn-copy-script" data-type="phone">
              Copy Phone Script
            </button>
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
     6. Side-by-Side Level Comparison Modal
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

    const openModal = () => {
      elements.compareModal.classList.add("open");
      renderComparison();
    };

    const closeModal = () => {
      elements.compareModal.classList.remove("open");
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
      elements.mobileDrawer.classList.toggle("hidden");
    });

    elements.mobileDrawer.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        elements.mobileDrawer.classList.add("hidden");
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

      // Counter-Offer Email Script
      const targetAnchor = Math.max(competing, Math.round(year1TC * 1.12 / 1000) * 1000);
      const counterBaseTarget = Math.round(base * 1.08 / 1000) * 1000;
      const counterEquityTarget = Math.round((equityTotal + (cliffDiff > 0 ? cliffDiff * 2 : 40000)) / 1000) * 1000;

      const emailScript = `Dear ${company} Recruiting Team,

Thank you so much for extending the written offer for the ${level.name} (${level.code}) opportunity. I loved discussing the team's engineering standards and 2026 technical vision throughout the interview process.

After analyzing the total compensation structure and calibrating against market benchmarks for this leveling scope, I would like to propose a tailored adjustment to bring our numbers into optimal alignment:

1. Base Salary: Proposing an adjustment from ${formatCurrency(base)} to ${formatCurrency(counterBaseTarget)}, reflecting my track record in high-leverage execution.${competing > 0 ? `\n2. Competing Consideration: I am concurrently evaluating an active competing offer calibrated at approximately ${formatCurrency(competing)} Year 1 total compensation.` : ""}
2. Equity & Retention Alignment: Looking at the 4-year schedule, there is a ${formatCurrency(cliffDiff)} step-down in Year 2 when the sign-on bonus concludes. To ensure steady year-over-year compensation, I would welcome either increasing the 4-year equity grant from ${formatCurrency(equityTotal)} to ${formatCurrency(counterEquityTarget)} or structuring an agreed Year 2 retention grant.

${company} is my unequivocal top choice. If we can solidify these adjustments to reach approximately ${formatCurrency(targetAnchor)} in Year 1 total compensation, I am prepared to sign the offer letter immediately and withdraw from all other interview loops.

Thank you again for your partnership and advocacy throughout this process. I look forward to finalizing our start date!

Warm regards,
[Your Name]`;

      elements.counterEmailPre.textContent = emailScript;
    };

    // Event listeners
    [elements.evalRoleSelect, elements.evalBaseSalary, elements.evalBonusPct, elements.evalEquityTotal, elements.evalSignonBonus, elements.evalCompetingOffer, elements.evalCompany].forEach(input => {
      if (input) input.addEventListener("input", calculateEvaluation);
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
      elements.arbitrageModal.classList.add("active");
      updateArbitrage();
    });

    elements.arbitrageModalClose.addEventListener("click", () => {
      elements.arbitrageModal.classList.remove("active");
    });

    elements.arbitrageModal.addEventListener("click", (e) => {
      if (e.target === elements.arbitrageModal) {
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
      elements.submitOfferModal.classList.add("active");
    };

    const closeModal = () => {
      elements.submitOfferModal.classList.remove("active");
    };

    if (elements.navSubmitOfferBtn) {
      elements.navSubmitOfferBtn.addEventListener("click", openModal);
    }
    if (elements.mobileSubmitOfferBtn) {
      elements.mobileSubmitOfferBtn.addEventListener("click", () => {
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
      elements.submitOfferModalClose.addEventListener("click", closeModal);
    }
    if (elements.submitOfferCancelBtn) {
      elements.submitOfferCancelBtn.addEventListener("click", closeModal);
    }

    elements.submitOfferModal.addEventListener("click", (e) => {
      if (e.target === elements.submitOfferModal) {
        closeModal();
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
        const firstYearTC = Math.round(base + (base * (bonusPct / 100)) + (equity / 4) + signon);

        // Update ticker live
        if (elements.tickerContentText) {
          const newTickerItem = `<strong>${comp}</strong> (${loc}) &bull; ${role} ${lvl}: <strong style="color: var(--emerald-dark);">${formatCurrency(firstYearTC)}/yr TC</strong> (Base ${formatCurrency(base)}) &bull; Verified Just Now`;
          elements.tickerContentText.innerHTML = `${newTickerItem} &nbsp;&bull;&nbsp; ${elements.tickerContentText.innerHTML}`;
        }

        closeModal();
        elements.submitOfferForm.reset();
        showToast("🔒 Anonymous offer submitted! Added to live 2026 verification queue.");
      });
    }
  };

  /* ==========================================================================
     Service Worker Registration for PWA
     ========================================================================== */
  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
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
  initDirectory();
  initNegotiationPlaybook();
  initResources();
  initCompareModal();
  initNavigation();
  registerServiceWorker();
});
