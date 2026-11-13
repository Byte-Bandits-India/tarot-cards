  // Helper to create clean, offline SVG dummy images for front and back of cards
function createFrontSvg(name: string, numeral: string, icon: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
    <rect width="100%" height="100%" fill="#ffffff" rx="16" />
    <rect x="12" y="12" width="276" height="396" fill="#ffffff" stroke="#171717" stroke-width="2" rx="10" />
    <rect x="18" y="18" width="264" height="384" fill="none" stroke="#737373" stroke-width="1" stroke-dasharray="4 2" rx="8" />
    
    <!-- Top Roman Numeral -->
    <text x="150" y="48" font-family="serif" font-size="20" font-weight="bold" fill="#171717" text-anchor="middle" letter-spacing="3">${numeral}</text>
    
    <!-- Decorative Inner Artwork Frame -->
    <rect x="36" y="68" width="228" height="230" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" rx="8" />
    
    <!-- Central Icon/Symbol -->
    <text x="150" y="195" font-size="70" text-anchor="middle" dominant-baseline="middle">${icon}</text>
    
    <!-- Decorative Divider -->
    <path d="M 80 320 Q 150 310 220 320" stroke="#64748b" stroke-width="1" fill="none" />
    <circle cx="150" cy="316" r="3" fill="#1e293b" />
    
    <!-- Card Title -->
    <text x="150" y="348" font-family="serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="1">${name.toUpperCase()}</text>
    <text x="150" y="372" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle">${subtitle}</text>
    <text x="150" y="394" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">[ DUMMY FRONT IMAGE ]</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Ornate card back with royal blue geometric pattern matching the classic card back reference
function createBackSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
    <defs>
      <pattern id="cardLattice" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 0 8 L 8 0 L 16 8 L 8 16 Z" fill="none" stroke="#2563eb" stroke-width="1" />
        <path d="M 8 8 L 12 4 L 16 8 L 12 12 Z" fill="none" stroke="#3b82f6" stroke-width="0.5" />
        <circle cx="8" cy="8" r="1.5" fill="#1d4ed8" />
      </pattern>
    </defs>
    
    <!-- Card Base -->
    <rect width="100%" height="100%" fill="#ffffff" rx="16" />
    
    <!-- Outer Margin Border -->
    <rect x="14" y="14" width="272" height="392" fill="#ffffff" stroke="#1d4ed8" stroke-width="2.5" rx="10" />
    
    <!-- Ornate Border Frame -->
    <rect x="24" y="24" width="252" height="372" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="6" />
    <rect x="30" y="30" width="240" height="360" fill="url(#cardLattice)" stroke="#1e40af" stroke-width="2" rx="4" />
    
    <!-- Central Medallion -->
    <rect x="85" y="160" width="130" height="100" fill="#ffffff" stroke="#1d4ed8" stroke-width="2" rx="8" />
    <rect x="91" y="166" width="118" height="88" fill="#eff6ff" stroke="#3b82f6" stroke-width="1" rx="6" />
    
    <!-- Center Emblem -->
    <circle cx="150" cy="202" r="22" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.5" />
    <text x="150" y="208" font-size="20" fill="#1d4ed8" text-anchor="middle" dominant-baseline="middle">✦</text>
    <text x="150" y="238" font-family="serif" font-size="11" font-weight="bold" fill="#1e40af" text-anchor="middle" letter-spacing="3">TAROT</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const DEFAULT_CARD_BACK = createBackSvg()

export interface TarotCardData {
  id: number
  name: string
  numeral: string
  icon: string
  subtitle: string
  frontImage: string
  backImage: string
}

// 10 Cards (0 to 9) corresponding to the cards dealt in the spread
export const INITIAL_CARDS: TarotCardData[] = [
  {
    id: 0,
    name: 'The Fool',
    numeral: '0',
    icon: '🌸',
    subtitle: 'Beginnings & Freedom',
    frontImage: createFrontSvg('The Fool', '0', '🌸', 'Beginnings & Freedom'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 1,
    name: 'The Magician',
    numeral: 'I',
    icon: '🪄',
    subtitle: 'Willpower & Creation',
    frontImage: createFrontSvg('The Magician', 'I', '🪄', 'Willpower & Creation'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 2,
    name: 'The High Priestess',
    numeral: 'II',
    icon: '🌙',
    subtitle: 'Intuition & Mystery',
    frontImage: createFrontSvg('The High Priestess', 'II', '🌙', 'Intuition & Mystery'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 3,
    name: 'The Empress',
    numeral: 'III',
    icon: '🌿',
    subtitle: 'Abundance & Nature',
    frontImage: createFrontSvg('The Empress', 'III', '🌿', 'Abundance & Nature'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 4,
    name: 'The Emperor',
    numeral: 'IV',
    icon: '👑',
    subtitle: 'Authority & Structure',
    frontImage: createFrontSvg('The Emperor', 'IV', '👑', 'Authority & Structure'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 5,
    name: 'The Hierophant',
    numeral: 'V',
    icon: '🗝️',
    subtitle: 'Wisdom & Tradition',
    frontImage: createFrontSvg('The Hierophant', 'V', '🗝️', 'Wisdom & Tradition'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    icon: '💞',
    subtitle: 'Harmony & Choice',
    frontImage: createFrontSvg('The Lovers', 'VI', '💞', 'Harmony & Choice'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 7,
    name: 'The Chariot',
    numeral: 'VII',
    icon: '⚔️',
    subtitle: 'Determination & Victory',
    frontImage: createFrontSvg('The Chariot', 'VII', '⚔️', 'Determination & Victory'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 8,
    name: 'Strength',
    numeral: 'VIII',
    icon: '🦁',
    subtitle: 'Courage & Patience',
    frontImage: createFrontSvg('Strength', 'VIII', '🦁', 'Courage & Patience'),
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 9,
    name: 'The Hermit',
    numeral: 'IX',
    icon: '🏮',
    subtitle: 'Soul Searching & Truth',
    frontImage: createFrontSvg('The Hermit', 'IX', '🏮', 'Soul Searching & Truth'),
    backImage: DEFAULT_CARD_BACK,
  },
]
