import { IResellerProgramData } from '@/types/reseller-program';

export const DEFAULT_RESELLER_PROGRAM_DATA: IResellerProgramData = {
  hero: {
    badgeText: 'Reseller Partnership Program',
    titlePart1: 'Launch Your Own',
    titleHighlight: 'E-Commerce Brand',
    titlePart2: 'with Zero Risk',
    subheading: 'Source thousands of quality products at wholesale rates, set your prices, and earn instant profits. We handle sourcing, storage, packaging, and door-to-door delivery!',
    registerBtnText: 'Register as Reseller',
    registerBtnLink: '/reseller/register',
    viewPackagesBtnText: 'View Packages & Pricing',
    viewPackagesBtnLink: '/reseller-program',
    benefits: [
      'No upfront inventory or warehouse costs',
      'Sell under your own brand, logo, and pricing',
      'Fully branded online store with custom domain support',
      'Instant profits and commission on every delivered order',
      'Automated courier management and hassle-free payouts',
    ],
    heroImage: '/assets/images/sectionbanner/reseller-section.webp',
  },
  pricingHeader: {
    offerBadge: '🔥 সীমিত সময়ের অফার চলছে',
    titlePart1: 'আপনার ব্যবসার জন্য সেরা',
    titleHighlight: 'Next.js ওয়েবসাইট প্যাকেজ',
    titlePart2: 'বেছে নিন',
    subtitle: 'মাসিক অথবা বাৎসরিক — আপনার সুবিধামতো প্ল্যান বেছে নিন। বাৎসরিক প্যাকেজে পাচ্ছেন সম্পূর্ণ ১ মাস ফ্রি!',
    featureBadges: [
      '⚡ Next.js সুপারফাস্ট সার্ভার',
      '📊 ফ্রি Server-Side Tracking',
      '🚫 কোনো হিডেন চার্জ নেই'
    ],
    valueCards: [
      {
        emoji: '🔒',
        title: 'SSL সিকিউরিটি',
        desc: 'এনক্রিপ্টেড কানেকশন',
      },
      {
        emoji: '🚀',
        title: 'Next.js স্পিড',
        desc: 'আল্ট্রা-ফাস্ট কম লেটেন্সি',
      },
      {
        emoji: '💳',
        title: 'সহজ পেমেন্ট',
        desc: 'bKash / Nagad / Rocket',
      },
    ],
  },
  packages: [
    {
      id: '1-month',
      name: '১ মাস (1 Month)',
      icon: 'Sprout',
      iconColor: 'text-emerald-400',
      tagline: 'নতুন রিসেলারদের জন্য নিয়মিত মাসিক প্ল্যান',
      regularSetup: 500,
      offerSetup: 500,
      savingsPct: '',
      monthlyFee: 500,
      yearlySavings: '',
      yearlyTotal: 500,
      popular: false,
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      features: [
        { text: '১,০০০ প্রোডাক্ট আপলোড লিমিট', highlight: false },
        { text: '৫০০ মাসিক অর্ডার ম্যানেজমেন্ট', highlight: false },
        { text: '৩০০ অটো প্রোডাক্ট আপলোড (মাদার ক্যাটালগ থেকে)', highlight: false },
        { text: 'Fraud Order Guard (ফেক অর্ডার রোধ)', highlight: false },
        { text: 'Incomplete Order Management (ড্রপ অর্ডার রিকভারি)', highlight: false },
        { text: 'সেন্ট্রাল কুরিয়ার ডেলিভারি ও ফুলফিলমেন্ট', highlight: false },
        { text: 'bKash / Nagad / Rocket পেমেন্ট গেটওয়ে', highlight: false },
        { text: 'রিয়েল-টাইম Push Notification সিস্টেম', highlight: true },
        { text: 'Server-Side Tracking (FB CAPI, Pixel, GA4) - ফ্রি', highlight: true },
        { text: 'Next.js Store Admin Panel', highlight: false },
        { text: 'Website Video Tutorial', highlight: false },
        { text: '১টি Logo Design', highlight: false },
        { text: '৩টি Cover Photo Design', highlight: false },
        { text: 'ড্র্যাগ & ড্রপ লাইভ স্টোর বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ল্যান্ডিং পেজ বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ব্যান্ডউইথ ও ক্লাউড সিডিএন', highlight: false },
        { text: 'কোনো হিডেন চার্জ নেই', highlight: true },
      ],
    },
    {
      id: '6-months',
      name: '৬ মাস (6 Months)',
      icon: 'Rocket',
      iconColor: 'text-purple-400',
      tagline: 'গ্রোথ ও অতিরিক্ত সাশ্রয়ের জন্য জনপ্রিয় প্ল্যান',
      regularSetup: 3000,
      offerSetup: 2000,
      savingsPct: '৩৩%',
      monthlyFee: 333,
      yearlySavings: '৳১,০০০ সাশ্রয়',
      yearlyTotal: 2000,
      popular: true,
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      features: [
        { text: '৩,০০০ প্রোডাক্ট আপলোড লিমিট', highlight: false },
        { text: '২,০০০ মাসিক অর্ডার ম্যানেজমেন্ট', highlight: false },
        { text: '১,০০০ অটো প্রোডাক্ট আপলোড (মাদার ক্যাটালগ থেকে)', highlight: false },
        { text: 'Fraud Order Guard (ফেক অর্ডার রোধ)', highlight: false },
        { text: 'Incomplete Order Management (ড্রপ অর্ডার রিকভারি)', highlight: false },
        { text: 'সেন্ট্রাল কুরিয়ার ডেলিভারি ও ফুলফিলমেন্ট', highlight: false },
        { text: 'bKash / Nagad / Rocket পেমেন্ট গেটওয়ে', highlight: false },
        { text: 'রিয়েল-টাইম Push Notification সিস্টেম', highlight: true },
        { text: 'Server-Side Tracking (FB CAPI, Pixel, GA4) - ফ্রি', highlight: true },
        { text: 'Next.js Store Admin Panel', highlight: false },
        { text: 'Priority Customer Support', highlight: true },
        { text: '১টি কাস্টম লোগো ডিজাইন', highlight: false },
        { text: '৫টি প্রিমিয়াম ব্যানার ও কভার ডিজাইন', highlight: false },
        { text: 'ড্র্যাগ & ড্রপ লাইভ স্টোর বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ল্যান্ডিং পেজ বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ব্যান্ডউইথ ও ক্লাউড সিডিএন', highlight: false },
        { text: 'কোনো হিডেন চার্জ নেই', highlight: true },
      ],
    },
    {
      id: '1-year',
      name: '১ বছর (1 Year)',
      icon: 'Crown',
      iconColor: 'text-amber-400',
      tagline: 'দীর্ঘমেয়াদী ব্যবসার জন্য সেরা ও সর্বোচ্চ সাশ্রয়ী প্ল্যান',
      regularSetup: 6000,
      offerSetup: 3000,
      savingsPct: '৫০%',
      monthlyFee: 250,
      yearlySavings: '৳৩,০০০ সাশ্রয় (৫০%)',
      yearlyTotal: 3000,
      popular: false,
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      features: [
        { text: 'আনলিমিটেড প্রোডাক্ট আপলোড লিমিট', highlight: true },
        { text: 'আনলিমিটেড অর্ডার ম্যানেজমেন্ট', highlight: true },
        { text: 'আনলিমিটেড অটো প্রোডাক্ট আপলোড', highlight: true },
        { text: 'Fraud Order Guard (ফেক অর্ডার রোধ)', highlight: false },
        { text: 'Incomplete Order Management (ড্রপ অর্ডার রিকভারি)', highlight: false },
        { text: 'সেন্ট্রাল কুরিয়ার ডেলিভারি ও ফুলফিলমেন্ট', highlight: false },
        { text: 'bKash / Nagad / Rocket পেমেন্ট গেটওয়ে', highlight: false },
        { text: 'রিয়েল-টাইম Push Notification সিস্টেম', highlight: true },
        { text: 'Server-Side Tracking (FB CAPI, Pixel, GA4) - ফ্রি', highlight: true },
        { text: 'Next.js Store Admin Panel', highlight: false },
        { text: 'VIP 24/7 Dedicated Manager Support', highlight: true },
        { text: '১টি এক্সক্লুসিভ ব্র্যান্ড লোগো ডিজাইন', highlight: false },
        { text: '১০টি প্রিমিয়াম ব্যানার ও কভার ডিজাইন', highlight: false },
        { text: 'ড্র্যাগ & ড্রপ লাইভ স্টোর বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ল্যান্ডিং পেজ বিল্ডার', highlight: false },
        { text: 'আনলিমিটেড ব্যান্ডউইথ ও ক্লাউড সিডিএন', highlight: false },
        { text: 'কোনো হিডেন চার্জ নেই', highlight: true },
      ],
    },
  ],
  whyChooseUs: {
    title: 'কেন আমাদের বেছে নেবেন?',
    subtitle: 'আমরা শুধু ওয়েবসাইট বানাই না — আপনার ব্যবসার ডিজিটাল পার্টনার হই',
    items: [
      {
        icon: 'Zap',
        iconColor: 'text-amber-400',
        title: 'Next.js ব্লেজিং স্পিড',
        desc: 'Next.js আল্ট্রা-ফাস্ট আর্কিটেকচারে আপনার সাইট লোড হবে চোখের পলকে — কাস্টমার ড্রপ কমে সেল বাড়বে',
      },
      {
        icon: 'Puzzle',
        iconColor: 'text-emerald-400',
        title: 'লাইভ স্টোর বিল্ডার',
        desc: 'কোনো কোডিং ছাড়া সহজেই ব্যানার, লেআউট ও কালার কাস্টমাইজ করে ব্র্যান্ড স্টোর তৈরি করুন',
      },
      {
        icon: 'ShieldCheck',
        iconColor: 'text-sky-400',
        title: 'Fraud Order Guard',
        desc: 'অটোমেটিক ফ্রড ও ফেইক অর্ডার ফিল্টার — আপনার সময়, প্যাকেজিং খরচ ও রিটার্ন লস বাঁচাবে',
      },
      {
        icon: 'Activity',
        iconColor: 'text-purple-400',
        title: 'ফ্রি Server-Side Tracking',
        desc: 'Facebook Conversion API, Pixel, TikTok ও GA4 সার্ভার সাইড ট্র্যাকিং সম্পূর্ণ বিনামূল্যে অন্তর্ভুক্ত',
      },
      {
        icon: 'Bell',
        iconColor: 'text-rose-400',
        title: 'রিয়েল-টাইম Push Notification',
        desc: 'নতুন অর্ডার, স্ট্যাটাস আপডেট ও অফার কাস্টমার এবং রিসেলারের ডিভাইসে তাৎক্ষণিক পুশ নোটিফিকেশনে পৌঁছে যায়',
      },
      {
        icon: 'Package',
        iconColor: 'text-amber-300',
        title: 'সেন্ট্রাল কুরিয়ার ও ফুলফিলমেন্ট',
        desc: 'অর্ডার আসা মাত্রই সেন্ট্রাল হাব থেকে প্যাকেজিং ও সারাদেশে কুরিয়ার ডেলিভারি সম্পন্ন',
      },
    ],
  },
  workflow: {
    steps: [
      {
        step: 1,
        icon: 'FileText',
        title: 'প্যাকেজ সিলেক্ট করুন',
        desc: 'আপনার ব্যবসার সাইজ অনুযায়ী প্যাকেজ বেছে নিন',
        time: '১ মিনিট',
      },
      {
        step: 2,
        icon: 'CreditCard',
        title: 'পেমেন্ট সম্পন্ন করুন',
        desc: 'bKash, Nagad বা Rocket এ সহজেই পে করুন',
        time: '২ মিনিট',
      },
      {
        step: 3,
        icon: 'Wrench',
        title: 'আমরা সেটআপ করি',
        desc: 'আমাদের টিম আপনার সাইট ডিজাইন ও সেটআপ করবে',
        time: '১-৩ দিন',
      },
      {
        step: 4,
        icon: 'Rocket',
        title: 'সাইট লাইভ!',
        desc: 'আপনার ওয়েবসাইট চালু — অর্ডার আসা শুরু!',
        time: 'এখনই',
      },
    ],
  },
  comparisonTable: {
    title: 'তিনটি প্যাকেজের তুলনা',
    subtitle: 'উপরে মাসিক/বাৎসরিক টগল পরিবর্তন করলে কার্ডগুলোর মূল্য বদলে যাবে',
    categories: [
      {
        name: '💰 প্রাইসিং',
        rows: [
          { feature: 'নিয়মিত সেটআপ চার্জ', starter: '৳২,৩০০', business: '৳৪,৮০০', professional: '৳৭,৮০০' },
          { feature: 'অফার সেটআপ চার্জ', starter: '৳১,৫০০', business: '৳২,৫০০', professional: '৳৩,৫০০' },
          { feature: 'সাশ্রয়ের হার', starter: '৩৫%', business: '৪৮%', professional: '৫৫%' },
          { feature: 'মাসিক চার্জ', starter: '৳৩৭০', business: '৳৬৯০', professional: '৳১,১৯০' },
          { feature: 'বাৎসরিক মোট (সেটআপ + ১১ মাস)', starter: '৳৫,৫৭০', business: '৳১০,০৯০', professional: '৳১৬,৫৯০' },
          { feature: 'বাৎসরিকে সাশ্রয়', starter: '৳১,১৭০ + ১ মাস ফ্রি', business: '৳২,৯৯০ + ১ মাস ফ্রি', professional: '৳৫,৪১০ + ১ মাস ফ্রি' },
        ],
      },
      {
        name: '⚙️ পারফরম্যান্স ও টেকনোলজি',
        rows: [
          { feature: 'Next.js সুপারফাস্ট ও কম লেটেন্সি আর্কিটেকচার', starter: true, business: true, professional: true },
          { feature: 'ড্র্যাগ & ড্রপ লাইভ স্টোর বিল্ডার', starter: true, business: true, professional: true },
          { feature: 'আনলিমিটেড ল্যান্ডিং পেজ বিল্ডার', starter: true, business: true, professional: true },
          { feature: 'আনলিমিটেড ব্যান্ডউইথ ও গ্লোবাল সিডিএন', starter: true, business: true, professional: true },
        ],
      },
      {
        name: '🛒 ই-কমার্স ফিচার',
        rows: [
          { feature: 'প্রোডাক্ট আপলোড লিমিট', starter: '১,০০০', business: '২,০০০', professional: '৪,০০০' },
          { feature: 'মাসিক অর্ডার ম্যানেজমেন্ট', starter: '৫০০', business: '২,০০০', professional: '৫,০০০' },
          { feature: 'অটো প্রোডাক্ট আপলোড (মাদার ক্যাটালগ থেকে)', starter: '৩০০', business: '৫০০', professional: '৮০০' },
          { feature: 'ডিসকাউন্ট / কুপন ম্যানেজমেন্ট', starter: true, business: true, professional: true },
          { feature: 'Fraud Order Guard (ফেক অর্ডার রোধ)', starter: true, business: true, professional: true },
          { feature: 'Incomplete Order Management (ড্রপ অর্ডার রিকভারি)', starter: true, business: true, professional: true },
          { feature: 'সেন্ট্রাল কুরিয়ার ডেলিভারি ও ফুলফিলমেন্ট (হ্যান্ডল্ড বাই স্বপ্নবাজ)', starter: true, business: true, professional: true },
          { feature: 'bKash / Nagad / Rocket পেমেন্ট গেটওয়ে', starter: true, business: true, professional: true },
        ],
      },
      {
        name: '🎨 ট্র্যাকিং, ডিজাইন ও সাপোর্ট',
        rows: [
          { feature: 'Server-Side Tracking (FB CAPI, Pixel, GA4, TikTok)', starter: 'ফ্রি অন্তর্ভুক্ত', business: 'ফ্রি অন্তর্ভুক্ত', professional: 'ফ্রি অন্তর্ভুক্ত' },
          { feature: 'Store Admin Panel', starter: true, business: true, professional: true },
          { feature: 'Website Video Tutorial', starter: true, business: true, professional: true },
          { feature: 'Logo Design', starter: '১টি', business: '১টি', professional: '১টি' },
          { feature: 'Cover Photo Design', starter: '৩টি', business: '৫টি', professional: '১০টি' },
          { feature: 'কাস্টম ফিচার', starter: false, business: 'সর্বোচ্চ ২টি', professional: 'সর্বোচ্চ ৪টি' },
          { feature: 'রিয়েল-টাইম Push Notification', starter: 'ফ্রি অন্তর্ভুক্ত', business: 'ফ্রি অন্তর্ভুক্ত', professional: 'ফ্রি অন্তর্ভুক্ত' },
          { feature: 'হিডেন চার্জ', starter: 'নেই', business: 'নেই', professional: 'নেই' },
        ],
      },
    ],
  },
  faqs: {
    title: 'সচরাচর জিজ্ঞাসা',
    subtitle: 'প্যাকেজ সম্পর্কে সাধারণ প্রশ্নগুলোর উত্তর',
    items: [
      {
        q: 'মাসিক প্ল্যানে কি যেকোনো সময় বাতিল করা যাবে?',
        a: 'হ্যাঁ, মাসিক প্ল্যানে কোনো দীর্ঘমেয়াদি চুক্তি নেই। আপনি যেকোনো সময় সাবস্ক্রিপশন বন্ধ বা পরিবর্তন করতে পারবেন।',
      },
      {
        q: 'বাৎসরিক প্ল্যানে "১ মাস ফ্রি" মানে কী?',
        a: 'বাৎসরিক প্ল্যান নিলে আপনি ১২ মাসের জন্য মাত্র ১১ মাসের ফি পরিশোধ করবেন — অর্থাৎ সম্পূর্ণ ১ মাসের মাসিক চার্জ সম্পূর্ণ ফ্রি পাচ্ছেন!',
      },
      {
        q: 'আমাদের ওয়েবসাইট কি WordPress নাকি Next.js?',
        a: 'প্ল্যাটফর্মটি ১০০% আধুনিক Next.js টেকনোলজিতে তৈরি। এটি সাধারণ WordPress ওয়েবসাইটের চেয়ে বহুগুণ দ্রুতগতির, সিকিউর এবং মোবাইল-অপ্টিমাইজড।',
      },
      {
        q: 'Server-Side Tracking কি সত্যিই ফ্রি?',
        a: 'হ্যাঁ! Facebook Conversion API, Meta Pixel, Google Analytics 4, TikTok Pixel ও Microsoft Clarity সার্ভার সাইড ট্র্যাকিং সকল প্যাকেজের সাথে সম্পূর্ণ ফ্রিতে সেটআপ করে দেওয়া হয়।',
      },
      {
        q: 'ওয়েবসাইট সেটআপ কতদিনে হয়?',
        a: 'অর্ডার ও পেমেন্ট কনফার্ম করার ১ থেকে ৩ কার্যদিবসের মধ্যে আপনার সম্পূর্ণ প্রস্তুত ওয়েবসাইট হ্যান্ডওভার করা হয়।',
      },
      {
        q: 'Push Notification সিস্টেম কিভাবে কাজ করে?',
        a: 'ওয়েবসাইটে নতুন অর্ডার আসলে বা অর্ডারের স্ট্যাটাস পরিবর্তন হলে তাৎক্ষণিকভাবে রিসেলার ও কাস্টমারের মোবাইল/ব্রাউজারে রিয়েল-টাইম Push Notification পৌঁছে যায়।',
      },
      {
        q: 'ডোমেইন ও হোস্টিং কি প্যাকেজে অন্তর্ভুক্ত?',
        a: 'হ্যাঁ, প্রিমিয়াম সাবডোমেন ও ক্লাউড হোস্টিং প্যাকেজের সাথে সম্পূর্ণ ফ্রি। আপনি চাইলে আপনার নিজস্ব কাস্টম ডোমেইনও (.com/.shop) ফ্রিতে কানেক্ট করতে পারবেন।',
      },
    ],
  },
  importantInfo: {
    title: 'গুরুত্বপূর্ণ তথ্য',
    items: [
      'মাসিক প্লান: এখন শুধু সেটআপ চার্জ পরিশোধ করুন। ওয়েবসাইট সেটআপের পরবর্তী মাস থেকে মাসিক ফি নেয়া হবে, চাইলে একসাথেও দিতে পারবেন।',
      'বাৎসরিক প্লান: সেটআপ চার্জ + ১১ মাসের চার্জ একসাথে এখনই পরিশোধ করুন — সম্পূর্ণ ১২শ মাস সম্পূর্ণ ফ্রি!',
      'কোনো হিডেন চার্জ নেই — সেটআপ চার্জ, মাসিক/বাৎসরিক চার্জ সবকিছু আগে থেকেই স্পষ্টভাবে দেখানো হয়েছে।',
      'Server-Side Tracking (Facebook Conversion API, Meta Pixel, TikTok, GA4 ও Microsoft Clarity): সম্পূর্ণ ফ্রিতে সকল প্যাকেজের সাথে অন্তর্ভুক্ত!',
      'রিয়েল-টাইম Push Notification সিস্টেম সকল প্যাকেজের সাথে সম্পূর্ণ বিনামূল্যে অন্তর্ভুক্ত — কোনো অতিরিক্ত চার্জ নেই।',
      'কাস্টম ফিচার বলতে বিদ্যমান Next.js সিস্টেমের সাথে সামঞ্জস্যপূর্ণ অতিরিক্ত ফিচার ডেভেলপমেন্ট বোঝানো হয়েছে। প্রয়োজনে আলাদা চার্জ প্রযোজ্য হতে পারে।',
    ],
  },
};

