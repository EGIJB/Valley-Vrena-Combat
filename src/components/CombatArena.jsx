import React, { useState, useRef, useEffect } from 'react';
import { Swords, Zap, Wind, Repeat } from 'lucide-react';
import { ATTACK_TYPES } from '../config/attackTypes';
import { STAT_CONFIGS } from '../config/statConfigs';
import { getFactionEmoji } from '../config/factions';
import { calculateDamage } from '../utils/combatHelpers';

/**
 * Componente de Arena de Combate para Valley'Vrena
 * Gestiona la lógica de batalla entre dos equipos
 */
const CombatArena = ({ p1Team, p2Team, onEndCombat, useCooldown }) => {
  const [p1, setP1] = useState(p1Team);
  const [p2, setP2] = useState(p2Team);
  const [turn, setTurn] = useState(1);
  const [selectedAttackerId, setSelectedAttackerId] = useState(null);
  const [logs, setLogs] = useState(["¡La batalla ha comenzado!"]);
  const logsEndRef = useRef(null);

  // Auto-scroll en logs
  useEffect(() => { 
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [logs]);

  // Detectar fin de combate
  useEffect(() => {
    const p1Alive = p1.some(u => u.currentHp > 0);
    const p2Alive = p2.some(u => u.currentHp > 0);
    if (!p1Alive || !p2Alive) {
      setTimeout(() => {
        alert(!p1Alive ? "¡Jugador 2 gana la partida!" : "¡Jugador 1 gana la partida!");
        onEndCombat();
      }, 400);
    }
  }, [p1, p2, onEndCombat]);

  const addLog = (msg) => setLogs(prev => [...prev, msg]);

  const handleUnitClick = (side, unit) => {
    if (unit.currentHp <= 0) return;
    if (side === turn) {
      if (useCooldown && unit.currentCooldown > 0) {
        addLog(`⚠️ ${unit.name} está cansado (${unit.currentCooldown}T).`);
        return;
      }
      setSelectedAttackerId(unit.id);
    } else if (selectedAttackerId && side !== turn) {
      executeAttack(selectedAttackerId, unit.id);
    }
  };

  const executeAttack = (attackerId, targetId) => {
    const attackers = turn === 1 ? p1 : p2;
    const defenders = turn === 1 ? p2 : p1;
    const attacker = attackers.find(u => u.id === attackerId);
    const target = defenders.find(u => u.id === targetId);
    if (!attacker || !target) return;
    
    // Cálculo de daño (usando helper para evitar llamadas aleatorias dispersas)
    const { isCrit, damage } = calculateDamage(attacker);
    
    // Tipos de ataque
    const attackTypes = Array.isArray(attacker.attackTypes) 
      ? attacker.attackTypes 
      : attacker.attackType ? [attacker.attackType] : ['melee'];
    const primaryAttackType = attackTypes[0] || 'melee';
    const attackConfig = ATTACK_TYPES[primaryAttackType] || ATTACK_TYPES.melee;
    
    // Aplicar daño
    const nextP1 = [...p1];
    const nextP2 = [...p2];
    const currentAttackers = turn === 1 ? nextP1 : nextP2;
    const currentDefenders = turn === 1 ? nextP2 : nextP1;
    const targetIdx = currentDefenders.findIndex(u => u.id === targetId);
    
    currentDefenders[targetIdx].currentHp = Math.max(0, currentDefenders[targetIdx].currentHp - damage);
    
    // Aplicar cooldown si está activado
    if (useCooldown) {
      const attackerIdx = currentAttackers.findIndex(u => u.id === attackerId);
      currentAttackers[attackerIdx].currentCooldown = attacker.maxCooldown || 0;
    }
    
    // Formato del log
    const typeLabel = attackTypes.length > 1 
      ? `${attackConfig.label} (+${attackTypes.length - 1})` 
      : attackConfig.label;
    
    const speed = attacker.speed ?? 10;
    const special = attacker.special ?? 10;
    const speedBonus = speed >= 70 ? '⚡' : '';
    const specialBonus = special >= 70 ? '✨' : '';
    const factionLabel = getFactionEmoji(attacker.faction);
    
    addLog(`${isCrit ? '💥 CRIT! ' : '⚔️ '}${factionLabel} ${attacker.name} [${typeLabel}]${speedBonus}${specialBonus} -> ${target.name} (-${damage} HP)`);
    
    if (currentDefenders[targetIdx].currentHp === 0) {
      addLog(`💀 ${target.name} fuera de combate.`);
    }
    
    setP1(nextP1);
    setP2(nextP2);
    setSelectedAttackerId(null);
    
    // Cambiar turno
    const nextTurn = turn === 1 ? 2 : 1;
    setTurn(nextTurn);
    
    // Reducir cooldowns al cambiar turno
    if (useCooldown) {
      if (nextTurn === 1) {
        setP1(prev => prev.map(u => ({ ...u, currentCooldown: Math.max(0, u.currentCooldown - 1) })));
      } else {
        setP2(prev => prev.map(u => ({ ...u, currentCooldown: Math.max(0, u.currentCooldown - 1) })));
      }
    }
  };

  // Badge de tipos de ataque
  const AttackTypeBadges = ({ attackTypes }) => {
    const types = Array.isArray(attackTypes) ? attackTypes : [attackTypes || 'melee'];
    return (
      <div className="flex flex-wrap gap-1 mb-1">
        {types.map(typeId => {
          const config = ATTACK_TYPES[typeId] || ATTACK_TYPES.melee;
          const Icon = config.icon;
          return (
            <span 
              key={typeId}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[7px] font-bold uppercase tracking-tight backdrop-blur-sm ${config.borderColor} ${config.bgColor} ${config.textColor}`}
            >
              <Icon size={8} />
              {config.label.split(' ')[0]}
            </span>
          );
        })}
      </div>
    );
  };

  // Badge de rareza
  const RarityBadge = ({ special }) => {
    let rarity = { label: 'Común', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
    if (special >= 70) rarity = { label: 'Raro', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    else if (special >= 40) rarity = { label: 'Poco Común', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    
    return (
      <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border ${rarity.border} ${rarity.bg} ${rarity.color}`}>
        {rarity.label}
      </span>
    );
  };

  // Renderizar carta de unidad
  const renderCard = (unit, side, isMirrored) => {
    const isDead = unit.currentHp <= 0;
    const isExhausted = useCooldown && unit.currentCooldown > 0;
    const isSelected = selectedAttackerId === unit.id;
    const hpPerc = (unit.currentHp / unit.maxHp) * 100;
    
    const attackTypes = Array.isArray(unit.attackTypes) 
      ? unit.attackTypes 
      : unit.attackType ? [unit.attackType] : ['melee'];
    const primaryType = attackTypes[0] || 'melee';
    const primaryConfig = ATTACK_TYPES[primaryType] || ATTACK_TYPES.melee;
    
    const speed = unit.speed ?? 10;
    const special = unit.special ?? 10;
    const combos = unit.combos ?? 1;
    
    // Estilos según estado
    let borderClass = "border-slate-700";
    let bgClass = "bg-slate-800";
    
    if (unit.faction === 'ally') borderClass = "border-green-600/50";
    else if (unit.faction === 'enemy') borderClass = "border-red-600/50";
    
    if (isDead) { 
      borderClass = "border-black"; 
      bgClass = "bg-slate-900 opacity-40 grayscale"; 
    } else if (isSelected) { 
      borderClass = "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"; 
    } else if (isExhausted) { 
      borderClass = "border-orange-500/50"; 
      bgClass = "bg-orange-900/10"; 
    }

    return (
      <div 
        key={unit.id} 
        onClick={() => handleUnitClick(side, unit)}
        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${bgClass} ${borderClass}`}
      >
        <div className={`flex items-center gap-3 ${isMirrored ? 'flex-row-reverse text-right' : ''}`}>
          {/* Imagen con borde de tipo de ataque */}
          <div className="w-12 h-12 bg-black rounded border border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
            <div className={`absolute inset-0 rounded border-2 pointer-events-none ${primaryConfig.borderColor} opacity-30`} />
            {special >= 70 && (
              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
            <img 
              src={unit.image} 
              style={{ transform: `scale(${unit.scale / 100}) ${isMirrored ? 'scaleX(-1)' : ''}` }} 
              alt={unit.name} 
              className="object-cover"
            />
          </div>
          
          {/* Info de la unidad */}
          <div className="flex-1 overflow-hidden min-w-0">
            <div className="flex justify-between items-center mb-0.5 gap-2">
              <span className={`text-xs font-bold truncate block ${isExhausted && !isDead ? 'text-orange-300' : 'text-white'}`}>
                {getFactionEmoji(unit.faction)} {unit.name}
              </span>
              {isExhausted && !isDead && <Zap size={10} className="text-orange-500 animate-pulse flex-shrink-0" />}
            </div>
            
            <AttackTypeBadges attackTypes={attackTypes} />
            
            {/* Badges de atributos especiales */}
            <div className="flex flex-wrap gap-1 mb-1">
              <RarityBadge special={special} />
              {speed >= 70 && (
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 flex items-center gap-0.5">
                  <Wind size={6} /> {parseFloat(speed).toFixed(1)}
                </span>
              )}
              {combos >= 3 && (
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded border border-pink-500/30 bg-pink-500/10 text-pink-300 flex items-center gap-0.5">
                  <Repeat size={6} /> x{combos}
                </span>
              )}
            </div>
            
            {/* Stats principales */}
            <div className="flex justify-between items-end text-[8px] font-bold">
              <span className="text-red-400">ATK:{unit.attack}</span>
              <span className="text-green-400">HP:{unit.currentHp}/{unit.maxHp}</span>
            </div>
            
            {/* Barra de vida */}
            <div className="w-full bg-black h-1.5 rounded-full mt-1 border border-slate-700 overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-300" 
                style={{width: `${hpPerc}%`}}
              />
            </div>
            
            {isExhausted && (
              <div className="text-[7px] text-orange-400 font-bold uppercase mt-1">
                Cansancio: {unit.currentCooldown}T
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in zoom-in-95 duration-300">
      {/* Header del combate */}
      <div className="flex justify-between items-center mb-4 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl">
        <button 
          onClick={onEndCombat} 
          className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
        >
          RENDIRSE
        </button>
        <span className="font-black tracking-[0.2em] text-red-500 flex items-center gap-2">
          <Swords size={18}/> ARENA DE COMBATE
        </span>
        <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 ${
          turn === 1 ? 'text-indigo-400 border-indigo-500/50' : 'text-pink-400 border-pink-500/50'
        }`}>
          TURNO J{turn}
        </span>
      </div>
      
      {/* Área de combate */}
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Equipo 1 */}
        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {p1.map(u => renderCard(u, 1, false))}
        </div>
        
        {/* Logs de batalla */}
        <div className="flex-1 bg-slate-900 rounded-xl p-3 border border-slate-800 overflow-hidden flex flex-col shadow-inner">
          <p className="text-[9px] font-bold text-slate-600 mb-2 uppercase tracking-widest border-b border-slate-800 pb-1">
            Registros de Batalla
          </p>
          <div className="flex-1 overflow-y-auto text-[10px] space-y-1 pr-1 custom-scrollbar">
            {logs.map((l, i) => (
              <div key={i} className="p-2 border-b border-slate-800/50 text-slate-400 animate-in slide-in-from-left-2">
                {l}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
        
        {/* Equipo 2 */}
        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {p2.map(u => renderCard(u, 2, true))}
        </div>
      </div>
    </div>
  );
};

export default CombatArena;