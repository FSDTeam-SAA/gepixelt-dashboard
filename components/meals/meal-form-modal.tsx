"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMeal, updateMeal } from "@/lib/api"
import { toast } from "sonner"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface MealFormModalProps {
  isOpen: boolean
  onClose: () => void
  meal?: any
  day: string
}

export function MealFormModal({ isOpen, onClose, meal, day }: MealFormModalProps) {
  const [formData, setFormData] = useState({
    description: meal?.description || "",
    price: meal?.price || "",
    availableDay: meal?.availableDay || day,
  })
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [otherImages, setOtherImages] = useState<File[]>([])
  const [mainImagePreview, setMainImagePreview] = useState<string>(meal?.mainImage || "")
  const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>(meal?.otherImages || [])

  const mainImageRef = useRef<HTMLInputElement>(null)
  const otherImagesRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", day] })
      toast.success("Meal created successfully")
      onClose()
      resetForm()
    },
    onError: () => {
      toast.error("Failed to create meal")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", day] })
      toast.success("Meal updated successfully")
      onClose()
      resetForm()
    },
    onError: () => {
      toast.error("Failed to update meal")
    },
  })

  const resetForm = () => {
    setFormData({
      description: "",
      price: "",
      availableDay: day,
    })
    setMainImage(null)
    setOtherImages([])
    setMainImagePreview("")
    setOtherImagePreviews([])
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      const reader = new FileReader()
      reader.onload = () => setMainImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setOtherImages((prev) => [...prev, ...files])

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setOtherImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeOtherImage = (index: number) => {
    setOtherImages((prev) => prev.filter((_, i) => i !== index))
    setOtherImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append("description", formData.description)
    data.append("price", formData.price)
    data.append("availableDay", formData.availableDay)

    if (mainImage) {
      data.append("mainImage", mainImage)
    }

    otherImages.forEach((image, index) => {
      data.append("otherImages", image)
    })

    if (meal) {
      updateMutation.mutate({ id: meal._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meal ? `Edit ${day} Meal` : `Add ${day} Meal`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Title */}
          <div className="space-y-2">
            <Label htmlFor="description">Add food title</Label>
            <Input
              id="description"
              placeholder="Add your title"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Add food price"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            {/* Available Day */}
            <div className="space-y-2">
              <Label>Available Day</Label>
              <Select
                value={formData.availableDay}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, availableDay: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Product Image */}
          <div className="space-y-2">
            <Label>Add Product Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {mainImagePreview ? (
                <div className="relative">
                  <Image
                    src={mainImagePreview || "/placeholder.svg"}
                    alt="Main product"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover mx-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setMainImage(null)
                      setMainImagePreview("")
                      if (mainImageRef.current) mainImageRef.current.value = ""
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Button type="button" variant="outline" onClick={() => mainImageRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              )}
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Other Images */}
          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="grid grid-cols-5 gap-4">
              {otherImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`Additional ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover w-full h-20"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => removeOtherImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {otherImagePreviews.length < 5 && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-gray-400"
                  onClick={() => otherImagesRef.current?.click()}
                >
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <input
              ref={otherImagesRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherImagesChange}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
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
