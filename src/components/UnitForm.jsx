import React, { useState, useRef } from 'react';
import { UserPlus, ImageIcon, BarChart2, Swords, Zap, Check, AlertCircle, Gauge, Wind, Sparkles, Ruler, Repeat, Hand, BowArrow, Target } from 'lucide-react';
import { ATTACK_TYPES } from '../config/attackTypes';
import { STAT_CONFIGS } from '../config/statConfigs';
import { FACTIONS } from '../config/factions';

// ✅ COMPONENTES AUXILIARES MOVIDOS FUERA (nivel módulo)

/**
 * Input de stat con slider + campo editable numérico
 * @param {Object} props - statKey, value, setValue
 */
export const StatInput = ({ statKey, value, setValue }) => {
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Icon size={10} className={`text-${config.color}-400`} />
          {config.label}
        </label>
        <input
          type="number"
          step={config.step}
          min={config.min}
          max={config.max}
          value={displayValue}
          onChange={handleNumberChange}
          className={`w-20 bg-slate-900 text-${config.color}-300 text-[10px] font-bold p-1 rounded border border-slate-600 focus:border-${config.color}-500 outline-none text-right`}
        />
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <p className="text-[8px] text-slate-500">{config.description}</p>
      {isDecimal && (
        <p className="text-[7px] text-indigo-400">
          ↕ Incremento: {config.step} | Rango: {config.min} - {config.max}
        </p>
      )}
    </div>
  );
};

/**
 * Input mini para edición en lista
 */
