// app/(account)/layout.tsx
'use client'
import { SidebarNav } from "@/components/account/SidebarNav"
import UserMobileNav from "@/components/account/UserMobileNav"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { User, Heart, Package, Truck, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const sidebarNavItems = [
    {
        title: 'Inicio',
        href: '/',
        icon: User,
    },
    {
        title: 'Favoritos',
        href: '/account/favorites',
        icon: Heart,
    },
    {
        title: 'Mis Pedidos',
        href: '/account/orders',
        icon: Package,
    },
    {
        title: 'Rastrear Pedido',
        href: '/account/track',
        icon: Truck,
    },
    {
        title: 'Notificaciones',
        href: '/account/notifications',
        icon: Bell,
    },
    {
        title: 'Cerrar Sesión',
        href: '/login',
        icon: LogOut
    },
]


export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.push('/')
        }
    }, [user, router, loading])


    return (
        <div className="mx-auto flex min-h-screen flex-col md:flex-row">
            {/* Sidebar - visible en desktop, oculto en mobile (puedes usar Sheet para mobile) */}
            <aside className="hidden w-64 shrink-0 border-r bg-muted/40 md:block">
                <div className="sticky top-16 h-full overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Mi Cuenta</h2>
                            <p className="text-sm text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                        <Separator />
                        <SidebarNav items={sidebarNavItems} />
                    </div>
                </div>
            </aside>
            <UserMobileNav
                items={sidebarNavItems}
                userName={user?.displayName}
            />

            {/* Contenido principal */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Mobile: puedes poner un Sheet con la navegación aquí si quieres */}
                {children}
            </main>
        </div>
    )
}