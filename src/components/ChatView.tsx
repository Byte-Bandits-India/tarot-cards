import { useState, useRef, useEffect } from 'react'
import {
  Send,
  ArrowLeft,
  ArrowRightLeft,
  User,
  RotateCcw,
  Search,
  ChevronLeft,
  Layers,
  MessageSquare,
} from 'lucide-react'
import {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from '@/components/ui/message'
import { cn } from '@/lib/utils'
import type { TarotCardData } from '@/cardsData'

export interface ChatMessage {
  id: string
  sender: 'person1' | 'person2' | 'other'
  text: string
  timestamp: string
  cardsShared?: {
    id: number
    name: string
    icon: string
  }[]
}

export interface Contact {
  id: string
  name: string
  avatarInitial: string
}

// Contacts in Person 2's sidebar
const CONTACTS: Contact[] = [
  { id: 'person1', name: 'Person 1', avatarInitial: 'P1' },
  { id: 'patrick', name: 'Patrick Horton', avatarInitial: 'PH' },
  { id: 'jon', name: 'Jon Norman', avatarInitial: 'JN' },
  { id: 'lilly', name: 'Lilly Wagner', avatarInitial: 'LW' },
  { id: 'kenneth', name: 'Kenneth Harrison', avatarInitial: 'KH' },
  { id: 'barbara', name: 'Barbara Adams', avatarInitial: 'BA' },
  { id: 'elijah', name: 'Elijah Bishop', avatarInitial: 'EB' },
]

interface ChatViewProps {
  activePersona: 'person1' | 'person2'
  onSwitchPersona: (persona: 'person1' | 'person2') => void
  onBackToTarot: () => void
  selectedCards?: TarotCardData[]
  messages: ChatMessage[]
  onSendMessage: (msg: {
    text: string
    sender: 'person1' | 'person2'
    cardsShared?: { id: number; name: string; icon: string }[]
  }) => void
  onClearMessages: () => void
}

export function ChatView({
  activePersona,
  onSwitchPersona,
  onBackToTarot,
  selectedCards = [],
  messages,
  onSendMessage,
  onClearMessages,
}: ChatViewProps) {
  // Person 2 alone has a sidebar
  const hasSidebar = activePersona === 'person2'

  // Selected contact in Person 2's sidebar (defaults to person1)
  const [selectedContactId, setSelectedContactId] = useState<string>('person1')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileChatOpen, setMobileChatOpen] = useState(false)

  // Real message threads for each contact (initialized empty, zero hardcoded messages)
  const [contactThreads, setContactThreads] = useState<Record<string, ChatMessage[]>>({})

  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const otherPersona = activePersona === 'person1' ? 'person2' : 'person1'

  // Current active contact data
  const currentContact =
    CONTACTS.find((c) => c.id === selectedContactId) || CONTACTS[0]

  // Messages to display:
  // - For Person 1: always shows the shared conversation with Person 2
  // - For Person 2: if person1 is selected, shows shared conversation; otherwise shows thread with that contact
  const activeMessages: ChatMessage[] =
    !hasSidebar || selectedContactId === 'person1'
      ? messages
      : contactThreads[selectedContactId] || []

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  // Filter contacts by search query
  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    const trimmed = inputText.trim()
    if (!trimmed) return

    if (!hasSidebar || selectedContactId === 'person1') {
      // Send message to shared Person 1 <-> Person 2 thread
      onSendMessage({
        sender: activePersona,
        text: trimmed,
      })
    } else {
      // Send message to the selected contact's thread
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'person2',
        text: trimmed,
        timestamp: timeStr,
      }
      setContactThreads((prev) => ({
        ...prev,
        [selectedContactId]: [...(prev[selectedContactId] || []), newMsg],
      }))
    }

    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Share selected cards from the tarot spread into the chat
  const handleShareCards = () => {
    if (selectedCards.length === 0) return
    const cardNames = selectedCards.map((c) => c.name).join(', ')
    onSendMessage({
      sender: activePersona,
      text: `Selected cards: ${cardNames}`,
      cardsShared: selectedCards.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
      })),
    })
  }

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId)
    setMobileChatOpen(true)
  }

  // Clear current active conversation
  const handleClearCurrent = () => {
    if (!hasSidebar || selectedContactId === 'person1') {
      onClearMessages()
    } else {
      setContactThreads((prev) => ({
        ...prev,
        [selectedContactId]: [],
      }))
    }
  }

  return (
    <div
      className={cn(
        'w-full mx-auto h-[calc(100dvh-70px)] sm:h-[calc(100dvh-80px)] flex bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden select-none animate-fadeIn my-1 sm:my-2',
        hasSidebar ? 'max-w-6xl' : 'max-w-4xl'
      )}
    >
      {/* 
        =========================================================
        SIDEBAR (Rendered ONLY for Person 2)
        =========================================================
      */}
      {hasSidebar && (
        <aside
          className={cn(
            'w-full md:w-72 lg:w-80 border-r border-neutral-200 flex flex-col bg-white flex-shrink-0 transition-all',
            mobileChatOpen ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Sidebar Top Header */}
          <div className="p-3 sm:p-4 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-serif font-bold text-sm text-neutral-900">Conversations</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#d8dbff] text-[#1e1b4b] border border-[#b8bcfa]">
                {CONTACTS.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-[#818cf8] focus:ring-2 focus:ring-[#d8dbff]/50 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Contacts List with Real Dynamic Message Previews */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContactId === contact.id

              // Real messages for this contact (no hardcoded fake text)
              const thread =
                contact.id === 'person1'
                  ? messages
                  : contactThreads[contact.id] || []

              const lastMsg = thread.length > 0 ? thread[thread.length - 1] : null
              const lastMsgText = lastMsg ? lastMsg.text : 'No messages yet'
              const lastMsgTime = lastMsg ? lastMsg.timestamp : ''

              return (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact.id)}
                  className={cn(
                    'p-3 flex items-start gap-3 cursor-pointer transition-colors relative border-l-2',
                    isSelected
                      ? 'bg-[#d8dbff]/35 border-[#6366f1] text-[#1e1b4b]'
                      : 'border-transparent hover:bg-[#d8dbff]/10 text-neutral-700'
                  )}
                >
                  {/* Contact Avatar */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs select-none border shadow-2xs',
                        contact.id === 'person1'
                          ? 'bg-[#d8dbff] text-[#1e1b4b] border-[#b8bcfa]'
                          : 'bg-white text-neutral-800 border-neutral-300'
                      )}
                    >
                      {contact.avatarInitial}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-neutral-900 truncate">
                        {contact.name}
                      </span>
                      {lastMsgTime && (
                        <span className="text-[10px] text-neutral-400 flex-shrink-0">
                          {lastMsgTime}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {lastMsgText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      )}

      {/* 
        =========================================================
        MAIN CHAT AREA (Shared between Person 1 & Person 2)
        =========================================================
      */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 bg-white',
          hasSidebar && !mobileChatOpen ? 'hidden md:flex' : 'flex'
        )}
      >
        {/* Chat Top Header */}
        <header className="px-3 sm:px-5 py-3 border-b border-neutral-200 bg-white flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Back Button to Contacts List (on Person 2 mobile) */}
            {hasSidebar && (
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="md:hidden p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                title="Back to contacts list"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Back to Tarot Cards Spread */}
            <button
              type="button"
              onClick={onBackToTarot}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
              title="Back to Tarot Cards Spread"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Chat Target Avatar & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs select-none shadow-2xs border',
                  activePersona === 'person1'
                    ? 'bg-[#d8dbff] text-[#1e1b4b] border-[#b8bcfa]'
                    : 'bg-white text-neutral-900 border-neutral-300'
                )}
              >
                {hasSidebar ? (
                  currentContact.avatarInitial
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                  {hasSidebar ? currentContact.name : 'Person 2'}
                </span>
                <span className="text-[11px] text-neutral-500 truncate">
                  Chatting as{' '}
                  <span className="font-semibold text-neutral-800">
                    {activePersona === 'person1' ? 'Person 1' : 'Person 2'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions: Switch Persona & Reset */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onSwitchPersona(otherPersona)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              title={`Switch to chat as ${otherPersona === 'person1' ? 'Person 1' : 'Person 2'}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">
                Switch to {otherPersona === 'person1' ? 'Person 1' : 'Person 2'}
              </span>
              <span className="sm:hidden">Switch</span>
            </button>

            {activeMessages.length > 0 && (
              <button
                type="button"
                onClick={handleClearCurrent}
                className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-neutral-50/50 space-y-4 min-h-0 flex flex-col justify-end">
          {activeMessages.length === 0 ? (
            /* Clean Empty State (Zero Hardcoded/Default Messages) */
            <div className="my-auto text-center py-10 px-4 max-w-sm mx-auto flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#d8dbff]/40 border border-[#b8bcfa] flex items-center justify-center text-[#1e1b4b] mb-3 shadow-2xs">
                <MessageSquare className="w-5 h-5 text-[#4338ca]" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900">No messages yet</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Type a message below to start communicating with {hasSidebar ? currentContact.name : 'Person 2'}.
              </p>
            </div>
          ) : (
            <MessageGroup className="gap-3 sm:gap-4">
              {activeMessages.map((msg) => {
                const isMe = msg.sender === activePersona
                const senderLabel =
                  msg.sender === 'person1'
                    ? 'Person 1'
                    : msg.sender === 'person2'
                    ? 'Person 2'
                    : currentContact.name

                const avatarInitial =
                  msg.sender === 'person1'
                    ? 'P1'
                    : msg.sender === 'person2'
                    ? 'P2'
                    : currentContact.avatarInitial

                return (
                  <Message key={msg.id} align={isMe ? 'end' : 'start'}>
                    {/* Avatar */}
                    <MessageAvatar>
                      <div
                        className={cn(
                          'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs select-none border shadow-2xs',
                          isMe
                            ? 'bg-[#d8dbff] text-[#1e1b4b] border-[#b8bcfa]'
                            : 'bg-white text-neutral-900 border-neutral-300'
                        )}
                      >
                        {avatarInitial}
                      </div>
                    </MessageAvatar>

                    {/* Content */}
                    <MessageContent className={isMe ? 'items-end' : 'items-start'}>
                      <MessageHeader className="gap-1.5">
                        <span className="font-semibold text-neutral-700 text-[11px] sm:text-xs">
                          {senderLabel}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-neutral-400 text-[10px] sm:text-[11px]">
                          {msg.timestamp}
                        </span>
                      </MessageHeader>

                      {/* Message Bubble (#d8dbff for sent messages) */}
                      <div
                        className={cn(
                          'w-fit max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs',
                          isMe
                            ? 'bg-[#d8dbff] text-[#1e1b4b] border border-[#c4c8fa] rounded-br-xs self-end'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs self-start'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Attached Tarot Cards (if any) */}
                        {msg.cardsShared && msg.cardsShared.length > 0 && (
                          <div
                            className={cn(
                              'mt-2 pt-2 border-t flex flex-wrap gap-1.5',
                              isMe ? 'border-[#b8bcfa]/60' : 'border-neutral-200'
                            )}
                          >
                            {msg.cardsShared.map((card) => (
                              <span
                                key={card.id}
                                className={cn(
                                  'px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1.5',
                                  isMe
                                    ? 'bg-white/80 text-[#1e1b4b] border border-[#b8bcfa]'
                                    : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                                )}
                              >
                                <span className="text-xs">{card.icon}</span>
                                <span>{card.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </MessageContent>
                  </Message>
                )
              })}
              <div ref={messagesEndRef} />
            </MessageGroup>
          )}
        </div>

        {/* Quick Action Bar (if cards are selected on the tarot table) */}
        {selectedCards.length > 0 && (!hasSidebar || selectedContactId === 'person1') && (
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 text-xs">
            <button
              type="button"
              onClick={handleShareCards}
              className="px-2.5 py-1 rounded-lg border border-[#b8bcfa] bg-[#d8dbff] text-[#1e1b4b] font-semibold hover:bg-[#c7cbff] transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#1e1b4b]" />
              <span>Share {selectedCards.length} Selected Cards</span>
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <footer className="p-2.5 sm:p-3 border-t border-neutral-200 bg-white flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type a message as ${
              activePersona === 'person1' ? 'Person 1' : 'Person 2'
            }...`}
            className="flex-1 px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-[#818cf8] focus:ring-2 focus:ring-[#d8dbff]/50 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 py-2 sm:py-2.5 bg-[#1e1b4b] hover:bg-[#2d296a] active:bg-[#15123d] text-[#d8dbff] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    </div>
  )
}
