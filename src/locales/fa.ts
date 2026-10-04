import type { Dictionary } from "@/locales";

export const fa: Dictionary = {
  brand: {
    name: "Worthline",
    subtitle: "هوش پرتفوی",
  },
  nav: {
    sectionPortfolio: "پرتفوی",
    sectionWorkspace: "فضای کاری",
    overview: "نمای کلی",
    transactions: "تراکنش‌ها",
    assets: "دارایی‌ها",
    analytics: "تحلیل",
    settings: "تنظیمات",
    login: "ورود",
    collapse: "بستن منو",
    expand: "باز کردن منو",
    open: "باز کردن ناوبری",
    primary: "اصلی",
  },
  account: {
    name: "رضا احمدی",
    email: "reza@meridian.io",
    plan: "حرفه‌ای",
    loginTitle: "لطفاً وارد شوید",
    loginHint: "یا ثبت نام کنید",
  },
  topbar: {
    title: "داشبورد دارایی",
    lastUpdate: "آخرین بروزرسانی:",
    refresh: "به‌روزرسانی داده‌ها",
    language: "زبان رابط کاربری",
    currency: "ارز نمایش",
    display: "نمایش",
    done: "تأیید",
    close: "بستن",
  },
  range: {
    label: "بازه زمانی",
    D: "روزانه",
    W: "هفتگی",
    "1M": "۱ ماه",
    "3M": "۳ ماه",
    "6M": "۶ ماه",
    "1Y": "۱ سال",
  },
  kpi: {
    portfolioValue: "ارزش پرتفوی",
    portfolioValueToman: "ارزش پرتفوی (تومان)",
    monthlyGrowth: "درصد رشد ماهانه",
    monthlyPnl: "مقدار رشد ماهانه",
    usdTomanRate: "نرخ دلار / تومان",
    bitcoinPrice: "قیمت بیت‌کوین",
    vsPreviousRange: "نسبت به {range} قبل",
    vsPreviousMonth: "نسبت به ماه قبل",
    lastDays: "{days} روز اخیر",
  },
  performance: {
    title: "عملکرد پرتفوی",
    subtitlePeriod: "ارزش در بازه انتخابی",
    subtitleYear: "ارزش در سال انتخابی",
    value: "ارزش پرتفوی",
    observations: "{count} رکورد · {range}",
    mode: {
      value: "ارزش",
      return: "بازده",
      drawdown: "افت",
    },
    metrics: {
      return: "بازده",
      maxDrawdown: "حداکثر افت",
      volatility: "نوسان",
      bestDay: "بهترین روز",
      fxEffect: "اثر ارز",
    },
  },
  allocation: {
    title: "ترکیب دارایی‌ها",
    subtitle: "وزن هر کلاس دارایی",
  },
  donut: {
    title: "توزیع دارایی‌ها",
    subtitle: "سهم هر کلاس دارایی",
    total: "ارزش کل",
    classes: "{count} دارایی",
    colAsset: "دارایی",
    colWeight: "وزن",
    colValue: "ارزش",
  },
  assets: {
    title: "دارایی‌ها",
    tracked: "{count} دارایی تحت پیگیری",
    colAsset: "دارایی",
    col24h: "۲۴ ساعت",
    colCurrent: "ارزش فعلی",
    colNative: "ارزش بومی",
  },
  activity: {
    title: "فعالیت‌های اخیر",
    all: "همه",
    colAsset: "دارایی",
    colDate: "تاریخ",
    colType: "نوع",
    colAmount: "مبلغ",
    types: {
      BUY: "خرید",
      SELL: "فروش",
      TRANSFER: "انتقال",
      DEPOSIT: "واریز",
      WITHDRAW: "برداشت",
    },
  },
  tooltip: {
    portfolioValue: "ارزش پرتفوی",
    netFlow: "جریان خالص",
    rate: "نرخ هر دلار = {rate} تومان",
    allocation: "سهم تخصیص",
    value: "ارزش",
    change: "تغییر",
    sinceStart: "از ابتدای بازه",
    periodReturn: "بازده دوره",
  },
  chart: {
    average: "میانگین دوره",
    baseline: "شروع بازه",
    benchmark: "شاخص مبنا",
    portfolio: "پرتفوی",
  },
  placeholder: {
    transactions: {
      title: "تراکنش‌ها",
      description:
        "دفتر کامل تراکنش‌ها با امکان فیلتر بر اساس نوع، دارایی، بازه زمانی و ارز در مرحله داده‌ها اضافه می‌شود.",
    },
    assets: {
      title: "دارایی‌ها",
      description:
        "صفحه جزئیات هر دارایی با مبنای بهای تمام‌شده، سود و زیان تحقق‌یافته و تاریخچه مقدار، به API پرتفوی متصل خواهد شد.",
    },
    analytics: {
      title: "تحلیل",
      description:
        "شاخص‌های ریسک، تحلیل همبستگی، حداکثر افت و مقایسه با شاخص بازار در این بخش قرار می‌گیرند.",
    },
    settings: {
      title: "تنظیمات",
      description:
        "ارز پیش‌فرض، منبع نرخ ارز، قواعد اعلان و ترجیحات حساب در این بخش مدیریت می‌شود.",
    },
    login: {
      title: "ورود",
      description:
        "احراز هویت خارج از محدوده این مرحله است — این مسیر فقط برای کامل بودن مدل ناوبری وجود دارد.",
    },
    stages: {
      data: "مدل‌سازی داده",
      api: "سرویس‌های API",
      views: "نماهای داشبورد",
      qa: "پرداخت نهایی",
    },
  },
};