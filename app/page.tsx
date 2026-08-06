'use client';

import './globals.css';
import { useState, useEffect } from 'react';

type QuartierYaounde = 'Bastos' | 'Mvan' | 'Mesa' | 'Emana' | 'Nsam' | 'Mokolo' | 'Biyem-Assi';
type NiveauUrgence = 'FAIBLE' | 'MOYEN' | 'CRITIQUE';
type StatutSignature = 'SIGNALÉ' | 'EN_COURS' | 'RÉSOLU';

interface Signalement {
  id: string;
  quartier: QuartierYaounde;
  repere: string;
  urgence: NiveauUrgence;
  statut: StatutSignature;
  date: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'signaler' | 'suivi'>('signaler');
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [quartier, setQuartier] = useState<QuartierYaounde>('Mokolo');
  const [repere, setRepere] = useState('');
  const [urgence, setUrgence] = useState<NiveauUrgence>('MOYEN');

  useEffect(() => {
    const sauv = localStorage.getItem('yaounde_propre_alerts');
    if (sauv) {
      setSignalements(JSON.parse(sauv));
    }
  }, []);

  const gérerSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repere.trim()) return;

    const nouvelleAlerte: Signalement = {
      id: Math.random().toString(36).substring(2, 9),
      quartier,
      repere,
      urgence,
      statut: 'SIGNALÉ',
      date: new Date().toLocaleDateString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const majListe = [nouvelleAlerte, ...signalements];
    setSignalements(majListe);
    localStorage.setItem('yaounde_propre_alerts', JSON.stringify(majListe));
    setRepere('');
    setUrgence('MOYEN');
    setActiveTab('suivi');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-emerald-600 text-white shadow-md text-center py-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-red-500 to-yellow-400" />
        <h1 className="text-2xl font-black tracking-wider flex items-center justify-center gap-2">
          <span>🇨🇲</span> YAOUNDÉ PROPRE
        </h1>
        <p className="text-xs text-emerald-100 font-medium mt-1 uppercase tracking-widest">
          Plateforme Citoyenne Locale • Esquisse MVP
        </p>
      </header>

      <div className="max-w-md mx-auto mt-4 px-3">
        <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-xl shadow-inner mb-6">
          <button
            onClick={() => setActiveTab('signaler')}
            className={`py-3 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === 'signaler' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-600'
            }`}
          >
            📢 Signaler une zone
          </button>
          <button
            onClick={() => setActiveTab('suivi')}
            className={`py-3 text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'suivi' ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-600'
            }`}
          >
            📋 Flux de Suivi
          </button>
        </div>

        {activeTab === 'signaler' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <form onSubmit={gérerSoumission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Sélectionner le Quartier
                </label>
                <select
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value as QuartierYaounde)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none"
                >
                  <option value="Mokolo">Mokolo (Marché)</option>
                  <option value="Biyem-Assi">Biyem-Assi</option>
                  <option value="Bastos">Bastos</option>
                  <option value="Mvan">Mvan (Gare routière)</option>
                  <option value="Mesa">La Mesa</option>
                  <option value="Emana">Emana</option>
                  <option value="Nsam">Nsam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Point de repère précis
                </label>
                <textarea
                  value={repere}
                  onChange={(e) => setRepere(e.target.value)}
                  placeholder="Ex: Face boulangerie, tas d'ordures bloquant le caniveau..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Niveau de gravité constaté
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FAIBLE', 'MOYEN', 'CRITIQUE'] as NiveauUrgence[]).map((niv) => (
                    <button
                      key={niv}
                      type="button"
                      onClick={() => setUrgence(niv)}
                      className={`py-2 text-[10px] font-black rounded-xl border text-center transition-all ${
                        urgence === niv ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {niv}
                    </button>
                    ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all mt-2"
              >
                🚀 Envoyer le signalement
              </button>
            </form>
          </div>
        )}

        {activeTab === 'suivi' && (
          <div className="space-y-3">
            {signalements.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">Aucun problème signalé pour le moment.</p>
              </div>
            ) : (
              signalements.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">📍 {item.quartier}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      {item.urgence}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">{item.repere}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
