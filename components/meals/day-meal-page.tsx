"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MealTable } from "./meal-table"
import { MealFormModal } from "./meal-form-modal"
import { useState } from "react"

interface DayMealPageProps {
  day: string
  displayName: string
}

export function DayMealPage({ day, displayName }: DayMealPageProps) {
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddClick = () => {
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
  }

  return (
    <AppLayout>
      <PageHeader
        title={`${displayName} List`}
        breadcrumbs={["Dashboard", `${displayName} List`]}
        action={
          <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add food
          </Button>
        }
      />

      <div className="p-6">
        <MealTable day={day} />
      </div>

      <MealFormModal isOpen={showAddModal} onClose={closeModal} day={day} />
    </AppLayout>
  )
}
