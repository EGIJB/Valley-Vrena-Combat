import { Hand, BowArrow, Target } from 'lucide-react';

/**
 * Configuración de Tipos de Ataque para Valley'Vrena
 * Define las propiedades visuales y de comportamiento para cada tipo
 */
export const ATTACK_TYPES = {
  melee: {
    id: 'melee',
    label: 'Cuerpo a Cuerpo',
    icon: Hand,
    color: 'red',
    borderColor: 'border-red-500/60',
    textColor: 'text-red-300',
    bgColor: 'bg-red-500/10',
    ringColor: 'ring-red-400/50',
    description: 'Ataque cercano: mordiscos, garras, embestidas'
  },
  range: {
    id: 'range',
    label: 'Alcance',
    icon: BowArrow,
    color: 'amber',
    borderColor: 'border-amber-500/60',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    ringColor: 'ring-amber-400/50',
    description: 'Ataque medio: látigos, escupitos, ondas de impacto'
  },
  distance: {
    id: 'distance',
    label: 'Distancia',
    icon: Target,
    color: 'cyan',
    borderColor: 'border-cyan-500/60',
    textColor: 'text-cyan-300',
    bgColor: 'bg-cyan-500/10',
    ringColor: 'ring-cyan-400/50',
    description: 'Proyectiles: espinas, semillas, veneno a distancia'
  }
};

/**
 * Helper para obtener un tipo de ataque por ID
 * @param {string} typeId - El ID del tipo de ataque
 * @returns {Object} La configuración del tipo de ataque o melee por defecto
 */
export const getAttackType = (typeId) => {
  return ATTACK_TYPES[typeId] || ATTACK_TYPES.melee;
};

/**
 * Helper para obtener todos los tipos de ataque como array
 * @returns {Array} Array con todas las configuraciones de tipos de ataque
 */
export const getAllAttackTypes = () => {
  return Object.values(ATTACK_TYPES);
};

export default ATTACK_TYPES;