import { useState } from 'react'
import {
  Sparkles,
  User,
  Users,
  LayoutDashboard,
  Menu,
  X,
  Layers,
  ArrowLeft,
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export type NavbarTab = 'tarot' | 'person1' | 'person2' | 'dashboard'

interface NavbarProps {
  activeTab: NavbarTab
  onSelectTab: (tab: NavbarTab) => void
}

interface NavItem {
  id: NavbarTab
  label: string
  icon: typeof Sparkles
}

const NAV_ITEMS: NavItem[] = [
  { id: 'tarot', label: 'Tarot Card', icon: Layers },
  { id: 'person1', label: 'Person 1', icon: User },
  { id: 'person2', label: 'Person 2', icon: Users },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Navbar({ activeTab, onSelectTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleTabClick = (tab: NavbarTab) => {
    onSelectTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-40 flex-shrink-0 select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo with #d8dbff Theme Accent */}
        <div
          onClick={() => handleTabClick('tarot')}
          className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1e1b4b] text-[#d8dbff] flex items-center justify-center shadow-xs transition-colors group-hover:bg-[#2e2a6a]">
            <Sparkles className="w-4 h-4 text-[#d8dbff]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-neutral-900 leading-tight">
              Tarot Cards
            </span>
            <span className="text-[10px] text-neutral-400 font-sans tracking-wide uppercase font-semibold hidden sm:inline">
              Spread
            </span>
          </div>
        </div>

        {/* Desktop Navigation Menu with #d8dbff Active Theme */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <NavigationMenu align="center">
            <NavigationMenuList className="gap-1 sm:gap-2 list-none m-0 p-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuLink
                      render={
                        <button
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={cn(
                            'inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer outline-none border no-underline',
                            isActive
                              ? '!bg-[#d8dbff] !text-[#1e1b4b] !border-[#b8bcfa] font-semibold shadow-xs'
                              : '!bg-white !text-neutral-700 border-transparent hover:!text-[#1e1b4b] hover:!bg-[#d8dbff]/20 hover:border-[#b8bcfa]/40'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-4 h-4 transition-colors',
                              isActive ? '!text-[#1e1b4b]' : '!text-neutral-500'
                            )}
                          />
                          <span
                            className={cn(
                              'transition-colors font-medium',
                              isActive ? '!text-[#1e1b4b] font-semibold' : '!text-neutral-800'
                            )}
                          >
                            {item.label}
                          </span>
                        </button>
                      }
                    />
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section: Optional Return Button (if viewing other tabs) & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {activeTab !== 'tarot' && (
            <button
              type="button"
              onClick={() => handleTabClick('tarot')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-[#d8dbff]/20 hover:border-[#b8bcfa] text-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-700" />
              <span>Back to Cards</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-neutral-200 text-neutral-800 hover:bg-[#d8dbff]/20 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer with #d8dbff Accent */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-3 py-3 shadow-sm animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    'flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border',
                    isActive
                      ? 'bg-[#d8dbff] text-[#1e1b4b] border-[#b8bcfa] shadow-xs'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:bg-[#d8dbff]/15 hover:text-[#1e1b4b]'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-[#1e1b4b]' : 'text-neutral-500')} />
                  <span className={isActive ? 'text-[#1e1b4b]' : 'text-neutral-800'}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
