"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import type { AxiosError } from "axios";
import { AuthApi } from "@/services/authApi";

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "otp" | "forgot">("signin");
  const [success, setSuccess] = useState(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Please enter your Email and Password to Sign In"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  
  const [otpMessage, setOtpMessage] = useState<
    { text: string; tone: "error" | "info" }
    | null
  >(null);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showError]);

  // Optimized OTP input change handler
  const handleOtpChange = useCallback(
    (value: string, index: number) => {
      if (/^\d*$/.test(value)) {
        setOtp((prev) => {
          const newOtp = [...prev];
          newOtp[index] = value;
          return newOtp;
        });

        // Auto-focus next field
        if (value && index < otp.length - 1) {
          const nextInput = document.getElementById(
            `otp-input-${index + 1}`
          ) as HTMLInputElement | null;
          nextInput?.focus();
        }
      }
    },
    [otp.length]
  );

  const handleForgotPassword = useCallback(() => {
    setMode("forgot");
  }, []);

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        setShowError(true);
        setErrorMessage("Please enter your Email and Password to Sign In");
        return;
      }
      setShowError(false);
      setIsSubmitting(true);
      setOtpMessage(null);

      try {
        console.log('inside try');
        const response = await AuthApi.login({ email, password });

        setOtp(["", "", "", "", "", ""]);
        setMode("otp");
      } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>;
        setErrorMessage(err.response?.data?.message || err.message || "Login failed");
        setShowError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, router]
  );

  const handleOtpSubmit = useCallback(async () => {

    const enteredOtp = otp.join("");
    if (enteredOtp.length < otp.length) {
      setOtpMessage({
        text: "Please enter the complete OTP",
        tone: "error",
      });
      return;
    }

    setIsOtpSubmitting(true);
    setOtpMessage(null);

    try {
      await AuthApi.verifyTwoFa({
        email,
        twoFACode: enteredOtp,
      });
      await router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      setOtpMessage({
        text: err.response?.data?.message || err.message || "Invalid OTP",
        tone: "error",
      });
    } finally {
      setIsOtpSubmitting(false);
    }
  }, [otp, router]);

  const handlePasswordReset = useCallback(async (): Promise<void> => {
    if (!email) {
      setOtpMessage({
        text: "Please enter your email address",
        tone: "error",
      });
      return;
    }

    try {
      await AuthApi.requestPasswordReset({ email });
      setSuccess(true);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      setOtpMessage({
        text:
          err.response?.data?.message ||
          err.message ||
          "Password reset failed",
        tone: "error",
      });
    }
  }, [email]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#E8F5F1] flex items-center justify-center">
      {/* Error Alert Popup */}
      {showError && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] flex items-center justify-between bg-red-50 border border-red-200 text-red-600 px-6 py-2 rounded-full shadow-lg min-w-[400px] max-w-[90vw]">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
            <span className="font-semibold">Error :</span>
            <span className="ml-2">{errorMessage}</span>
          </div>
          <button
            type="button"
            className="ml-4 text-red-400 hover:text-red-600 text-lg font-bold"
            aria-label="Close alert"
            onClick={() => setShowError(false)}
          >
            ×
          </button>
        </div>
      )}
      {/* Top Vectors */}
      <div className="absolute top-[-20px] left-0 w-full overflow-hidden">
        <Image
          src="/login/vectors/Vector 1.svg"
          alt="Decorative gradient"
          width={1920}
          height={500}
          className="w-full h-auto relative z-30"
          priority
          quality={70}
        />
        <Image
          src="/login/vectors/Vector 2.svg"
          alt="Decorative gradient"
          width={1920}
          height={500}
          className="w-full h-auto mt-[-370px] opacity-50 relative z-20"
          loading="lazy"
          quality={70}
        />
        <Image
          src="/login/vectors/Vector 3.svg"
          alt="Decorative gradient"
          width={1920}
          height={500}
          className="w-full h-auto mt-[-410px] opacity-40 relative z-10"
          loading="lazy"
          quality={70}
        />
      </div>

      {/* Bottom Vectors */}
      <div className="absolute right-0 bottom-[-30px] w-[520px] h-[360px] overflow-hidden">
        <Image
          src="/login/vectors/Vector 4.svg"
          alt="Decorative shape"
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto z-30 mr-[-120px]"
          loading="lazy"
          quality={70}
        />
        <Image
          src="/login/vectors/Vector 5.svg"
          alt="Decorative shape"
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto mr-[-100px] opacity-50 z-20"
          loading="lazy"
          quality={70}
        />
        <Image
          src="/login/vectors/Vector 6.svg"
          alt="Decorative shape"
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto mr-[-80px] opacity-40 z-10"
          loading="lazy"
          quality={70}
        />
      </div>

      {/* Background illustrations - Optimized for performance */}
      <Image
        src="/login/wallet.png"
        alt="Wallet illustration"
        width={400}
        height={400}
        priority
        sizes="(max-width: 768px) 200px, 400px"
        className="absolute top-10 left-[180px] w-[400px] rotate-[-5deg]"
      />
      <Image
        src="/login/booking.png"
        alt="Booking illustration"
        width={492}
        height={492}
        loading="lazy"
        sizes="(max-width: 768px) 246px, 492px"
        className="absolute bottom-6 left-30 w-[492px] rotate-[-6deg]"
      />
      <Image
        src="/login/world.png"
        alt="World illustration"
        width={332}
        height={332}
        loading="lazy"
        sizes="(max-width: 768px) 166px, 332px"
        className="absolute -top-5 right-[40%] w-[332px] rotate-[5deg]"
      />
      <Image
        src="/login/traveller.png"
        alt="Traveler illustration"
        width={320}
        height={320}
        loading="lazy"
        sizes="(max-width: 768px) 160px, 320px"
        className="absolute -bottom-1 right-[30%] w-[320px]"
      />
      <Image
        src="/login/group.png"
        alt="Group illustration"
        width={480}
        height={500}
        loading="lazy"
        sizes="(max-width: 768px) 240px, 480px"
        className="absolute mt-100 ml-305 w-[480.47px] h-[500.29px] -translate-y-1/2"
      />

      {/* Sign-in box */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg px-6 py-6 w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/cooncierge-logo.jpg"
            alt="Cooncierge Logo"
            width={240}
            height={80}
            priority
            className="w-60 h-auto"
          />
        </div>
        {mode === "signin" && (
          <>
            <h2 className="text-xl font-bold text-center mb-6 text-black">
              Welcome!
            </h2>
            <form className="space-y-5" onSubmit={handleSignIn}>
              {/* Email */}
              <div className="mt-[-10px]">
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  autoComplete="off"
                  data-lpignore="true"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none text-black"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-md px-3 mb-2 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none text-black"
                />
                <div>
                  <div className="flex items-center gap-2 mt-1 mb-1">
                    <input
                      type="checkbox"
                      className="accent-green-700 cursor-pointer w-4 h-4 rounded-xl"
                    />
                    <label className="text-black">Remember Me</label>
                  </div>
                  <div className="flex justify-end mt-[-30px]">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-right text-green-800 px-2 py-1 underline text-sm hover:text-blue-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </>
        )}
        {mode === "otp" && (
          <>
            <h2 className="text-xl font-bold text-center mb-6 text-black">
              <button
                onClick={() => {
                  setMode("signin");
                  setOtpMessage(null);
                }}
                className="float-left p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <IoMdArrowBack size={20} />
              </button>
              Please Enter OTP
            </h2>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              ))}
            </div>
            <p className="text-sm text-center text-blue-600 mb-4">
              OTP has been sent to your email.
            </p>
            {otpMessage && (
              <p
                className={`text-sm text-center mb-4 ${
                  otpMessage.tone === "error"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {otpMessage.text}
              </p>
            )}
            <button
              onClick={handleOtpSubmit}
              className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isOtpSubmitting}
            >
              {isOtpSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            {/* <div className="flex justify-end mt-4">
              <button
                type="button"
                className="text-blue-400 px-2 py-1 underline text-sm hover:text-blue-700"
              >
                Resend OTP
              </button>
            </div> */}
          </>
        )}

        {mode === "forgot" && (
          <>
            {!success ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center mb-6 text-black">
                  <button
                    onClick={() => {
                      setMode("signin");
                      setOtpMessage(null);
                    }}
                    className="float-left p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <IoMdArrowBack size={20} />
                  </button>
                  Forgot Password
                </h2>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordReset();
                  }}
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none text-black"
                      required
                    />
                  </div>
                  <p className="text-sm text-center text-black mb-4 mt-4">
                    Don&apos;t worry! Just enter your email and we&apos;ll
                    notify your admin to reset your password.
                  </p>
                  {otpMessage && (
                    <p
                      className={`text-sm text-center mb-2 ${
                        otpMessage.tone === "error"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {otpMessage.text}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800 transition"
                    >
                      <span className="transition text-medium duration-700 hover:text-lg">
                        Send Reset Link
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div>
                  <video
                    src="/animations/tickmark-anim.mp4"
                    width="100"
                    height="100"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={(e) => {
                      (e.currentTarget as HTMLVideoElement).playbackRate = 0.75;
                    }}
                  />
                </div>
                <p className="text-black font-small mb-3">
                  Hurrah! Password reset link has been sent to your admin email.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setMode("signin");
                  }}
                  className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800  transition"
                >
                  <span className="transition text-medium duration-700 hover:text-lg">
                    Back to Sign In
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
