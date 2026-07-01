import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver, type Driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import './tour.css'
import { Sparkles } from 'lucide-react'
import { tourSteps } from './tourSteps'

const SEEN_KEY = 'tremendous-tour-seen'

function clickEl(sel: string) {
  ;(document.querySelector(sel) as HTMLElement | null)?.click()
}

// Poll for an element to exist (route changes / modals mount asynchronously).
function waitForEl(sel: string, cb: () => void, tries = 100) {
  if (document.querySelector(sel) || tries <= 0) return cb()
  setTimeout(() => waitForEl(sel, cb, tries - 1), 50)
}

// driver.js config expects its own step shape; map ours onto it. Handoff steps
// hide Next (the user advances by clicking the real element); info steps show it.
const driveSteps: DriveStep[] = tourSteps.map((s) => ({
  element: s.element,
  popover: {
    title: s.title,
    description: s.description,
    side: s.side,
    align: s.align,
    showButtons: (s.kind === 'handoff'
      ? ['close']
      : ['next', 'close']) as Array<'next' | 'previous' | 'close'>,
  },
}))

export function Tour() {
  const navigate = useNavigate()
  const driverRef = useRef<Driver | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const start = useCallback(() => {
    driverRef.current?.destroy()
    const isMobile = !window.matchMedia('(min-width: 1024px)').matches

    const d = driver({
      showProgress: true,
      allowClose: true,
      overlayColor: '#0b0b0f',
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 10,
      popoverClass: 'app-tour',
      nextBtnText: 'Next',
      doneBtnText: 'Done',
      progressText: '{{current}} of {{total}}',
      steps: driveSteps,

      // Wire the page/modal handoffs: when a "handoff" step's element is
      // clicked, wait for the next step's element to appear, then advance.
      onHighlighted: (el) => {
        cleanupRef.current?.()
        cleanupRef.current = null
        const dr = driverRef.current
        const idx = dr?.getActiveIndex()
        if (!dr || el == null || idx == null) return
        const step = tourSteps[idx]

        // Pre-select the saved contacts so the "Add recipients" step is ready.
        if (step?.element === '[data-tour="contacts-list"]') {
          el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(
            (c) => {
              if (!c.checked) c.click()
            },
          )
        }

        if (step?.kind === 'handoff') {
          const nextSel = tourSteps[idx + 1]?.element
          const onClick = () => {
            if (!nextSel) {
              dr.moveNext()
              return
            }
            waitForEl(nextSel, () => {
              if (driverRef.current?.getActiveIndex() === idx) {
                driverRef.current.moveNext()
              }
            })
          }
          el.addEventListener('click', onClick)
          cleanupRef.current = () => el.removeEventListener('click', onClick)
        }
      },
      onDeselected: () => {
        cleanupRef.current?.()
        cleanupRef.current = null
      },
      onDestroyed: () => {
        cleanupRef.current?.()
        cleanupRef.current = null
        try {
          localStorage.setItem(SEEN_KEY, '1')
        } catch {
          /* ignore */
        }
      },
    })

    driverRef.current = d

    // Ensure we're on Home (where the sidebar / first anchor lives), then start.
    // On mobile the sidebar is a drawer, so open it before highlighting.
    navigate('/')
    waitForEl('[data-tour="send-rewards"]', () => {
      if (isMobile) {
        clickEl('[data-tour="menu"]')
        setTimeout(() => d.drive(), 340)
      } else {
        d.drive()
      }
    })
  }, [navigate])

  // Auto-start once per visitor, after the first paint settles.
  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (seen) return
    const t = setTimeout(start, 800)
    return () => clearTimeout(t)
  }, [start])

  // Tear down on unmount.
  useEffect(() => () => driverRef.current?.destroy(), [])

  return (
    <button type="button" onClick={() => start()} className="tour-fab">
      <Sparkles className="h-4 w-4" /> Take a tour
    </button>
  )
}
