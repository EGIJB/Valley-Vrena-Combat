import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'

// import { ATTACK_TYPES, getAllAttackTypes } from './config/attackTypes';
// console.log('✅ Attack Types cargados:', getAllAttackTypes().length);
// console.log('✅ Melee config:', ATTACK_TYPES.melee);

// import { STAT_CONFIGS, getAllStats, formatStatValue } from './config/statConfigs';

// console.log('✅ Stat Configs cargados:', getAllStats().length);
// console.log('✅ Velocidad config:', STAT_CONFIGS.speed);
// console.log('✅ Valor formateado (speed 75.5):', formatStatValue('speed', 75.5));
// console.log('✅ Valor formateado (agility 50):', formatStatValue('agility', 50));

// import { FACTIONS, getAllFactions, getFactionEmoji, getFactionFileName } from './config/factions';

// console.log('✅ Factions cargadas:', getAllFactions().length);
// console.log('✅ Vrena config:', FACTIONS.vrena);
// console.log('✅ Emoji Aliado:', getFactionEmoji('ally'));
// console.log('✅ Archivo Enemigo:', getFactionFileName('enemy'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
