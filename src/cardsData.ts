import cardBackImg from './assets/cards/back.png'
import card1Img from './assets/cards/card1.png'
import card2Img from './assets/cards/card2.png'
import card3Img from './assets/cards/card3.png'

// Global back image for all cards from src/assets/cards/back.png
export const DEFAULT_CARD_BACK = cardBackImg

export interface TarotCardData {
  id: number
  name: string
  numeral: string
  icon: string
  subtitle: string
  frontImage: string
  backImage: string
}

// Front images map (cycles through card1, card2, card3 images from src/assets/cards/)
const frontImagePool = [
  card1Img, // 0: The Fool
  card2Img, // 1: The Magician
  card3Img, // 2: The High Priestess
  card1Img, // 3: The Empress
  card2Img, // 4: The Emperor
  card3Img, // 5: The Hierophant
  card1Img, // 6: The Lovers
  card2Img, // 7: The Chariot
  card3Img, // 8: Strength
  card1Img, // 9: The Hermit
  card2Img, // 10: Wheel of Fortune
  card3Img, // 11: Justice
]

// 12 Cards (0 to 11) using the user's back.png for every card
export const INITIAL_CARDS: TarotCardData[] = [
  {
    id: 0,
    name: 'The Fool',
    numeral: '0',
    icon: '🌸',
    subtitle: 'Beginnings & Freedom',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 1,
    name: 'The Magician',
    numeral: 'I',
    icon: '🪄',
    subtitle: 'Willpower & Creation',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 2,
    name: 'The High Priestess',
    numeral: 'II',
    icon: '🌙',
    subtitle: 'Intuition & Mystery',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 3,
    name: 'The Empress',
    numeral: 'III',
    icon: '🌿',
    subtitle: 'Abundance & Nature',
    frontImage: frontImagePool[3],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 4,
    name: 'The Emperor',
    numeral: 'IV',
    icon: '👑',
    subtitle: 'Authority & Structure',
    frontImage: frontImagePool[4],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 5,
    name: 'The Hierophant',
    numeral: 'V',
    icon: '🗝️',
    subtitle: 'Wisdom & Tradition',
    frontImage: frontImagePool[5],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    icon: '💞',
    subtitle: 'Harmony & Choice',
    frontImage: frontImagePool[6],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 7,
    name: 'The Chariot',
    numeral: 'VII',
    icon: '⚔️',
    subtitle: 'Determination & Victory',
    frontImage: frontImagePool[7],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 8,
    name: 'Strength',
    numeral: 'VIII',
    icon: '🦁',
    subtitle: 'Courage & Patience',
    frontImage: frontImagePool[8],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 9,
    name: 'The Hermit',
    numeral: 'IX',
    icon: '🏮',
    subtitle: 'Soul Searching & Truth',
    frontImage: frontImagePool[9],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    numeral: 'X',
    icon: '🎡',
    subtitle: 'Destiny & Cycles',
    frontImage: frontImagePool[10],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 11,
    name: 'Justice',
    numeral: 'XI',
    icon: '⚖️',
    subtitle: 'Truth & Fairness',
    frontImage: frontImagePool[11],
    backImage: DEFAULT_CARD_BACK,
  },
]
