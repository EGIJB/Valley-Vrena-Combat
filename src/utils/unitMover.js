/**
 * Utilidad para mover unidades entre facciones en Valley'Vrena
 */

/**
 * Mueve una unidad de una facción a otra
 * @param {Object} params - Parámetros del movimiento
 * @param {string} params.unitId - ID de la unidad a mover
 * @param {string} params.fromFaction - Facción de origen ('vrena' | 'ally' | 'enemy')
 * @param {string} params.toFaction - Facción de destino ('vrena' | 'ally' | 'enemy')
 * @param {Object} params.lists - Objeto con las listas actuales { vrena: [], ally: [], enemy: [] }
 * @returns {Object} Resultado { success: boolean, error?: string, updatedLists: Object }
 */
export const moveUnitBetweenFactions = ({ unitId, fromFaction, toFaction, lists }) => {
  // Validaciones básicas
  if (!unitId || !fromFaction || !toFaction) {
    return { success: false, error: 'Parámetros incompletos', updatedLists: lists };
  }
  
  if (fromFaction === toFaction) {
    return { success: false, error: 'La unidad ya está en esa facción', updatedLists: lists };
  }
  
  const validFactions = ['vrena', 'ally', 'enemy'];
  if (!validFactions.includes(fromFaction) || !validFactions.includes(toFaction)) {
    return { success: false, error: 'Facción no válida', updatedLists: lists };
  }
  
  // Buscar la unidad en la lista de origen
  const fromList = lists[fromFaction] || [];
  const unitIndex = fromList.findIndex(u => u.id === unitId);
  
  if (unitIndex === -1) {
    return { success: false, error: 'Unidad no encontrada', updatedLists: lists };
  }
  
  // Crear copias inmutables de las listas
  const updatedLists = { ...lists };
  
  // Extraer la unidad y actualizar su facción
  const unitToMove = { ...fromList[unitIndex], faction: toFaction };
  
  // Remover de origen y añadir a destino
  updatedLists[fromFaction] = fromList.filter(u => u.id !== unitId);
  updatedLists[toFaction] = [...(lists[toFaction] || []), unitToMove];
  
  return { 
    success: true, 
    message: `✅ ${unitToMove.name} movido a ${getFactionLabel(toFaction)}`,
    updatedLists 
  };
};

/**
 * Helper para obtener label legible de facción
 */
const getFactionLabel = (factionId) => {
  const labels = { vrena: 'Vrena', ally: 'Aliado', enemy: 'Enemigo' };
  return labels[factionId] || factionId;
};

export default moveUnitBetweenFactions;