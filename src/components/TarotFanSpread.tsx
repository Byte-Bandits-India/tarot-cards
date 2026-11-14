import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  RotateCcw,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { INITIAL_CARDS, type TarotCardData } from '@/cardsData'
import { cn } from '@/lib/utils'

export interface TarotFanSpreadProps {
  cards?: TarotCardData[]
  selectedCardIds: number[]
  onSelectCard: (id: number) => void
  onDeselectCard: (id: number) => void
  revealedCardIds: number[]
  onToggleReveal: (id: number) => void
  onRevealAll?: () => void
  onResetSpread?: () => void
  onNavigateToChat?: () => void
}

const SLOT_LABELS = ['Past', 'Present', 'Future']

export function TarotFanSpread({
  cards = INITIAL_CARDS,
  selectedCardIds,
  onSelectCard,
  onDeselectCard,
  revealedCardIds,
  onToggleReveal,
  onRevealAll,
  onResetSpread,
}: TarotFanSpreadProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fanTrackRef = useRef<HTMLDivElement>(null)

  // Continuous scroll position along the fan curve
  // Starts at 0 so Card 0 shows its full face on the left, matching user reference image
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  // Track container width for responsive arc calculation
  const [containerWidth, setContainerWidth] = useState(1050)

  // Drag interaction state
  const isPointerDownRef = useRef(false)
  const hasMovedDuringDragRef = useRef(false)
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null)
  const lastPointerXRef = useRef(0)
  const dragVelocityRef = useRef(0)

  // Hovered card in the fan
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)

  // Shuffling animation trigger
  const [isShuffling, setIsShuffling] = useState(false)

  const totalCards = cards.length
  // Max scroll for smooth sliding along the 78-card deck
  const maxScroll = Math.max(0, totalCards - 18)

  // Resize observer to keep the arc geometry responsive
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Physics animation loop: smooth lerp to target scroll
  useEffect(() => {
    const loop = () => {
      const diff = targetScrollRef.current - currentScrollRef.current
      if (Math.abs(diff) > 0.001) {
        currentScrollRef.current += diff * 0.12
        setScrollProgress(currentScrollRef.current)
      } else if (currentScrollRef.current !== targetScrollRef.current) {
        currentScrollRef.current = targetScrollRef.current
        setScrollProgress(currentScrollRef.current)
      }
      animFrameRef.current = requestAnimationFrame(loop)
    }
    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Clamp target scroll
  const setTargetScroll = useCallback(
    (newVal: number) => {
      const clamped = Math.max(0, Math.min(maxScroll, newVal))
      targetScrollRef.current = clamped
    },
    [maxScroll]
  )

  // Non-passive wheel listener for smooth scrolling along the arc
  useEffect(() => {
    const el = fanTrackRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const step = delta * 0.0065
      setTargetScroll(targetScrollRef.current + step)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [setTargetScroll])

  // Pointer Drag Handlers on fan track
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true
    hasMovedDuringDragRef.current = false
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY }
    lastPointerXRef.current = e.clientX
    dragVelocityRef.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || !pointerDownPosRef.current) return
    const dist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    )

    if (dist > 6) {
      hasMovedDuringDragRef.current = true
    }

    if (!hasMovedDuringDragRef.current) return

    const dx = e.clientX - lastPointerXRef.current
    lastPointerXRef.current = e.clientX
    dragVelocityRef.current = dx

    // Dragging left moves deck forward
    const scrollDelta = -dx * 0.035
    setTargetScroll(targetScrollRef.current + scrollDelta)
  }

  const handlePointerUp = () => {
    isPointerDownRef.current = false
    pointerDownPosRef.current = null

    if (hasMovedDuringDragRef.current) {
      // Apply momentum flick
      const momentum = -dragVelocityRef.current * 0.04
      setTargetScroll(targetScrollRef.current + momentum)
      // Reset drag flag shortly after release
      setTimeout(() => {
        hasMovedDuringDragRef.current = false
      }, 60)
    }
  }

  // Handle Card Click / Selection (Instant & Reliable)
  const handleCardClick = (card: TarotCardData, e: React.MouseEvent) => {
    e.stopPropagation()
    // Do not select if the user was actively dragging the fan
    if (hasMovedDuringDragRef.current) return

    if (selectedCardIds.includes(card.id)) {
      onDeselectCard(card.id)
    } else if (selectedCardIds.length < 3) {
      onSelectCard(card.id)
    }
  }

  // Shuffle animation: resets to start (Card 0) and resets cards
  const handleShuffle = () => {
    setIsShuffling(true)
    targetScrollRef.current = 0
    currentScrollRef.current = 0
    setScrollProgress(0)
    setTimeout(() => {
      setIsShuffling(false)
      onResetSpread?.()
    }, 600)
  }

  // Selected card objects
  const selectedCards = useMemo(() => {
    return selectedCardIds
      .map((id) => cards.find((c) => c.id === id))
      .filter((c): c is TarotCardData => Boolean(c))
  }, [cards, selectedCardIds])

  // Automatically turn newly placed cards in slots without needing manual flip
  const [autoFlippedIds, setAutoFlippedIds] = useState<number[]>([])

  useEffect(() => {
    selectedCardIds.forEach((id) => {
      if (!autoFlippedIds.includes(id)) {
        const timer = setTimeout(() => {
          setAutoFlippedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
          if (!revealedCardIds.includes(id)) {
            onToggleReveal(id)
          }
        }, 120)
        return () => clearTimeout(timer)
      }
    })
  }, [selectedCardIds, autoFlippedIds, revealedCardIds, onToggleReveal])

  useEffect(() => {
    if (selectedCardIds.length === 0) {
      setAutoFlippedIds([])
    }
  }, [selectedCardIds.length])

  // =========================================================================
  // CARD PROPORTIONS & ARC GEOMETRY (Balanced & Elegant)
  // =========================================================================
  // Card size: well-balanced (~88px to 96px width, ~142px to 155px height)
  const cardWidth = Math.max(80, Math.min(96, containerWidth * 0.086))
  const cardHeight = Math.round(cardWidth * 1.62)

  // Arc Radius calibrated so the curve is graceful and compact
  const arcRadius = Math.max(120, Math.min(500, containerWidth * 0.38))
  const arcCenterX = containerWidth * 0.5
  // Apex position: generous top headroom (24px)
  const arcApexY = 24
  const arcCenterY = arcApexY + arcRadius + cardHeight * 0.5

  // Compact arc: Card 0 starts on the left (-22deg showing full face)
  const angleStepDeg = 2.2
  const baseAngleDeg = -22

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white text-neutral-900 flex flex-col items-center justify-start select-none py-2 sm:py-3 transition-colors overflow-x-hidden"
    >
      {/* 
        ============================================================
        1. CENTER: BALANCED FULL-LENGTH HALF-CIRCLE RAINBOW ARC
           - Clearly visible full-length cards starting with Card 0 showing full face on left
           - Compact arc length: graceful, controlled span
           - Full card length 100% visible from top to bottom
           - Hovered card lifts and gets glowing highlight ring
        ============================================================
      */}
      <div
        ref={fanTrackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full h-[360px] sm:h-[400px] md:h-[440px] flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing z-20"
      >
        {/* Navigation arrows */}
        <button
          type="button"
          onClick={() => setTargetScroll(targetScrollRef.current - 2.5)}
          className="flex absolute left-3 sm:left-6 top-[40%] -translate-y-1/2 z-[2100] p-2 rounded-full bg-white/95 hover:bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setTargetScroll(targetScrollRef.current + 2.5)}
          className="flex absolute right-3 sm:right-6 top-[40%] -translate-y-1/2 z-[2100] p-2 rounded-full bg-white/95 hover:bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Semicircular Arc Cards - Curving all the way down fully to the baseline */}
        {cards.map((card, index) => {
          const effectiveIndex = index - scrollProgress
          const angleDeg = baseAngleDeg + effectiveIndex * angleStepDeg
          const angleRad = (angleDeg * Math.PI) / 160

          // Render cards curving fully all the way down (-72deg to +72deg)
          if (angleDeg < -72 || angleDeg > 72) {
            return null
          }

          // Card position along the semicircular arc
          const x = arcCenterX + arcRadius * Math.sin(angleRad)
          const y = arcCenterY - arcRadius * Math.cos(angleRad)

          const isSelected = selectedCardIds.includes(card.id)
          const isHovered = hoveredCardId === card.id
          const selectionOrder = selectedCardIds.indexOf(card.id)

          // Stacking order: slight elevation when hovered
          const baseZIndex = 1000 - index
          const zIndex = isHovered ? baseZIndex + 10 : baseZIndex

          // Hover offset: simply moves the card a little bit outward (8px) along its angle
          const hoverMoveY = isHovered ? -8 : 0

          return (
            <div
              key={card.id}
              onClick={(e) => handleCardClick(card, e)}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={cn(
                'absolute origin-center select-none will-change-transform cursor-pointer pointer-events-auto',
                isSelected && 'opacity-40'
              )}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(${hoverMoveY}px)`,
                zIndex,
                transition: isShuffling
                  ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'transform 0.15s ease-out',
              }}
              title={
                isSelected
                  ? `${card.name} (#${selectionOrder + 1} Selected - click to return)`
                  : `${card.name} (Click to pick card)`
              }
            >
              {/* Individual Tarot Card */}
              <div
                style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
                className={cn(
                  'relative rounded-xl overflow-hidden border transition-all duration-150',
                  'shadow-[0_2px_8px_-1px_rgba(0,0,0,0.14)]',
                  isHovered ? 'border-neutral-300 shadow-md' : 'border-white/80',
                  isSelected && 'ring-2 ring-[#7c3aed] border-[#7c3aed]'
                )}
              >
                {/* Card Back Face (Infinity gold pattern from reference image) */}
                <img
                  src={card.backImage}
                  alt={card.name}
                  className="w-full h-full object-fill pointer-events-none"
                  draggable={false}
                />

                {/* Selected Indicator Badge in Fan */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-[0.5px] flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-bold text-xs flex items-center justify-center border border-white shadow-sm">
                      #{selectionOrder + 1}
                    </span>
                  </div>
                )}

                {/* Subtle edge gleam */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />
              </div>
            </div>
          )
        })}
      </div>

      {/* 
        ============================================================
        2. BOTTOM SLOTS: 3 Card Slots Labeled "Past", "Present", "Future"
        ============================================================
      */}
      <section className="w-full max-w-3xl mx-auto px-4 z-30 flex flex-col items-center gap-3 flex-shrink-0 mt-2 sm:mt-4">
        {/* 3 Target Slots with Past, Present, Future Labels */}
        <div className="w-full grid grid-cols-3 gap-3 sm:gap-6 justify-center max-w-[480px] sm:max-w-[560px]">
          {[0, 1, 2].map((slotIndex) => {
            const card = selectedCards[slotIndex]
            const isFilled = Boolean(card)
            const isFlipped = card
              ? revealedCardIds.includes(card.id) || autoFlippedIds.includes(card.id)
              : false

            return (
              <div key={slotIndex} className="flex flex-col items-center">
                {/* Slot Card Frame */}
                <div
                  className={cn(
                    'relative w-full aspect-[1/1.72] sm:aspect-[1/1.75] rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-1',
                    isFilled
                      ? 'border-[#8b5cf6] bg-white shadow-xs'
                      : 'border-dashed border-[#b8bcfa] bg-[#d8dbff]/10 hover:border-[#818cf8] hover:bg-[#d8dbff]/20'
                  )}
                >
                  {/* Top-Left Slot Badge "1", "2", "3" (Matching user's screenshot) */}
                  <div className="absolute -top-2 -left-2 sm:-top-2.5 sm:-left-2.5 z-30 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#7c3aed] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                    {slotIndex + 1}
                  </div>

                  {isFilled && card ? (
                    /* Placed Tarot Card with 3D Flip */
                    <div
                      onClick={() => onToggleReveal(card.id)}
                      className="group relative w-full h-full cursor-pointer perspective-[1000px] select-none"
                      title={
                        isFlipped
                          ? `${card.name} (Revealed - click to flip back)`
                          : 'Click to reveal card!'
                      }
                    >
                      {/* Deselect / Remove button in corner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeselectCard(card.id)
                        }}
                        className="absolute -top-1.5 -right-1.5 z-40 w-5 h-5 rounded-full bg-neutral-900/90 text-white hover:bg-rose-600 border border-white flex items-center justify-center transition-colors cursor-pointer shadow-md opacity-0 group-hover:opacity-100"
                        title="Return card to fan"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* 3D Inner Card Flipper */}
                      <div
                        className={cn(
                          'relative w-full h-full rounded-lg sm:rounded-xl transition-transform duration-700 preserve-3d shadow-xs',
                          isFlipped && 'rotate-y-180'
                        )}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* BACK FACE (Infinity Symbol Art from back.png) */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden border border-neutral-200"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        >
                          <img
                            src={card.backImage}
                            alt="Card Back"
                            className="w-full h-full object-fill"
                            draggable={false}
                          />
                          {/* Hover hint */}
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-center p-1">
                            <Eye className="w-4 h-4 text-white animate-pulse" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded-full">
                              Flip
                            </span>
                          </div>
                        </div>

                        {/* FRONT FACE (Revealed Tarot Artwork & Meanings) */}
                        <div
                          className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden border border-[#b8bcfa] bg-white flex flex-col justify-between p-1 sm:p-1.5 shadow-sm text-neutral-900"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {/* Top banner: numeral & icon */}
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#1e1b4b] px-1 pt-0.5 leading-none shrink-0">
                            <span>{card.numeral}</span>
                            <span className="text-xs">{card.icon}</span>
                          </div>

                          {/* Front Image Artwork - fully visible without cropping */}
                          <div className="flex-1 min-h-0 w-full my-0.5 rounded-md overflow-hidden relative flex items-center justify-center">
                            <img
                              src={card.frontImage}
                              alt={card.name}
                              className="w-full h-full object-contain"
                              draggable={false}
                            />
                          </div>

                          {/* Bottom Name & Subtitle */}
                          <div className="text-center px-0.5 pb-0.5 shrink-0">
                            <p className="font-serif font-bold text-[9px] sm:text-[10px] text-neutral-900 truncate leading-tight">
                              {card.name}
                            </p>
                            <p className="text-[7px] sm:text-[8px] text-neutral-500 truncate">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty Slot Placeholder */
                    <div className="flex flex-col items-center justify-center text-center p-1.5 text-neutral-400 gap-1">
                      <span className="text-base sm:text-xl opacity-35">🂠</span>
                      <span className="text-[9px] sm:text-[10px] font-medium text-neutral-500">
                        Card {slotIndex + 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Slot Subtitle: "Past", "Present", "Future" */}
                <span className="text-xs font-semibold text-neutral-600 tracking-wide mt-1.5 sm:mt-2">
                  {SLOT_LABELS[slotIndex]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Action Controls when cards are placed or to reset */}
        <div className="flex items-center gap-2 flex-wrap justify-center pt-2 animate-fadeIn">
          {/* Reveal All Button (only if any card is not yet revealed) */}
          {selectedCardIds.length === 3 &&
            selectedCardIds.some(
              (id) => !revealedCardIds.includes(id) && !autoFlippedIds.includes(id)
            ) &&
            onRevealAll && (
              <button
                type="button"
                onClick={onRevealAll}
                className="px-4 py-2 rounded-xl border border-[#b8bcfa] bg-[#1e1b4b] text-[#d8dbff] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#2d296a] transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d8dbff]" />
                <span>Reveal All 3 Cards</span>
              </button>
            )}

          {/* Reset / Shuffle Spread */}
          <button
            type="button"
            onClick={selectedCardIds.length > 0 ? onResetSpread : handleShuffle}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Reset cards and shuffle deck"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{selectedCardIds.length > 0 ? 'Reset' : 'Shuffle Deck'}</span>
          </button>
        </div>
      </section>
    </div>
  )
}
