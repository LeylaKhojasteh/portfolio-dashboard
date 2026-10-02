/**
 * English source dictionary. Every other locale is type-checked against this
 * shape, so a missing or misspelled key fails the build rather than the UI.
 */
export const en = {
  brand: {
    name: "Meridian",
    subtitle: "Portfolio Intelligence",
  },
  nav: {
    sectionPortfolio: "Portfolio",
    sectionWorkspace: "Workspace",
    overview: "Overview",
    transactions: "Transactions",
    assets: "Assets",
    analytics: "Analytics",
    settings: "Settings",
    login: "Login",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
    open: "Open navigation",
  },
  account: {
    name: "Reza Ahmadi",
    email: "reza@meridian.io",
    plan: "Pro",
    loginTitle: "Please Login",
    loginHint: "Sign in to continue",
  },
  topbar: {
    title: "Portfolio Dashboard",
    lastUpdate: "Last Update:",
    refresh: "Refresh data",
    language: "Interface language",
    currency: "Display currency",
  },
  range: {
    label: "Time Range",
    D: "Daily",
    W: "Weekly",
    "1M": "1 Month",
    "3M": "3 Months",
    "6M": "6 Months",
    "1Y": "1 Year",
  },
  kpi: {
    portfolioValue: "Portfolio Value",
    portfolioValueToman: "Portfolio Value (Toman)",
    monthlyGrowth: "Monthly Growth %",
    monthlyPnl: "Monthly Growth Amount",
    usdTomanRate: "USD / TOMAN Rate",
    bitcoinPrice: "Bitcoin Price",
    vsPreviousRange: "vs {range}",
    vsPreviousMonth: "vs previous month",
    lastDays: "last {days} days",
  },
  performance: {
    title: "Portfolio Performance",
    subtitlePeriod: "Value over the selected period",
    subtitleYear: "Value over the selected year",
    value: "Portfolio Value",
    observations: "{count} observations · {range}",
  },
  allocation: {
    title: "Asset Allocation",
    subtitle: "Weight of each asset class",
  },
  donut: {
    title: "Portfolio Allocation",
    subtitle: "Share by asset class",
    total: "Total Value",
    classes: "{count} Assets",
    colAsset: "Asset",
    colWeight: "Weight",
    colValue: "Value",
  },
  assets: {
    title: "Assets",
    tracked: "{count} holdings tracked",
    colAsset: "Asset",
    col24h: "24H",
    colCurrent: "Current Value",
    colNative: "Native Value",
  },
  activity: {
    title: "Recent Activity",
    all: "All",
    colAsset: "Asset",
    colDate: "Date",
    colType: "Type",
    colAmount: "Amount",
    types: {
      BUY: "Buy",
      SELL: "Sell",
      TRANSFER: "Transfer",
      DEPOSIT: "Deposit",
      WITHDRAW: "Withdraw",
    },
  },
  tooltip: {
    portfolioValue: "Portfolio value",
    netFlow: "Net flow",
    rate: "Rate 1 USD = {rate} Toman",
    allocation: "Allocation",
    value: "Value",
  },
  chart: {
    average: "period average",
  },
  placeholder: {
    transactions: {
      title: "Transactions",
      description:
        "The full ledger with filtering by type, asset, date range and currency lands here in the data phase.",
    },
    assets: {
      title: "Assets",
      description:
        "Per-asset detail pages with cost basis, realised P/L and quantity history will be wired to the portfolio API.",
    },
    analytics: {
      title: "Analytics",
      description:
        "Risk metrics, correlation analysis, drawdowns and benchmarking against a market index will live here.",
    },
    settings: {
      title: "Settings",
      description:
        "Preferred currency, exchange rate source, notification rules and account preferences will be managed here.",
    },
    login: {
      title: "Sign in",
      description:
        "Authentication is out of scope for this prototype phase — the route exists so the navigation model is complete.",
    },
    stages: {
      data: "Data modelling",
      api: "API endpoints",
      views: "Dashboard views",
      qa: "Polish & QA",
    },
  },
};