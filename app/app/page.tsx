import { EntityCard } from "@/components/entity-card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">HA Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <EntityCard name="Гостиная" state="22.5°C" icon="🌡️" />
        <EntityCard name="Люстра" state="Включена" icon="💡" active />
        <EntityCard name="Входная дверь" state="Закрыта" icon="🚪" />
        <EntityCard name="Телевизор" state="Выключен" icon="📺" />
      </div>
    </main>
  )
}
