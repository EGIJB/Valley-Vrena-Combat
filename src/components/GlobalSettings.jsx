import React from 'react';
import { Settings, Zap } from 'lucide-react';

/**
 * Componente de Ajustes Globales para Valley'Vrena
 * Permite configurar las reglas generales del juego
 */
const GlobalSettings = ({ settings, setSettings }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 h-full">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Settings size={20} className="text-indigo-400" /> 
        Ajustes Globales
      </h2>
      
      <div className="space-y-6">
        {/* Mecánica de Cansancio */}
        <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Mecánica de Cansancio
              <Zap size={14} className="text-yellow-500" />
            </h3>
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

        {/* Futuros ajustes pueden agregarse aquí */}
        <div className="p-3 bg-slate-900/50 rounded border border-slate-700/50">
          <h3 className="text-sm font-bold text-slate-400 mb-2">Próximamente</h3>
          <ul className="text-[10px] text-slate-500 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              Ventaja por tipo de ataque
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              Modificadores de terreno
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              Límite de turnos por combate
            </li>
          </ul>
        </div>

        {/* Información de versión */}
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