// app/(account)/layout.tsx
'use client'
import { SidebarNav } from "@/components/account/SidebarNav"
import UserMobileNav from "@/components/account/UserMobileNav"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { User, Heart, Package, Truck, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export const sidebarNavItems = [
    {
        title: 'Inicio',
        href: '/dashboard',
        icon: User,
    },
    {
        title: 'Favoritos',
        href: '/favorites',
        icon: Heart,
    },
    {
        title: 'Mis Pedidos',
        href: '/orders',
        icon: Package,
    },
    {
        title: 'Rastrear Pedido',
        href: '/track',
        icon: Truck,
    },
    {
        title: 'Notificaciones',
        href: '/notifications',
        icon: Bell,
    },
]


export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth()
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
                    <div className="space-y-6 flex flex-col h-full">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Mi Cuenta</h2>
                            <p className="text-sm text-muted-foreground">
                                {user?.displayName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                        <Separator />
                        <SidebarNav items={sidebarNavItems} />
                        <div className="flex-1 block"> </div>
                        <Button
                            onClick={() => logout()}
                            variant='ghost'
                            className={cn(
                                'group w-full cursor-pointer justify-start mt-auto flex items-center rounded-md px-3 py-2 text-sm font-medium m-0 hover:bg-accent hover:text-accent-foreground',
                            )}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
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