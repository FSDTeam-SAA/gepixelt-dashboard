"use client";

import type React from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, changePassword } from "@/lib/api";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Calendar, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Mr. Raja",
    companyName: "Catering Service Admin",
    phoneNumber: "+1 (888) 000-0000",
    gender: "",
    dateOfBirth: "",
    address: "00000 Artesia Blvd, Suite A-000",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("/professional-man.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("companyName", profileData.companyName);
    formData.append("phoneNumber", profileData.phoneNumber);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  return (
    <AppLayout>
      <PageHeader title="Setting" breadcrumbs={["Dashboard", "Setting"]} />

      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewImage || "/placeholder.svg"} />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mr. Raja</h2>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50 bg-transparent cursor-pointer"
                    onClick={() => router.push("/change-password")}
                  >
                    Change Password
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    onClick={handleProfileSubmit}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending
                      ? "Updating..."
                      : "Update Profile"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="cursor-pointer">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="cursor-pointer">
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="cursor-pointer">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      placeholder="Set your Birthday"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          dateOfBirth: e.target.value,
                        }))
                      }
                      className="cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50 cursor-pointer bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>

            {/* Password Change Section */}
            <div id="password-section" className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Change Password
              </h3>

              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4 max-w-md"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? "Changing..."
                    : "Change Password"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
