import { useState } from 'react'
import { INITIAL_CARDS, type TarotCardData } from './cardsData'
import { Navbar, type NavbarTab } from './components/Navbar'
import { DashboardCalendar } from './components/DashboardCalendar'
import { ChatView, type ChatMessage } from './components/ChatView'
import { TarotFanSpread } from './components/TarotFanSpread'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavbarTab>('tarot')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  // Tracks the IDs of selected cards (strictly up to 3 cards)
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  // Tracks which of the selected cards have been flipped / revealed
  const [revealedCardIds, setRevealedCardIds] = useState<number[]>([])

  // Selection handlers for the TarotFanSpread component
  const handleSelectCard = (id: number) => {
    if (selectedCardIds.length < 3 && !selectedCardIds.includes(id)) {
      setSelectedCardIds((prev) => [...prev, id])
      // Turn the card automatically with smooth 3D flip animation
      setTimeout(() => {
        setRevealedCardIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      }, 180)
    }
  }

  const handleDeselectCard = (id: number) => {
    setSelectedCardIds((prev) => prev.filter((cardId) => cardId !== id))
    setRevealedCardIds((prev) => prev.filter((cardId) => cardId !== id))
  }

  const handleToggleReveal = (id: number) => {
    setRevealedCardIds((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    )
  }

  const handleRevealAll = () => {
    setRevealedCardIds(selectedCardIds)
  }

  const handleResetSpread = () => {
    setSelectedCardIds([])
    setRevealedCardIds([])
  }

  // Map selected IDs to card objects (for chat sharing & spreads)
  const selectedCards: TarotCardData[] = selectedCardIds
    .map((id) => INITIAL_CARDS.find((c) => c.id === id))
    .filter((c): c is TarotCardData => Boolean(c))

  const handleSendMessage = ({
    sender,
    text,
    cardsShared,
  }: {
    sender: 'person1' | 'person2'
    text: string
    cardsShared?: { id: number; name: string; icon: string }[]
  }) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: timeStr,
      cardsShared,
    }
    setChatMessages((prev) => [...prev, newMsg])
  }

  const handleClearMessages = () => {
    setChatMessages([])
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 flex flex-col justify-start items-center select-none">
      {/* Top Navbar using NavigationMenu Component */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {activeTab === 'tarot' ? (
        <main className="w-full flex-1 flex flex-col items-center justify-start bg-white">
          <TarotFanSpread
            cards={INITIAL_CARDS}
            selectedCardIds={selectedCardIds}
            onSelectCard={handleSelectCard}
            onDeselectCard={handleDeselectCard}
            revealedCardIds={revealedCardIds}
            onToggleReveal={handleToggleReveal}
            onRevealAll={handleRevealAll}
            onResetSpread={handleResetSpread}
            onNavigateToChat={() => setActiveTab('person1')}
          />
        </main>
      ) : activeTab === 'person1' || activeTab === 'person2' ? (
        <div className="w-full flex-1 flex items-center justify-center p-1 sm:p-3 min-h-0">
          <ChatView
            activePersona={activeTab}
            onSwitchPersona={(persona) => setActiveTab(persona)}
            onBackToTarot={() => setActiveTab('tarot')}
            selectedCards={selectedCards}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearMessages={handleClearMessages}
          />
        </div>
      ) : (
        <div className="w-full flex-1 overflow-y-auto py-2">
          <DashboardCalendar onBackToTarot={() => setActiveTab('tarot')} />
        </div>
      )}
    </div>
  )
}
