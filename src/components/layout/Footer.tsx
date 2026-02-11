// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-8">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-semibold mb-4">Florería La Paz</h3>
          <p className="text-sm text-muted-foreground">
            Flores frescas del desierto al corazón de BCS
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4">Enlaces</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/products" className="hover:text-primary">Catálogo</a></li>
            <li><a href="/contacto" className="hover:text-primary">Contacto</a></li>
            <li><a href="/envios" className="hover:text-primary">Envíos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4">Contacto</h4>
          <p className="text-sm text-muted-foreground">
            La Paz, Baja California Sur<br />
            WhatsApp: +52 612 123 4567<br />
            hola@florerialapaz.mx
          </p>
        </div>
      </div>

      <div className="container mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Florería La Paz. Todos los derechos reservados.
      </div>
    </footer>
  );
}