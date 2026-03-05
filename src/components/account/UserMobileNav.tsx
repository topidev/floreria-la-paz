// src/components/account/UserMobileNav.tsx
'use client';
import { SidebarNavProps } from "@/types/types";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";



export default function UserMobileNav({ items, userName }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer md:hidden" variant='ghost' size='icon'>
          <Menu className="h-6 size-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className='w-full max-w-75 sm:max-w-sm pt-8'>
        <SheetHeader>
          <SheetTitle className="text-3xl">{userName}</SheetTitle>
        </SheetHeader>
        <hr />
        <nav className="grid gap-2">
          {
            items.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    title={link.title}
                    className={cn(
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {link.title}
                  </Link>
                </SheetClose>
              )
            })
          }
        </nav>
      </SheetContent>
    </Sheet>
  )
}