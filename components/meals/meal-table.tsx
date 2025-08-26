"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMeals, deleteMeal } from "@/lib/api"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MealFormModal } from "./meal-form-modal"

interface MealTableProps {
  day: string
  onEdit?: (meal: any) => void
  onAdd?: () => void
}

export function MealTable({ day, onEdit, onAdd }: MealTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [editingMeal, setEditingMeal] = useState<any>(null)
  const queryClient = useQueryClient()

  console.log("[v0] MealTable day prop:", day)

  const { data: mealsData, isLoading } = useQuery({
    queryKey: ["meals", day, currentPage],
    queryFn: () => {
      console.log("[v0] Fetching meals for day:", day)
      return getMeals(currentPage, 10, day)
    },
  })

  console.log("[v0] Meals data received:", mealsData)

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals", day] })
      toast.success("Meal deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete meal")
    },
  })

  const handleDelete = (mealId: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      deleteMutation.mutate(mealId)
    }
  }

  const handleEdit = (meal: any) => {
    setEditingMeal(meal)
  }

  const closeEditModal = () => {
    setEditingMeal(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const meals = mealsData?.meals || []
  const pagination = mealsData?.pagination

  console.log("[v0] Filtered meals for", day, ":", meals)

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual_Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-4">🍽️</div>
                        <p className="text-lg font-medium">No meals found for {day}</p>
                        <p className="text-sm">Add your first meal to get started!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  meals.map((meal: any, index: number) => (
                    <tr key={meal._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image
                            src={meal.mainImage || "/placeholder.svg?height=48&width=48&query=food"}
                            alt={meal.description}
                            width={48}
                            height={48}
                            className="rounded object-cover mr-3"
                          />
                          <span className="text-sm text-gray-900 font-medium">
                            {meal.description.split(" ").slice(0, 2).join(" ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Meal-{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">€{meal.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.availableDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(meal.createdAt).toLocaleDateString("en-GB")}{" "}
                        {new Date(meal.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEdit(meal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 cursor-pointer"
                            onClick={() => handleDelete(meal._id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.min(8, pagination.pages))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    {pagination.pages > 8 && (
                      <PaginationItem>
                        <span className="px-3 py-2">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                        className={
                          currentPage === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MealFormModal isOpen={!!editingMeal} onClose={closeEditModal} meal={editingMeal} day={day} />
    </>
  )
}
