import './globals.css';

'use client';

import { useState, useEffect } from 'react';

// Types locaux pour Yaoundé
type QuartierYaounde = 'Bastos' | 'Mvan' | 'Mesa' | 'Mokolo' | 'Biyem-Assi' | 'Emana' | 'Nsam';
type NiveauUrgence = 'FAIBLE' | 'MOYEN' | 'CRITIQUE';
type StatutSignalement = 'SIGNALE' | 'EN_COURS' | 'NETTOYE';

interface Signalement {
  id: string;
  quartier: QuartierYaounde;
  repere: string;
  urgence: NiveauUrgence;
  statut: StatutSignalement;
  date: string;
}

export default function Home() {
  // Navigation par onglets
  const [activeTab, setActiveTab] = useState<'signaler' | 'suivi'>('signaler');
  const [signalements, setSignalements] = useState<Signalement[]>([]);

  // États du formulaire
  const [quartier, setQuartier] = useState<QuartierYaounde>('Mokolo');
  const [repere, setRepere] = useState('');
  const [urgence, setUrgence] = useState<NiveauUrgence>('MOYEN');

  // Charger les données fictives au démarrage
  useEffect(() => {
    const localData = localStorage.getItem('yaounde_propre_db');
    if (localData) {
      setSignalements(JSON.parse(localData));
    } else {
      // Données de départ pour la démo
      const demoData: Signalement[] = [
        { id: '1', quartier: 'Mokolo', repere: 'En face du marché, bac à ordures renversé', urgence: 'CRITIQUE', statut: 'SIGNALE', date: '05/08/2026' },
        { id: '2', quartier: 'Biyem-Assi', repere: 'Carrefour Acacia, côté boulangerie', urgence: 'MOYEN', statut: 'EN_COURS', date: '04/08/2026' }
      ];
      localStorage.setItem('yaounde_propre_db', JSON.stringify(demoData));
      setSignalements(demoData);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repere.trim()) return alert('Précisez un point de repère');

    const nouveau: Signalement = {
      id: Math.random().toString(36).substring(2, 7).toUpperCase(),
      quartier,
      repere,
      urgence,
      statut: 'SIGNALE',
      date: new Date().toLocaleDateString('fr-FR')
    };

    const MAJList = [nouveau, ...signalements];
    setSignalements(MAJList);
    localStorage.setItem('yaounde_propre_db', JSON.stringify(MAJList));
    
    setRepere('');
    setActiveTab('suivi'); // Bascule directement sur le flux public pour voir le résultat !
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-8">
      {/* Entête */}
      <header className="bg-emerald-600 p-4 text-center sticky top-0 shadow-md z-10">
        <h1 className="text-xl font-black tracking-tight text-white">🇨🇲 YAOUNDÉ PROPRE</h1>
        <p className="text-[10px] text-emerald-100 font-medium tracking-wide uppercase">MVP Citoyen Propre</p>
      </header>

      {/* Système d'onglets pour ton contact */}
      <nav className="flex bg-slate-800 border-b border-slate-700 sticky top-[60px] z-10">
        <button 
          onClick={() => setActiveTab('signaler')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center ${activeTab === 'signaler' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-800/50' : 'text-slate-400'}`}
        >
          📢 Signaler un dépôt
        </button>
        <button 
          onClick={() => setActiveTab('suivi')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center ${activeTab === 'suivi' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-800/50' : 'text-slate-400'}`}
        >
          📋 Suivi Public ({signalements.length})
        </button>
      </nav>

      <section className="max-w-md mx-auto p-4">
        {/* ONGLET 1 : FORMULAIRE CITOYEN */}
        {activeTab === 'signaler' && (
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4">Alerte Anonyme Rapide</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Choisir le Quartier</label>
                <select 
                  value={quartier} 
                  onChange={(e) => setQuartier(e.target.value as QuartierYaounde)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {['Mokolo', 'Biyem-Assi', 'Bastos', 'Mvan', 'Mesa', 'Emana', 'Nsam'].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Point de repère textuel</label>
                <textarea 
                  value={repere}
                  onChange={(e) => setRepere(e.target.value)}
                  placeholder="Ex: Juste derrière la station service, à côté de la boutique orange..."
                  rows={3}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Niveau de gravité</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FAIBLE', 'MOYEN', 'CRITIQUE'] as NiveauUrgence[]).map(level => {
                    const activeStyle = urgence === level ? 'ring-2 ring-emerald-400 border-transparent bg-slate-600 text-white' : 'opacity-50 bg-slate-700 text-slate-300';
                    return (
                      <button 
                        key={level} type="button" onClick={() => setUrgence(level)}
                        className={`p-2.5 text-[10px] font-extrabold rounded-lg border border-slate-600 transition-all ${activeStyle}`}
                      >
                        {level === 'FAIBLE' ? '🟢 ' : level === 'MOYEN' ? '🟡 ' : '🔴 '} {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-slate-950 p-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform pt-3">
                🚀 Envoyer le signalement
              </button>
            </form>
          </div>
        )}

        {/* ONGLET 2 : SUIVI PUBLIC */}
        {activeTab === 'suivi' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 px-1 uppercase tracking-wide">Flux des alertes de la ville</h2>
            {signalements.map(item => (
              <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">#{item.id}</span>
                    <h3 className="font-extrabold text-base text-white">{item.quartier}</h3>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${
                    item.statut === 'SIGNALE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.statut === 'SIGNALE' ? '🔴 Signalé' : '🟡 En cours'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 leading-relaxed">{item.repere}</p>
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wide text-slate-500">
                  <span>URGENCE : <strong className={item.urgence === 'CRITIQUE' ? 'text-rose-400' : item.urgence === 'MOYEN' ? 'text-amber-400' : 'text-green-400'}>{item.urgence}</strong></span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
                                                                                           }
            
