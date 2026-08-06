'use client';

import './globals.css';
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

const QUARTIERS: QuartierYaounde[] = ['Bastos', 'Mvan', 'Mesa', 'Mokolo', 'Biyem-Assi', 'Emana', 'Nsam'];

const STATUT_CONFIG: Record<StatutSignalement, { label: string; color: string; icon: string }> = {
  SIGNALE: { label: 'Signalé', color: '#ef4444', icon: '🔴' },
  EN_COURS: { label: 'En cours', color: '#f59e0b', icon: '🟡' },
  NETTOYE: { label: 'Nettoyé', color: '#22c55e', icon: '🟢' },
};

const URGENCE_COLOR: Record<NiveauUrgence, string> = {
  FAIBLE: '#22c55e',
  MOYEN: '#f59e0b',
  CRITIQUE: '#ef4444',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'signaler' | 'suivi' | 'carte' | 'impact'>('signaler');
  const [signalements, setSignalements] = useState<Signalement[]>([
    { id: '1', quartier: 'Mokolo', repere: "Derrière le marché", urgence: 'CRITIQUE', statut: 'SIGNALE', date: '2026-08-04' },
    { id: '2', quartier: 'Bastos', repere: "Près de la pharmacie", urgence: 'MOYEN', statut: 'EN_COURS', date: '2026-08-03' },
  ]);

  const [quartier, setQuartier] = useState<QuartierYaounde>('Mokolo');
  const [repere, setRepere] = useState('');
  const [urgence, setUrgence] = useState<NiveauUrgence>('MOYEN');

  function handleSubmit() {
    const nouveau: Signalement = {
      id: Date.now().toString(),
      quartier,
      repere: repere || 'Non précisé',
      urgence,
      statut: 'SIGNALE',
      date: new Date().toISOString().split('T')[0],
    };
    setSignalements([nouveau, ...signalements]);
    setRepere('');
    setActiveTab('suivi');
  }

  const compteParQuartier = QUARTIERS.map((q) => ({
    quartier: q,
    count: signalements.filter((s) => s.quartier === q).length,
    critique: signalements.some((s) => s.quartier === q && s.urgence === 'CRITIQUE' && s.statut !== 'NETTOYE'),
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 1 }}>🇨🇲 YAOUNDÉ PROPRE</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Plateforme citoyenne de signalement des dépôts sauvages</div>
      </header>

      <nav style={{ display: 'flex', borderBottom: '1px solid #1e293b', overflowX: 'auto' }}>
        {[
          { key: 'signaler', label: '📢 Signaler' },
          { key: 'suivi', label: `📋 Suivi (${signalements.length})` },
          { key: 'carte', label: '🗺️ Carte' },
          { key: 'impact', label: '📊 Impact' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: '1 0 auto',
              padding: '14px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === tab.key ? '#10b981' : '#94a3b8',
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: 20, maxWidth: 480, margin: '0 auto' }}>
        {activeTab === 'signaler' && (
          <div style={{ background: '#1e293b', borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Alerte Anonyme Rapide</h2>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1 }}>CHOISIR LE QUARTIER</label>
            <select
              value={quartier}
              onChange={(e) => setQuartier(e.target.value as QuartierYaounde)}
              style={{ width: '100%', padding: 14, marginTop: 8, marginBottom: 20, background: '#334155', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15 }}
            >
              {QUARTIERS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1 }}>POINT DE REPÈRE TEXTUEL</label>
            <textarea
              value={repere}
              onChange={(e) => setRepere(e.target.value)}
              placeholder="Ex: Juste derrière la station service, à côté de la boutique orange..."
              rows={3}
              style={{ width: '100%', padding: 14, marginTop: 8, marginBottom: 20, background: '#334155', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, resize: 'vertical' }}
            />

            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1 }}>NIVEAU DE GRAVITÉ</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 24 }}>
              {(['FAIBLE', 'MOYEN', 'CRITIQUE'] as NiveauUrgence[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgence(u)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: urgence === u ? `2px solid ${URGENCE_COLOR[u]}` : '2px solid #334155',
                    background: urgence === u ? `${URGENCE_COLOR[u]}22` : '#334155',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  ● {u}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              style={{ width: '100%', padding: 16, background: '#10b981', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15 }}
            >
              🚀 ENVOYER LE SIGNALEMENT
            </button>
          </div>
        )}

        {activeTab === 'suivi' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Suivi Public</h2>
            {signalements.length === 0 && <p style={{ color: '#94a3b8' }}>Aucun signalement pour l'instant.</p>}
            {signalements.map((s) => {
              const cfg = STATUT_CONFIG[s.statut];
              return (
                <div key={s.id} style={{ background: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderLeft: `4px solid ${URGENCE_COLOR[s.urgence]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{s.quartier}</span>
                    <span style={{ background: cfg.color + '22', color: cfg.color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>{s.repere}</div>
                  <div style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>{s.date} · Gravité: {s.urgence}</div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'carte' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Zones concernées</h2>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Vue par quartier — la couleur indique la densité de signalements actifs.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {compteParQuartier.map((z) => (
                <div
                  key={z.quartier}
                  style={{
                    background: z.critique ? '#7f1d1d' : z.count > 0 ? '#78350f' : '#1e293b',
                    borderRadius: 14,
                    padding: 16,
                    textAlign: 'center',
                    border: z.critique ? '2px solid #ef4444' : 'none',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{z.quartier}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>{z.count}</div>
                  <div style={{ fontSize: 10, color: '#cbd5e1' }}>signalement{z.count !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
            <p style={{ color: '#64748b', fontSize: 11, marginTop: 16, fontStyle: 'italic' }}>
              Note : une carte géolocalisée interactive (avec GPS précis) est prévue pour la version suivante.
            </p>
          </div>
        )}

        {activeTab === 'impact' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Pourquoi ce projet compte</h2>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {[
                { chiffre: '100%', label: 'Signalement anonyme et gratuit pour tous les citoyens' },
                { chiffre: '24/7', label: 'Disponible en continu, accessible depuis n\'importe quel smartphone' },
                { chiffre: '0 F', label: "Aucun coût d'infrastructure lourde pour démarrer" },
              ].map((item, i) => (
                <div key={i} style={{ background: '#1e293b', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', minWidth: 60 }}>{item.chiffre}</div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1e293b', borderRadius: 14, padding: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Bénéfices attendus pour la ville</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 13, lineHeight: 1.9 }}>
                <li>Détection plus rapide des points noirs d'insalubrité</li>
                <li>Meilleure priorisation des interventions municipales</li>
                <li>Réduction des risques sanitaires (paludisme, choléra) liés aux dépôts sauvages</li>
                <li>Renforcement de la participation citoyenne à la propreté urbaine</li>
                <li>Image modernisée de la mairie auprès des habitants</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: 24, color: '#475569', fontSize: 11 }}>
        Yaoundé Propre — MVP Citoyen Propre
      </footer>
    </div>
  );
}