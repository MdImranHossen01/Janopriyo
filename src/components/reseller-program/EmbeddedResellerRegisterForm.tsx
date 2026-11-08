'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
  Store,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  Globe,
  ArrowRight,
  Truck,
  Building2,
  Eye,
  EyeOff,
  Check,
  Package,
  CreditCard,
  Copy,
  Star,
  Landmark,
} from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { divisions, getDistrictsByDivision, getThanasByDistrict } from '@/lib/bd-locations';
import { IResellerPackage } from '@/types/reseller-program';
import { fbEvent } from '@/lib/fpixel';
import { ttEvent } from '@/lib/tiktok';
import { normalizePhoneNumber } from '@/lib/utils';

// Standard 3 duration packages for Janopriyo Reseller Program
const JANOPRIYO_PACKAGES = [
  {
    id: '1-month',
    name: '১ মাস (1 Month)',
    durationLabel: '১ মাস মেয়াদ',
    regularPrice: 500,
    offerPrice: 500,
    discountBadge: '',
    perMonthText: 'নিয়মিত মাসিক প্ল্যান (কোনো ডিসকাউন্ট নেই)',
    planTag: 'মাসিক প্ল্যান',
    bestValue: false,
  },
  {
    id: '6-months',
    name: '৬ মাস (6 Months)',
    durationLabel: '৬ মাস মেয়াদ',
    regularPrice: 3000,
    offerPrice: 2000,
    discountBadge: '৩৩% ছাড় (৳১,০০০ সাশ্রয়)',
    perMonthText: 'প্রতি মাসে মাত্র ৳৩৩৩',
    planTag: 'ষাণ্মাসিক প্ল্যান',
    bestValue: false,
  },
  {
    id: '1-year',
    name: '১ বছর (1 Year)',
    durationLabel: '১ বছর মেয়াদ',
    regularPrice: 6000,
    offerPrice: 3000,
    discountBadge: '৫০% ছাড় (৳৩,০০০ সাশ্রয়)',
    perMonthText: 'প্রতি মাসে মাত্র ৳২৫০',
    planTag: 'বাৎসরিক প্ল্যান',
    bestValue: true,
  },
];

const createSchema = (isLoggedIn: boolean) =>
  z.object({
    name: isLoggedIn ? z.string().optional() : z.string().min(2, 'আপনার পুরো নাম লিখুন'),
    email: isLoggedIn ? z.string().optional() : z.string().email('সঠিক ইমেইল এড্রেস লিখুন'),
    password: isLoggedIn ? z.string().optional() : z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
    storeName: z.string().min(3, 'স্টোরের নাম কমপক্ষে ৩ অক্ষরের হতে হবে'),
    subdomain: z
      .string()
      .min(3, 'সাবডোমেন কমপক্ষে ৩ অক্ষরের হতে হবে')
      .max(30, 'সাবডোমেন ৩০ অক্ষরের বেশি হতে পারবে না')
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং হাইফেন (-) ব্যবহার করা যাবে'),
    phone: z
      .string()
      .regex(
        /^(?:\+88|88|\+৮৮|৮৮|0088|০০৮৮)?(?:01|০১)[3-9৩-৯][\d০-৯]{8}$/,
        'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
      ),
    division: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
    district: z.string().min(1, 'জেলা নির্বাচন করুন'),
    thana: z.string().min(1, 'থানা / উপজেলা নির্বাচন করুন'),
    address: z.string().min(5, 'সম্পূর্ণ পিকআপ ঠিকানা লিখুন (রোড, বাসা, এরিয়া)'),
    hubName: z.string().optional(),
    description: z.string().optional(),
    plan: z.string().min(1, 'প্যাকেজ নির্বাচন করুন'),
  });

type FormValues = z.infer<ReturnType<typeof createSchema>>;

interface EmbeddedResellerRegisterFormProps {
  packages?: IResellerPackage[];
  selectedPlanId?: string;
  onSelectPlanId?: (id: string) => void;
}

