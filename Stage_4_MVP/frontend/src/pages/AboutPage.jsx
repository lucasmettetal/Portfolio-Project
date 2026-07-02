import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';
import { useCustomerAuth } from '../hooks/useCustomerAuth.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import { useState } from 'react';

const IMG_ATELIER = '/images/atelier.jpg';

const TIMELINE = [
  { year: '2019', title: 'La fondation', text: 'Lucas et Marie ouvrent un premier atelier de 30m² au 25 de la rue des Artisans à Montauban. Deux machines à coudre, un stock de lin et une vision claire : créer des vêtements qui durent.' },
  { year: '2021', title: 'Le sur-mesure', text: 'Face à la demande de clients qui souhaitaient des pièces uniques, Rue 25 lance son service sur-mesure. Chaque projet devient une collaboration entre l\'atelier et son client.' },
  { year: '2023', title: 'Les matières', text: 'Signature d\'un partenariat avec trois filatures françaises et italiennes labellisées GOTS. Tous les tissus sont désormais traçables de la fibre à la pièce.' },
  { year: '2024', title: 'L\'atelier s\'agrandit', text: 'Déménagement dans un espace de 120m², accueil de deux apprentis tailleurs. La production reste manuelle et limitée à 200 pièces par an.' },
];

const VALUES = [
  { icon: '◈', title: 'Fait à la main', text: 'Chaque pièce passe par minimum 12 heures de travail artisanal. Pas de production à la chaîne, pas de compromis.' },
  { icon: '✦', title: 'Matières naturelles', text: 'Lin, coton biologique, laine mérinos, soie. Nous refusons les synthétiques et les mélanges qui ne se dégradent pas.' },
  { icon: '⬡', title: 'Pièces de durée', text: 'Nos vêtements sont conçus pour traverser les décennies. On vous fournit du fil pour les retouches.' },
];

export default function AboutPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const { user } = useCustomerAuth();

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between h-[68px]">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-[26px] font-normal tracking-[0.08em]">Rue</span>
            <span className="font-serif text-[30px] italic text-accent">25</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-[12px] tracking-[0.12em] text-muted uppercase hover:text-dark transition-colors">Boutique</Link>
            <Link to="/notre-histoire" className="text-[12px] tracking-[0.12em] text-dark uppercase">Notre Histoire</Link>
            <Link to="/contact" className="text-[12px] tracking-[0.12em] text-muted uppercase hover:text-dark transition-colors">Contact</Link>
            <Link to="/sur-mesure" className="text-[12px] tracking-[0.12em] text-muted uppercase hover:text-dark transition-colors">Sur Mesure</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 text-dark">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className="text-[11px] bg-accent text-white rounded-full w-[18px] h-[18px] flex items-center justify-center">{count}</span>}
            </button>
            {user ? (
              <Link to="/mon-compte" className="text-[10px] tracking-[0.15em] uppercase border border-stone text-muted px-3 py-1.5 hover:border-dark transition-colors">
                {user.firstName || 'Mon compte'}
              </Link>
            ) : (
              <Link to="/connexion" className="text-[10px] tracking-[0.15em] uppercase border border-stone text-muted px-3 py-1.5 hover:border-dark transition-colors">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden flex items-end">
        <img src={IMG_ATELIER} alt="Atelier Rue 25" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,24,21,0.80)] via-[rgba(26,24,21,0.15)] to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pb-10 md:pb-14 w-full fade-up">
          <p className="text-[11px] tracking-[0.35em] uppercase text-accent mb-4">Notre atelier</p>
          <h1 className="font-serif text-[42px] md:text-[60px] text-white leading-[1.08] font-normal">
            L'histoire de<br /><em>Rue 25</em>
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 md:px-10 py-16 md:py-20 text-center">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase mb-6">Depuis 2019</p>
        <p className="font-serif text-2xl md:text-3xl text-dark leading-relaxed font-normal mb-6">
          Nous croyons qu'un vêtement bien fait vaut plus que dix vêtements jetables.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Installés au 25 de la rue des Artisans à Montauban, nous confectionnons chaque pièce à la main, avec des matières naturelles choisies pour leur qualité et leur traçabilité. Notre production est volontairement limitée — 200 pièces par an — parce que la qualité ne supporte pas la précipitation.
        </p>
      </section>

      {/* Valeurs */}
      <section className="bg-white border-y border-stone">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {VALUES.map(v => (
            <div key={v.title} className="text-center md:text-left">
              <span className="text-accent text-xl block mb-4">{v.icon}</span>
              <h3 className="font-serif text-xl mb-3">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 md:px-10 py-16 md:py-20">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase mb-10">Notre parcours</p>
        <div className="space-y-12">
          {TIMELINE.map((item, i) => (
            <div key={item.year} className="flex gap-8 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex-shrink-0 w-16 pt-1">
                <span className="font-serif text-2xl text-accent">{item.year}</span>
              </div>
              <div className="flex-1 border-l border-stone pl-8">
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chiffres */}
      <section className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['200', 'Pièces / an'], ['15h+', 'Par pièce'], ['3', 'Artisans'], ['100%', 'Fait main']].map(([v, l]) => (
            <div key={l}>
              <div className="font-serif text-[44px] text-accent leading-none mb-2">{v}</div>
              <div className="text-[11px] text-white/45 tracking-[0.15em] uppercase">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl mb-2">Envie d'une pièce unique ?</h2>
          <p className="text-sm text-muted">Notre service sur-mesure est fait pour vous.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/sur-mesure" className="bg-dark text-white text-[12px] tracking-widest uppercase px-8 py-3">
            Sur mesure →
          </Link>
          <Link to="/" className="border border-stone text-[12px] tracking-widest uppercase px-8 py-3 text-muted hover:border-dark transition-colors">
            La boutique
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-dark text-white px-4 md:px-10 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-3 text-[11px] text-white/30">
          <span>© 2026 Rue 25. Tous droits réservés.</span>
          <div className="flex gap-5">
            <Link to="/mentions-legales" className="hover:text-white/60 transition-colors">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-white/60 transition-colors">Politique de confidentialité</Link>
            <span>25 rue des Artisans, Montauban</span>
          </div>
        </div>
      </footer>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
