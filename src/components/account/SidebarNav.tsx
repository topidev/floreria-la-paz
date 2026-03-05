// src/components/account/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarNavProps } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';


export function SidebarNav({ items }: SidebarNavProps) {
    const pathname = usePathname();
    const { logout } = useAuth()

    return (
        <nav className="grid gap-2">
            {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (index === items.length - 1) {
                    return (
                        <Button
                            key={item.href}
                            onClick={logout}
                            variant='ghost'
                            className={cn(
                                'group cursor-pointer justify-start flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                            )}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.title}
                        </Button>
                    )
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                        )}
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}