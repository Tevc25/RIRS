import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary" />
            <span className="font-semibold text-lg">RIRS</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">Prijava</Link>
            <Link to="/register" className="text-sm bg-primary text-white px-3 py-1.5 rounded hover:bg-primary-dark">Ustvari račun</Link>
          </nav>
        </div>
      </header>

      <main className="">
        <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Organiziraj dogodke brez stresa
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Vabila, RSVP-ji, opomniki in povratne informacije na enem mestu. Enostavno za vas, lepo za goste.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="bg-primary text-white px-5 py-3 rounded-md font-medium hover:bg-primary-dark">Začni brezplačno</Link>
              <Link to="/events/new" className="px-5 py-3 rounded-md font-medium border hover:bg-gray-50">Ustvari dogodek</Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">Brez kreditne kartice • 2 minuti za nastavitev</p>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl border shadow-sm bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
              <div className="text-gray-500">Predogled dogodka</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} RIRS
        </div>
      </footer>
    </div>
  );
}
