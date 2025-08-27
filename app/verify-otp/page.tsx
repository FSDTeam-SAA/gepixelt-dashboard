"use client";

import type React from "react";
import { Suspense, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyOTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const resendOTPMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP resent successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.slice(0, 6).split("");
    const newOtp = [...otp];
    pasteArray.forEach((digit, idx) => {
      newOtp[idx] = digit;
      inputRefs.current[idx]?.focus();
    });
    setOtp(newOtp);
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a complete OTP");
      return;
    }
    router.push(
      `/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`
    );
  };

  const handleResendOTP = () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    resendOTPMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Verify OTP</h1>
            {email && (
              <p className="text-sm text-gray-600 mb-4">
                Enter the OTP sent to:{" "}
                <span className="font-medium">{email}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              ))}
            </div>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                className="text-red-500 hover:text-red-600 cursor-pointer"
                onClick={() => router.push("/forgot-password")}
              >
                Didn't Receive OTP?
              </button>
              <button
                type="button"
                className="text-cyan-500 hover:text-cyan-600 cursor-pointer"
                onClick={handleResendOTP}
                disabled={resendOTPMutation.isPending}
              >
                {resendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium cursor-pointer"
            >
              Verify
            </Button>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-red-500 cursor-pointer"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}
