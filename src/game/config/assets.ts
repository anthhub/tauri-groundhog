// Groundhog SVG images
const GROUNDHOG_IDLE = `data:image/svg+xml;base64,${btoa(`
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Body -->
  <ellipse cx="60" cy="70" rx="45" ry="35" fill="#D4A373"/>
  <ellipse cx="60" cy="80" rx="40" ry="25" fill="#B08968"/>
  
  <!-- Face -->
  <circle cx="60" cy="55" r="35" fill="#D4A373"/>
  
  <!-- Eyes -->
  <circle cx="48" cy="48" r="8" fill="#000000"/>
  <circle cx="72" cy="48" r="8" fill="#000000"/>
  <circle cx="50" cy="46" r="3" fill="#FFFFFF"/>
  <circle cx="74" cy="46" r="3" fill="#FFFFFF"/>
  
  <!-- Nose -->
  <ellipse cx="60" cy="58" rx="10" ry="8" fill="#FF9E9E"/>
  <ellipse cx="60" cy="58" rx="8" ry="6" fill="#FFB6B6"/>
  
  <!-- Whiskers -->
  <path d="M35 58C45 58 50 58 55 58" stroke="#B08968" stroke-width="2"/>
  <path d="M35 62C45 62 50 62 55 62" stroke="#B08968" stroke-width="2"/>
  <path d="M65 58C75 58 80 58 85 58" stroke="#B08968" stroke-width="2"/>
  <path d="M65 62C75 62 80 62 85 62" stroke="#B08968" stroke-width="2"/>
  
  <!-- Cheeks -->
  <circle cx="38" cy="58" r="8" fill="#E6B89C" fill-opacity="0.6"/>
  <circle cx="82" cy="58" r="8" fill="#E6B89C" fill-opacity="0.6"/>
  
  <!-- Mouth -->
  <path d="M55 65C60 68 65 68 68 65" stroke="#000000" stroke-width="2"/>
  
  <!-- Ears -->
  <ellipse cx="35" cy="30" rx="12" ry="15" fill="#D4A373"/>
  <ellipse cx="85" cy="30" rx="12" ry="15" fill="#D4A373"/>
  <ellipse cx="35" cy="30" rx="8" ry="10" fill="#B08968"/>
  <ellipse cx="85" cy="30" rx="8" ry="10" fill="#B08968"/>
</svg>
`)}`;

const GROUNDHOG_HIT = `data:image/svg+xml;base64,${btoa(`
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Body -->
  <ellipse cx="60" cy="70" rx="45" ry="35" fill="#D4A373"/>
  <ellipse cx="60" cy="80" rx="40" ry="25" fill="#B08968"/>
  
  <!-- Face -->
  <circle cx="60" cy="55" r="35" fill="#D4A373"/>
  
  <!-- Eyes (Dizzy spiral) -->
  <path d="M44 44C48 48 52 48 48 44" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
  <path d="M68 44C72 48 76 48 72 44" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Nose -->
  <ellipse cx="60" cy="58" rx="10" ry="8" fill="#FF9E9E"/>
  <ellipse cx="60" cy="58" rx="8" ry="6" fill="#FFB6B6"/>
  
  <!-- Whiskers (drooping) -->
  <path d="M35 60C45 58 50 58 55 60" stroke="#B08968" stroke-width="2"/>
  <path d="M35 64C45 62 50 62 55 64" stroke="#B08968" stroke-width="2"/>
  <path d="M65 60C75 58 80 58 85 60" stroke="#B08968" stroke-width="2"/>
  <path d="M65 64C75 62 80 62 85 64" stroke="#B08968" stroke-width="2"/>
  
  <!-- Cheeks -->
  <circle cx="38" cy="58" r="8" fill="#E6B89C" fill-opacity="0.6"/>
  <circle cx="82" cy="58" r="8" fill="#E6B89C" fill-opacity="0.6"/>
  
  <!-- Mouth (dizzy) -->
  <path d="M50 68C55 65 65 65 70 68" stroke="#000000" stroke-width="2"/>
  
  <!-- Ears (drooping) -->
  <ellipse cx="35" cy="35" rx="12" ry="15" fill="#D4A373" transform="rotate(-15 35 35)"/>
  <ellipse cx="85" cy="35" rx="12" ry="15" fill="#D4A373" transform="rotate(15 85 35)"/>
  <ellipse cx="35" cy="35" rx="8" ry="10" fill="#B08968" transform="rotate(-15 35 35)"/>
  <ellipse cx="85" cy="35" rx="8" ry="10" fill="#B08968" transform="rotate(15 85 35)"/>
  
  <!-- Stars -->
  <path d="M40 25L42 30L37 28L42 26L40 31" stroke="#FFD700" stroke-width="2"/>
  <path d="M80 25L82 30L77 28L82 26L80 31" stroke="#FFD700" stroke-width="2"/>
</svg>
`)}`;

export const GAME_CONFIG = {
  groundhog: {
    baseSpeed: 100,
    baseHealth: 1,
    maxGroundhogs: 5,
    spawnInterval: 2000,
    images: {
      idle: GROUNDHOG_IDLE,
      hit: GROUNDHOG_HIT
    },
    sounds: {
      hit: '/assets/hit.mp3',
      miss: '/assets/miss.mp3',
      spawn: '/assets/spawn.mp3'
    },
    hitAnimationDuration: 300,
  },
  score: {
    base: 100, // 基础分数
    combo: {
      threshold: 3, // 连击阈值
      multipliers: [ // 连击倍数
        { threshold: 3, multiplier: 1.5 },
        { threshold: 5, multiplier: 2 },
        { threshold: 10, multiplier: 3 },
        { threshold: 20, multiplier: 4 },
      ],
      decay: { // 连击衰减
        time: 2000, // 2秒内需要击中下一个，否则连击重置
        warning: 1000 // 1秒后开始显示警告
      }
    },
    timeBonus: { // 时间奖励
      perfect: 1.5, // 快速击中
      good: 1.2, // 正常击中
      threshold: 500 // 快速击中的时间阈值（毫秒）
    }
  }
};
