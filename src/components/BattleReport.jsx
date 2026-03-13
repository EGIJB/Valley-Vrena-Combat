import React, { useState } from 'react';
import { Copy, Download, Trophy, Sword, Shield, Heart, X, BarChart2, Skull } from 'lucide-react';
import { getFactionEmoji } from '../config/factions';

/**
 * BattleReport.jsx - Reporte de Combate para Valley'Vrena
 * Muestra estadísticas numéricas post-combate con opción de exportación
 */
const BattleReport = ({ data, onClose }) => {
  const { p1 = [], p2 = [], logs = [], winner = 0, timestamp = new Date() } = data || {}; // ensure data object exists and provide defaults
  const [copied, setCopied] = useState(false);

  // Calcular estadísticas por equipo
  const calculateTeamStats = (team = []) => {
    // defensivo: si no es un array, retornamos ceros
    if (!Array.isArray(team)) {
      return { totalDamage: 0, survivors: 0, totalHp: 0, avgHp: 0, count: 0 };
    }

    const totalDamage = team.reduce((sum, u) => {
      const dealt = (u.maxHp - (u.currentHp || 0));
      return sum + Math.max(0, dealt);
    }, 0);
    
    const survivors = team.filter(u => u.currentHp > 0).length;
    const totalHp = team.reduce((sum, u) => sum + u.maxHp, 0);
    const avgHp = totalHp / (team.length || 1);
    
    return { totalDamage, survivors, totalHp, avgHp, count: team.length };
  };

  const stats1 = calculateTeamStats(p1);
  const stats2 = calculateTeamStats(p2);

  // Identificar unidades destacadas (MVP por daño infligido)
  const findMVP = (team, teamName) => {
    if (!team.length) return null;
    
    // Calcular daño infligido aproximado (basado en HP perdido del enemigo)
    // Nota: Para precisión total, necesitaríamos registrar daño por unidad en CombatArena
    const sorted = [...team].sort((a, b) => {
      const dmgA = (a.maxHp - (a.currentHp || 0)) + (a.attack * 2); // Heurística
      const dmgB = (b.maxHp - (b.currentHp || 0)) + (b.attack * 2);
      return dmgB - dmgA;
    });
    
    const mvp = sorted[0];
    return mvp ? {
      name: mvp.name,
      faction: mvp.faction,
      emoji: getFactionEmoji(mvp.faction),
      attack: mvp.attack,
      hp: mvp.currentHp,
      maxHp: mvp.maxHp,
      special: mvp.special ?? 10
    } : null;
  };

  const mvp1 = findMVP(p1, 'Equipo 1');
  const mvp2 = findMVP(p2, 'Equipo 2');

  // Generar reporte en formato JSON
  const generateJSONReport = () => {
    return JSON.stringify({
      battle: {
        timestamp: timestamp.toISOString(),
        winner: winner === 1 ? 'team1' : winner === 2 ? 'team2' : 'draw',
        duration: 'N/A' // Podría calcularse si se registra tiempo
      },
      teams: {
        team1: {
          units: p1.map(u => ({
            name: u.name,
            faction: u.faction,
            attack: u.attack,
            maxHp: u.maxHp,
            finalHp: u.currentHp,
            survived: u.currentHp > 0
          })),
          stats: stats1
        },
        team2: {
          units: p2.map(u => ({
            name: u.name,
            faction: u.faction,
            attack: u.attack,
            maxHp: u.maxHp,
            finalHp: u.currentHp,
            survived: u.currentHp > 0
          })),
          stats: stats2
        }
      },
      highlights: {
        mvp_team1: mvp1,
        mvp_team2: mvp2
      },
      logs: logs
    }, null, 2);
  };

  // Generar reporte en formato Markdown
  const generateMarkdownReport = () => {
    const lines = [
      `# 🗡️ Reporte de Batalla - Valley'Vrena`,
      ``,
      `**Fecha:** ${timestamp.toLocaleString()}`,
      `**Ganador:** ${winner === 1 ? '🔵 Equipo 1' : winner === 2 ? '🔴 Equipo 2' : '🤝 Empate'}`,
      ``,
      `## 📊 Resumen`,
      `| Equipo | Unidades | Supervivientes | Daño Total | HP Promedio |`,
      `|--------|----------|----------------|------------|-------------|`,
      `| 🔵 Eq1 | ${stats1.count} | ${stats1.survivors} | ${stats1.totalDamage} | ${stats1.avgHp.toFixed(1)} |`,
      `| 🔴 Eq2 | ${stats2.count} | ${stats2.survivors} | ${stats2.totalDamage} | ${stats2.avgHp.toFixed(1)} |`,
      ``,
      `## 🏆 Unidades Destacadas`,
      mvp1 ? `### 🔵 MVP Equipo 1\n- **${mvp1.emoji} ${mvp1.name}**\n- Ataque: ${mvp1.attack} | HP: ${mvp1.hp}/${mvp1.maxHp}\n- Rareza: ${mvp1.special >= 70 ? 'Raro ✨' : mvp1.special >= 40 ? 'Poco Común 💎' : 'Común'}` : `### 🔵 MVP Equipo 1\n- Sin datos`,
      ``,
      mvp2 ? `### 🔴 MVP Equipo 2\n- **${mvp2.emoji} ${mvp2.name}**\n- Ataque: ${mvp2.attack} | HP: ${mvp2.hp}/${mvp2.maxHp}\n- Rareza: ${mvp2.special >= 70 ? 'Raro ✨' : mvp2.special >= 40 ? 'Poco Común 💎' : 'Común'}` : `### 🔴 MVP Equipo 2\n- Sin datos`,
      ``,
      `## 📋 Log de Batalla`,
      '```',
      ...logs,
      '```'
    ];
    return lines.join('\n');
  };

  // Copiar reporte al portapapeles
  const handleCopy = (format = 'json') => {
    const content = format === 'json' ? generateJSONReport() : generateMarkdownReport();
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Barra de progreso visual para daño
  const DamageBar = ({ value, max, color = 'green' }) => {
    const percent = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 transition-all duration-500`} 
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  };

  // Tarjeta de unidad destacada
  const HighlightCard = ({ unit, teamColor, label }) => {
    if (!unit) return (
      <div className={`p-3 rounded-lg border ${teamColor} bg-slate-900/50 text-slate-500 text-center`}>
        Sin datos
      </div>
    );
    
    const rarity = unit.special >= 70 ? { label: 'Raro', color: 'text-purple-400', icon: '✨' } :
                   unit.special >= 40 ? { label: 'Poco Común', color: 'text-blue-400', icon: '💎' } :
                   { label: 'Común', color: 'text-slate-400', icon: '' };
    
    return (
      <div className={`p-3 rounded-lg border ${teamColor} bg-slate-900/50`}>
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={14} className="text-yellow-400" />
          <span className="text-xs font-bold text-white">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-lg">
            {unit.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{unit.name}</p>
            <p className="text-[10px] text-slate-400">
              ATK:{unit.attack} • HP:{unit.hp}/{unit.maxHp}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[9px]">
          <span className={`${rarity.color}`}>{rarity.icon} {rarity.label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 size={20} className="text-indigo-400" />
            Reporte de Batalla
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* Resumen principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipo 1 */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
              <h3 className="font-bold text-indigo-300 flex items-center gap-2 mb-3">
                <Shield size={16} /> Equipo 1
                {winner === 1 && <Trophy size={14} className="text-yellow-400" />}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Unidades:</span>
                  <span className="text-white font-bold">{stats1.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supervivientes:</span>
                  <span className="text-green-400 font-bold">{stats1.survivors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daño Total:</span>
                  <span className="text-red-400 font-bold">{stats1.totalDamage}</span>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] text-slate-500 mb-1">Daño relativo</p>
                  <DamageBar value={stats1.totalDamage} max={Math.max(stats1.totalDamage, stats2.totalDamage) || 1} color="indigo" />
                </div>
              </div>
            </div>

            {/* Equipo 2 */}
            <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
              <h3 className="font-bold text-pink-300 flex items-center gap-2 mb-3">
                <Skull size={16} /> Equipo 2
                {winner === 2 && <Trophy size={14} className="text-yellow-400" />}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Unidades:</span>
                  <span className="text-white font-bold">{stats2.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supervivientes:</span>
                  <span className="text-green-400 font-bold">{stats2.survivors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daño Total:</span>
                  <span className="text-red-400 font-bold">{stats2.totalDamage}</span>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] text-slate-500 mb-1">Daño relativo</p>
                  <DamageBar value={stats2.totalDamage} max={Math.max(stats1.totalDamage, stats2.totalDamage) || 1} color="pink" />
                </div>
              </div>
            </div>
          </div>

          {/* Unidades destacadas */}
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-yellow-400" /> Unidades Destacadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <HighlightCard unit={mvp1} teamColor="border-indigo-500/50" label="🔵 MVP Equipo 1" />
              <HighlightCard unit={mvp2} teamColor="border-pink-500/50" label="🔴 MVP Equipo 2" />
            </div>
          </div>

          {/* Log de batalla */}
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 mb-2">
              <Sword size={16} className="text-red-400" /> Log de Batalla
            </h3>
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 max-h-48 overflow-y-auto text-[10px] font-mono text-slate-300 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="py-0.5 border-b border-slate-800/50 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer con acciones */}
        <div className="flex flex-wrap justify-between items-center gap-2 p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="text-[10px] text-slate-500">
            {timestamp.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy('json')}
              className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Copy size={12} /> {copied ? '¡Copiado!' : 'Copiar JSON'}
            </button>
            <button
              onClick={() => handleCopy('markdown')}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-bold transition-colors flex items-center gap-1"
            >
              <Download size={12} /> Copiar Markdown
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors"
            >
              ✓ Volver al Menú
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BattleReport;