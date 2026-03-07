/**
 * Helpers de Combate para Valley'Vrena
 * Implementa lógica de atributos en batalla
 */

/**
 * Calcula si un ataque es esquivado basado en Agility del defensor
 * @param {Object} defender - Unidad defensora
 * @returns {boolean} True si el ataque fue esquivado
 */
export const calculateEvasion = (defender) => {
  const agility = defender.agility ?? 10;
  
  if (agility >= 80) return Math.random() < 0.30;
  if (agility >= 50) return Math.random() < 0.15;
  if (agility >= 30) return Math.random() < 0.05;
  
  return false;
};

/**
 * Calcula cuántos ataques adicionales puede hacer por Combos
 * @param {Object} attacker - Unidad atacante
 * @returns {number} Número de ataques extra (0, 1, o 2)
 */
export const calculateComboAttacks = (attacker) => {
  const combos = attacker.combos ?? 1;
  
  if (combos >= 4) {
    const roll = Math.random();
    if (roll < 0.50) return 2;
    if (roll < 0.80) return 1;
    return 0;
  }
  
  if (combos >= 2) {
    return Math.random() < 0.30 ? 1 : 0;
  }
  
  return 0;
};

/**
 * Calcula el daño final de un ataque (con crítico y reducción por agility)
 * @param {Object} attacker - Unidad atacante
 * @param {Object} [defender] - Unidad defensora (opcional, para reducción por agility)
 * @returns {Object} { isCrit: boolean, damage: number, extraAttacks: number }
 */
export const calculateDamage = (attacker, defender = null) => {
  // Crítico
  const isCrit = Math.random() * 100 < (attacker.critChance ?? 10);
  let damage = isCrit 
    ? Math.floor((attacker.attack ?? 10) * (attacker.critMult ?? 1.5))
    : (attacker.attack ?? 10);
  
  // Reducción por agility del defensor (solo si se proporciona)
  if (defender) {
    const defenderAgility = defender.agility ?? 10;
    const damageReduction = Math.min(defenderAgility / 10, 10);
    damage = Math.floor(damage * (1 - damageReduction / 100));
  }
  
  // Ataques extra por combos
  const extraAttacks = calculateComboAttacks(attacker);
  
  return { isCrit, damage: Math.max(1, damage), extraAttacks };
};

/**
 * Determina si una unidad puede actuar
 * @param {Object} unit - Unidad a verificar
 * @param {boolean} useCooldown - Si el sistema de cooldown está activo
 * @returns {boolean} True si puede actuar
 */
export const canAct = (unit, useCooldown = true) => {
  if (unit.currentHp <= 0) return false;
  if (useCooldown && (unit.currentCooldown ?? 0) > 0) return false;
  return true;
};

/**
 * Duplica unidades para alcanzar un mínimo, con variación opcional
 * @param {Array} units - Unidades originales seleccionadas
 * @param {number} minUnits - Mínimo de unidades deseado por equipo
 * @param {number} variance - Porcentaje de variación en stats (0-100)
 * @returns {Array} Unidades originales + duplicados con IDs únicos
 */
export const duplicateUnitsForCombat = (units, minUnits = 4, variance = 10) => {
  if (units.length >= minUnits) return units;
  
  const result = [...units];
  const needed = minUnits - units.length;
  
  for (let i = 0; i < needed; i++) {
    const base = units[Math.floor(Math.random() * units.length)];
    
    const getVariedValue = (value, maxVar) => {
      if (!maxVar || maxVar === 0) return value;
      const variation = (Math.random() * 2 - 1) * (maxVar / 100);
      return Math.max(1, Math.round(value * (1 + variation)));
    };
    
    const duplicate = {
      ...base,
      id: `${base.id}_dup_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `${base.name} (x2)`,
      hp: getVariedValue(base.maxHp, variance),
      maxHp: getVariedValue(base.maxHp, variance),
      currentHp: getVariedValue(base.maxHp, variance),
      attack: getVariedValue(base.attack, variance),
      currentCooldown: 0
    };
    
    result.push(duplicate);
  }
  
  return result;
};

// ✅ EXPORT DEFAULT INCLUYE TODAS LAS FUNCIONES
export default {
  calculateEvasion,
  calculateComboAttacks,
  calculateDamage,
  canAct,
  duplicateUnitsForCombat
};