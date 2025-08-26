// "use client"

// import { AppLayout } from "@/components/layout/app-layout"
// import { PageHeader } from "@/components/layout/page-header"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { getLocations, deleteLocation } from "@/lib/api"
// import { useState } from "react"
// import { toast } from "sonner"
// import { Edit, Trash2, Plus } from "lucide-react"
// import { LocationFormModal } from "@/components/locations/location-form-modal"

// export default function LocationsPage() {
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [editingLocation, setEditingLocation] = useState<any>(null)
//   const queryClient = useQueryClient()

//   const { data: locations, isLoading } = useQuery({
//     queryKey: ["locations"],
//     queryFn: getLocations,
//   })

//   const deleteMutation = useMutation({
//     mutationFn: deleteLocation,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["locations"] })
//       toast.success("Location deleted successfully")
//     },
//     onError: () => {
//       toast.error("Failed to delete location")
//     },
//   })

//   const handleDelete = (locationId: string) => {
//     if (confirm("Are you sure you want to delete this location?")) {
//       deleteMutation.mutate(locationId)
//     }
//   }

//   const handleEdit = (location: any) => {
//     setEditingLocation(location)
//   }

//   const closeModals = () => {
//     setShowAddModal(false)
//     setEditingLocation(null)
//   }

//   if (isLoading) {
//     return (
//       <AppLayout>
//         <PageHeader
//           title="Location"
//           breadcrumbs={["Dashboard", "Location"]}
//           action={
//             <Button className="bg-red-500 hover:bg-red-600 cursor-pointer">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Location
//             </Button>
//           }
//         />
//         <div className="p-6">
//           <Card>
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="flex items-center justify-between">
//                     <div className="flex-1 space-y-2">
//                       <Skeleton className="h-4 w-full" />
//                       <Skeleton className="h-4 w-3/4" />
//                     </div>
//                     <div className="flex space-x-2">
//                       <Skeleton className="h-8 w-8" />
//                       <Skeleton className="h-8 w-8" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </AppLayout>
//     )
//   }

//   return (
//     <AppLayout>
//       <PageHeader
//         title="Location"
//         breadcrumbs={["Dashboard", "Location"]}
//         action={
//           <Button className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => setShowAddModal(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Location
//           </Button>
//         }
//       />

//       <div className="p-6">
//         <Card>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Street Address
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       City
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       State
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Zip Code
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {locations && locations.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
//                         <div className="flex flex-col items-center">
//                           <div className="text-4xl mb-4">📍</div>
//                           <p className="text-lg font-medium">No locations found</p>
//                           <p className="text-sm">Add your first location to get started!</p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     locations?.map((location: any) => (
//                       <tr key={location._id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {location.streetAddress || location.address}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.city || "N/A"}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.state || "N/A"}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {location.zipCode || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => handleEdit(location)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-red-600 hover:text-red-900 hover:bg-red-50 cursor-pointer"
//                               onClick={() => handleDelete(location._id)}
//                               disabled={deleteMutation.isPending}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {locations && locations.length > 0 && (
//               <div className="px-6 py-4 border-t bg-gray-50">
//                 <div className="text-sm text-gray-500">
//                   Showing 1 to {locations.length} of {locations.length} results
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <LocationFormModal isOpen={showAddModal} onClose={closeModals} />

//       <LocationFormModal isOpen={!!editingLocation} onClose={closeModals} location={editingLocation} />
//     </AppLayout>
//   )
// }

