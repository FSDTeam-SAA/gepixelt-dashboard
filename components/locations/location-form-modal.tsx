"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLocation,
  updateLocation,
  updateLocationStatus,
} from "@/lib/api";
import { toast } from "sonner";

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: any;
}

export function LocationFormModal({
  isOpen,
  onClose,
  location,
}: LocationFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // ✅ Load location data into form when editing
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        address: location.address || "",
      });
    } else {
      resetForm();
    }
  }, [location, isOpen]);

  const queryClient = useQueryClient();

  // ✅ Create mutation
  const createMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created successfully");
      onClose();
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create location");
    },
  });

  // ✅ Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location updated successfully");
      onClose();
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update location");
    },
  });

  // ✅ Update status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateLocationStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update location status");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (location) {
      updateMutation.mutate({ id: location._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isStatusLoading = statusMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {location ? "Edit Location" : "Add Location"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Office Building A"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street, Downtown"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            {/* ✅ Toggle status button only if editing */}
            {location && (
              <Button
                type="button"
                variant={location.isActive ? "destructive" : "default"}
                onClick={() =>
                  statusMutation.mutate({
                    id: location._id,
                    isActive: !location.isActive,
                  })
                }
                disabled={isStatusLoading}
              >
                {isStatusLoading
                  ? "Updating..."
                  : location.isActive
                  ? "Deactivate"
                  : "Activate"}
              </Button>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
