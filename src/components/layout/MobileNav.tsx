import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mobileCats, mobileNav } from '@/src/stores/data';

export default function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Menu className='h-6 w-6 size-6'>
                    </Menu>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className='w-full max-w-75 sm:max-w-sm pt-8'>
                <SheetHeader>
                    <SheetTitle className='text-4lx'> 
                        Explora <br/> <b>DessertBloom</b>
                    </SheetTitle>
                </SheetHeader>
                <hr />
                <ScrollArea className='p-0'>
                    <ul className='flex flex-col items-start list-none gap-3 p-4 m-0'>
                        {
                            mobileNav.map(link => (
                                <li key={link.href} className="mb-2 w-full">
                                        <SheetClose asChild>
                                        <Link 
                                            href={link.href} 
                                            title={link.label} 
                                            className='text-[16px] sm:text-lg'>
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                </li>
                            ))
                        }
                    </ul>

                    <hr />

                    <h2 className='font-bold text-4lx px-4 my-6'>
                        Categorías
                    </h2>

                    <ul className='flex flex-col items-start list-none gap-3 p-4 m-0'>
                        {
                            mobileCats.map(link => (
                                <li key={link.href} className="mb-2 w-full">
                                        <SheetClose asChild>
                                        <Link 
                                            href={link.href} 
                                            title={link.label} 
                                            className='text-[16px] sm:text-lg'>
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                </li>
                            ))
                        }
                    </ul>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}