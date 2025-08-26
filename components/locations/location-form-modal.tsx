"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createLocation, updateLocation } from "@/lib/api"
import { toast } from "sonner"

interface LocationFormModalProps {
  isOpen: boolean
  onClose: () => void
  location?: any
}

export function LocationFormModal({ isOpen, onClose, location }: LocationFormModalProps) {
  const [formData, setFormData] = useState({
    streetAddress: location?.streetAddress || "",
    city: location?.city || "",
    state: location?.state || "",
    zipCode: location?.zipCode || "",
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast.success("Location created successfully")
      onClose()
      resetForm()
    },
    onError: () => {
      toast.error("Failed to create location")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast.success("Location updated successfully")
      onClose()
      resetForm()
    },
    onError: () => {
      toast.error("Failed to update location")
    },
  })

  const resetForm = () => {
    setFormData({
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (location) {
      updateMutation.mutate({ id: location._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{location ? "Edit Location" : "Add Location"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              placeholder="123 Main Street"
              value={formData.streetAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, streetAddress: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="CA"
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              placeholder="94105"
              value={formData.zipCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
