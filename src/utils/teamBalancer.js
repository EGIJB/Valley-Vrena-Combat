/**
 * Sistema de Balanceo de Equipos para Valley'Vrena
 * Permite equilibrar equipos antes del combate
 */

/**
 * Balancea equipos por cantidad numérica de unidades
 * @param {Array} team1 - Equipo 1
 * @param {Array} team2 - Equipo 2
 * @returns {Object} { p1: Array, p2: Array, removed: Array }
 */
export const balanceByCount = (team1, team2) => {
  const t1 = [...team1];
  const t2 = [...team2];
  const removed = [];
  
  const diff = Math.abs(t1.length - t2.length);
  if (diff === 0) return { p1: t1, p2: t2, removed };
  
  // Equipo con más unidades
  const larger = t1.length > t2.length ? t1 : t2;
  const smaller = t1.length > t2.length ? t2 : t1;
  
  // Remover unidades aleatoriamente hasta igualar
  for (let i = 0; i < diff; i++) {
    const idx = Math.floor(Math.random() * larger.length);
    removed.push(larger.splice(idx, 1)[0]);
  }
  
  return t1.length > t2.length 
    ? { p1: larger, p2: smaller, removed }
    : { p1: smaller, p2: larger, removed };
};

/**
 * Calcula el "poder total" de un equipo basado en special + attack
 * @param {Array} team - Equipo a evaluar
 * @returns {number} Score de poder
 */
const calculateTeamPower = (team) => {
  return team.reduce((total, u) => {
    const special = u.special ?? 10;
    const attack = u.attack ?? 10;
    // Fórmula: special tiene 2x peso que attack
    return total + (special * 2) + attack;
  }, 0);
};

/**
 * Balancea equipos por poder (atributo special + attack)
 * @param {Array} team1 - Equipo 1
 * @param {Array} team2 - Equipo 2
 * @param {number} tolerance - Tolerancia de diferencia permitida (default: 15%)
 * @returns {Object} { p1: Array, p2: Array, swapped: Array }
 */
export const balanceByPower = (team1, team2, tolerance = 0.15) => {
  let t1 = [...team1];
  let t2 = [...team2];
  const swapped = [];
  
  const power1 = calculateTeamPower(t1);
  const power2 = calculateTeamPower(t2);
  const totalPower = power1 + power2;
  // const targetPower = totalPower / 2; // Eliminada: no se usa
  
  // Si ya están balanceados dentro de la tolerancia, retornar
  const currentDiff = Math.abs(power1 - power2) / totalPower;
  if (currentDiff <= tolerance) {
    return { p1: t1, p2: t2, swapped };
  }
  
  // Intentar intercambiar unidades para balancear
  let iterations = 0;
  const maxIterations = 50;
  
  while (iterations < maxIterations) {
    const p1 = calculateTeamPower(t1);
    const p2 = calculateTeamPower(t2);
    const diff = Math.abs(p1 - p2) / (p1 + p2);
    
    if (diff <= tolerance) break;
    
    // Encontrar mejor intercambio
    let bestSwap = null;
    let bestDiff = diff;
    
    for (let u1 of t1) {
      for (let u2 of t2) {
        // Simular intercambio
        const newT1 = t1.filter(u => u.id !== u1.id).concat(u2);
        const newT2 = t2.filter(u => u.id !== u2.id).concat(u1);
        
        const newP1 = calculateTeamPower(newT1);
        const newP2 = calculateTeamPower(newT2);
        const newDiff = Math.abs(newP1 - newP2) / (newP1 + newP2);
        
        if (newDiff < bestDiff) {
          bestDiff = newDiff;
          bestSwap = { u1, u2 };
        }
      }
    }
    
    if (!bestSwap) break; // No hay mejora posible
    
    // Aplicar mejor intercambio
    t1 = t1.filter(u => u.id !== bestSwap.u1.id).concat(bestSwap.u2);
    t2 = t2.filter(u => u.id !== bestSwap.u2.id).concat(bestSwap.u1);
    swapped.push({ from: bestSwap.u1, to: bestSwap.u2 });
    
    iterations++;
  }
  
  return { p1: t1, p2: t2, swapped };
};

/**
 * Permite o valida la multiplicidad de unidades en equipos
 * @param {Array} team - Equipo a validar
 * @param {boolean} allowDuplicates - Si se permiten duplicados
 * @returns {Object} { valid: boolean, duplicates: Array }
 */
export const validateMultiplicity = (team, allowDuplicates = true) => {
  if (allowDuplicates) {
    return { valid: true, duplicates: [] };
  }
  
  // Si no se permiten duplicados, identificar repetidos
  const seen = new Set();
  const duplicates = [];
  
  team.forEach(u => {
    if (seen.has(u.name)) {
      duplicates.push(u);
    } else {
      seen.add(u.name);
    }
  });
  
  return {
    valid: duplicates.length === 0,
    duplicates
  };
};

/**
 * Función principal de balanceo que combina todas las opciones
 * @param {Array} team1 - Equipo 1 seleccionado
 * @param {Array} team2 - Equipo 2 seleccionado
 * @param {Object} options - { byCount: bool, byPower: bool, allowDuplicates: bool }
 * @returns {Object} { p1: Array, p2: Array, log: Array }
 */
export const balanceTeams = (team1, team2, options = {}) => {
  const {
    byCount = false,
    byPower = false,
    allowDuplicates = true
  } = options;
  
  const log = [];
  let p1 = [...team1];
  let p2 = [...team2];
  
  // Validar multiplicidad
  if (!allowDuplicates) {
    const v1 = validateMultiplicity(p1, false);
    const v2 = validateMultiplicity(p2, false);
    
    if (!v1.valid) {
      log.push(`⚠️ Equipo 1: ${v1.duplicates.length} unidades repetidas`);
      p1 = p1.filter((u, i, arr) => 
        arr.findIndex(x => x.name === u.name) === i
      );
    }
    if (!v2.valid) {
      log.push(`⚠️ Equipo 2: ${v2.duplicates.length} unidades repetidas`);
      p2 = p2.filter((u, i, arr) => 
        arr.findIndex(x => x.name === u.name) === i
      );
    }
  }
  
  // Balance por cantidad
  if (byCount) {
    const balanced = balanceByCount(p1, p2);
    p1 = balanced.p1;
    p2 = balanced.p2;
    if (balanced.removed.length > 0) {
      log.push(`⚖️ Balance por cantidad: ${balanced.removed.length} unidad(es) removida(s)`);
    }
  }
  
  // Balance por poder
  if (byPower) {
    const balanced = balanceByPower(p1, p2);
    p1 = balanced.p1;
    p2 = balanced.p2;
    if (balanced.swapped.length > 0) {
      log.push(`⚖️ Balance por poder: ${balanced.swapped.length} intercambio(s) realizado(s)`);
    }
  }
  
  return { p1, p2, log };
};

export default {
  balanceByCount,
  balanceByPower,
  validateMultiplicity,
  balanceTeams,
  calculateTeamPower
};