export function sanitizeResellerProgramData(data: any) {
  if (!data) return DEFAULT_RESELLER_PROGRAM_DATA;

  // Replace legacy "অটো কল সুবিধা" / "Auto Call" or Telegram in whyChooseUs.items
  if (data.whyChooseUs?.items && Array.isArray(data.whyChooseUs.items)) {
    data.whyChooseUs.items = data.whyChooseUs.items.map((item: any) => {
      if (
        item?.title?.includes('অটো কল') ||
        item?.title?.toLowerCase().includes('auto call') ||
        item?.icon === 'PhoneCall' ||
        item?.desc?.includes('টেলিগ্রাম') ||
        item?.desc?.toLowerCase().includes('telegram')
      ) {
        return {
          icon: 'Bell',
          iconColor: 'text-rose-400',
          title: 'রিয়েল-টাইম Push Notification',
          desc: 'নতুন অর্ডার, স্ট্যাটাস আপডেট ও অফার কাস্টমার এবং রিসেলারের ডিভাইসে তাৎক্ষণিক পুশ নোটিফিকেশনে পৌঁছে যায়',
        };
      }
      if (item?.desc?.includes('স্বপ্নবাজ সেন্ট্রাল হাব')) {
        return {
          ...item,
          desc: item.desc.replace('স্বপ্নবাজ সেন্ট্রাল হাব', 'সেন্ট্রাল হাব'),
        };
      }
      return item;
    });
  }

  // Replace legacy Auto Call or Telegram in packages features
  if (data.packages && Array.isArray(data.packages)) {
    data.packages = data.packages.map((pkg: any) => ({
      ...pkg,
      features: Array.isArray(pkg.features)
        ? pkg.features.map((f: any) =>
            f?.text?.toLowerCase().includes('auto call') ||
            f?.text?.includes('অটো কল') ||
            f?.text?.toLowerCase().includes('telegram') ||
            f?.text?.includes('টেলিগ্রাম')
              ? { text: 'রিয়েল-টাইম Push Notification সিস্টেম', highlight: true }
              : f
          )
        : pkg.features,
    }));
  }

  // Replace legacy Auto Call or Telegram in FAQs
  if (data.faqs?.items && Array.isArray(data.faqs.items)) {
    data.faqs.items = data.faqs.items.map((faq: any) =>
      faq?.q?.toLowerCase().includes('auto call') ||
      faq?.q?.includes('অটো কল') ||
      faq?.a?.toLowerCase().includes('telegram') ||
      faq?.a?.includes('টেলিগ্রাম')
        ? {
            q: 'Push Notification সিস্টেম কিভাবে কাজ করে?',
            a: 'ওয়েবসাইটে নতুন অর্ডার আসলে বা অর্ডারের স্ট্যাটাস পরিবর্তন হলে তাৎক্ষণিকভাবে রিসেলার ও কাস্টমারের মোবাইল/ব্রাউজারে রিয়েল-টাইম Push Notification পৌঁছে যায়।',
          }
        : faq
    );
  }

  // Replace legacy Auto Call or Telegram in Important Info
  if (data.importantInfo?.items && Array.isArray(data.importantInfo.items)) {
    data.importantInfo.items = data.importantInfo.items.map((info: string) =>
      typeof info === 'string' &&
      (info.toLowerCase().includes('auto call') ||
        info.includes('অটো কল') ||
        info.toLowerCase().includes('telegram') ||
        info.includes('টেলিগ্রাম'))
        ? 'রিয়েল-টাইম Push Notification সিস্টেম সকল প্যাকেজের সাথে সম্পূর্ণ বিনামূল্যে অন্তর্ভুক্ত — কোনো অতিরিক্ত চার্জ নেই।'
        : info
    );
  }

  return data;
}
