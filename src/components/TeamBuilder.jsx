import React, { useState } from 'react';
import { Swords, Shield, Skull, Users, Check, X, RefreshCw } from 'lucide-react';
import { FACTIONS } from '../config/factions';

/**
 * Componente TeamBuilder para Valley'Vrena
 * Permite seleccionar unidades de múltiples facciones para cada equipo
 */
const TeamBuilder = ({ 
  allUnits, 
  onCancel, 
  onConfirm 
}) => {
  // Estado para selecciones de cada equipo
  const [team1Selections, setTeam1Selections] = useState({
    vrena: [],
    ally: [],
    enemy: []
  });
  
  const [team2Selections, setTeam2Selections] = useState({
    vrena: [],
    ally: [],
    enemy: []
  });

  // Helper para obtener unidades de una facción
  const getUnitsByFaction = (faction) => {
    return allUnits[faction] || [];
  };

  // Toggle selección de unidad
  const toggleUnitSelection = (unitId, faction, team) => {
    const setter = team === 1 ? setTeam1Selections : setTeam2Selections;
    setter(prev => {
      const current = [...(prev[faction] || [])];
      const index = current.indexOf(unitId);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(unitId);
      }
      return { ...prev, [faction]: current };
    });
  };

  // Obtener todos los IDs seleccionados para un equipo
  const getAllSelectedIds = (team) => {
    const selections = team === 1 ? team1Selections : team2Selections;
    return [
      ...(selections.vrena || []),
      ...(selections.ally || []),
      ...(selections.enemy || [])
    ];
  };

  // Obtener unidades seleccionadas de una facción
  const getSelectedUnits = (faction, team) => {
    const selections = team === 1 ? team1Selections : team2Selections;
    const ids = selections[faction] || [];
    return getUnitsByFaction(faction).filter(u => ids.includes(u.id));
  };

  // Confirmar combate
  const handleConfirm = () => {
    const team1Ids = getAllSelectedIds(1);
    const team2Ids = getAllSelectedIds(2);
    
    if (team1Ids.length === 0 || team2Ids.length === 0) {
      alert('⚠️ Ambos equipos deben tener al menos 1 unidad');
      return;
    }
    
    // Construir equipos completos con datos de unidad
    const buildTeam = (selections) => {
      const team = [];
      Object.keys(selections).forEach(faction => {
        (selections[faction] || []).forEach(unitId => {
          const unit = getUnitsByFaction(faction).find(u => u.id === unitId);
          if (unit) {
            team.push({
              ...unit,
              currentHp: unit.maxHp,
              currentCooldown: 0
            });
          }
        });
      });
      return team;
    };
    
    onConfirm(buildTeam(team1Selections), buildTeam(team2Selections));
  };

  // Barajar selecciones aleatoriamente
  const handleShuffle = () => {
    const allAvailable = [];
    
    // Recopilar TODAS las unidades de TODAS las facciones
    Object.keys(FACTIONS).forEach(faction => {
      const units = getUnitsByFaction(faction);
      units.forEach(unit => {
        allAvailable.push({ 
          ...unit, 
          faction: faction
        });
      });
    });
    
    if (allAvailable.length === 0) {
      alert('⚠️ No hay unidades disponibles para mezclar');
      return;
    }
    
    // Mezclar y dividir
    const shuffled = allAvailable.sort(() => 0.5 - Math.random());
    const half = Math.ceil(shuffled.length / 2);
    
    const team1 = shuffled.slice(0, half);
    const team2 = shuffled.slice(half);
    
    // Inicializar correctamente con las keys correctas
    const newTeam1 = { vrena: [], ally: [], enemy: [] };
    const newTeam2 = { vrena: [], ally: [], enemy: [] };
    
    team1.forEach(u => {
      if (newTeam1[u.faction]) {
        newTeam1[u.faction].push(u.id);
      }
    });
    
    team2.forEach(u => {
      if (newTeam2[u.faction]) {
        newTeam2[u.faction].push(u.id);
      }
    });
    
    setTeam1Selections(newTeam1);
    setTeam2Selections(newTeam2);
  };

  // Contar unidades seleccionadas
  const team1Count = getAllSelectedIds(1).length;
  const team2Count = getAllSelectedIds(2).length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-6xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Swords size={20} className="text-red-400" />
            Constructor de Equipos
          </h2>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Área de equipos */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4">
          
          {/* Equipo 1 */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3 mb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-300 flex items-center gap-2">
                  <Shield size={16} />
                  Equipo 1
                </h3>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded">
                  {team1Count} unidades
                </span>
              </div>
            </div>
            
            {/* Lista de unidades seleccionadas */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {Object.keys(FACTIONS).map(faction => {
                const selected = getSelectedUnits(faction, 1);
                if (selected.length === 0) return null;
                const factionConfig = FACTIONS[faction];
                const Icon = factionConfig.icon;
                return (
                  <div key={faction} className={`bg-slate-900 rounded-lg border ${factionConfig.borderColor} p-2`}>
                    <p className={`text-[10px] font-bold ${factionConfig.textColor} mb-1 flex items-center gap-1`}>
                      <Icon size={10} /> {factionConfig.label}
                    </p>
                    <div className="space-y-1">
                      {selected.map(unit => (
                        <div 
                          key={unit.id}
                          className="flex justify-between items-center bg-slate-800/50 rounded px-2 py-1"
                        >
                          <span className="text-xs text-white truncate">{unit.name}</span>
                          <button
                            onClick={() => toggleUnitSelection(unit.id, faction, 1)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {team1Count === 0 && (
                <p className="text-slate-500 text-center text-sm py-4">
                  Selecciona unidades del panel central
                </p>
              )}
            </div>
          </div>

          {/* Selector de unidades disponibles */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <Users size={16} />
                  Unidades Disponibles
                </h3>
                <button
                  onClick={handleShuffle}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Aleatorio
                </button>
              </div>
            </div>
            
            {/* Lista de unidades disponibles por facción */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {Object.keys(FACTIONS).map(faction => {
                const factionConfig = FACTIONS[faction];
                const Icon = factionConfig.icon;
                const units = getUnitsByFaction(faction);
                
                if (units.length === 0) return null;
                
                return (
                  <div key={faction} className={`bg-slate-900 rounded-lg border ${factionConfig.borderColor} p-2`}>
                    <p className={`text-[10px] font-bold ${factionConfig.textColor} mb-2 flex items-center gap-1`}>
                      <Icon size={10} /> {factionConfig.label} ({units.length})
                    </p>
                    <div className="space-y-1">
                      {units.map(unit => {
                        const inTeam1 = team1Selections[faction]?.includes(unit.id);
                        const inTeam2 = team2Selections[faction]?.includes(unit.id);
                        const isTaken = inTeam1 || inTeam2;
                        
                        return (
                          <div 
                            key={unit.id}
                            className={`flex justify-between items-center rounded px-2 py-1 ${
                              isTaken ? 'bg-slate-800/30 opacity-50' : 'bg-slate-800'
                            }`}
                          >
                            <span className={`text-xs truncate ${isTaken ? 'text-slate-500' : 'text-white'}`}>
                              {unit.name}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => !isTaken && toggleUnitSelection(unit.id, faction, 1)}
                                disabled={isTaken}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  inTeam1 
                                    ? 'bg-indigo-600 text-white' 
                                    : isTaken 
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-indigo-600/50 text-indigo-300 hover:bg-indigo-600'
                                }`}
                              >
                                E1
                              </button>
                              <button
                                onClick={() => !isTaken && toggleUnitSelection(unit.id, faction, 2)}
                                disabled={isTaken}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  inTeam2 
                                    ? 'bg-pink-600 text-white' 
                                    : isTaken 
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-pink-600/50 text-pink-300 hover:bg-pink-600'
                                }`}
                              >
                                E2
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipo 2 */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-pink-900/30 border border-pink-500/30 rounded-lg p-3 mb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-pink-300 flex items-center gap-2">
                  <Skull size={16} />
                  Equipo 2
                </h3>
                <span className="text-xs font-bold text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded">
                  {team2Count} unidades
                </span>
              </div>
            </div>
            
            {/* Lista de unidades seleccionadas */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {Object.keys(FACTIONS).map(faction => {
                const selected = getSelectedUnits(faction, 2);
                if (selected.length === 0) return null;
                const factionConfig = FACTIONS[faction];
                const Icon = factionConfig.icon;
                return (
                  <div key={faction} className={`bg-slate-900 rounded-lg border ${factionConfig.borderColor} p-2`}>
                    <p className={`text-[10px] font-bold ${factionConfig.textColor} mb-1 flex items-center gap-1`}>
                      <Icon size={10} /> {factionConfig.label}
                    </p>
                    <div className="space-y-1">
                      {selected.map(unit => (
                        <div 
                          key={unit.id}
                          className="flex justify-between items-center bg-slate-800/50 rounded px-2 py-1"
                        >
                          <span className="text-xs text-white truncate">{unit.name}</span>
                          <button
                            onClick={() => toggleUnitSelection(unit.id, faction, 2)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {team2Count === 0 && (
                <p className="text-slate-500 text-center text-sm py-4">
                  Selecciona unidades del panel central
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Footer con acciones */}
        <div className="flex justify-between items-center p-4 border-t border-slate-700 gap-4">
          <div className="text-sm text-slate-400">
            <span className="text-indigo-400 font-bold">{team1Count}</span> vs{' '}
            <span className="text-pink-400 font-bold">{team2Count}</span> unidades
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors font-bold"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={team1Count === 0 || team2Count === 0}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-colors flex items-center gap-2"
            >
              <Swords size={16} />
              Iniciar Combate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamBuilder;