import React, { useState } from 'react';
import { RefreshCw, FolderOpen, Download, Trash2, Edit2, Check, X, Gauge, Wind, Sparkles, Ruler, Repeat, Hand, BowArrow, Target } from 'lucide-react';
import { ATTACK_TYPES } from '../config/attackTypes';
import { STAT_CONFIGS } from '../config/statConfigs';
import { FACTIONS } from '../config/factions';

/**
 * Componente de Lista de Unidades para Valley'Vrena
 * Gestiona la visualización, edición y selección de unidades por facción
 */
const UnitRoster = ({ 
  units, 
  setUnits, 
  rosterTab, 
  setRosterTab, 
  onStartCombat, 
  exportStatus, 
  setExportStatus,
  setShowExportData,
  setJsonPreview, 
  allUnits 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Toggle selección para combate
  const toggleSelection = (id) => 
    setUnits(units.map(u => u.id === id ? { ...u, selectedForDraft: !u.selectedForDraft } : u));

  // Eliminar unidad
  const deleteUnit = (id) => setUnits(units.filter(u => u.id !== id));

  // Iniciar edición de unidad
  const startEditing = (unit) => {
    setEditingId(unit.id);
    const attackTypes = Array.isArray(unit.attackTypes) 
      ? unit.attackTypes 
      : unit.attackType ? [unit.attackType] : ['melee'];
    
    setEditValues({
      ...unit, 
      attackTypes,
      speed: unit.speed ?? STAT_CONFIGS.speed.default,
      agility: unit.agility ?? STAT_CONFIGS.agility.default,
      special: unit.special ?? STAT_CONFIGS.special.default,
      range: unit.range ?? STAT_CONFIGS.range.default,
      combos: unit.combos ?? STAT_CONFIGS.combos.default
    });
  };

  // Guardar edición
  const saveEdit = () => {
    setUnits(units.map(u => u.id === editingId ? { 
      ...editValues, 
      maxHp: Number(editValues.hp),
      speed: Number(parseFloat(editValues.speed).toFixed(STAT_CONFIGS.speed.decimals)),
      range: Number(parseFloat(editValues.range).toFixed(STAT_CONFIGS.range.decimals))
    } : u));
    setEditingId(null);
  };

  // Toggle tipos de ataque en edición
  const toggleEditAttackType = (typeId) => {
    setEditValues(prev => {
      const current = prev.attackTypes || [];
      if (current.includes(typeId)) {
        if (current.length > 1) {
          return {...prev, attackTypes: current.filter(t => t !== typeId)};
        }
        return prev;
      } else {
        return {...prev, attackTypes: [...current, typeId]};
      }
    });
  };

  // Ruleta para iniciar combate aleatorio
  const handleRoulette = () => {
    const selectedUnits = units.filter(u => u.selectedForDraft);
    if (selectedUnits.length < 2) return;
    
    const shuffled = [...selectedUnits].sort(() => 0.5 - Math.random());
    const half = Math.ceil(shuffled.length / 2);
    const p1 = shuffled.slice(0, half).map(u => ({...u, currentHp: u.maxHp, currentCooldown: 0}));
    const p2 = shuffled.slice(half).map(u => ({...u, currentHp: u.maxHp, currentCooldown: 0}));
    onStartCombat(p1, p2);
  };

  // Exportar unidades a JSON
  const exportUnits = () => {
    if (units.length === 0) {
      setExportStatus({ type: 'error', message: '⚠️ No hay unidades para exportar' });
      setTimeout(() => setExportStatus(''), 3000);
      return;
    }
    const jsonString = JSON.stringify(units, null, 2);
    setJsonPreview(jsonString);
    setShowExportData(true);
    
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonString).then(() => {
        setExportStatus({ type: 'success', message: `📋 ${getFactionLabel()} copiados` });
        setTimeout(() => setExportStatus(''), 3000);
      }).catch(() => {
        setExportStatus({ type: 'warning', message: '💡 Usa el botón "Copiar JSON"' });
        setTimeout(() => setExportStatus(''), 4000);
      });
    }
  };

  // Importar unidades desde JSON
  const importUnits = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target.result);
        if (Array.isArray(loaded)) {
          const migrated = loaded.map(u => {
            const attackTypes = Array.isArray(u.attackTypes) 
              ? u.attackTypes 
              : u.attackType ? [u.attackType] : ['melee'];
            const { attackType: _attackType, ...rest } = u;
            return {
              ...rest, 
              attackTypes,
              faction: rosterTab,
              speed: u.speed ?? STAT_CONFIGS.speed.default,
              agility: u.agility ?? STAT_CONFIGS.agility.default,
              special: u.special ?? STAT_CONFIGS.special.default,
              range: u.range ?? STAT_CONFIGS.range.default,
              combos: u.combos ?? STAT_CONFIGS.combos.default
            };
          });
          setUnits(migrated);
          setExportStatus({ type: 'success', message: `✅ Importadas: ${migrated.length} unidades` });
          setTimeout(() => setExportStatus(''), 3000);
        }
      } catch (err) { 
        console.error("❌ Error cargando archivo", err); 
        setExportStatus({ type: 'error', message: '❌ Archivo inválido' });
        setTimeout(() => setExportStatus(''), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Helper para obtener label de facción
  const getFactionLabel = () => {
    const labels = { vrena: 'Vrenas', ally: 'Aliados', enemy: 'Enemigos' };
    return labels[rosterTab] || 'Unidades';
  };

  // Componente de badges de tipos de ataque
  const AttackTypeBadges = ({ attackTypes, size = 'sm' }) => {
    const types = Array.isArray(attackTypes) ? attackTypes : [attackTypes || 'melee'];
    const sizeClasses = size === 'sm' ? 'text-[7px] px-1.5 py-0.5' : 'text-[8px] px-2 py-0.5';
    
    return (
      <div className="flex flex-wrap gap-1">
        {types.map(typeId => {
          const config = ATTACK_TYPES[typeId] || ATTACK_TYPES.melee;
          const Icon = config.icon;
          return (
            <span 
              key={typeId}
              className={`inline-flex items-center gap-0.5 rounded-full border font-bold ${config.borderColor} ${config.bgColor} ${config.textColor} ${sizeClasses}`}
            >
              <Icon size={size === 'sm' ? 7 : 8} />
              {config.label.split(' ')[0]}
            </span>
          );
        })}
      </div>
    );
  };

  // Componente de input mini para edición de stats avanzados
  const MiniStatInput = ({ statKey, value, setValue }) => {
    const config = STAT_CONFIGS[statKey];
    if (!config) return null;
    
    const Icon = config.icon;
    const isDecimal = config.decimals > 0;
    const displayValue = isDecimal ? parseFloat(value).toFixed(config.decimals) : value;
    
    const handleNumberChange = (e) => {
      const newValue = e.target.value;
      if (newValue === '' || newValue === '-') return;
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue) && numValue >= config.min && numValue <= config.max) {
        setValue(numValue);
      }
    };
    
    return (
      <div className="space-y-0.5">
        <div className="flex items-center justify-between gap-1">
          <label className="text-[7px] text-slate-400 flex items-center gap-0.5 min-w-0">
            <Icon size={7} className={`text-${config.color}-400 flex-shrink-0`} />
            <span className="truncate">{config.label.slice(0, 3)}</span>
          </label>
          <input
            type="number"
            step={config.step}
            min={config.min}
            max={config.max}
            value={displayValue}
            onChange={handleNumberChange}
            className={`w-14 bg-slate-900 text-${config.color}-300 text-[8px] font-bold p-0.5 rounded border border-slate-600 focus:border-${config.color}-500 outline-none text-right flex-shrink-0`}
          />
        </div>
        <input 
          type="range" 
          min={config.min} 
          max={config.max} 
          step={config.step}
          value={value} 
          onChange={e => setValue(Number(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
    );
  };

  const rosterConfig = FACTIONS[rosterTab] || FACTIONS.vrena;
  const RosterIcon = rosterConfig.icon;

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col h-full">
      
      {/* === PESTAÑAS DE FACCIONES === */}
      <div className="flex gap-2 mb-4">
        {Object.values(FACTIONS).map((f) => {
          const Icon = f.icon;
          const isActive = rosterTab === f.id;
          const unitCount = f.id === 'vrena' ? allUnits.vrenas.length : f.id === 'ally' ? allUnits.allies.length : allUnits.enemies.length;
          
          return (
            <button
              key={f.id}
              onClick={() => setRosterTab(f.id)}
              className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                isActive 
                  ? `${f.borderColor} ${f.bgColor} ${f.textColor}` 
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Icon size={14} />
              <span className="text-[10px] font-bold">{f.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                {unitCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* === CABECERA CON ACCIONES === */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <RefreshCw size={20} className={rosterConfig.textColor} /> 
          Cuartel: {rosterConfig.label}
        </h2>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white p-1.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors">
            <FolderOpen size={14} /> CARGAR
            <input type="file" accept=".json" className="hidden" onChange={importUnits} />
          </label>
          <button 
            onClick={exportUnits} 
            disabled={units.length === 0} 
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-1.5 rounded flex items-center gap-1 text-[10px] font-bold transition-colors"
          >
            <Download size={14} /> GUARDAR
          </button>
        </div>
      </div>

      {/* === ESTADO DE EXPORTACIÓN === */}
      {exportStatus && (
        <div className={`mb-3 p-2 rounded text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
          exportStatus.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-300' : 
          exportStatus.type === 'warning' ? 'bg-yellow-900/50 border border-yellow-500 text-yellow-300' : 
          'bg-red-900/50 border border-red-500 text-red-300'
        }`}>
          {exportStatus.type === 'success' ? <Check size={14} /> : <X size={14} />}
          {exportStatus.message}
        </div>
      )}

      {/* === LISTA DE UNIDADES === */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4 custom-scrollbar">
        {units.length === 0 ? (
          <p className="text-slate-500 text-center mt-10 text-sm">
            Sin {rosterConfig.label.toLowerCase()} registrados. Crea uno en la Forja.
          </p>
        ) : (
          units.map(unit => {
            const isEditing = editingId === unit.id;
            const unitAttackTypes = Array.isArray(unit.attackTypes) ? unit.attackTypes : [unit.attackType || 'melee'];
            
            return (
              <div 
                key={unit.id} 
                className={`bg-slate-900 p-2 rounded border border-slate-700 transition-colors ${
                  isEditing ? 'border-indigo-500 bg-slate-850' : 'hover:border-slate-600'
                }`}
              >
                {isEditing ? (
                  // === MODO EDICIÓN ===
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editValues.name} 
                        onChange={e => setEditValues({...editValues, name: e.target.value})} 
                        className="flex-1 bg-slate-800 text-white text-xs p-1 rounded border border-slate-600" 
                      />
                      <button onClick={saveEdit} className="bg-green-600 hover:bg-green-500 p-1 rounded text-white transition-colors">
                        <Check size={14}/>
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-red-600 hover:bg-red-500 p-1 rounded text-white transition-colors">
                        <X size={14}/>
                      </button>
                    </div>
                    
                    {/* Stats básicos en grid */}
                    <div className="grid grid-cols-6 gap-1 text-[6px] text-slate-500 uppercase font-bold text-center">
                      <div>Vida</div><div>Atk</div><div>Crit%</div><div>Mult</div><div>Cool</div><div>Ataques</div>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      <input type="number" value={editValues.hp} onChange={e => setEditValues({...editValues, hp: e.target.value})} className="bg-slate-800 text-white p-1 rounded border border-slate-600 w-full text-[7px]" />
                      <input type="number" value={editValues.attack} onChange={e => setEditValues({...editValues, attack: e.target.value})} className="bg-slate-800 text-white p-1 rounded border border-slate-600 w-full text-[7px]" />
                      <input type="number" value={editValues.critChance} onChange={e => setEditValues({...editValues, critChance: e.target.value})} className="bg-slate-800 text-white p-1 rounded border border-slate-600 w-full text-[7px]" />
                      <input type="number" step="0.1" value={editValues.critMult} onChange={e => setEditValues({...editValues, critMult: e.target.value})} className="bg-slate-800 text-white p-1 rounded border border-slate-600 w-full text-[7px]" />
                      <input type="number" value={editValues.maxCooldown} onChange={e => setEditValues({...editValues, maxCooldown: e.target.value})} className="bg-slate-800 text-white p-1 rounded border border-slate-600 w-full text-[7px]" />
                      <div className="flex flex-wrap gap-0.5">
                        {Object.values(ATTACK_TYPES).map(t => {
                          const isSelected = (editValues.attackTypes || []).includes(t.id);
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => toggleEditAttackType(t.id)}
                              className={`flex-1 text-[6px] px-0.5 py-0.5 rounded border truncate ${
                                isSelected 
                                  ? `${t.borderColor} ${t.bgColor} ${t.textColor}` 
                                  : 'border-slate-600 bg-slate-700 text-slate-400'
                              }`}
                            >
                              {t.label.split(' ')[0].slice(0, 2)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* === ATRIBUTOS AVANZADOS CON SCROLL === */}
                    <div className="border-t border-slate-700 pt-2">
                      <p className="text-[7px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Gauge size={8} /> Atributos Avanzados
                      </p>
                      <div className="max-h-24 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                        <MiniStatInput statKey="speed" value={editValues.speed ?? 10} setValue={v => setEditValues({...editValues, speed: v})} />
                        <MiniStatInput statKey="agility" value={editValues.agility ?? 10} setValue={v => setEditValues({...editValues, agility: v})} />
                        <MiniStatInput statKey="special" value={editValues.special ?? 10} setValue={v => setEditValues({...editValues, special: v})} />
                        <MiniStatInput statKey="range" value={editValues.range ?? 1} setValue={v => setEditValues({...editValues, range: v})} />
                        <MiniStatInput statKey="combos" value={editValues.combos ?? 1} setValue={v => setEditValues({...editValues, combos: v})} />
                      </div>
                    </div>
                  </div>
                ) : (
                  // === MODO VISUALIZACIÓN ===
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={unit.selectedForDraft} 
                        onChange={() => toggleSelection(unit.id)} 
                        className="w-4 h-4 accent-indigo-500 cursor-pointer flex-shrink-0" 
                      />
                      <div className="w-10 h-10 overflow-hidden bg-black rounded-full border border-slate-600 flex items-center justify-center flex-shrink-0">
                        <img src={unit.image} style={{ transform: `scale(${unit.scale / 100})` }} className="object-cover" alt={unit.name} />
                      </div>
                      <div className="cursor-pointer min-w-0" onClick={() => startEditing(unit)}>
                        <p className="text-white font-semibold text-sm flex items-center gap-1 truncate">
                          {unit.name} <Edit2 size={10} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-slate-500 text-[7px] uppercase">HP:{unit.maxHp} | ATK:{unit.attack}</p>
                          <AttackTypeBadges attackTypes={unitAttackTypes} size="sm" />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteUnit(unit.id)} 
                      className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                      title="Eliminar unidad"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* === BOTÓN DE COMBATE === */}
      <button 
        onClick={handleRoulette} 
        disabled={units.filter(u => u.selectedForDraft).length < 2} 
        className={`w-full font-bold py-3 rounded-lg flex justify-center items-center gap-2 text-lg transition-all ${
          rosterTab === 'enemy'
            ? 'bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white'
            : rosterTab === 'ally'
            ? 'bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white'
        }`}
      >
        <RefreshCw size={20} /> Luchar con {getFactionLabel()}
      </button>
    </div>
  );
};

export default UnitRoster;