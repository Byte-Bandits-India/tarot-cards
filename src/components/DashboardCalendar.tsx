import { useMemo, useRef } from "react"
import {
  EventCalendar,
  type EventCalendarApi,
  type EventCalendarRenderEventProps,
} from "@/components/reui/event-calendar/event-calendar"
import { EventCalendarContent } from "@/components/reui/event-calendar/event-calendar-content"
import {
  EventCalendarNav,
  EventCalendarToolbar,
} from "@/components/reui/event-calendar/event-calendar-nav"
import type { CalendarEvent } from "@/components/reui/event-calendar/event-calendar-types"
import { addDays, startOfDay, startOfWeek } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
  User,
  Users,
  Layers,
  ArrowLeft,
  Plus,
  Flag,
  type LucideIcon,
} from "lucide-react"

type Category = "reading" | "consultation" | "partner" | "study"

interface CategoryConfig {
  label: string
  color: string
  icon: LucideIcon
}

const CATEGORIES: Record<Category, CategoryConfig> = {
  reading: {
    label: "Tarot Spread",
    color: "#4f46e5", // Indigo/periwinkle tone (tints cleanly to #d8dbff)
    icon: Sparkles,
  },
  consultation: {
    label: "Consultation",
    color: "#6366f1", // Lavender-indigo tone
    icon: User,
  },
  partner: {
    label: "Partner Session",
    color: "#7c3aed", // Violet tone
    icon: Users,
  },
  study: {
    label: "Arcana Study",
    color: "#4338ca", // Deep periwinkle tone
    icon: Layers,
  },
}

interface EventData {
  category: Category
}

/** Pre-populated schedule for readings, milestones, and consultations */
function buildDashboardEvents(anchor: Date): CalendarEvent<EventData>[] {
  const week = startOfWeek(startOfDay(anchor), { weekStartsOn: 1 })
  const day = (offset: number) => addDays(week, offset)

  const span = (
    id: string,
    title: string,
    startOffset: number,
    endOffset: number,
    category: Category
  ): CalendarEvent<EventData> => ({
    id,
    title,
    start: day(startOffset),
    end: day(endOffset),
    allDay: true,
    color: CATEGORIES[category].color,
    data: { category },
  })

  return [
    span("daily-draw", "Daily Arcana Draw", -2, 1, "reading"),
    span("partner-spread", "Partner Compatibility Spread", 1, 4, "partner"),
    span("celtic-cross", "Celtic Cross Consultation", 2, 5, "consultation"),
    span("study-session", "Major Arcana Study", 3, 6, "study"),
    span("new-moon", "New Moon 3-Card Reading", 8, 10, "reading"),
    span("deep-dive", "Archetype Deep Dive", 9, 13, "study"),
    span("review", "Weekly Spread Review", 15, 16, "consultation"),
  ]
}

function renderChip({ occurrence }: EventCalendarRenderEventProps<EventData>) {
  const category = occurrence.event.data?.category
  if (!category) return undefined
  const Icon = CATEGORIES[category].icon

  return (
    <span className="flex w-full min-w-0 items-center gap-1.5 px-1 py-0.5">
      <span className="flex shrink-0 text-[#4338ca]">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <span className="truncate font-semibold text-[#1e1b4b] text-xs tracking-tight">
        {occurrence.event.title}
      </span>
    </span>
  )
}

function renderTooltip({
  occurrence,
}: {
  occurrence: { event: CalendarEvent<EventData> }
}) {
  const category = occurrence.event.data?.category
  if (!category) return undefined
  const Icon = CATEGORIES[category].icon

  return (
    <div className="flex flex-col gap-1.5 p-1 min-w-[140px] text-left">
      <div className="flex items-center gap-1.5">
        <span className="flex shrink-0 text-[#d8dbff]">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span className="font-semibold text-xs text-white leading-tight">
          {occurrence.event.title}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d8dbff] text-[#1e1b4b] border border-[#b8bcfa] shadow-2xs">
          {CATEGORIES[category].label}
        </span>
      </div>
    </div>
  )
}

