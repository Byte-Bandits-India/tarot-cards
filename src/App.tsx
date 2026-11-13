import { useState, useRef, useEffect } from 'react'
import { INITIAL_CARDS, type TarotCardData } from './cardsData'

export default function App() {
  // Tracks which cards (0..11) are dealt onto the table
  const [dealtCards, setDealtCards] = useState<boolean[]>(() => new Array(INITIAL_CARDS.length).fill(false))
  // Tracks the IDs of selected cards (strictly up to 3 cards)
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  // Tracks which of the selected cards have been flipped / revealed
  const [revealedCardIds, setRevealedCardIds] = useState<number[]>([])
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const timeoutsRef = useRef<number[]>([])

  const clearScheduledAnimations = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => {
    return () => clearScheduledAnimations()
  }, [])

  const anyDealt = dealtCards.some(Boolean)
  const isThreeSelected = selectedCardIds.length === 3

  // Start (Deal): Deals cards 0 to 11 one by one every 130ms
  const handleStart = () => {
    if (isBusy) return
    clearScheduledAnimations()
    setIsBusy(true)
    setSelectedCardIds([])
    setRevealedCardIds([])

    INITIAL_CARDS.forEach((_, i) => {
      const timeoutId = window.setTimeout(() => {
        setDealtCards((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
        if (i === INITIAL_CARDS.length - 1) {
          setIsBusy(false)
        }
      }, i * 130)
      timeoutsRef.current.push(timeoutId)
    })
  }

  // Make a Deck (Stack): Gathers cards back into the deck stack with staggered delay
  const handleStack = () => {
    if (isBusy) return
    clearScheduledAnimations()
    setIsBusy(true)
    setSelectedCardIds([])
    setRevealedCardIds([])

    // Stack in reverse order (card 11 back first up to card 0)
    INITIAL_CARDS.forEach((_, i) => {
      const targetIndex = INITIAL_CARDS.length - 1 - i
      const timeoutId = window.setTimeout(() => {
        setDealtCards((prev) => {
          const next = [...prev]
          next[targetIndex] = false
          return next
        })
        if (i === INITIAL_CARDS.length - 1) {
          setIsBusy(false)
        }
      }, i * 130)
      timeoutsRef.current.push(timeoutId)
    })
  }

  // Card click handler:
  // Step 1: If deck is stacked -> clicking deals the cards out onto the table
  // Step 2: During selection (0 to 2 cards selected) -> clicking selects/unselects cards (stays face down!)
  // Step 3: When 3 cards are selected -> clicking any of the 3 chosen cards flips it over in 3D
  const handleCardClick = (id: number) => {
    if (isBusy) return

    // 1. Deck is stacked: click triggers dealing
    if (!anyDealt) {
      handleStart()
      return
    }

    const isSelected = selectedCardIds.includes(id)

    // 2. Selection Phase (Less than 3 cards selected)
    if (!isThreeSelected) {
      if (isSelected) {
        // Deselect if already picked
        setSelectedCardIds((prev) => prev.filter((cardId) => cardId !== id))
      } else {
        // Select card (strictly stays face-down, no premature turn)
        setSelectedCardIds((prev) => [...prev, id])
      }
      return
    }

    // 3. Reveal Phase (All 3 cards have been selected into the fan)
    // Only the 3 selected cards can be clicked and flipped in 3D
    if (isSelected) {
      setRevealedCardIds((prev) =>
        prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
      )
    }
  }

  // Map selected IDs to card objects
  const selectedCards: TarotCardData[] = selectedCardIds
    .map((id) => INITIAL_CARDS.find((c) => c.id === id))
    .filter((c): c is TarotCardData => Boolean(c))

  return (
    <div className="h-screen max-h-screen w-full bg-white text-neutral-900 flex flex-col justify-between items-center p-2 sm:p-3 select-none overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-[1440px] text-center px-2 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-neutral-900">
          Tarot Cards Spread
        </h1>
      </header>

      {/* Main Viewport-Fitted Card Table Area with Full-Width Spread */}
      <div className="w-full flex-1 flex items-center justify-center min-h-0 px-2 sm:px-6 md:px-10 py-1">
        <div
          className="relative w-full aspect-[16/8.2] max-h-[calc(100dvh-125px)] overflow-visible select-none"
          style={{
            maxWidth: 'calc((100dvh - 125px) * (16 / 8.2))',
          }}
        >
          {/* Deck Slot Indicator (matches stack position: left: 84.1%, top: 3.5%) */}
          <div
            onClick={anyDealt && !isBusy ? handleStack : undefined}
            className={`absolute rounded-lg sm:rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-300 text-xs font-sans transition-all ${
              isThreeSelected ? 'opacity-20 blur-[1px]' : ''
            } ${
              anyDealt && !isBusy ? 'hover:border-neutral-400 hover:text-neutral-500 cursor-pointer' : 'pointer-events-none'
            }`}
            style={{
              left: '84.1%',
              top: '3.5%',
              width: '14.8%',
              height: '45.5%',
            }}
            title={anyDealt ? 'Click to make a deck' : undefined}
          >
            <span className="text-base sm:text-2xl opacity-40">🂠</span>
            <span className="mt-0.5 font-medium text-[9px] sm:text-[11px] leading-tight text-center px-1">
              {anyDealt ? 'Make Deck' : 'Deck Stack'}
            </span>
          </div>

          {/* Cards List */}
          <ul className="relative w-full h-full list-none p-0 m-0 card-perspective">
            {INITIAL_CARDS.map((card, index) => {
              const isDealt = dealtCards[index]
              const isSelected = selectedCardIds.includes(card.id)
              const isFlipped = revealedCardIds.includes(card.id)
              const isDeckStacked = !anyDealt
              const selectionOrder = selectedCardIds.indexOf(card.id)

              // Stack offset when sitting in deck
              const stackZIndex = 25 - index
              const stackOffset = !isDealt
                ? {
                    transform: `translateY(${-index * 0.5}px) translateX(${index * 0.2}px)`,
                    zIndex: stackZIndex,
                  }
                : undefined

              // Determine visual presentation state
              let stateClass = ''
              if (isDealt) {
                if (isThreeSelected) {
                  if (isSelected) {
                    const fanIdx = selectedCardIds.indexOf(card.id)
                    stateClass = `fan-card-${fanIdx}`
                  } else {
                    stateClass = 'card-blurred'
                  }
                } else if (isSelected) {
                  stateClass = 'card-selected-staging'
                }
              }

              return (
                <li
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`card card-item select-none ${
                    isDealt ? `dealt-${index}` : ''
                  } ${stateClass} ${
                    isDeckStacked
                      ? 'cursor-pointer hover:-translate-y-1'
                      : isThreeSelected && !isSelected
                      ? 'pointer-events-none'
                      : 'cursor-pointer'
                  }`}
                  style={stackOffset}
                  title={
                    isDeckStacked
                      ? 'Click deck to deal cards'
                      : !isThreeSelected
                      ? isSelected
                        ? `Card #${selectionOrder + 1} (Selected - tap to unselect)`
                        : `Tap to select this card (${selectedCardIds.length}/3)`
                      : isSelected
                      ? isFlipped
                        ? `${card.name} (Revealed)`
                        : `Card #${selectionOrder + 1} (Tap to flip!)`
                      : undefined
                  }
                >
                  {/* Selection Badge for Selected Cards */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-50 px-1.5 py-0.5 sm:px-2 rounded-full bg-neutral-900 text-white border sm:border-2 border-white shadow-md flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bold tracking-tight">
                      <span>#{selectionOrder + 1}</span>
                      {isThreeSelected && !isFlipped && (
                        <span className="text-[7px] sm:text-[8px] font-normal text-amber-300 uppercase tracking-widest hidden xs:inline">Flip</span>
                      )}
                    </div>
                  )}

                  {/* 3D Inner Card Flipper */}
                  <div
                    className={`card-flipper ${isFlipped ? 'is-flipped' : ''} ${
                      isSelected && !isThreeSelected ? 'ring-1 sm:ring-2 ring-neutral-900 ring-offset-1 sm:ring-offset-2' : ''
                    }`}
                  >
                    {/* BACK FACE (Visible in deck, during selection, and before flipping) */}
                    <div className="card-face face-back">
                      <img
                        src={card.backImage}
                        alt={`${card.name} Back`}
                        className="w-full h-full object-fill"
                        draggable={false}
                      />
                    </div>

                    {/* FRONT FACE (Revealed only when user clicks to flip) */}
                    <div className="card-face face-front">
                      <img
                        src={card.frontImage}
                        alt={`${card.name} Front`}
                        className="w-full h-full object-fill"
                        draggable={false}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Centered Single Button "Make a Deck / Deal Cards" */}
      <footer className="w-full max-w-[1240px] mx-auto px-2 sm:px-4 flex flex-col items-center justify-center gap-1.5 text-xs flex-shrink-0 py-1">
        {/* Single Button: Perfectly Centered */}
        <button
          type="button"
          onClick={anyDealt ? handleStack : handleStart}
          disabled={isBusy}
          className="px-6 py-2 sm:px-8 sm:py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-900 text-xs sm:text-sm font-semibold tracking-wide shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-40"
        >
          {anyDealt ? 'Make a Deck' : 'Deal Cards'}
        </button>

        {/* Selected 3 Cards Chips (Centered underneath when cards are selected) */}
        {selectedCards.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center animate-fadeIn">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Selected ({selectedCardIds.length}/3):
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center">
              {selectedCards.map((card, idx) => {
                const isCardFlipped = revealedCardIds.includes(card.id)
                return (
                  <span
                    key={card.id}
                    className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border text-xs font-medium flex items-center gap-1 shadow-2xs transition-all ${
                      isCardFlipped
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <span className={`text-[10px] sm:text-xs font-bold ${isCardFlipped ? 'text-amber-300' : 'text-neutral-400'}`}>
                      #{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm">{isCardFlipped ? card.icon : '🂠'}</span>
                    <span className="font-medium truncate max-w-[110px] sm:max-w-none">
                      {isCardFlipped ? card.name : `Card #${idx + 1}`}
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}
