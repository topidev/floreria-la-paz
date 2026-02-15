// HomePage.tsx
'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardFooter } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';

const ctas_imgs = [
  { src: "/images/ctas/hbd.png", alt: "Feliz Cumpleaños", title: "Feliz Cumpleaños", link: "/products/hbd" },
  { src: "/images/ctas/events.png", alt: "Eventos", title: "Eventos", link: "/events" },
  { src: "/images/ctas/sets.png", alt: "Conjuntos", title: "Conjuntos", link: "/products/sets" },
  { src: "/images/ctas/bottle.png", alt: "Condolencias", title: "Condolencias", link: "products/accessories" }
]

const bestSellers = [
  {
    title: 'Oasis Rose Box',
    price: 1250,
    image: '/images/products/oasis-rose-box.jpg',
    alt: 'Caja de rosas preservadas Oasis',
    link: '/products/oasis-rose-box',
  },
  {
    title: 'Desert Sunset',
    price: 890,
    image: '/images/products/desert-sunset.jpg',
    alt: 'Arreglo inspirado en atardecer del desierto',
    link: '/products/desert-sunset',
  },
  {
    title: 'Minimalist Cactus',
    price: 650,
    image: '/images/products/minimalist-cactus.jpg',
    alt: 'Cactus minimalista en maceta',
    link: '/products/minimalist-cactus',
  },
  {
    title: 'La Paz Breeze',
    price: 1400,
    image: '/images/products/la-paz-breeze.jpg',
    alt: 'Arreglo marino inspirado en La Paz',
    link: '/products/la-paz-breeze',
  },
];

export default function Home() {


  return (
    <div className="w-full flex flex-col min-h-screen items-center justify-center bg-background font-sans ">

      {/* Hero Shot */}
      <Carousel
        className="overflow-hidden w-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true
          })
        ]}
        opts={{
          loop: true,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="ml-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full aspect-video
              ">
                <Image
                  src={`/images/heroshot/tulpeon_hs_${index + 1}.png`}
                  alt={`Oferta especial - Hero ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                />

                <div
                  className="
                    absolute inset-0 flex items-center justify-center bg-black/15
                    hover:bg-black/30 transition-colors"
                >
                  <Link
                    href="/products/on-sale"
                    className="text-center text-2xl w-full h-full flex items-end justify-end text-accent px-6"
                  >
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* CTAs */}
      <section className="w-full py-16 md:py-20 bg-muted/30 flex justify-center">
        <div className="container px-4 md:px-6">
          {/* Título */}
          <div className="text-center mb-10 md:mb-12">
            <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Colecciones del Desierto
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Inspiradas en la belleza única de Baja California Sur
            </p>
          </div>

          {/* Carousel en mobile, grid en desktop */}
          <div className="block md:hidden">
            {/* Versión carousel para mobile */}
            <Carousel
              opts={{
                align: 'center',
                loop: true,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {ctas_imgs.map((cta) => (
                  <CarouselItem key={cta.title} className="pl-2 md:pl-4 basis-[85%]">
                    <Card className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 h-full">
                      <div className="relative aspect-4/5 w-full overflow-hidden">
                        <Image
                          src={cta.src}
                          alt={cta.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="85vw"
                          quality={85}
                        />
                      </div>

                      {/* Botón siempre visible en mobile */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end justify-center pb-6 md:hidden">
                        <Link
                          href={cta.link}
                          className="px-8 py-3 tracking-wider bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:bg-primary/90 transition-colors"
                        >
                          {cta.title}
                        </Link>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 hover:bg-background border-border" />
              <CarouselNext className="right-2 bg-background/80 hover:bg-background border-border" />
            </Carousel>
          </div>

          {/* Grid en desktop */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8">
            {ctas_imgs.map((cta) => (
              <Card
                key={cta.title}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src={cta.src}
                    alt={cta.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1200px) 25vw, 20vw"
                    quality={85}
                  />
                </div>

                {/* Overlay + botón en hover (solo desktop) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <Link
                    href={cta.link}
                    className="px-8 py-4 tracking-wider bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    {cta.title}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="w-full flex justify-center py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          {/* Título y subtítulo */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Más Vendidos
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Favoritos en La Paz
            </p>
          </div>

          {/* Carousel */}
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 py-2.5">
              {bestSellers.map((product) => (
                <CarouselItem
                  key={product.title}
                  className="pl-2 md:pl-4 basis-4/5 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                        quality={85}
                      />
                    </div>

                    <CardFooter className="flex flex-col items-center p-4 pt-5 bg-card border-t">
                      <h3 className="font-medium text-lg text-center mb-1">
                        {product.title}
                      </h3>
                      <p className="text-primary font-semibold text-xl">
                        ${product.price.toLocaleString('es-MX')} MXN
                      </p>
                      <Button asChild variant="outline" size="sm" className="mt-4 w-full md:w-auto">
                        <Link href={product.link}>Ver producto</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Flechas de navegación */}
            <CarouselPrevious className="left-2 md:left-4 bg-background/80 hover:bg-background border-border" />
            <CarouselNext className="right-2 md:right-4 bg-background/80 hover:bg-background border-border" />
          </Carousel>
        </div>
      </section>

    </div>
  );
}
