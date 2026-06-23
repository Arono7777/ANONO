import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { X, Mail, Phone, Lock, User as UserIcon, LogIn, Sparkles, Bot, Key, AlertCircle, ArrowRight, ShieldCheck, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  onLoginSuccess: (user: User) => void;
  onSendAdminForgotNotification: (emailOrPhone: string, userName: string, otp: string) => void;
  initialCheckoutActive?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  lang,
  users,
  onUpdateUsers,
  onLoginSuccess,
  onSendAdminForgotNotification,
  initialCheckoutActive
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Google Interactive Picker states
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isEnteringCustomGoogle, setIsEnteringCustomGoogle] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login inputs
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password states
  const [forgotInput, setForgotInput] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiIsMatched, setAiIsMatched] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resettingUser, setResettingUser] = useState<User | null>(null);

  // OTP Validation states
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerifyError, setOtpVerifyError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Set new password states
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset all fields on mode change
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setLoginEmailOrPhone('');
    setLoginPassword('');
    setForgotInput('');
    setAiAnalyzing(false);
    setAiMessage('');
    setAiIsMatched(false);
    setGeneratedOtp('');
    setResettingUser(null);
    setEnteredOtp('');
    setOtpVerifyError('');
    setOtpVerified(false);
    setNewPassword('');
    setNewConfirmPassword('');
    setShowGooglePicker(false);
    setCustomGoogleEmail('');
    setCustomGoogleName('');
    setIsEnteringCustomGoogle(false);
    setIsGoogleSigningIn(false);
  }, [mode, isOpen]);

  if (!isOpen) return null;

  // Sign up Form Submit
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(lang === 'en' ? 'Name is required!' : 'নাম প্রদান করা বাধ্যতামূলক!');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg(lang === 'en' ? 'Email or Phone is required!' : 'ইমেইল অথবা ফোন নাম্বার প্রদান করতে হবে!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'en' ? 'Password must be at least 6 characters!' : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(lang === 'en' ? 'Passwords do not match!' : 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!');
      return;
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const exists = users.find(
      (u) =>
        (normalizedEmail && u.email?.toLowerCase() === normalizedEmail) ||
        (normalizedPhone && u.phone === normalizedPhone)
    );

    if (exists) {
      setErrorMsg(lang === 'en' ? 'User with this email/phone already registered!' : 'এই ইমেইল বা ফোন নাম্বার দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে!');
      return;
    }

    // Create New User
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: normalizedEmail || `${normalizedPhone}@anono.shop`,
      phone: normalizedPhone,
      password: password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    onUpdateUsers(updatedUsers);

    setSuccessMsg(lang === 'en' ? 'Registration Successful! Logging in...' : 'রেজিস্ট্রেশন সফল হয়েছে! লগইন হচ্ছে...');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 1500);
  };

  // Login Form Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmailOrPhone.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter Email or Phone Number!' : 'অনুগ্রহ করে ইমেইল বা ফোন নাম্বার লিখুন!');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter password!' : 'পাসওয়ার্ড টাইপ করুন!');
      return;
    }

    const input = loginEmailOrPhone.trim().toLowerCase();

    // Find user by either email, phone, or ID matches
    const matchedUser = users.find(
      (u) =>
        u.email?.toLowerCase() === input ||
        u.phone === input ||
        u.id === input
    );

    if (!matchedUser) {
      setErrorMsg(lang === 'en' ? 'Incorrect Email/Phone or account does not exist!' : 'ভুল ইমেইল/ফোন অথবা অ্যাকাউন্টটি নিবন্ধিত নয়!');
      return;
    }

    if (matchedUser.status === UserStatus.BLOCKED) {
      setErrorMsg(lang === 'en' ? 'Your account is currently BLOCKED by admin!' : 'আপনার অ্যাকাউন্টটি এডমিন কর্তৃক ব্লক করা হয়েছে!');
      return;
    }

    // Match password
    if (matchedUser.password && matchedUser.password !== loginPassword) {
      setErrorMsg(lang === 'en' ? 'Incorrect password! Try again.' : 'ভুল পাসওয়ার্ড! দয়া করে আবার চেষ্টা করুন।');
      return;
    }

    // Success login
    setSuccessMsg(lang === 'en' ? 'Login successful!' : 'লগইন সফল হয়েছে!');
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      onClose();
    }, 1200);
  };

  // Custom Google Settle integration simulation
  const handleCustomGoogleSignIn = (googleName: string, googleEmail: string) => {
    setErrorMsg('');
    setIsGoogleSigningIn(true);
    setSuccessMsg('');

    setTimeout(() => {
      // Find if already exists using case-insensitive check
      let matched = users.find((u) => u.email?.toLowerCase() === googleEmail.toLowerCase());
      if (!matched) {
        matched = {
          id: 'google_u_' + Date.now(),
          name: googleName,
          email: googleEmail,
          phone: `017${Math.floor(10000000 + Math.random() * 90000050)}`,
          password: 'google_oauth_pass',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          createdAt: new Date().toISOString()
        };
        const updated = [...users, matched];
        onUpdateUsers(updated);
      } else {
        if (matched.status === UserStatus.BLOCKED) {
          setIsGoogleSigningIn(false);
          setErrorMsg(lang === 'en' ? 'Your Google Google-linked account is currently BLOCKED!' : 'দুঃখিত, আপনার গুগল সংযুক্ত অ্যাকাউন্টটি এডমিন ব্লক করে রেখেছেন!');
          return;
        }
      }

      setIsGoogleSigningIn(false);
      setSuccessMsg(lang === 'en' ? `Successfully Signed in as ${googleName}!` : `গুগল কানেক্ট সফল! ${googleName} হিসেবে লগইন সম্পূর্ণ হয়েছে।`);
      setTimeout(() => {
        onLoginSuccess(matched!);
        onClose();
      }, 1000);
    }, 1400);
  };

  // Forgot Password AI Recovery
  const handleAiVerification = () => {
    setErrorMsg('');
    setAiMessage('');
    setAiIsMatched(false);

    const input = forgotInput.trim().toLowerCase();
    if (!input) {
      setErrorMsg(lang === 'en' ? 'Please enter your registered Email or Phone number!' : 'অনুগ্রহ করে রেজিষ্ট্রেশনকৃত ইমেইল বা ফোন নম্বরটি লিখুন!');
      return;
    }

    setAiAnalyzing(true);

    setTimeout(() => {
      setAiAnalyzing(false);

      // Verify if matching user exists in the database
      const matched = users.find(
        (u) =>
          u.email?.toLowerCase() === input ||
          u.phone === input
      );

      if (!matched) {
        setAiMessage(
          lang === 'en'
            ? '🤖 AI Scanner: No matching registration credentials found. Please sign up first!'
            : '🤖 স্বয়ংক্রিয় AI সিস্টেম: দুঃখিত, ডাটাবেজের সাথে মিলিয়ে দেখে সিস্টেমে কোনো মিল পাওয়া যায়নি! অনুগ্রহ করে সঠিক ইমেইল অথবা ফোন নম্বর দিন।'
        );
        setAiIsMatched(false);
      } else {
        // Match found! Generate secure 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otpCode);
        setResettingUser(matched);
        setAiIsMatched(true);

        // Generate helpful AI analysis response showing database info
        setAiMessage(
          lang === 'en'
            ? `🤖 AI System matched database records!\n• Name: ${matched.name}\n• User ID: ${matched.id}\n• Password Stored: ${matched.password ? '*'.repeat(matched.password.length) : 'None'}\n\n🔐 One-time Login OTP created: ${otpCode}. Enter it below to define a new password!`
            : `🤖 স্বয়ংক্রিয় AI সিস্টেম ডাটাবেজ যাচাই করে সঠিক মিল খুঁজে পেয়েছে!\n• কাস্টমার নাম: ${matched.name}\n• অ্যাকাউন্ট ধরণ: ${matched.role.toUpperCase()}\n• রেজিস্টার্ড ইমেইল/ফোন: ${matched.email || matched.phone}\n\n🔐 ওয়ান-টাইম লগইন ওটিপি (OTP) কোড তৈরি করা হয়েছে: "${otpCode}"। নিচে ওটিপি-টি দিয়ে নতুন পাসওয়ার্ড দেওয়ার পেজে যান।`
        );

        // Trigger notification back to Admin
        onSendAdminForgotNotification(input, matched.name, otpCode);
      }
    }, 1500);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    setOtpVerifyError('');
    if (enteredOtp.trim() === generatedOtp) {
      setOtpVerified(true);
      setSuccessMsg(lang === 'en' ? 'OTP verified! Please set your new password.' : 'ওটিপি সঠিকভাবে ভেরিফাইড হয়েছে! এখন নতুন পাসওয়ার্ড সেট করুন।');
    } else {
      setOtpVerifyError(lang === 'en' ? 'Invalid OTP code! Try again.' : 'ভুল ওটিপি কোড! অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  // Save new password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg(lang === 'en' ? 'Password must be at least 6 characters!' : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }
    if (newPassword !== newConfirmPassword) {
      setErrorMsg(lang === 'en' ? 'Passwords do not match!' : 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!');
      return;
    }

    if (!resettingUser) return;

    // Update password in global state
    const updated = users.map((u) => {
      if (u.id === resettingUser.id) {
        return {
          ...u,
          password: newPassword
        };
      }
      return u;
    });

    onUpdateUsers(updated);

    setSuccessMsg(lang === 'en' ? 'Password changed successfully! Logging in...' : 'পাসওয়ার্ড সঠিকভাবে পরিবর্তন করা হয়েছে! লগইন করা হচ্ছে...');

    setTimeout(() => {
      // Find the updated user
      const updatedUser = updated.find(u => u.id === resettingUser.id);
      if (updatedUser) {
        onLoginSuccess(updatedUser);
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white w-full max-w-md rounded-3xl border border-neutral-100 shadow-2xl p-6 md:p-8 z-10 overflow-hidden font-sans"
      >
        {/* Background gradient graphics */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-60 -z-10" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-800 text-sm">
                {mode === 'login' && (lang === 'en' ? 'Log In Account' : 'অফিসিয়াল লগইন গেটওয়ে')}
                {mode === 'signup' && (lang === 'en' ? 'Sign Up New Account' : 'নতুন কাস্টমার সাইন-আপ')}
                {mode === 'forgot' && (lang === 'en' ? 'AI Password Recovery' : 'AI অ্যাকাউন্ট রিকভারি')}
              </h3>
              <p className="text-[10px] text-neutral-400 font-medium">ANONO Premium Security Secure Module</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checkout requirement announcement */}
        {initialCheckoutActive && !showGooglePicker && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex gap-3 shadow-xs">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950 block text-[11px] mb-0.5">
                {lang === 'en' ? '🔐 Sign-in Required to Buy' : '🔐 পণ্য কিনতে অ্যাকাউন্ট থাকা আবশ্যক'}
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed font-sans">
                {lang === 'en' 
                  ? 'Your selected products are saved. Please login or signup below to securely confirm and check out your order!' 
                  : 'আপনার পছন্দের প্রোডাক্টগুলো কার্টে সংরক্ষিত করা হয়েছে। পণ্য কিনতে দয়া করে নিচের ফরম দিয়ে লগইন করুন অথবা গুগল দিয়ে ১-ক্লিকে সাইন-ইন করে নিন।'}
              </p>
            </div>
          </div>
        )}

        {/* Global Alert messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= GOOGLE ACCOUNTS INTERACTIVE PICKER ================= */}
        {showGooglePicker ? (
          <div className="space-y-4 font-sans animate-fade-in">
            <div className="flex flex-col items-center justify-center text-center py-2">
              <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.57-1.07-1.28-1.53-2.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h2 className="text-sm font-bold text-neutral-800">
                {lang === 'en' ? 'Sign in with Google' : 'গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন'}
              </h2>
              <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                {lang === 'en' ? 'Select an account to continue to Anono Shop' : 'অনন্য শপে এগিয়ে যেতে আপনার গুগল আইডি নির্বাচন করুন'}
              </p>
            </div>

            {isGoogleSigningIn ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-[11px] text-neutral-500 font-medium">
                  {lang === 'en' 
                    ? 'Verifying secure Google session token...' 
                    : 'নিরাপদ গুগল ওঅথ (OAuth) সেশন যাচাই করা হচ্ছে...'}
                </p>
              </div>
            ) : isEnteringCustomGoogle ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!customGoogleEmail.trim() || !customGoogleName.trim()) return;
                
                // Trigger customized signup/login with Google email/name
                handleCustomGoogleSignIn(customGoogleName.trim(), customGoogleEmail.trim().toLowerCase());
              }} className="space-y-4 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 mb-1">{lang === 'en' ? 'GOOGLE ACCOUNT NAME' : 'গুগল অ্যাকাউন্টের সম্পূর্ণ নাম'}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'John Doe' : 'যেমন: অরন্য রয়'}
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 mb-1">{lang === 'en' ? 'GOOGLE EMAIL ADDRESS' : 'গুগল জিমেইল অ্যাড্রেস'}</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="flex gap-2.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEnteringCustomGoogle(false);
                      setCustomGoogleEmail('');
                      setCustomGoogleName('');
                    }}
                    className="w-1/3 border border-neutral-200 hover:bg-neutral-50 py-2.5 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer"
                  >
                    {lang === 'en' ? 'Back' : 'ফিরে যান'}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Continue' : 'সাইন-ইন করুন'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {/* 1. Developer context account matching user email */}
                <button
                  type="button"
                  onClick={() => handleCustomGoogleSignIn('Aronor Roy', 'aronoroy047@gmail.com')}
                  className="w-full text-left bg-neutral-50/70 hover:bg-neutral-100 border border-neutral-100 rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      AR
                    </div>
                    <div>
                      <span className="font-extrabold text-[11px] text-neutral-800 block group-hover:text-indigo-700">Aronor Roy</span>
                      <span className="text-[10px] text-neutral-400 font-sans">aronoroy047@gmail.com</span>
                    </div>
                  </div>
                  <div className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    {lang === 'en' ? 'Logged in' : 'প্রধান আইডি'}
                  </div>
                </button>

                {/* 2. Secondary alternative Saima Akter */}
                <button
                  type="button"
                  onClick={() => handleCustomGoogleSignIn('Saima Akter', 'saima.akter@gmail.com')}
                  className="w-full text-left bg-neutral-50/70 hover:bg-neutral-100 border border-neutral-100 rounded-2xl p-3 flex items-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    SA
                  </div>
                  <div>
                    <span className="font-extrabold text-[11px] text-neutral-800 block group-hover:text-indigo-700">Saima Akter</span>
                    <span className="text-[10px] text-neutral-400 font-sans">saima.akter@gmail.com</span>
                  </div>
                </button>

                {/* 3. Add Custom Account button */}
                <button
                  type="button"
                  onClick={() => setIsEnteringCustomGoogle(true)}
                  className="w-full text-left bg-white hover:bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-3 flex items-center gap-3 transition-all cursor-pointer text-indigo-600 hover:text-indigo-700"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center font-bold text-xs shadow-sm">
                    +
                  </div>
                  <div>
                    <span className="font-extrabold text-[11px] block">{lang === 'en' ? 'Use another Google account' : 'নতুন গুগল অ্যাকাউন্ট যোগ করুন'}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">{lang === 'en' ? 'Customize email & profile' : 'অন্য আরেকটি নাম ও ইমেইল অ্যাকাউন্ট দিন'}</span>
                  </div>
                </button>

                <div className="pt-2 border-t border-neutral-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGooglePicker(false)}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold py-2 rounded-xl text-xs text-center cursor-pointer transition-colors"
                  >
                    {lang === 'en' ? 'Cancel & Use Regular Login' : 'ডায়লগ বন্ধ করে সাধারণ লগইনে যান'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* TAB Switchers for Login/Signup */}
            {mode !== 'forgot' && !otpVerified && (
              <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`w-1/2 text-center py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {lang === 'en' ? 'Login' : 'লগইন'}
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`w-1/2 text-center py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {lang === 'en' ? 'Sign Up' : 'সাইন আপ'}
                </button>
              </div>
            )}

            {/* ================= MODE: LOGIN ================= */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'EMAIL OR PHONE NUMBER' : 'ইমেইল অথবা ফোন নম্বর'}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={lang === 'en' ? 'Name@email.com or 01712345...' : 'আপনার ইমেইল বা মোবাইল নাম্বার লিখুন...'}
                      value={loginEmailOrPhone}
                      onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                      className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-neutral-500">{lang === 'en' ? 'PASSWORD' : 'সিকিউর পাসওয়ার্ড'}</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Forgot Password?' : 'পাসওয়ার্ড মনে নেই?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                    />
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5 pt-3.5 pb-3.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Secure Login' : 'সুরক্ষিত লগইন সম্পন্ন করুন'}</span>
                </button>
              </form>
            )}

            {/* ================= MODE: SIGN UP ================= */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'FULL NAME' : 'সম্পূর্ণ নাম'}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={lang === 'en' ? 'John Doe' : 'আপনার সম্পূর্ণ নাম টাইপ করুন...'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                    />
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'EMAIL ADDRESS' : 'ইমেইল অ্যাড্রেস'}</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                      />
                      <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'PHONE NUMBER' : 'মোবাইল নাম্বার'}</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="01712345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                      />
                      <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'PASSWORD' : 'পাসওয়ার্ড দিন'}</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="নূন্যতম ৬ অক্ষর"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                      />
                      <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'CONFIRM' : 'পুনরায় পাসওয়ার্ড'}</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="পাসওয়ার্ড পুনরাবৃত্তি"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                      />
                      <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5 pt-3.5 pb-3.5 mt-2"
                >
                  <span>{lang === 'en' ? 'Register New Account' : 'রেজিস্ট্রেশন সম্পূর্ণ করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ================= MODE: FORGOT PASSWORD (SPECIAL AI SCANNER) ================= */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {!otpVerified ? (
                  <>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 mb-4 text-xs flex gap-3 text-indigo-950 font-medium">
                      <Bot className="w-10 h-10 text-indigo-600 flex-shrink-0 bg-white p-2 rounded-xl shadow-xs" />
                      <div>
                        <span className="font-bold text-neutral-800 block text-[11px] mb-0.5">ANONO AUTONOMOUS AI ENGINE</span>
                        {lang === 'en' 
                          ? 'Enter your registered Email or Phone. The AI database resolver will instantly matching credentials and build a Secure OTP code.' 
                          : 'আপনার রেজিষ্ট্রেশনকৃত ইমেইল বা ফোন নম্বরটি টাইপ করুন। আমাদের স্বয়ংক্রিয় AI সিস্টেম ডাটাবেজ তথ্য মিলিয়ে দেখে একটি ওয়ান-টাইম পাসওয়ার্ড (OTP) কোড তৈরি করে দিবে।'}
                      </div>
                    </div>

                    {!aiIsMatched ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'EMAIL OR PHONE FOR RECOVERY' : 'নিবন্ধিত ইমেইল অথবা মোবাইল নম্বর'}</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder={lang === 'en' ? 'Email or phone number' : 'যেমন: Saima@yahoo.com বা 01911...'}
                              value={forgotInput}
                              onChange={(e) => setForgotInput(e.target.value)}
                              className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                            />
                            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={aiAnalyzing}
                          onClick={handleAiVerification}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold py-3 rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 pt-3.5 pb-3.5 disabled:opacity-75"
                        >
                          {aiAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              <span>AI স্ক্যানার প্রসেসিং হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>AI স্বয়ংক্রিয় রিকভারি করুন</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}

                    {/* AI System Message Response Display */}
                    {aiMessage && (
                      <div className={`p-4 rounded-2xl text-xs whitespace-pre-line border leading-relaxed font-sans ${
                        aiIsMatched 
                          ? 'bg-neutral-900 text-green-400 border-neutral-800 font-mono shadow-inner' 
                          : 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm'
                      }`}>
                        {aiMessage}
                      </div>
                    )}

                    {/* If AI Matched, show entered OTP verification box */}
                    {aiIsMatched && (
                      <div className="pt-4 border-t border-neutral-100 space-y-3">
                        {otpVerifyError && (
                          <p className="text-rose-600 text-xs font-bold text-center">{otpVerifyError}</p>
                        )}
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5 text-center">🔐 ENTER THE OTP SHOWN BY AI (AI কর্তৃক প্রদর্শিত ওটিপি টাইপ করুন)</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="ENTER 6 DIGIT OTP"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            className="w-1/2 mx-auto text-center font-mono text-lg tracking-widest bg-neutral-100 border border-neutral-200 rounded-xl py-2 text-neutral-800 focus:outline-none focus:border-indigo-600 focus:bg-white block"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md cursor-pointer pt-3.5 pb-3.5"
                        >
                          ওটিপি ভেরিফাই করে লগইন করুন (Verify & Advance)
                        </button>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-xs text-neutral-400 hover:text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        {lang === 'en' ? '← Back to Login' : '← মূল লগইন স্ক্রিনে ফিরে যান'}
                      </button>
                    </div>
                  </>
                ) : (
                  // SET NEW PASSWORD FORM AFTER SUCCESS OTP VERIFY
                  <form onSubmit={handleSaveNewPassword} className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">ওটিপি ভেরিফিকেশন শতভাগ সফল!</span>
                        আপনার অ্যাকাউন্টের জন্য একটি স্থায়ী নতুন পাসওয়ার্ড তৈরি করুন। পাসওয়ার্ডটি মনে রাখবেন।
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'NEW SECURE PASSWORD' : 'নতুন শক্তিশালী পাসওয়ার্ড'}</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="নূন্যতম ৬ অক্ষর"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                        />
                        <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">{lang === 'en' ? 'RE-TYPE NEW PASSWORD' : 'পুনরায় পাসওয়ার্ড লিখুন'}</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="পাসওয়ার্ড পুনরাবৃত্তি"
                          value={newConfirmPassword}
                          onChange={(e) => setNewConfirmPassword(e.target.value)}
                          className="w-full bg-neutral-50/70 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-neutral-800"
                        />
                        <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
                    >
                      পাসওয়ার্ড পরিবর্তন ও লগইন সম্পন্ন করুন (Save & Login)
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {/* Third Party Login (Continue with Google) separator */}
        {!showGooglePicker && mode !== 'forgot' && (
          <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute left-0 right-0 border-t border-neutral-100" />
              <span className="relative bg-white px-3 text-[10px] text-neutral-400 font-bold tracking-wider uppercase">
                {lang === 'en' ? 'Or Continue with' : 'অথবা বিকল্প পদ্ধতি'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGooglePicker(true)}
              className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-extrabold py-2.5 px-4 border border-neutral-200 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.57-1.07-1.28-1.53-2.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{lang === 'en' ? 'Continue with Google Account' : 'গুগল একাউন্ট দিয়ে সাইন-ইন'}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
