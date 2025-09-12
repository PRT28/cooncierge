"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";

export default function SignIn() {
  const [mode, setMode] = useState<"signin" | "otp" | "forgot">("signin");
  const [success, setSuccess] = useState(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next field
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(
          `otp-input-${index + 1}`
        ) as HTMLInputElement | null;
        nextInput?.focus();
      }
    }
  };

  const handleForgotPassword = () => {
    setMode("forgot");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setMode("otp");
  };

  const handleSuccess = async (): Promise<void> => {
    // fake API call
    await new Promise((res) => setTimeout(res, 1000));
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#E8F5F1] flex items-center justify-center">
      {/* Top Vectors */}
      <div className="absolute top-[-20px] left-0 w-full overflow-hidden">
        <Image
          src="/login/vectors/Vector 1.svg"
          alt=""
          width={1920}
          height={500}
          className="w-full h-auto relative z-30"
          unoptimized
        />
        <Image
          src="/login/vectors/Vector 2.svg"
          alt=""
          width={1920}
          height={500}
          className="w-full h-auto mt-[-370px] opacity-50 relative z-20"
          unoptimized
        />
        <Image
          src="/login/vectors/Vector 3.svg"
          alt=""
          width={1920}
          height={500}
          className="w-full h-auto mt-[-410px] opacity-40 relative z-10"
          unoptimized
        />
      </div>

      {/* Bottom Vectors */}
      <div className="absolute right-0 bottom-[-30px] w-[520px] h-[360px] overflow-hidden">
        <Image
          src="/login/vectors/Vector 4.svg"
          alt=""
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto z-30 mr-[-120px]"
          unoptimized
        />
        <Image
          src="/login/vectors/Vector 5.svg"
          alt=""
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto mr-[-100px] opacity-50 z-20"
          unoptimized
        />
        <Image
          src="/login/vectors/Vector 6.svg"
          alt=""
          width={520}
          height={360}
          className="absolute bottom-0 right-0 w-[520px] h-auto mr-[-80px] opacity-40 z-10"
          unoptimized
        />
      </div>

      {/* Background illustrations */}
      <Image
        src="/login/wallet.png"
        alt="Wallet"
        width={400}
        height={400}
        priority
        className="absolute top-10 left-[180px] w-[400px] rotate-[-5deg]"
      />
      <Image
        src="/login/booking.png"
        alt="Booking"
        width={492}
        height={492}
        className="absolute bottom-6 left-30 w-[492px] rotate-[-6deg]"
      />
      <Image
        src="/login/world.png"
        alt="World"
        width={332}
        height={332}
        className="absolute -top-5 right-[40%] w-[332px] rotate-[5deg]"
      />
      <Image
        src="/login/traveller.png"
        alt="Traveler"
        width={320}
        height={320}
        className="absolute -bottom-1 right-[30%] w-[320px]"
      />
      <Image
        src="/login/group.png"
        alt="Group"
        width={480}
        height={500}
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
                  required
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
                  required
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
                className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800  transition"
              >
                <span className="transition text-medium duration-700 hover:text-lg">
                  Sign In
                </span>
              </button>
            </form>
          </>
        )}
        {mode === "otp" && (
          <>
            <h2 className="text-xl font-bold text-center mb-6 text-black">
              <button
                onClick={() => setMode("signin")}
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
            <button
              onClick={() => alert("OTP Submitted: " + otp.join(""))}
              className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800 transition"
            >
              <span className="transition text-medium duration-700 hover:text-lg">
                Verify OTP
              </span>
            </button>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="text-blue-400 px-2 py-1 underline text-sm hover:text-blue-700"
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {mode === "forgot" && (
          <>
            {!success ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center mb-6 text-black">
                  <button
                    onClick={() => setMode("signin")}
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
                    handleSuccess();
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
                    Don't worry! Just enter your email and we'll notify your
                    admin to reset your password.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full h-13 bg-green-900 text-white py-2 rounded-md font-medium hover:bg-green-800  transition"
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
