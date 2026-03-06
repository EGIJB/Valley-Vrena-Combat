import { Users, Shield, Skull } from 'lucide-react';

/**
 * Configuración de Facciones para Valley'Vrena
 * Define las propiedades visuales y de comportamiento para cada facción
 */
export const FACTIONS = {
  vrena: {
    id: 'vrena',
    label: 'Vrena',
    icon: Users,
    color: 'indigo',
    borderColor: 'border-indigo-500/60',
    textColor: 'text-indigo-300',
    bgColor: 'bg-indigo-500/10',
    ringColor: 'ring-indigo-400/50',
    description: 'Unidades base neutrales',
    defaultFileName: 'vrenas_roster.json'
  },
  ally: {
    id: 'ally',
    label: 'Aliado',
    icon: Shield,
    color: 'green',
    borderColor: 'border-green-500/60',
    textColor: 'text-green-300',
    bgColor: 'bg-green-500/10',
    ringColor: 'ring-green-400/50',
    description: 'Unidades aliadas del jugador',
    defaultFileName: 'allies_roster.json'
  },
  enemy: {
    id: 'enemy',
    label: 'Enemigo',
    icon: Skull,
    color: 'red',
    borderColor: 'border-red-500/60',
    textColor: 'text-red-300',
    bgColor: 'bg-red-500/10',
    ringColor: 'ring-red-400/50',
    description: 'Unidades enemigas',
    defaultFileName: 'enemies_roster.json'
  }
};

/**
 * Helper para obtener una facción por ID
 * @param {string} factionId - El ID de la facción
 * @returns {Object} La configuración de la facción o vrena por defecto
 */
export const getFaction = (factionId) => {
  return FACTIONS[factionId] || FACTIONS.vrena;
};

/**
 * Helper para obtener todas las facciones como array
 * @returns {Array} Array con todas las configuraciones de facciones
 */
export const getAllFactions = () => {
  return Object.values(FACTIONS);
};

/**
 * Helper para obtener el ícono de facción como emoji
 * @param {string} factionId - El ID de la facción
 * @returns {string} El emoji representativo de la facción
 */
export const getFactionEmoji = (factionId) => {
  const emojis = {
    vrena: '👤',
    ally: '🛡️',
    enemy: '💀'
  };
  return emojis[factionId] || '👤';
};

/**
 * Helper para obtener el nombre del archivo JSON por facción
 * @param {string} factionId - El ID de la facción
 * @returns {string} El nombre del archivo JSON
 */
export const getFactionFileName = (factionId) => {
  const faction = getFaction(factionId);
  return faction.defaultFileName;
};

/**
 * Helper para validar si una facción existe
 * @param {string} factionId - El ID de la facción a validar
 * @returns {boolean} True si la facción existe
 */
export const isValidFaction = (factionId) => {
  return Object.keys(FACTIONS).includes(factionId);
};

export default FACTIONS;