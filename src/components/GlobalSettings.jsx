import React from 'react';
import { Settings, Zap, Scale, Users, Repeat } from 'lucide-react';

/**
 * Componente de Ajustes Globales para Valley'Vrena
 * Permite configurar las reglas generales del juego y balanceo de equipos
 */
const GlobalSettings = ({ settings, setSettings }) => {
  // Helper para actualizar settings anidados
  const updateBalanceSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-full">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Settings size={20} className="text-indigo-400" /> 
        Ajustes Globales
      </h2>
      
      <div className="space-y-6">
        
        {/* === SECCIÓN: MECÁNICAS DE COMBATE === */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            Mecánicas de Combate
          </h3>
          
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <div>
              <h4 className="text-sm font-bold text-white">Mecánica de Cansancio</h4>
              <p className="text-[10px] text-slate-500 mt-1">
                Activar enfriamiento tras atacar. Las unidades deberán esperar 
                turnos antes de volver a atacar.
              </p>
            </div>
            <button 
              onClick={() => setSettings({...settings, enableCooldown: !settings.enableCooldown})}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.enableCooldown ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
              aria-label={settings.enableCooldown ? 'Desactivar cansancio' : 'Activar cansancio'}
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.enableCooldown ? 'left-7' : 'left-1'
                }`} 
              />
            </button>
          </div>
        </div>

        {/* === SECCIÓN: BALANCEO DE EQUIPOS === */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Scale size={14} className="text-purple-500" />
            Balanceo de Equipos
          </h3>

          {/* Balance por cantidad de unidades */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Users size={14} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Balance por Cantidad</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  Si hay número impar de unidades, elimina aleatoriamente 
                  la sobrante para que ambos equipos tengan igual cantidad.
                </p>
              </div>
            </div>
            <button 
              onClick={() => updateBalanceSetting('byCount', !settings.balance?.byCount)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.balance?.byCount ? 'bg-blue-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle balance por cantidad"
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.balance?.byCount ? 'left-7' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Balance por poder (special + attack) */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Scale size={14} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Balance por Poder</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  Intenta intercambiar unidades para que la suma de 
                  Special + Attack sea similar en ambos equipos.
                </p>
              </div>
            </div>
            <button 
              onClick={() => updateBalanceSetting('byPower', !settings.balance?.byPower)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.balance?.byPower ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle balance por poder"
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.balance?.byPower ? 'left-7' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Permitir unidades duplicadas */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Repeat size={14} className="text-pink-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Permitir Duplicados</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  Si está desactivado, elimina automáticamente unidades 
                  con el mismo nombre en un mismo equipo.
                </p>
              </div>
            </div>
            <button 
              onClick={() => updateBalanceSetting('allowDuplicates', !settings.balance?.allowDuplicates)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.balance?.allowDuplicates !== false ? 'bg-pink-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle permitir duplicados"
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.balance?.allowDuplicates !== false ? 'left-7' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Duplicados en Combate */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Repeat size={14} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Duplicados en Combate</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  Si hay pocas unidades seleccionadas, duplicarlas automáticamente 
                  para llenar los equipos y hacer el combate más dinámico.
                </p>
              </div>
            </div>
            <button 
              onClick={() => updateBalanceSetting('allowCombatDuplicates', !settings.balance?.allowCombatDuplicates)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.balance?.allowCombatDuplicates ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
              aria-label="Toggle duplicados en combate"
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.balance?.allowCombatDuplicates ? 'left-7' : 'left-1'
                }`} 
              />
            </button>
          </div>

          {/* Configuración de duplicación */}
          {settings.balance?.allowCombatDuplicates && (
            <div className="ml-11 p-3 bg-slate-900/50 rounded border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-400">Mínimo de unidades por equipo:</label>
                <input 
                  type="number" 
                  min="2" 
                  max="10"
                  value={settings.balance?.minUnitsForDuplicate ?? 4}
                  onChange={(e) => updateBalanceSetting('minUnitsForDuplicate', Number(e.target.value))}
                  className="w-12 bg-slate-800 text-white text-[10px] p-1 rounded border border-slate-600 text-center"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-400">Variación en duplicados (±%):</label>
                <input 
                  type="number" 
                  min="0" 
                  max="50"
                  value={settings.balance?.duplicateVariance ?? 10}
                  onChange={(e) => updateBalanceSetting('duplicateVariance', Number(e.target.value))}
                  className="w-12 bg-slate-800 text-white text-[10px] p-1 rounded border border-slate-600 text-center"
                />
              </div>
            </div>
          )}
        </div>

        {/* === SECCIÓN: INFORMACIÓN === */}
        <div className="pt-4 border-t border-slate-700">
          <p className="text-[9px] text-slate-500 text-center">
            Valley'Vrena Combat Simulator v1.0
          </p>
          <p className="text-[8px] text-slate-600 text-center mt-1">
            Configuración guardada localmente
          </p>
        </div>

      </div>
    </div>
  );
};

export default GlobalSettings;