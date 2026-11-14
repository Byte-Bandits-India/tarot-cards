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

// 22 Major Arcana Cards (0 to 21) using the user's back.png for every card
export const MAJOR_ARCANA_CARDS: TarotCardData[] = [
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
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 4,
    name: 'The Emperor',
    numeral: 'IV',
    icon: '👑',
    subtitle: 'Authority & Structure',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 5,
    name: 'The Hierophant',
    numeral: 'V',
    icon: '🗝️',
    subtitle: 'Wisdom & Tradition',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    icon: '💞',
    subtitle: 'Harmony & Choice',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 7,
    name: 'The Chariot',
    numeral: 'VII',
    icon: '⚔️',
    subtitle: 'Determination & Victory',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 8,
    name: 'Strength',
    numeral: 'VIII',
    icon: '🦁',
    subtitle: 'Courage & Patience',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 9,
    name: 'The Hermit',
    numeral: 'IX',
    icon: '🏮',
    subtitle: 'Soul Searching & Truth',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    numeral: 'X',
    icon: '🎡',
    subtitle: 'Destiny & Cycles',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 11,
    name: 'Justice',
    numeral: 'XI',
    icon: '⚖️',
    subtitle: 'Truth & Fairness',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 12,
    name: 'The Hanged Man',
    numeral: 'XII',
    icon: '⏳',
    subtitle: 'Surrender & New Perspective',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 13,
    name: 'Death',
    numeral: 'XIII',
    icon: '🦋',
    subtitle: 'Transformation & Rebirth',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 14,
    name: 'Temperance',
    numeral: 'XIV',
    icon: '🌊',
    subtitle: 'Balance & Moderation',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 15,
    name: 'The Devil',
    numeral: 'XV',
    icon: '🔥',
    subtitle: 'Shadow & Inner Freedom',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 16,
    name: 'The Tower',
    numeral: 'XVI',
    icon: '⚡',
    subtitle: 'Awakening & Sudden Change',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 17,
    name: 'The Star',
    numeral: 'XVII',
    icon: '⭐',
    subtitle: 'Hope & Divine Inspiration',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 18,
    name: 'The Moon',
    numeral: 'XVIII',
    icon: '🌕',
    subtitle: 'Intuition & Subconscious',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 19,
    name: 'The Sun',
    numeral: 'XIX',
    icon: '☀️',
    subtitle: 'Vitality, Joy & Success',
    frontImage: frontImagePool[1],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 20,
    name: 'Judgement',
    numeral: 'XX',
    icon: '🎺',
    subtitle: 'Awakening & Reckoning',
    frontImage: frontImagePool[2],
    backImage: DEFAULT_CARD_BACK,
  },
  {
    id: 21,
    name: 'The World',
    numeral: 'XXI',
    icon: '🌍',
    subtitle: 'Completion & Wholeness',
    frontImage: frontImagePool[0],
    backImage: DEFAULT_CARD_BACK,
  },
]

// 56 Minor Arcana Cards (Wands, Cups, Swords, Pentacles) to complete the 78 Tarot Deck
const SUITS = [
  { name: 'Wands', icon: '🪄', subtitle: 'Action & Passion' },
  { name: 'Cups', icon: '🏆', subtitle: 'Love & Emotion' },
  { name: 'Swords', icon: '⚔️', subtitle: 'Truth & Clarity' },
  { name: 'Pentacles', icon: '🪙', subtitle: 'Prosperity & Grounding' },
]

const RANKS = [
  { name: 'Ace', numeral: 'I' },
  { name: 'Two', numeral: 'II' },
  { name: 'Three', numeral: 'III' },
  { name: 'Four', numeral: 'IV' },
  { name: 'Five', numeral: 'V' },
  { name: 'Six', numeral: 'VI' },
  { name: 'Seven', numeral: 'VII' },
  { name: 'Eight', numeral: 'VIII' },
  { name: 'Nine', numeral: 'IX' },
  { name: 'Ten', numeral: 'X' },
  { name: 'Page', numeral: 'P' },
  { name: 'Knight', numeral: 'Kn' },
  { name: 'Queen', numeral: 'Q' },
  { name: 'King', numeral: 'K' },
]

const MINOR_ARCANA_CARDS: TarotCardData[] = []
let minorId = 22
SUITS.forEach((suit, suitIdx) => {
  RANKS.forEach((rank, rankIdx) => {
    const imgIndex = (suitIdx * 14 + rankIdx) % frontImagePool.length
    MINOR_ARCANA_CARDS.push({
      id: minorId++,
      name: `${rank.name} of ${suit.name}`,
      numeral: rank.numeral,
      icon: suit.icon,
      subtitle: suit.subtitle,
      frontImage: frontImagePool[imgIndex],
      backImage: DEFAULT_CARD_BACK,
    })
  })
})

// Complete 78 Tarot Cards Deck
export const FULL_TAROT_DECK: TarotCardData[] = [...MAJOR_ARCANA_CARDS, ...MINOR_ARCANA_CARDS]
export const INITIAL_CARDS: TarotCardData[] = FULL_TAROT_DECK
