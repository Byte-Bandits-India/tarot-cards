import { useState, useRef, useEffect } from 'react'
import { INITIAL_CARDS, type TarotCardData } from './cardsData'

export default function App() {
  // Tracks which cards (0..9) are dealt onto the table
  const [dealtCards, setDealtCards] = useState<boolean[]>(() => new Array(10).fill(false))
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

  // Start (Deal): Deals cards 0 to 9 one by one every 150ms
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
      }, i * 150)
      timeoutsRef.current.push(timeoutId)
    })
  }

  // Stack: Gathers cards back into the deck stack with staggered delay
  const handleStack = () => {
    if (isBusy) return
    clearScheduledAnimations()
    setIsBusy(true)
    setSelectedCardIds([])
    setRevealedCardIds([])

    // Stack in reverse order (card 9 back first up to card 0)
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
      }, i * 150)
      timeoutsRef.current.push(timeoutId)
    })
  }

  // Reselect: Keep table dealt, clear selection so user can pick 3 different cards
  const handleReselect = () => {
    if (isBusy) return
    setSelectedCardIds([])
    setRevealedCardIds([])
  }

  // Reveal all 3 cards simultaneously
  const handleRevealAll = () => {
    if (!isThreeSelected) return
    setRevealedCardIds([...selectedCardIds])
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

    // 3. Reveal Phase (All 3 cards have been selected)
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
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 select-none">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-neutral-900">
          Tarot Cards Spread
        </h1>
      </header>

      {/* Card Table Area */}
      <div className="w-full max-w-[780px] overflow-x-auto pb-4 flex justify-center">
        <div className="cards relative w-[736px] min-w-[736px] h-[432px] bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Deck Slot Indicator (matches stack position: left 584px, top 31px) */}
          <div
            onClick={anyDealt && !isBusy ? handleStack : undefined}
            className={`absolute w-[120px] h-[175px] rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-300 text-xs font-sans transition-all ${
              isThreeSelected ? 'opacity-20 blur-[1px]' : ''
            } ${
              anyDealt && !isBusy ? 'hover:border-neutral-400 hover:text-neutral-500 cursor-pointer' : 'pointer-events-none'
            }`}
            style={{ left: '584px', top: '31px' }}
            title={anyDealt ? 'Click to stack cards back into deck' : undefined}
          >
            <span className="text-xl opacity-40">🂠</span>
            <span className="mt-1 font-medium text-[11px]">
              {anyDealt ? 'Click to Stack' : 'Deck Stack'}
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
              const stackZIndex = 20 - index
              const stackOffset = !isDealt
                ? {
                    transform: `translateY(${-index * 0.75}px) translateX(${index * 0.25}px)`,
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
                        ? `Card #${selectionOrder + 1} (Selected - click to unselect)`
                        : `Click to select this card (${selectedCardIds.length}/3)`
                      : isSelected
                      ? isFlipped
                        ? `${card.name} (Revealed)`
                        : `Card #${selectionOrder + 1} (Click to flip and reveal!)`
                      : undefined
                  }
                >
                  {/* Selection Badge for Selected Cards */}
                  {isSelected && (
                    <div className="absolute -top-2.5 -right-2.5 z-50 px-2 py-0.5 rounded-full bg-neutral-900 text-white border-2 border-white shadow-md flex items-center gap-1 text-[10px] font-bold tracking-tight">
                      <span>#{selectionOrder + 1}</span>
                      {isThreeSelected && !isFlipped && (
                        <span className="text-[8px] font-normal text-amber-300 uppercase tracking-widest hidden sm:inline">Flip</span>
                      )}
                    </div>
                  )}

                  {/* 3D Inner Card Flipper */}
                  <div
                    className={`card-flipper ${isFlipped ? 'is-flipped' : ''} ${
                      isSelected && !isThreeSelected ? 'ring-2 ring-neutral-900 ring-offset-2' : ''
                    }`}
                  >
                    {/* BACK FACE (Visible in deck, during selection, and before flipping) */}
                    <div className="card-face face-back">
                      <img
                        src={card.backImage}
                        alt={`${card.name} Back`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>

                    {/* FRONT FACE (Revealed only when user clicks to flip) */}
                    <div className="card-face face-front">
                      <img
                        src={card.frontImage}
                        alt={`${card.name} Front`}
                        className="w-full h-full object-cover"
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

      {/* Selected 3 Cards Bar & Actions */}
      <div className="w-full max-w-[736px] mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Selected Cards ({selectedCardIds.length}/3):
          </span>
          {selectedCards.length === 0 ? (
            <span className="text-xs text-neutral-400 italic">None yet</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedCards.map((card, idx) => {
                const isCardFlipped = revealedCardIds.includes(card.id)
                return (
                  <span
                    key={card.id}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-all ${
                      isCardFlipped
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${isCardFlipped ? 'text-amber-300' : 'text-neutral-400'}`}>
                      #{idx + 1}
                    </span>
                    <span>{isCardFlipped ? card.icon : '🂠'}</span>
                    <span>{isCardFlipped ? card.name : `Card #${idx + 1}`}</span>
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Reveal All (Visible when 3 cards selected and not all revealed) */}
          {isThreeSelected && revealedCardIds.length < 3 && (
            <button
              type="button"
              onClick={handleRevealAll}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              Reveal All 3
            </button>
          )}

          {/* Reselect Cards (Active when cards dealt) */}
          {anyDealt && selectedCardIds.length > 0 && (
            <button
              type="button"
              onClick={handleReselect}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              Reselect
            </button>
          )}

          {/* Stack Deck / New Reading */}
          {anyDealt && (
            <button
              type="button"
              onClick={handleStack}
              disabled={isBusy}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-40"
            >
              Stack Deck
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
