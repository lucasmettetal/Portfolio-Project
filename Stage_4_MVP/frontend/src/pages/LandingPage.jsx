import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6efe8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(216,180,138,0.35),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(74,57,40,0.16),_transparent_35%),linear-gradient(135deg,_#f8efe9_0%,_#efe1d1_100%)]" />
      <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-[#d8b48a]/40 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-80 w-80 rounded-full bg-[#4a3928]/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_90px_rgba(31,25,20,0.12)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a6743]">Rue 25</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#1f1914] sm:text-5xl lg:text-6xl">
              Une élégance pensée à la main.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#5d534a] sm:text-lg">
              Découvrez une expérience boutique raffinée, où chaque détail est pensé pour vous accompagner avec style et singularité.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/boutique"
                className="inline-flex items-center justify-center rounded-full border border-[#2f241b] bg-[#1f1914] px-8 py-4 text-[12px] font-medium uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#2f241b]"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
