import React, { useState } from 'react';
import { Swords, RefreshCw, Settings, Check, AlertCircle, FileJson, Copy, X, Users, Hand, Shield, Skull, Database, ChevronLeft, ChevronRight } from 'lucide-react';

// Importar configuraciones
import { FACTIONS, getFactionFileName } from '../config/factions';

// Importar componentes
import UnitForm from './UnitForm';
import UnitRoster from './UnitRoster';
import CombatArena from './CombatArena';
import GlobalSettings from './GlobalSettings';

/**
 * Aplicación Principal - Valley'Vrena Combat Simulator
 * Punto de entrada que gestiona estados globales y navegación
 */
export default function App() {
  // Navegación
  const [view, setView] = useState('menu'); // 'menu' | 'combat'
  const [leftTab, setLeftTab] = useState('create'); // 'create' | 'settings'
  const [rosterTab, setRosterTab] = useState('vrena'); // 'vrena' | 'ally' | 'enemy'
  
  // Estados de unidades por facción
  const [vrenas, setVrenas] = useState([]);
  const [allies, setAllies] = useState([]);
  const [enemies, setEnemies] = useState([]);
  
  // Combate
  const [combatTeams, setCombatTeams] = useState({ p1: [], p2: [] });
  
  // Exportación
  const [exportStatus, setExportStatus] = useState('');
  const [showExportData, setShowExportData] = useState(false);
  const [jsonPreview, setJsonPreview] = useState('');
  
  // UI
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  
  // Configuración global
  const [settings, setSettings] = useState({
    enableCooldown: true
  });

  // Helpers para obtener/establecer unidades según pestaña
  const getCurrentUnits = () => {
    switch(rosterTab) {
      case 'ally': return allies;
      case 'enemy': return enemies;
      default: return vrenas;
    }
  };

  const setCurrentUnits = (newUnits) => {
    switch(rosterTab) {
      case 'ally': setAllies(newUnits); break;
      case 'enemy': setEnemies(newUnits); break;
      default: setVrenas(newUnits);
    }
  };

  // helper: etiqueta de facción (UnitRoster la gestiona internamente)

  // Actualizar timestamp
  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsUpdating(false);
      setExportStatus({ type: 'success', message: '🔄 Datos actualizados' });
      setTimeout(() => setExportStatus(''), 3000);
    }, 500);
  };

  // Iniciar combate
  const handleStartCombat = (p1, p2) => {
    setCombatTeams({ p1, p2 });
    setView('combat');
  };

  // Estadísticas de unidades
  const getUnitStats = (units) => {
    const stats = { melee: 0, range: 0, distance: 0, total: units.length };
    units.forEach(u => {
      const types = Array.isArray(u.attackTypes) ? u.attackTypes : [u.attackType || 'melee'];
      types.forEach(t => { if (stats[t] !== undefined) stats[t]++; });
    });
    return stats;
  };

  const currentUnits = getCurrentUnits();
  const unitStats = getUnitStats(currentUnits);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* === HEADER === */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            
            
            {/* Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Swords size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text truncate">
                  Valley'Vrena
                </h1>
                <p className="text-[9px] text-slate-500 truncate">Combat Simulator</p>
              </div>
            </div>

            {/* Stats rápidos */}
            <div className="hidden sm:flex items-center gap-4 flex-1 justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
              <Hand size={12} className="text-red-400" />
              <span className="text-[10px] text-slate-400">C/C:</span>
              <span className="text-[10px] font-bold text-red-300">{unitStats.melee}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Users size={12} className="text-indigo-400" />
                <span className="text-[10px] text-slate-400">Vrenas:</span>
                <span className="text-[10px] font-bold text-white">{vrenas.length}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Shield size={12} className="text-green-400" />
                <span className="text-[10px] text-slate-400">Aliados:</span>
                <span className="text-[10px] font-bold text-green-300">{allies.length}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Skull size={12} className="text-red-400" />
                <span className="text-[10px] text-slate-400">Enemigos:</span>
                <span className="text-[10px] font-bold text-red-300">{enemies.length}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50">
                <Database size={10} className="text-slate-500" />
                <span className="text-[9px] text-slate-500">{lastUpdate.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isUpdating}
                className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isUpdating 
                    ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Actualizar datos"
              >
                <RefreshCw size={14} className={isUpdating ? 'animate-spin' : ''} />
                <span className="text-[10px] font-bold hidden lg:inline">Actualizar</span>
              </button>
              
              <button
                onClick={() => setLeftTab('settings')}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                title="Ajustes"
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de progreso de actualización */}
        {isUpdating && (
          <div className="h-0.5 bg-slate-800 w-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" style={{ width: '100%' }} />
          </div>
        )}

        {/* Notificaciones */}
        {exportStatus && (
          <div className={`absolute top-full left-0 right-0 mx-auto max-w-md mt-2 p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-2 ${
            exportStatus.type === 'success' ? 'bg-green-900/90 border-green-500 text-green-300' : 
            exportStatus.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500 text-yellow-300' : 
            'bg-red-900/90 border-red-500 text-red-300'
          }`}>
            {exportStatus.type === 'success' ? <Check size={12} /> : <AlertCircle size={12} />}
            {exportStatus.message}
          </div>
        )}
      </header>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-[calc(90vh-80px)] flex flex-col">
          {view === 'menu' ? (
            <div className="flex flex-col md:flex-row gap-6 h-full">
              
              {/* Panel izquierdo (Forja/Ajustes) */}
              <div className={`transition-all duration-300 ease-in-out flex flex-col gap-4 min-w-0 ${
                leftPanelCollapsed ? 'w-0 md:w-0 opacity-0 overflow-hidden' : 'w-full md:w-1/3 opacity-100'
              }`}>
                {/* Tabs de panel izquierdo */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 shrink-0">
                  <button 
                    onClick={() => setLeftTab('create')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      leftTab === 'create' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    FORJA
                  </button>
                  <button 
                    onClick={() => setLeftTab('settings')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      leftTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    AJUSTES
                  </button>
                </div>
                
                {/* Contenido del panel */}
                <div className="flex-1 overflow-y-auto rounded-xl">
                  {leftTab === 'create' ? (
                    <UnitForm 
                      onAddUnit={(u, faction) => {
                        switch(faction) {
                          case 'ally': setAllies(prev => [...prev, u]); break;
                          case 'enemy': setEnemies(prev => [...prev, u]); break;
                          default: setVrenas(prev => [...prev, u]);
                        }
                      }} 
                    />
                  ) : (
                    <GlobalSettings settings={settings} setSettings={setSettings} />
                  )}
                </div>
              </div>

              {/* Botón flotante para colapsar panel */}
              <button
                onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-16 bg-slate-800 border border-slate-700 rounded-r-lg items-center justify-center hover:bg-slate-700 hover:border-indigo-500/50 transition-all group shadow-lg"
                title={leftPanelCollapsed ? 'Mostrar Forja' : 'Ocultar Forja'}
              >
                {leftPanelCollapsed ? (
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                ) : (
                  <ChevronLeft size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                )}
              </button>

              {/* Panel derecho (Cuartel) */}
              <div className={`flex-1 h-full overflow-hidden transition-all duration-300 min-w-0 ${
                leftPanelCollapsed ? 'md:ml-8' : ''
              }`}>
                <UnitRoster 
                  units={currentUnits}
                  setUnits={setCurrentUnits}
                  rosterTab={rosterTab}
                  setRosterTab={setRosterTab}
                  onStartCombat={handleStartCombat} 
                  exportStatus={exportStatus} 
                  setExportStatus={setExportStatus}
                  showExportData={showExportData}
                  setShowExportData={setShowExportData}
                  setJsonPreview={setJsonPreview}
                  leftPanelCollapsed={leftPanelCollapsed}
                  allUnits={{ vrenas, allies, enemies }}
                />
              </div>
            </div>
          ) : (
            // Vista de combate
            <CombatArena 
              p1Team={combatTeams.p1} 
              p2Team={combatTeams.p2} 
              onEndCombat={() => setView('menu')} 
              useCooldown={settings.enableCooldown}
            />
          )}
        </div>
      </main>

      {/* === MODAL DE EXPORTACIÓN JSON === */}
      {showExportData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileJson size={20} className="text-indigo-400" />
                Datos para Exportar
              </h3>
              <button onClick={() => setShowExportData(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-slate-900 p-4 rounded-lg text-xs text-green-400 overflow-auto max-h-96 font-mono">
                {jsonPreview}
              </pre>
            </div>
            <div className="p-4 border-t border-slate-700 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonPreview);
                  setExportStatus({ type: 'success', message: '📋 Copiado al portapapeles' });
                  setTimeout(() => setExportStatus(''), 3000);
                  setShowExportData(false);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded flex items-center justify-center gap-2"
              >
                <Copy size={16} /> Copiar JSON
              </button>
              <button
                onClick={() => setShowExportData(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded"
              >
                Cerrar
              </button>
            </div>
            <div className="px-4 pb-4">
              <p className="text-[10px] text-slate-400 text-center">
                💡 Copia este texto y pégalo en un archivo llamado{' '}
                <code className="bg-slate-700 px-1 rounded">
                  {getFactionFileName(rosterTab)}
                </code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}