export function EmbeddedResellerRegisterForm({
  selectedPlanId,
  onSelectPlanId,
}: EmbeddedResellerRegisterFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session?.user;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Payment settings & state (modeled after Checkout page)
  const [settings, setSettings] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [paymentDetailTab, setPaymentDetailTab] = useState<'phone' | 'trx'>('phone');
  const [manualDetails, setManualDetails] = useState({
    providerName: '',
    senderNumber: '',
    transactionId: '',
  });

  const activePlanId =
    selectedPlanId && JANOPRIYO_PACKAGES.some((p) => p.id === selectedPlanId)
      ? selectedPlanId
      : '1-year';

  const activePackage =
    JANOPRIYO_PACKAGES.find((p) => p.id === activePlanId) || JANOPRIYO_PACKAGES[2];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'janopriyo.com';

  const schema = createSchema(isLoggedIn);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      storeName: '',
      subdomain: '',
      phone: '',
      division: '',
      district: '',
      thana: '',
      address: '',
      hubName: '',
      description: '',
      plan: activePlanId,
    },
  });

  // Sync external selectedPlanId into form
  useEffect(() => {
    if (selectedPlanId && JANOPRIYO_PACKAGES.some((p) => p.id === selectedPlanId)) {
      form.setValue('plan', selectedPlanId, { shouldValidate: true });
    }
  }, [selectedPlanId, form]);

  // Fetch global settings for manualPaymentConfig (bKash, Nagad, Rocket, Bangla QR)
  useEffect(() => {
    async function fetchPaymentSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const sData = await res.json();
          setSettings(sData);
        }
      } catch (err) {
        console.error('Failed to fetch payment settings:', err);
      }
    }
    fetchPaymentSettings();
  }, []);

  // Helper to fire InitiateCheckout for a specific package
  const triggerInitiateCheckout = (pkg: typeof activePackage) => {
    const checkoutPayload = {
      content_ids: [pkg.id],
      content_name: `Reseller Package - ${pkg.name}`,
      content_type: 'product',
      value: pkg.offerPrice,
      currency: 'BDT',
      num_items: 1,
      contents: [
        {
          id: pkg.id,
          quantity: 1,
          item_price: pkg.offerPrice,
        },
      ],
    };

    const userData = {
      em: session?.user?.email || undefined,
      country: 'bd',
    };

    fbEvent('InitiateCheckout', checkoutPayload, userData);
    ttEvent('InitiateCheckout', checkoutPayload, userData);
  };

  // Track ViewContent + initial InitiateCheckout when page loads
  const hasTrackedInitialEvents = useRef(false);
  useEffect(() => {
    if (hasTrackedInitialEvents.current) return;
    hasTrackedInitialEvents.current = true;

    const viewContentPayload = {
      content_ids: JANOPRIYO_PACKAGES.map((p) => p.id),
      content_name: 'Janopriyo Reseller Subscription Program',
      content_category: 'Reseller Subscription',
      content_type: 'product_group',
      value: activePackage.offerPrice,
      currency: 'BDT',
      contents: JANOPRIYO_PACKAGES.map((p) => ({
        id: p.id,
        quantity: 1,
        item_price: p.offerPrice,
      })),
    };

    const initialUserData = {
      em: session?.user?.email || undefined,
      country: 'bd',
    };

    const waitForFbq = (maxWaitMs = 4000, intervalMs = 200) =>
      new Promise<void>((resolve) => {
        if (typeof window !== 'undefined' && window.fbq) {
          resolve();
          return;
        }
        let elapsed = 0;
        const timer = setInterval(() => {
          elapsed += intervalMs;
          if ((typeof window !== 'undefined' && window.fbq) || elapsed >= maxWaitMs) {
            clearInterval(timer);
            resolve();
          }
        }, intervalMs);
      });

    waitForFbq().then(() => {
      // 1. Fire ViewContent on page load
      fbEvent('ViewContent', viewContentPayload, initialUserData);
      ttEvent('ViewContent', viewContentPayload, initialUserData);

      // 2. Fire InitiateCheckout for the default selected package
      triggerInitiateCheckout(activePackage);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watched = form.watch();
  const subdomainValue = watched.subdomain;
  const selectedDivision = watched.division;
  const selectedDistrict = watched.district;

  const availableDistricts = selectedDivision ? getDistrictsByDivision(selectedDivision) : [];
  const availableThanas = selectedDistrict ? getThanasByDistrict(selectedDistrict) : [];

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    form.setValue('division', val, { shouldValidate: true });
    form.setValue('district', '', { shouldValidate: false });
    form.setValue('thana', '', { shouldValidate: false });
    form.clearErrors(['district', 'thana']);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    form.setValue('district', val, { shouldValidate: true });
    form.setValue('thana', '', { shouldValidate: false });
    form.clearErrors('thana');
  };

  const handleThanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    form.setValue('thana', val, { shouldValidate: true });
    if (val) form.clearErrors('thana');
  };

  // Determine available manual payment methods from settings (fallback to all 4 if none active yet)
  const manualConfig = settings?.manualPaymentConfig || {};
  const defaultMfsPhone = '01919011101';
  const hasAnyActiveMethod =
    manualConfig?.bkash?.active ||
    manualConfig?.nagad?.active ||
    manualConfig?.rocket?.active ||
    manualConfig?.banglaQr?.active;

  const getMethodConfig = (method: 'bkash' | 'nagad' | 'rocket' | 'banglaQr' | 'islamiBank') => {
    if (method === 'islamiBank') {
      return {
        active: true,
        bankName: 'Islami Bank Bangladesh PLC',
        accountTitle: 'MD IMRAN HOSSEN',
        accountNumber: '20503050203083010',
        branch: 'Matlab, Chandpur',
        routingNo: '125131188',
        number: '20503050203083010',
      };
    }
    const cfg = manualConfig?.[method];
    if (hasAnyActiveMethod) {
      return {
        ...cfg,
        number: cfg?.number?.trim() || defaultMfsPhone,
      };
    }
    // Fallback if admin hasn't toggled active in settings yet so options are always visible
    return {
      active: true,
      number: cfg?.number?.trim() || defaultMfsPhone,
      qrCode: cfg?.qrCode || '',
    };
  };

  // Strict form + payment validation to enable/disable Submit button
  const isPersonalValid = isLoggedIn
    ? true
    : (watched.name || '').trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((watched.email || '').trim()) &&
      (watched.password || '').length >= 6;

  const isPhoneValid = /^(?:\+88|88|\+৮৮|৮৮|0088|০০৮৮)?(?:01|০১)[3-9৩-৯][\d০-৯]{8}$/.test(
    watched.phone || ''
  );
  const isStoreNameValid = (watched.storeName || '').trim().length >= 3;
  const isSubdomainValid =
    (watched.subdomain || '').length >= 3 &&
    (watched.subdomain || '').length <= 30 &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(watched.subdomain || '');

  const isLocationValid = !!(
    watched.division &&
    watched.district &&
    watched.thana &&
    (watched.address || '').trim().length >= 5
  );

  const isPaymentVerified = !!(
    selectedMethod?.id &&
    (selectedMethod?.id === 'banglaQr'
      ? manualDetails.providerName.trim().length >= 2 &&
        manualDetails.senderNumber.trim().length >= 6
      : selectedMethod?.id === 'islamiBank'
      ? manualDetails.senderNumber.trim().length >= 5
      : manualDetails.senderNumber.trim().length >= 11)
  );

  const isFormValid = !!(
    activePlanId &&
    isPersonalValid &&
    isStoreNameValid &&
    isPhoneValid &&
    isSubdomainValid &&
    isLocationValid &&
    isPaymentVerified
  );

  const onSubmit = async (values: FormValues) => {
    if (!isPaymentVerified) {
      toast.error('অনুগ্রহ করে পেমেন্ট মেথড নির্বাচন করে পেমেন্ট ভেরিফিকেশন তথ্য প্রদান করুন!');
      return;
    }

    setSubmitting(true);
    try {
      const cleanedPhone = normalizePhoneNumber(values.phone) || values.phone.trim();
      const cleanSub = values.subdomain
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9-]/g, '')
        .trim();

      const payload: any = {
        storeName: values.storeName.trim(),
        subdomain: cleanSub,
        phone: cleanedPhone,
        division: values.division,
        district: values.district,
        thana: values.thana,
        address: values.address.trim(),
        hubName: values.hubName?.trim() || `${values.storeName.trim()} Hub`,
        description: values.description?.trim() || '',
        plan: activePackage.id,
        subscriptionPlan: {
          id: activePackage.id,
          name: activePackage.name,
          price: activePackage.offerPrice,
        },
        manualPaymentDetails: {
          methodName: selectedMethod?.id === 'islamiBank' ? 'bank' : selectedMethod?.id,
          providerName: selectedMethod?.id === 'banglaQr' ? manualDetails.providerName.trim() : '',
          senderNumber: manualDetails.senderNumber.trim(),
          transactionId: '',
          amount: activePackage.offerPrice,
        },
        pickupAddress: {
          hubName: values.hubName?.trim() || `${values.storeName.trim()} Hub`,
          contactPerson: values.name?.trim() || session?.user?.name || values.storeName.trim(),
          phone: cleanedPhone,
          division: values.division,
          district: values.district,
          thana: values.thana,
          address: values.address.trim(),
        },
      };

      if (!isLoggedIn) {
        payload.name = values.name?.trim();
        payload.email = values.email?.trim().toLowerCase();
        payload.password = values.password;
      }

      const res = await fetch('/api/reseller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Fire Purchase Event immediately on successful submission (just like Checkout page)
        try {
          const fullName = values.name?.trim() || session?.user?.name || values.storeName.trim();
          const nameParts = fullName.split(/\s+/);

          const purchaseEventData = {
            value: activePackage.offerPrice,
            currency: 'BDT',
            content_ids: [activePackage.id],
            content_name: `Reseller Package - ${activePackage.name}`,
            content_type: 'product',
            num_items: 1,
            contents: [
              {
                id: activePackage.id,
                quantity: 1,
                item_price: activePackage.offerPrice,
              },
            ],
          };

          const purchaseUserData: any = {
            em: values.email?.trim().toLowerCase() || session?.user?.email || '',
            ph: cleanedPhone,
            fn: nameParts[0] || '',
            ln: nameParts.slice(1).join(' ') || '',
            ct: values.district || 'Dhaka',
            st: values.division || 'Dhaka',
            country: 'bd',
          };

          const eventId = data.reseller?._id || `reseller_${Date.now()}`;
          fbEvent('Purchase', purchaseEventData, purchaseUserData, eventId);
          ttEvent('Purchase', purchaseEventData, purchaseUserData, eventId);
        } catch (trackingError) {
          console.error('Purchase tracking error:', trackingError);
        }

        setSuccess(true);
        toast.success('রিসেলার আবেদন ও পেমেন্ট তথ্য সফলভাবে সাবমিট হয়েছে!');

        await Swal.fire({
          icon: 'success',
          title: 'আবেদন ও পেমেন্ট সফল হয়েছে!',
          text: `আপনার "${activePackage.name}" প্যাকেজের আবেদন এবং পেমেন্ট তথ্য সফলভাবে গৃহীত হয়েছে। খুব শীঘ্রই যাচাই করে আপনার স্টোরটি সক্রিয় করা হবে।`,
          confirmButtonText: 'ঠিক আছে',
          confirmButtonColor: '#c70039',
          background: '#1a0430',
          color: '#ffffff',
        });

        // Guest auto-login in background
        if (!isLoggedIn && values.email && values.password) {
          try {
            await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirect: false,
            });
          } catch (e) {
            console.error('Auto login error:', e);
          }
        }
      } else {
        toast.error(data.error || 'আবেদন সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        Swal.fire({
          icon: 'error',
          title: 'ব্যর্থ হয়েছে',
          text: data.error || 'আবেদন সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
          confirmButtonText: 'ঠিক আছে',
          confirmButtonColor: '#c70039',
          background: '#1a0430',
          color: '#ffffff',
        });
      }
    } catch {
      toast.error('নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-[#20053b] to-[#120124] border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] space-y-6">
        <div className="h-20 w-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            অভিনন্দন! আপনার আবেদন ও পেমেন্ট গৃহীত হয়েছে
          </h2>
          <p className="text-sm sm:text-base text-purple-200/80 max-w-lg mx-auto leading-relaxed">
            আপনার নির্বাচিত <strong>{activePackage.name} (৳{activePackage.offerPrice.toLocaleString('bn-BD')})</strong> প্যাকেজের আবেদন আমাদের কাছে পৌঁছেছে। আমাদের টিম পেমেন্ট ভেরিফাই করে খুব দ্রুত আপনার স্টোর সক্রিয় করে দেবে।
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <button
            type="button"
            onClick={() => router.push('/reseller/dashboard')}
            className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>রিসেলার ড্যাশবোর্ড</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="py-3.5 px-6 rounded-xl font-semibold text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-400/30 text-pink-300 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
          <Sparkles className="size-4 text-pink-400" />
          <span>অনলাইন রেজিস্ট্রেশন ও পেমেন্ট ফরম</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          প্যাকেজ সিলেক্ট করে রিসেলার রেজিস্ট্রেশন সম্পন্ন করুন
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
          নিচে ১ মাস, ৬ মাস অথবা ১ বছরের প্যাকেজ বেছে নিন, আপনার স্টোরের তথ্য দিন এবং পেমেন্ট ভেরিফাই করে সাবমিট করুন।
        </p>

        {isLoggedIn && session?.user && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span>লগইন করা আছেন: {session.user.name || session.user.email}</span>
          </div>
        )}
      </div>

      {/* ── Step 1: 3 Package Selection Cards (Always all 3 shown here) ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
            <Package className="size-4.5 text-pink-400" />
            <span>১. আপনার পছন্দের প্যাকেজ সিলেক্ট করুন *</span>
          </div>
          <span className="text-xs text-purple-200/70 font-medium">
            নির্বাচিত: <strong className="text-white">{activePackage.name} (৳{activePackage.offerPrice.toLocaleString('bn-BD')})</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {JANOPRIYO_PACKAGES.map((pkg) => {
            const isSelected = activePlanId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => {
                  form.setValue('plan', pkg.id, { shouldValidate: true });
                  onSelectPlanId?.(pkg.id);
                  triggerInitiateCheckout(pkg);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-900/50 via-purple-900/70 to-[#1a0330] border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.3)] ring-2 ring-pink-400/40 scale-[1.01]'
                    : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/30 text-slate-300'
                }`}
              >
                {/* Top Best Value Ribbon */}
                {pkg.bestValue ? (
                  <div className="inline-flex items-center gap-1 bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full w-fit mb-2">
                    <Sparkles className="h-3 w-3" /> সেরা ভ্যালু (৫০% ছাড়)
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 bg-white/10 border border-white/15 text-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit mb-2">
                    {pkg.planTag}
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-base sm:text-lg text-white">{pkg.name}</span>
                  <span
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-pink-500 border-pink-300 text-white shadow-md shadow-pink-500/50'
                        : 'border-white/30 bg-white/5'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </span>
                </div>

                <div className="my-1">
                  {pkg.regularPrice > pkg.offerPrice && (
                    <div className="text-xs text-purple-300/60 line-through">
                      নিয়মিত মূল্য: ৳{pkg.regularPrice.toLocaleString('bn-BD')}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      ৳{pkg.offerPrice.toLocaleString('bn-BD')}
                    </span>
                    <span className="text-xs text-purple-200/80 font-semibold">
                      / {pkg.durationLabel}
                    </span>
                  </div>
                </div>

                {pkg.discountBadge && (
                  <div className="mt-1.5">
                    <span className="inline-block text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      ✔ {pkg.discountBadge}
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-purple-200/80 mt-2 font-medium">
                  {pkg.perMonthText}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Form Container Card ── */}
      <div className="bg-gradient-to-b from-white/10 via-white/5 to-[#150226]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          {/* Guest Personal & Account Details */}
          {!isLoggedIn && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider border-b border-white/10 pb-2">
                <User className="size-4 text-pink-400" />
                <span>২. ব্যক্তিগত ও একাউন্ট তথ্য</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  আপনার পুরো নাম <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                  <User className="size-4.5 text-pink-400 mr-3 shrink-0" />
                  <input
                    {...form.register('name')}
                    placeholder="যেমন: মোঃ ইমরান হোসেন"
                    className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.name.message as string}
                  </p>
                )}
              </div>

              {/* Email Address & Password (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                    ইমেইল এড্রেস <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                    <Mail className="size-4.5 text-pink-400 mr-3 shrink-0" />
                    <input
                      {...form.register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">
                      {form.formState.errors.email.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                    পাসওয়ার্ড <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                    <Lock className="size-4.5 text-pink-400 mr-3 shrink-0" />
                    <input
                      {...form.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-purple-300/70 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">
                      {form.formState.errors.password.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Store Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider border-b border-white/10 pb-2">
              <Store className="size-4 text-pink-400" />
              <span>{isLoggedIn ? '২.' : '৩.'} স্টোরের ব্র্যান্ড তথ্য</span>
            </div>

            {/* Store Name & Phone Number (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  স্টোর / ব্র্যান্ডের নাম <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                  <Store className="size-4.5 text-pink-400 mr-3 shrink-0" />
                  <input
                    {...form.register('storeName')}
                    placeholder="যেমন: ড্রিম শপ"
                    className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                  />
                </div>
                {form.formState.errors.storeName && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.storeName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  মোবাইল / হোয়াটসঅ্যাপ নম্বর <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                  <Phone className="size-4.5 text-pink-400 mr-3 shrink-0" />
                  <input
                    {...form.register('phone')}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^\d০-৯+]/g, '');
                      form.setValue('phone', sanitized, { shouldValidate: true });
                    }}
                    onBlur={(e) => {
                      const norm = normalizePhoneNumber(e.target.value);
                      if (norm) {
                        form.setValue('phone', norm, { shouldValidate: true });
                      }
                    }}
                    placeholder="017XXXXXXXX"
                    type="tel"
                    className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.phone.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Store Subdomain */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                স্টোর সাবডোমেইন <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                <Globe className="size-4.5 text-pink-400 mr-3 shrink-0" />
                <input
                  {...form.register('subdomain')}
                  onChange={(e) => {
                    const sanitized = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/-+/g, '-');
                    form.setValue('subdomain', sanitized, { shouldValidate: true });
                  }}
                  placeholder="dreamshop"
                  className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                />
                <span className="text-xs sm:text-sm font-bold text-pink-300 bg-pink-500/15 border border-pink-500/30 px-3 py-1.5 rounded-lg shrink-0 ml-2 select-none">
                  .{rootDomain}
                </span>
              </div>
              {subdomainValue && (
                <p className="text-xs text-pink-300 mt-1.5 font-medium flex items-center gap-1.5 pl-1">
                  <Globe className="size-3.5 shrink-0" />
                  <span>
                    আপনার স্টোর লিংক:{' '}
                    <strong>
                      https://
                      {subdomainValue
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9-]/g, '')}
                      .{rootDomain}
                    </strong>
                  </span>
                </p>
              )}
              {form.formState.errors.subdomain && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {form.formState.errors.subdomain.message as string}
                </p>
              )}
            </div>

            {/* Store Description (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                স্টোরের সংক্ষিপ্ত বিবরণ{' '}
                <span className="text-purple-300/50 text-xs font-normal">(ঐচ্ছিক)</span>
              </label>
              <div className="relative bg-black/40 border border-white/15 rounded-xl p-3 focus-within:border-pink-400 focus-within:ring-1 focus-within:ring-pink-400/40 transition-all">
                <textarea
                  {...form.register('description')}
                  rows={2}
                  placeholder="আপনার কালেকশন বা স্টোরের বিশেষত্ব সম্পর্কে সংক্ষেপে লিখুন..."
                  className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none resize-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Courier Pickup Location */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider">
                <Truck className="size-4 text-pink-400" />
                <span>{isLoggedIn ? '৩.' : '৪.'} কুরিয়ার পিকআপ ও ওয়্যারহাউজ লোকেশন</span>
              </div>
              <span className="text-[11px] text-purple-300/60 font-medium hidden sm:inline">
                ডেলিভারি ও রিটার্নের জন্য
              </span>
            </div>

            {/* Division, District, Thana (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Division */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  বিভাগ <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-3 py-3 focus-within:border-pink-400 transition-all">
                  <select
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className="w-full bg-transparent text-white text-sm outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="" className="bg-[#1b0330] text-purple-200">
                      বিভাগ নির্বাচন করুন
                    </option>
                    {divisions.map((div) => (
                      <option key={div} value={div} className="bg-[#1b0330] text-white">
                        {div}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.division && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.division.message as string}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  জেলা <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-3 py-3 focus-within:border-pink-400 transition-all">
                  <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedDivision}
                    className="w-full bg-transparent text-white text-sm outline-none appearance-none cursor-pointer font-medium disabled:text-purple-300/30 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#1b0330] text-purple-200">
                      {selectedDivision ? 'জেলা নির্বাচন করুন' : 'আগে বিভাগ বাছুন'}
                    </option>
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist} className="bg-[#1b0330] text-white">
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.district && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.district.message as string}
                  </p>
                )}
              </div>

              {/* Thana */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                  থানা / উপজেলা <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-3 py-3 focus-within:border-pink-400 transition-all">
                  <select
                    value={watched.thana}
                    onChange={handleThanaChange}
                    disabled={!selectedDistrict}
                    className="w-full bg-transparent text-white text-sm outline-none appearance-none cursor-pointer font-medium disabled:text-purple-300/30 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#1b0330] text-purple-200">
                      {selectedDistrict ? 'থানা নির্বাচন করুন' : 'আগে জেলা বাছুন'}
                    </option>
                    {availableThanas.map((th) => (
                      <option key={th} value={th} className="bg-[#1b0330] text-white">
                        {th}
                      </option>
                    ))}
                  </select>
                </div>
                {form.formState.errors.thana && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {form.formState.errors.thana.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                বিস্তারিত ঠিকানা <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all">
                <MapPin className="size-4.5 text-pink-400 mr-3 shrink-0" />
                <input
                  {...form.register('address')}
                  placeholder="যেমন: বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা"
                  className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                />
              </div>
              {form.formState.errors.address && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {form.formState.errors.address.message as string}
                </p>
              )}
            </div>

            {/* Hub Nickname (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-purple-100 mb-1.5">
                হাব / ওয়্যারহাউজ নাম{' '}
                <span className="text-purple-300/50 text-xs font-normal">(ঐচ্ছিক)</span>
              </label>
              <div className="relative flex items-center bg-black/40 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all">
                <Building2 className="size-4.5 text-pink-400 mr-3 shrink-0" />
                <input
                  {...form.register('hubName')}
                  placeholder="যেমন: সেন্ট্রাল হাব / প্রধান শাখা"
                  className="w-full bg-transparent text-white placeholder:text-purple-300/40 text-sm sm:text-base outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* ── Step 4/5: Manual Payment Section (bKash, Nagad, Rocket, Bangla QR, Islami Bank) ── */}
          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-wider">
                <CreditCard className="size-4.5 text-pink-400" />
                <span>{isLoggedIn ? '৪.' : '৫.'} পেমেন্ট মেথড নির্বাচন করুন (MFS / Bangla QR / Bank) *</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-white w-fit">
                <span>প্রদেয় ফি ({activePackage.name}):</span>
                <span className="text-amber-300 text-sm font-black">
                  ৳{activePackage.offerPrice.toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <p className="text-xs text-purple-200/80">
              নিচের যেকোনো একটি পেমেন্ট মাধ্যম (বিকাশ, নগদ, রকেট, বাংলা কিউআর অথবা ব্যাংক) সিলেক্ট করে নির্ধারিত <strong>৳{activePackage.offerPrice.toLocaleString('bn-BD')}</strong> পেমেন্ট সম্পন্ন করুন এবং ভেরিফিকেশন তথ্য দিন:
            </p>

            {/* 5 Manual Payment Provider Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {(['bkash', 'nagad', 'rocket', 'banglaQr', 'islamiBank'] as const).map((method) => {
                const config = getMethodConfig(method);
                if (!config?.active) return null;
                const isSelected = selectedMethod?.id === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setSelectedMethod({ id: method, ...config });
                      const paymentPayload = {
                        content_ids: [activePackage.id],
                        content_name: `Reseller Package - ${activePackage.name}`,
                        content_category: method === 'islamiBank' ? 'BANK' : method.toUpperCase(),
                        content_type: 'product',
                        value: activePackage.offerPrice,
                        currency: 'BDT',
                      };
                      const paymentUserData = {
                        em: watched.email || session?.user?.email || undefined,
                        ph: watched.phone || undefined,
                        country: 'bd',
                      };
                      fbEvent('AddPaymentInfo', paymentPayload, paymentUserData);
                      ttEvent('AddPaymentInfo', paymentPayload, paymentUserData);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 relative ${
                      isSelected
                        ? 'border-pink-400 bg-gradient-to-b from-pink-500/25 to-purple-900/50 shadow-[0_0_25px_rgba(236,72,153,0.3)] scale-[1.02]'
                        : 'border-white/15 bg-black/40 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                      {method === 'banglaQr' ? (
                        <Image
                          src="/qrlogo.jpg"
                          alt="Bangla QR"
                          width={44}
                          height={44}
                          className="h-full w-auto object-contain rounded"
                        />
                      ) : method === 'islamiBank' ? (
                        <div className="h-full w-full rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                          <Landmark className="h-6 w-6" />
                        </div>
                      ) : (
                        <Image
                          src={`/assets/${method}logo.webp`}
                          alt={method}
                          width={44}
                          height={44}
                          className="h-full w-auto object-contain"
                        />
                      )}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-white text-center leading-tight">
                      {method === 'banglaQr'
                        ? 'Bangla QR'
                        : method === 'islamiBank'
                        ? 'Bank'
                        : method}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> সিলেক্টেড
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {!selectedMethod?.id && (
              <p className="text-xs text-amber-300 font-bold text-center bg-amber-500/10 border border-amber-400/20 rounded-xl py-2.5 px-4 animate-pulse">
                👆 পেমেন্ট করতে উপরের যেকোনো একটি মাধ্যম (bKash / Nagad / Rocket / Bangla QR / Bank) সিলেক্ট করুন
              </p>
            )}

            {/* Expanded Payment Instructions & Verification Box (Checkout Page Style) */}
            {selectedMethod?.id && (
              <div className="rounded-3xl bg-white text-slate-900 border-2 border-pink-400/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Box Header */}
                <div className="py-3.5 px-5 bg-gradient-to-r from-[#c70039] via-rose-600 to-pink-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-xl p-1.5 shadow-md shrink-0 flex items-center justify-center">
                      {selectedMethod.id === 'banglaQr' ? (
                        <Image
                          src="/qrlogo.jpg"
                          alt="Bangla QR"
                          width={32}
                          height={32}
                          className="h-full w-auto object-contain rounded"
                        />
                      ) : selectedMethod.id === 'islamiBank' ? (
                        <div className="h-full w-full rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                          <Landmark className="h-5 w-5" />
                        </div>
                      ) : (
                        <Image
                          src={`/assets/${selectedMethod.id}logo.webp`}
                          alt={selectedMethod.id}
                          width={36}
                          height={36}
                          className="h-full w-auto object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black uppercase tracking-tight">
                        {selectedMethod.id === 'banglaQr'
                          ? 'Pay via Bangla QR'
                          : selectedMethod.id === 'islamiBank'
                          ? 'Pay via Bank'
                          : `Pay via ${selectedMethod.id}`}
                      </h4>
                      <p className="text-[11px] text-white/90 font-medium">
                        প্যাকেজ: {activePackage.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right bg-black/25 px-3.5 py-1.5 rounded-xl border border-white/20">
                    <span className="block text-[10px] uppercase text-white/80 font-bold">
                      মোট প্রদেয়
                    </span>
                    <span className="text-base sm:text-lg font-black text-white">
                      ৳{activePackage.offerPrice.toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Box Body */}
                <div className="p-5 sm:p-6 space-y-5">
                  {selectedMethod.id === 'islamiBank' ? (
                    <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200/80 space-y-3.5">
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-emerald-200/70">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-emerald-700" />
                          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-emerald-950">
                            Bank : Islami Bank Bangladesh PLC
                          </span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] py-0.5 px-2.5 rounded-full">
                          Bank Transfer / NPSB / BEFTN
                        </span>
                      </div>

                      {/* Account Number Row with Copy Button */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Account Number
                        </span>
                        <div className="flex items-center justify-between gap-2.5">
                          <p className="text-base sm:text-xl font-black tracking-widest text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-emerald-300 flex-1 select-all">
                            20503050203083010
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('20503050203083010');
                              toast.success('ব্যাংক একাউন্ট নম্বর কপি করা হয়েছে!');
                            }}
                            className="h-11 px-4 rounded-xl text-xs font-bold border border-emerald-400 bg-white hover:bg-emerald-700 hover:text-white text-emerald-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>

                      {/* Bank Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <div className="bg-white rounded-xl p-3 border border-emerald-200 flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                              Account Title
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900 select-all">
                              MD IMRAN HOSSEN
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('MD IMRAN HOSSEN');
                              toast.success('একাউন্ট টাইটেল কপি করা হয়েছে!');
                            }}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                            title="Copy Title"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="bg-white rounded-xl p-3 border border-emerald-200">
                          <span className="block text-[10px] font-bold uppercase text-slate-400">
                            Branch Name
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-900 select-all">
                            Matlab, Chandpur
                          </span>
                        </div>

                        <div className="bg-white rounded-xl p-3 border border-emerald-200 flex items-center justify-between gap-2">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                              Routing No
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900 select-all">
                              125131188
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('125131188');
                              toast.success('রাউটিং নম্বর কপি করা হয়েছে!');
                            }}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                            title="Copy Routing No"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : selectedMethod.id === 'banglaQr' ? (
                    <div className="relative bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 flex flex-col items-center text-center">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                          Interoperable Universal QR
                        </span>
                      </div>

                      <div className="relative p-2.5 bg-white rounded-2xl shadow-lg border-2 border-rose-200">
                        <Image
                          src={selectedMethod.qrCode || '/assets/placeholder-qr.png'}
                          alt="Bangla QR"
                          width={180}
                          height={180}
                          className="h-44 w-44 object-contain rounded-lg"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
                        {['bKash', 'Nagad', 'Rocket', 'Citytouch', 'যেকোনো ব্যাংক'].map(
                          (app) => (
                            <span
                              key={app}
                              className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700"
                            >
                              {app}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Send Money To
                        </span>
                        <span className="bg-rose-100 text-rose-700 font-bold text-[10px] py-0.5 px-2.5 rounded-full">
                          Personal Number
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-lg sm:text-xl font-black tracking-widest text-slate-900 bg-white px-4 py-2 rounded-xl border border-rose-200 flex-1 text-center select-all">
                          {selectedMethod.number || fallbackPhone}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMethod.number || fallbackPhone);
                            toast.success('নম্বরটি কপি করা হয়েছে!');
                          }}
                          className="h-11 px-4 rounded-xl text-xs font-bold border border-rose-300 bg-white hover:bg-rose-600 hover:text-white text-rose-700 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>

                      {selectedMethod.qrCode && (
                        <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-rose-200/60">
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            অথবা QR কোড স্ক্যান করে পেমেন্ট করুন
                          </p>
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-rose-100">
                            <Image
                              src={selectedMethod.qrCode}
                              alt="QR"
                              width={132}
                              height={132}
                              className="h-32 w-32 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Instruction Panel */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1.5">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      পেমেন্ট নির্দেশিকা (পড়ুন):
                    </p>
                    <div className="space-y-1 text-xs leading-relaxed text-slate-600 font-medium">
                      {selectedMethod.id === 'islamiBank' ? (
                        <>
                          <p>
                            ১. যেকোনো ব্যাংকের অ্যাপ, ইন্টারনেট ব্যাংকিং (NPSB / BEFTN / RTGS) অথবা সরাসরি ব্রাঞ্চ থেকে উপরের ব্যাংক একাউন্টে ফান্ড ট্রান্সফার করুন।
                          </p>
                          <p>
                            ২. ব্যাংক <strong>Islami Bank Bangladesh PLC</strong>, একাউন্ট টাইটেল <strong>MD IMRAN HOSSEN</strong> এবং একাউন্ট নম্বর <strong>20503050203083010</strong> মিলিয়ে নিন।
                          </p>
                          <p>
                            ৩. মোট পেমেন্ট অ্যামাউন্ট{' '}
                            <strong className="text-rose-600">
                              ৳{activePackage.offerPrice.toLocaleString('bn-BD')}
                            </strong>{' '}
                            ট্রান্সফার সম্পন্ন করুন।
                          </p>
                          <p>
                            ৪. সফলভাবে পেমেন্টের পর নিচে <strong>যে একাউন্ট থেকে পে করেছেন</strong> সেই একাউন্ট নম্বর প্রদান করুন।
                          </p>
                        </>
                      ) : selectedMethod.id === 'banglaQr' ? (
                        <>
                          <p>
                            ১. আপনার ব্যাংক (Citytouch, EBL, ইত্যাদি) বা MFS (বিকাশ, নগদ, রকেট) অ্যাপ ওপেন করুন।
                          </p>
                          <p>
                            ২. অ্যাপের <strong>&quot;QR Pay&quot;</strong> বা <strong>&quot;Scan QR&quot;</strong> অপশন সিলেক্ট করে ওপরের কোডটি স্ক্যান করুন।
                          </p>
                          <p>
                            ৩. মোট পেমেন্ট অ্যামাউন্ট{' '}
                            <strong className="text-rose-600">
                              ৳{activePackage.offerPrice.toLocaleString('bn-BD')}
                            </strong>{' '}
                            নিশ্চিত করে পেমেন্ট সম্পন্ন করুন।
                          </p>
                          <p>
                            ৪. সফলভাবে পেমেন্টের পর নিচে <strong>প্রোভাইডার/ব্যাংকের নাম (Provider Name)</strong> এবং আপনার <strong>একাউন্ট / মোবাইল নম্বর (Account Number)</strong> প্রদান করুন।
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            ১. আপনার{' '}
                            <strong>
                              {selectedMethod.id === 'bkash'
                                ? 'বিকাশ'
                                : selectedMethod.id === 'nagad'
                                ? 'নগদ'
                                : 'রকেট'}
                            </strong>{' '}
                            অ্যাপে যান অথবা USSD ডায়াল করে <strong>&quot;Send Money&quot;</strong> অপশন সিলেক্ট করুন।
                          </p>
                          <p>
                            ২. উপরে দেওয়া <strong>Personal</strong> নম্বরটি কপি করে প্রাপক হিসেবে দিন।
                          </p>
                          <p>
                            ৩. মোট পেমেন্ট অ্যামাউন্ট{' '}
                            <strong className="text-rose-600">
                              ৳{activePackage.offerPrice.toLocaleString('bn-BD')}
                            </strong>{' '}
                            সেন্ড মানি করুন।
                          </p>
                          <p>
                            ৪. সফলভাবে টাকা পাঠানোর পর নিচে <strong>যে একাউন্ট থেকে পে করেছেন</strong> সেই নম্বর প্রদান করুন।
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Verification Section */}
                  {selectedMethod.id === 'banglaQr' ? (
                    <div className="space-y-4 pt-1">
                      <div className="border-b-2 border-rose-600 pb-2">
                        <span className="text-xs sm:text-sm font-black text-rose-600 uppercase tracking-wide">
                          পেমেন্ট ভেরিফিকেশন তথ্য (প্রোভাইডার নাম ও একাউন্ট নম্বর)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Provider Name Field */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black uppercase text-slate-700">
                            প্রোভাইডার / ব্যাংকের নাম (Provider Name) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: bKash / Nagad / Citytouch / Brac Bank"
                            value={manualDetails.providerName}
                            onChange={(e) =>
                              setManualDetails({
                                ...manualDetails,
                                providerName: e.target.value,
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border-2 border-slate-300 focus:border-rose-600 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all"
                          />
                        </div>

                        {/* Account / Mobile Number Field */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-black uppercase text-slate-700">
                            একাউন্ট / মোবাইল নম্বর (Account Number) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="যে একাউন্ট থেকে পে করেছেন"
                            value={manualDetails.senderNumber}
                            onChange={(e) =>
                              setManualDetails({
                                ...manualDetails,
                                senderNumber: e.target.value.replace(/[^\d০-৯+]/g, ''),
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border-2 border-slate-300 focus:border-rose-600 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="border-b-2 border-rose-600 pb-2">
                        <span className="text-xs sm:text-sm font-black text-rose-600 uppercase tracking-wide">
                          {selectedMethod.id === 'bkash'
                            ? 'বিকাশ নম্বর দিয়ে ভেরিফাই'
                            : selectedMethod.id === 'nagad'
                            ? 'নগদ নম্বর দিয়ে ভেরিফাই'
                            : selectedMethod.id === 'rocket'
                            ? 'রকেট নম্বর দিয়ে ভেরিফাই'
                            : 'একাউন্ট নম্বর দিয়ে ভেরিফাই'}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-black uppercase text-slate-700">
                          যে একাউন্ট থেকে পে করেছেন <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type={selectedMethod.id === 'islamiBank' ? 'text' : 'tel'}
                          placeholder="যে একাউন্ট থেকে পে করেছেন"
                          value={manualDetails.senderNumber}
                          onChange={(e) =>
                            setManualDetails({
                              ...manualDetails,
                              senderNumber:
                                selectedMethod.id === 'islamiBank'
                                  ? e.target.value
                                  : e.target.value.replace(/[^\d০-৯+]/g, ''),
                            })
                          }
                          className="w-full h-11 px-4 rounded-xl border-2 border-slate-300 focus:border-rose-600 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Form Footer: Submit Button (Centered, Disabled until all fields & payment verify are filled) ── */}
          <div className="pt-6 border-t border-white/15 flex flex-col items-center justify-center space-y-3">
            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className={`w-full sm:w-auto px-10 sm:px-14 py-4 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 mx-auto ${
                isFormValid && !submitting
                  ? 'text-white bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-rose-500 active:scale-95 shadow-xl shadow-pink-600/30 cursor-pointer'
                  : 'bg-white/10 text-purple-200/40 border border-white/10 cursor-not-allowed opacity-70'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>আবেদন সাবমিট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  <span>
                    পেমেন্ট ও আবেদন নিশ্চিত করুন (৳{activePackage.offerPrice.toLocaleString('bn-BD')})
                  </span>
                  <ArrowRight className="size-5" />
                </>
              )}
            </button>

            {!isFormValid && (
              <p className="text-[11px] sm:text-xs font-bold text-amber-300/90 text-center">
                ⚠️ সাবমিট বাটন চালু করতে উপরের সকল তারকা (*) চিহ্নিত ঘর এবং পেমেন্ট ভেরিফিকেশন তথ্য পূরণ করুন
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
