import type React from "react"
interface PageHeaderProps {
  title: string
  breadcrumbs: string[]
  action?: React.ReactNode
}

export function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-red-50 border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">›</span>}
              <span className={index === breadcrumbs.length - 1 ? "text-gray-700 font-medium" : ""}>{crumb}</span>
            </span>
          ))}
        </nav>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
