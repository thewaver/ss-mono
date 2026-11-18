import type { InteractionSettingsHotkeys } from "@thewaver/ss-components";

import type { ToastKind } from "../../StyledComponents/ToastContent/ToastContent.types";

export const NO_LIMIT = 0;

export const STICKY = 0;

export const BURST_SIZE = 5;

export const MESSAGES: Record<ToastKind, string> = {
    info: "Your export is being prepared.",
    success: "Settings saved.",
    error: "Upload failed — the file was larger than 25 MB.",
};

export const TOAST_ID_PREFIX = "toast";

export const DOCS_ROOT = "/src/App/Pages/ToastsPage/Docs";

export const FIELD_WIDTH = 140;

export const DRAFT_DELETED_MESSAGE = "Draft deleted.";

export const RIGHT_TO_LEFT_MESSAGE = "Your changes were published.";

export const FAR_DOWN_MESSAGE = "Profile saved.";

export const OUTSIDE_MESSAGE = "A sync finished in the background.";

export const HOTKEYS_MESSAGE = "You got here with F9. Escape takes you back.";

export const OWN_HOTKEYS: InteractionSettingsHotkeys = {
    forward: { key: "F9" },
    back: { key: "F9", modifiers: ["shift"] },
};

export const DOCS_SECTIONS = {
    whereStackSitsHow: {
        title: "Where the stack sits and how it grows",
        content:
            "Set [prop]alignment[/prop] to put the stack at one of nine places on the screen, and [prop]flexDirection[/prop] for the way it grows from there: down a column or along a row, with new toasts joining at the far end or, reversed, at the near one, while the stack stays where it was put. The [prop]gap[/prop] spaces the toasts and the [prop]margins[/prop] hold the stack off the edges. Two providers at one alignment draw their stacks over each other, and the second warns in the console; every example on this page has a place of its own, so moving this one onto another's shows it. Piling the toasts on each other is the painter's work: each is handed its place in the stack and the measured size of every toast, and this one offsets and shrinks itself from them.",
    },
    howManyShowOnce: {
        title: "How many show at once",
        content:
            "Give [prop]limit[/prop] a number and only that many toasts are on screen. What happens to the rest is the [prop]overflow[/prop]: under dismiss_oldest the oldest are taken out of the queue so the newest show, and under hold_newest the newest wait in the queue and come on as places free, running no clock while they wait. The readout counts the queue, which this example holds itself through [prop]toasts[/prop].",
    },
    howLongToastStays: {
        title: "How long a toast stays",
        content:
            "A toast given a [prop]durationMs[/prop] dismisses itself once that time has passed, and one without waits to be dismissed. Hovering or focusing the stack holds every countdown, and so does switching to another tab; a held toast gets the rest of its time back, not a fresh start. Each toast's [prop]onShow[/prop] and [prop]onHide[/prop] run as it starts to arrive and to leave, which the readout counts.",
    },
    howToastArrivesLeaves: {
        title: "How a toast arrives and leaves",
        content:
            "The painter draws the arrival and the exit. It is handed whether its toast is arriving or leaving and how long [prop]transitionDurationMs[/prop] gives it, and the provider keeps a leaving toast on screen until that time is up, so the exit plays out. This painter zooms, slides or fades.",
    },
    toastThatPaintsItself: {
        title: "A toast that paints itself",
        content:
            "Every toast that brings no painter is drawn by the provider's [prop]renderToast[/prop], and one that brings its own [prop]renderToast[/prop] is drawn by that instead, so a toast raised anywhere can look and behave unlike its neighbors. The provider's painter is handed a dismiss for the toast it draws, and a toast's own painter closes it with the dismiss it was raised with. Here Save raises an ordinary toast, and Delete draft raises one that slides in and carries an Undo button wired to the code that raised it. A toast's painter is read once, when it arrives.",
    },
    queueHeldOutsidePage: {
        title: "A queue held outside the page",
        content:
            "Hand the provider a queue of your own as [prop]toasts[/prop], bound both ways, and it is yours: code outside any component can raise a toast by writing to it, as the sync here does, and the page can read it, as the count does. The provider still writes to it, taking out a toast whose time is up, one swiped away, and any past the limit.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Each toast reads in the direction of whatever raised it: the element focused when show was called, or the page when nothing was. Publish sits in a right-to-left box, so its toast reads right to left with nothing set in the painter, even though the stack is drawn at the end of the document, outside the box. The [prop]alignment[/prop] names a side of the screen, not of the text, so middle_left stays on the left.",
    },
    anotherShortcut: {
        title: "Another shortcut",
        content:
            "The keys that reach the stacks belong to the whole page, so they are set by an InteractionSettings wrapper rather than by a provider. Its [prop]toastHotkeys[/prop] is a pair of shortcuts, forward and back, and the providers under it answer to that pair. Providers that answer to the same pair form a group that the pair cycles through, so this example's stack is reached by F9 and Shift+F9, while F8 still takes you through the other examples. Wrappers nest: an inner one keeps what it does not set and replaces what it does. Setting [prop]toastHotkeys[/prop] to null switches the keys off for the providers under it, and the page then reaches them through ToastUtils.cycleFocus from a control of its own.",
    },
};

export const ANIMATED_NOTIFICATIONS_LABEL = "Animated notifications";

export const PROFILE_NOTIFICATIONS_LABEL = "Profile notifications";

export const NOTIFICATIONS_THEIR_OWN_KEYS_LABEL = "Notifications on their own keys";

export const LIMITED_NOTIFICATIONS_LABEL = "Limited notifications";

export const PLACEMENT_NOTIFICATIONS_LABEL = "Placement notifications";

export const PUBLISHING_NOTIFICATIONS_LABEL = "Publishing notifications";