export const MiniStatInput = ({ statKey, value, setValue }) => {
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

 // ✅ FUNCIONES QUE RETORNAN JSX (no componentes) - pueden estar dentro
export const AttackTypeSelector = ({ attackTypes, onToggle }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] text-slate-500">Selecciona los estilos de combate:</p>
      <span className="text-[10px] text-indigo-400 font-bold">{attackTypes.length} seleccionado(s)</span>
    </div>
    <div className="grid grid-cols-1 gap-2">
      {Object.values(ATTACK_TYPES).map((type) => {
        const Icon = type.icon;
        const isSelected = attackTypes.includes(type.id);
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onToggle(type.id)}
            className={`p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
              isSelected
                ? `${type.borderColor} ${type.bgColor} ring-1 ${type.ringColor}`
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? type.bgColor : 'bg-slate-800'}`}>
              <Icon size={16} className={isSelected ? type.textColor : 'text-slate-400'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${isSelected ? type.textColor : 'text-slate-300'}`}>
                {type.label}
              </p>
              <p className="text-[9px] text-slate-500 truncate">{type.description}</p>
            </div>
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              isSelected
                ? `${type.borderColor} ${type.bgColor}`
                : 'border-slate-600 bg-slate-800'
            }`}>
              {isSelected && <Check size={12} className={type.textColor} />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

  const AttackTypePreview = ({ attackTypes }) => (
    <div className="pt-3 border-t border-slate-700">
      <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase">Vista previa:</p>
      <div className="flex flex-wrap gap-1.5">
        {attackTypes.map(typeId => {
          const type = ATTACK_TYPES[typeId];
          if (!type) return null;
          const Icon = type.icon;
          return (
            <div key={typeId} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${type.borderColor} ${type.bgColor}`}>
              <Icon size={10} className={type.textColor} />
              <span className={`text-[9px] font-bold ${type.textColor}`}>{type.label.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

// ✅ COMPONENTE PRINCIPAL
const UnitForm = ({ onAddUnit }) => {
  const [activeSubTab, setActiveSubTab] = useState('basic');
  const [faction, setFaction] = useState('vrena');
  const [name, setName] = useState('');
  const [hp, setHp] = useState(100);
  const [attack, setAttack] = useState(15);
  const [critChance, setCritChance] = useState(10);
  const [critMult, setCritMult] = useState(1.5);
  const [cooldown, setCooldown] = useState(1);
  const [attackTypes, setAttackTypes] = useState(['melee']);
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(100);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [speed, setSpeed] = useState(STAT_CONFIGS.speed.default);
  const [agility, setAgility] = useState(STAT_CONFIGS.agility.default);
  const [special, setSpecial] = useState(STAT_CONFIGS.special.default);
  const [range, setRange] = useState(STAT_CONFIGS.range.default);
  const [combos, setCombos] = useState(STAT_CONFIGS.combos.default);

  const DEFAULT_IMAGE = "image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23334155' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='10'%3EVRENA%3C/text%3E%3C/svg%3E";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAttackType = (typeId) => {
    setAttackTypes(prev => {
      if (prev.includes(typeId)) {
        if (prev.length > 1) {
          return prev.filter(t => t !== typeId);
        }
        return prev;
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleSubmit = () => {
    setError('');
    if (!name?.trim()) { setError('⚠️ El nombre es obligatorio'); return; }
    if (attackTypes.length === 0) { setError('⚠️ Debes seleccionar al menos 1 tipo de ataque'); return; }
    try {
      const unitId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `unit_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const newUnit = {
        id: unitId, faction, name: name.trim(), hp: Number(hp), maxHp: Number(hp),
        attack: Number(attack), critChance: Number(critChance), critMult: Number(critMult),
        maxCooldown: Number(cooldown), attackTypes: [...attackTypes],
        speed: Number(parseFloat(speed).toFixed(STAT_CONFIGS.speed.decimals)),
        agility: Number(agility), special: Number(special),
        range: Number(parseFloat(range).toFixed(STAT_CONFIGS.range.decimals)),
        combos: Number(combos), image: image || DEFAULT_IMAGE, scale: Number(scale), selectedForDraft: true
      };
      console.log('✅ Unidad registrada:', newUnit);
      onAddUnit(newUnit, faction);
      // Reset
      setName(''); setHp(100); setAttack(15); setCritChance(10); setCritMult(1.5); setCooldown(1);
      setAttackTypes(['melee']);
      setSpeed(STAT_CONFIGS.speed.default); setAgility(STAT_CONFIGS.agility.default);
      setSpecial(STAT_CONFIGS.special.default); setRange(STAT_CONFIGS.range.default);
      setCombos(STAT_CONFIGS.combos.default);
      setImage(null); setScale(100);
      if(fileInputRef.current) fileInputRef.current.value = '';
      setActiveSubTab('basic');
    } catch (err) {
      console.error('❌ Error al registrar:', err);
      setError(`Error: ${err.message || 'Revisa la consola'}`);
    }
  };

  const useDefaultImage = () => { setImage(DEFAULT_IMAGE); setError(''); };

  const factionConfig = FACTIONS[faction] || FACTIONS.vrena;

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <UserPlus size={20} className="text-indigo-400" /> Crear Unidad
      </h2>

      <div className="mb-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
        <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase">Tipo de Unidad</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(FACTIONS).map((f) => {
            const Icon = f.icon;
            const isSelected = faction === f.id;
            return (
              <button key={f.id} type="button" onClick={() => setFaction(f.id)}
                className={`p-2 rounded-lg border-2 text-center transition-all ${isSelected ? `${f.borderColor} ${f.bgColor} ${f.textColor}` : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}>
                <Icon size={16} className="mx-auto mb-1" />
                <p className="text-[9px] font-bold">{f.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex border-b border-slate-700 mb-4 overflow-x-auto">
        {[{ id: 'basic', label: 'Básico', icon: ImageIcon }, { id: 'stats', label: 'Stats', icon: BarChart2 }, { id: 'attack', label: 'Ataques', icon: Swords }, { id: 'effects', label: 'Efectos', icon: Zap }].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} type="button" onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1 ${activeSubTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon size={14} />{tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {activeSubTab === 'basic' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm text-slate-300 mb-1 font-bold">Nombre</label>
              <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
                className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 focus:border-indigo-500 outline-none" placeholder={`Nombre del ${factionConfig.label}`} />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1 font-bold">Imagen</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
              <button type="button" onClick={useDefaultImage} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline">Usar imagen por defecto</button>
            </div>
            {image && (
              <div className="bg-slate-900 p-2 rounded border border-slate-700">
                <label className="block text-sm text-slate-300 mb-2">Escala: {scale}%</label>
                <input type="range" min="50" max="200" value={scale} onChange={e => setScale(e.target.value)} className="w-full mb-2" />
                <div className="w-20 h-20 mx-auto overflow-hidden bg-black rounded border border-slate-600 flex items-center justify-center">
                  <img src={image} style={{ transform: `scale(${scale / 100})` }} className="object-cover" alt="Preview" />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'stats' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Estadísticas Base</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1 font-bold">VIDA (HP)</label>
                  <input type="number" value={hp} onChange={e => setHp(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 outline-none" min="1" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1 font-bold">ATAQUE</label>
                  <input type="number" value={attack} onChange={e => setAttack(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 outline-none" min="1" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1 font-bold">CRIT %</label>
                  <input type="number" value={critChance} onChange={e => setCritChance(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 outline-none" min="0" max="100" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1 font-bold">MULT X</label>
                  <input type="number" step="0.1" value={critMult} onChange={e => setCritMult(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 outline-none" min="1" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Atributos Avanzados</p>
                <Gauge size={12} className="text-indigo-400" />
              </div>
              {/* ✅ AHORA StatInput es un componente externo - NO da error */}
              <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <StatInput statKey="speed" value={speed} setValue={setSpeed} />
                <StatInput statKey="agility" value={agility} setValue={setAgility} />
                <StatInput statKey="special" value={special} setValue={setSpecial} />
                <StatInput statKey="range" value={range} setValue={setRange} />
                <StatInput statKey="combos" value={combos} setValue={setCombos} />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'attack' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <AttackTypeSelector 
                attackTypes={attackTypes} 
                onToggle={toggleAttackType} 
                />
            <AttackTypePreview attackTypes={attackTypes} />
          </div>
        )}

        {activeSubTab === 'effects' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <label className="block text-sm text-slate-300 mb-1 font-bold flex items-center gap-2">
                Enfriamiento Máximo <Zap size={14} className="text-yellow-500" />
              </label>
              <p className="text-[10px] text-slate-500 mb-2">Turnos de espera tras atacar.</p>
              <input type="number" value={cooldown} onChange={e => setCooldown(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 outline-none" min="0" />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 p-2 rounded flex items-center gap-2 text-sm">
            <AlertCircle size={16} />{error}
          </div>
        )}

        <button type="button" onClick={handleSubmit}
          className={`w-full font-bold py-2 rounded transition-colors mt-4 flex items-center justify-center gap-2 ${faction === 'enemy' ? 'bg-red-600 hover:bg-red-500 text-white' : faction === 'ally' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          <Check size={18} /> Registrar {factionConfig.label}
        </button>
      </div>
    </div>
  );
};

export default UnitForm;