export interface DashboardCalendarProps {
  onBackToTarot?: () => void
}

export function DashboardCalendar({ onBackToTarot }: DashboardCalendarProps = {}) {
  const events = useMemo(() => buildDashboardEvents(new Date()), [])
  const apiRef = useRef<EventCalendarApi<EventData> | null>(null)
  const counter = useRef(0)

  // Add a multi-day tarot reading session
  const addReading = () => {
    const api = apiRef.current
    if (!api) return
    const start = startOfDay(new Date())
    api.addEvent({
      id: `reading-${counter.current++}`,
      title: "New Tarot Reading",
      start,
      end: addDays(start, 3),
      allDay: true,
      color: CATEGORIES.reading.color,
      data: { category: "reading" },
    })
    api.goTo(start)
  }

  // Add a single-day milestone
  const addMilestone = () => {
    const api = apiRef.current
    if (!api) return
    const start = startOfDay(new Date())
    api.addEvent({
      id: `milestone-${counter.current++}`,
      title: "Reading Milestone",
      start,
      end: addDays(start, 1),
      allDay: true,
      color: CATEGORIES.consultation.color,
      data: { category: "consultation" },
    })
    api.goTo(start)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 animate-fadeIn select-none flex flex-col gap-3">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBackToTarot && (
            <button
              type="button"
              onClick={onBackToTarot}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-[#d8dbff]/30 hover:border-[#b8bcfa] text-[#1e1b4b] transition-colors cursor-pointer"
              title="Back to Tarot Cards Spread"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base sm:text-lg text-neutral-900 leading-tight">
                Dashboard & Reading Schedule
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d8dbff] text-[#1e1b4b] border border-[#b8bcfa] hidden sm:inline">
                Reading Calendar
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Track multi-day reading sessions, consultations, and card milestones.
            </p>
          </div>
        </div>

        {onBackToTarot && (
          <button
            type="button"
            onClick={onBackToTarot}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#b8bcfa] bg-[#d8dbff]/30 hover:bg-[#d8dbff] text-[#1e1b4b] shadow-2xs transition-colors cursor-pointer"
          >
            Open Cards Spread
          </button>
        )}
      </div>

      {/* Event Calendar Card */}
      <Card className="w-full bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden py-0">
        <CardContent className="p-3 sm:p-4">
          <EventCalendar
            defaultEvents={events}
            defaultView="month"
            weekStartsOn={1}
            apiRef={apiRef}
            renderEvent={renderChip}
            renderEventTooltip={renderTooltip}
            eventTooltip={{ side: "top" }}
            interactions={{ drag: true, resize: true, selectSlot: false }}
            className="h-[580px] sm:h-[640px] w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <EventCalendarNav
                className="min-w-0 flex-1"
                showViewSwitcher={false}
              />
              <EventCalendarToolbar className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  className="cursor-pointer border-[#b8bcfa] hover:bg-[#d8dbff]/20 text-[#1e1b4b] text-xs font-semibold"
                >
                  <Flag className="size-3.5" aria-hidden="true" />
                  <span>Milestone</span>
                </Button>
                <Button
                  size="sm"
                  onClick={addReading}
                  className="cursor-pointer bg-[#1e1b4b] hover:bg-[#2d296a] text-[#d8dbff] text-xs font-semibold shadow-xs"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  <span>New Reading</span>
                </Button>
              </EventCalendarToolbar>
            </div>
            <EventCalendarContent />
          </EventCalendar>

          {/* Categories Legend with #d8dbff Theme Accents */}
          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 mt-3 pt-3 text-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
              Categories:
            </span>
            {(Object.keys(CATEGORIES) as Category[]).map((key) => {
              const Icon = CATEGORIES[key].icon
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#b8bcfa]/50 bg-[#d8dbff]/20 text-[#1e1b4b] font-medium text-[11px]"
                >
                  <Icon className="size-3 text-[#4338ca]" aria-hidden="true" />
                  <span>{CATEGORIES[key].label}</span>
                </span>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

