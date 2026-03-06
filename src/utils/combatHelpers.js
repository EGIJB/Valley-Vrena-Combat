// Helpers para lógica de combate
export function calculateDamage(attacker) {
  const isCrit = Math.random() * 100 < (attacker.critChance || 0);
  const damage = isCrit ? Math.floor((attacker.attack || 0) * (attacker.critMult || 1)) : (attacker.attack || 0);
  return { isCrit, damage };
}

export function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val));
}
