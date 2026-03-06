import { Wind, Zap, Sparkles, Ruler, Repeat } from 'lucide-react';

/**
 * Configuración de Atributos Avanzados para Valley'Vrena
 * Define las propiedades de cada stat para unidades
 */
export const STAT_CONFIGS = {
  speed: {
    id: 'speed',
    label: 'Velocidad',
    icon: Wind,
    min: 0.1,
    max: 100,
    default: 10,
    step: 0.1,
    decimals: 1,
    description: 'Determina orden de turno y probabilidad de combos',
    color: 'blue'
  },
  agility: {
    id: 'agility',
    label: 'Agilidad',
    icon: Zap,
    min: 1,
    max: 100,
    default: 10,
    step: 1,
    decimals: 0,
    description: 'Probabilidad de evasión y multi-ataques',
    color: 'green'
  },
  special: {
    id: 'special',
    label: 'Especial',
    icon: Sparkles,
    min: 1,
    max: 100,
    default: 10,
    step: 1,
    decimals: 0,
    description: 'Rareza: mayor valor = más raro pero más poderoso',
    color: 'purple'
  },
  range: {
    id: 'range',
    label: 'Alcance',
    icon: Ruler,
    min: 0.5,
    max: 10,
    default: 1,
    step: 0.5,
    decimals: 1,
    description: 'Distancia máxima de objetivo (casillas)',
    color: 'orange'
  },
  combos: {
    id: 'combos',
    label: 'Combos',
    icon: Repeat,
    min: 1,
    max: 10,
    default: 1,
    step: 1,
    decimals: 0,
    description: 'Ataques consecutivos máximos por turno',
    color: 'pink'
  }
};

/**
 * Helper para obtener un stat por ID
 * @param {string} statId - El ID del stat
 * @returns {Object} La configuración del stat o null si no existe
 */
export const getStatConfig = (statId) => {
  return STAT_CONFIGS[statId] || null;
};

/**
 * Helper para obtener todos los stats como array
 * @returns {Array} Array con todas las configuraciones de stats
 */
export const getAllStats = () => {
  return Object.values(STAT_CONFIGS);
};

/**
 * Helper para formatear un valor de stat según su configuración
 * @param {string} statId - El ID del stat
 * @param {number} value - El valor a formatear
 * @returns {string} El valor formateado con decimales correctos
 */
export const formatStatValue = (statId, value) => {
  const config = STAT_CONFIGS[statId];
  if (!config) return value;
  
  if (config.decimals > 0) {
    return parseFloat(value).toFixed(config.decimals);
  }
  return value;
};

/**
 * Helper para validar si un valor de stat es válido
 * @param {string} statId - El ID del stat
 * @param {number} value - El valor a validar
 * @returns {boolean} True si el valor es válido
 */
export const isValidStatValue = (statId, value) => {
  const config = STAT_CONFIGS[statId];
  if (!config) return false;
  
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= config.min && numValue <= config.max;
};

export default STAT_CONFIGS;