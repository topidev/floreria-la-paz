// HomePage.tsx
'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ctas_imgs = [
  { src: "/images/ctas/hbd.png", alt: "Feliz Cumpleaños", title: "Feliz Cumpleaños", link: "/products/hbd" },
  { src: "/images/ctas/events.png", alt: "Eventos", title: "Eventos", link: "/events" },
  { src: "/images/ctas/bottle.png", alt: "Decoradores", title: "Decoradores", link: "products/accessories" },
  { src: "/images/ctas/sets.png", alt: "Conjuntos", title: "Conjuntos", link: "/products/sets" }
]

export default function Home() {


  return (
    <div className="w-full flex flex-col min-h-screen items-center justify-center bg-background font-sans ">

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

      <section className="flex min-h-screen w-full container flex-col items-center justify-start text-center py-20">
        <div className="flex w-full container flex-col items-center justify-start text-center">
          <h2 className="relative text-lg md:text-xl lg:text-2xl xl:text-4xl mb-16 p-6">
            Colecciones del Desierto
            <span className="absolute bg-primary h-2 w-1/3 bottom-0 left-1/2 rounded -translate-x-1/2"></span>
          </h2>
          <div className="flex flex-col w-full md:flex-row justify-between px-4 gap-6 md:gap-4">
            {ctas_imgs.map((cta) => (
              <Card
                key={cta.title}
                className="py-0 block group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm w-full md:w-1/4 max-w-md mx-auto transition-all duration-300 hover:shadow-lg"
              >
                {/* Contenedor de la imagen con aspect-ratio y relative */}
                <div className="relative aspect-4/5 w-full overflow-hidden md:aspect-3/4">
                  <Image
                    src={cta.src}
                    alt={cta.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    quality={85}
                    priority={false}
                  />
                </div>

                {/* Overlay + contenido que aparece siempre en mobile y en hover en desktop */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Link
                    href={cta.link}
                    title={cta.title}
                    className="py-3 w-1/2 bg-primary text-primary-foreground rounded-full xl:text-lg font-medium shadow-md hover:bg-primary/90 transition-colors"
                  >
                    Ver más
                  </Link>
                </div>

                {/* Versión siempre visible en mobile */}
                <div className="md:hidden flex justify-center py-4 border-t bg-card">
                  <Link
                    href={cta.link}
                    title={cta.title}
                    className="w-1/2 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Ver más
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
