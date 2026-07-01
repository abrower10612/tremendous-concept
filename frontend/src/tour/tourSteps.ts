// The guided-tour script for the happy path. Targets elements by data-tour
// attributes (decoupled from styling).
//
// kind:
//   'handoff' — the user clicks the highlighted element to advance; the tour
//               waits for the NEXT step's element to mount, then moves on.
//   'info'    — advances via the popover's Next button.

export interface TourStep {
  element: string
  title: string
  description: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  kind: 'handoff' | 'info'
}

export const tourSteps: TourStep[] = [
  {
    element: '[data-tour="send-rewards"]',
    title: 'Send a reward',
    description: 'Every reward starts here. Click Send rewards to begin.',
    side: 'right',
    align: 'start',
    kind: 'handoff',
  },
  {
    element: '[data-tour="send-via-email"]',
    title: 'Choose email delivery',
    description: "We'll deliver this reward by email. Click Send via email.",
    side: 'bottom',
    align: 'start',
    kind: 'handoff',
  },
  {
    element: '[data-tour="add-recipients"]',
    title: 'Add recipients',
    description: 'Now pick who gets the reward. Click Add recipients.',
    side: 'left',
    align: 'center',
    kind: 'handoff',
  },
  {
    element: '[data-tour="add-from-contacts"]',
    title: 'Add from Contacts ✨',
    description:
      "This is the new feature — pull people straight from your saved Contacts instead of typing them in. Click Add from Contacts.",
    side: 'bottom',
    align: 'end',
    kind: 'handoff',
  },
  {
    element: '[data-tour="contacts-list"]',
    title: 'Pick your contacts',
    description:
      "These are your saved contacts — we've selected them for you. Click Next to continue.",
    side: 'left',
    align: 'center',
    kind: 'info',
  },
  {
    element: '[data-tour="add-selected"]',
    title: 'Add them to the order',
    description: 'Click Add recipients to drop the selected contacts in.',
    side: 'top',
    align: 'end',
    kind: 'handoff',
  },
  {
    element: '[data-tour="continue"]',
    title: 'Recipients ready',
    description: 'Your contacts are now recipients. Click Continue.',
    side: 'top',
    align: 'start',
    kind: 'handoff',
  },
  {
    element: '[data-tour="place-order"]',
    title: 'Place the order',
    description: 'Review the summary, then click Place order.',
    side: 'left',
    align: 'center',
    kind: 'handoff',
  },
  {
    element: '[data-tour="confirm-order"]',
    title: 'Confirm',
    description: 'One last check — click Confirm to send the reward.',
    side: 'top',
    align: 'center',
    kind: 'handoff',
  },
  {
    element: '[data-tour="order-placed"]',
    title: "That's it! 🎉",
    description:
      'Your order was placed and now appears in Order history. Tour complete!',
    side: 'left',
    align: 'center',
    kind: 'info',
  },
]
