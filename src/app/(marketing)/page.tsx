// HomePage.tsx
'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { testimonials, ctas_imgs, bestSellers } from '../../stores/data'
import { toast } from 'sonner';

export default function Home() {

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    try {
      // Aquí iría tu llamada real a Firebase/Mailchimp
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulación
      toast.success('¡Gracias por suscribirte! Revisa tu correo para el 10% de descuento.');
      setEmail('');
    } catch (error) {
      toast.error('Hubo un error al suscribirte. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight text-foreground">
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
                slidesToScroll: 1
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
                    className="
                      p-3
                      tracking-wider 
                      text-sm lg:text-lg xl:text-lg
                      bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:bg-primary/90 transition-colors"
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
              slidesToScroll: 1
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 py-2.5 px-1">
              {bestSellers.map((product) => (
                <CarouselItem
                  key={product.title}
                  className="pl-2 md:pl-4 basis-4/5 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="
                    shadow-sm dark:shadow-accent/30 px-2 group overflow-hidden border-none dark:hover:shadow-accent/70 transition-shadow duration-300 bg-card h-full flex flex-col
                    shadow-foreground/30 hover:shadow-foreground/70
                  ">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        className="object-cover rounded transition-transform duration-500 group-hover:scale-105"
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

      {/** Testimonials */}
      <section className="w-full flex justify-center py-12 md:py-16 bg-muted/20">
        <div className="container px-4 md:px-6">
          {/* Título */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Historias de Nuestros Clientes
            </h2>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground">
              Haciendo momentos inolvidables en Baja Sur
            </p>
          </div>

          {/* Testimonios – Carousel en mobile, grid en desktop */}
          <div className="block md:hidden">
            <Carousel
              opts={{
                align: 'center',
                loop: true,
                dragFree: true,
                slidesToScroll: 1
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((t) => (
                  <CarouselItem key={t.name} className="pl-4 basis-[90%]">
                    <Card className="h-full border-border bg-card shadow-sm">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="flex mb-4">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-lg italic mb-6 text-muted-foreground">"{t.text}"</p>
                        <Avatar className="h-12 w-12 mb-3 bg-primary/10">
                          <AvatarFallback className="text-primary font-medium">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Grid en desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="flex mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6 text-muted-foreground">"{t.text}"</p>
                  <Avatar className="h-12 w-12 mb-3 bg-primary/10">
                    <AvatarFallback className="text-primary font-medium">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 md:mt-20 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Recibe un 10% de descuento
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Suscríbete a nuestro boletín y mantente al tanto de nuestras colecciones exclusivas de temporada, promociones y entregas especiales en La Paz.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading} className="min-w-35 cursor-pointer">
                {loading ? 'Suscribiendo...' : 'Suscribirme'}
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
