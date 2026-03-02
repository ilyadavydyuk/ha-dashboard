import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EntityCardProps {
  name: string
  state: string
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export function EntityCard({ name, state, icon, active, onClick }: EntityCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-105",
        active && "border-primary bg-primary/10"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="text-2xl">{icon}</div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">{name}</p>
          <p className="text-lg font-semibold text-foreground">{state}</p>
        </div>
      </CardContent>
    </Card>
  )
}
