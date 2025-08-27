"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent to your email successfully!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-red-500 mb-2">
              Forgot Password
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-red-500 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium cursor-pointer"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>

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
