import type { TableOfContentsLink } from "./TableOfContents.types";

/** The attribute that makes a heading focusable without putting it in the tab order. */
const TAB_INDEX_ATTRIBUTE = "tabindex";

/** A `tabindex` that allows focus from script and from a link, but not from tabbing. */
const PROGRAMMATIC_TAB_INDEX = "-1";

/** What the reader does to move about a page of their own accord: a wheel, a touch, a key, a press. */
const READER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * The part of a table of contents that is not about drawing it: which section is current, and taking the reader to
 * one.
 */
export namespace TableOfContentsUtils {
    /**
     * The value of the section being read.
     *
     * @param links The links, in reading order.
     * @param currentIndex Which link's target has most recently scrolled past the line, if any has.
     * @returns That link's value, or `undefined` while the reader is above the first section.
     */
    export const computeCurrentValue = <T>(links: TableOfContentsLink<T>[], currentIndex: number | undefined) =>
        currentIndex === undefined ? undefined : links[currentIndex]?.value;

    /**
     * Makes each target able to take focus, so pressing its link can move focus onto it, until the returned function
     * is called.
     *
     * A heading cannot take focus by default, so pressing a link would scroll the page and leave focus on the link —
     * and the next Tab would carry on through the table of contents rather than into the section. Each target that
     * cannot already be focused is given a `tabindex` of `-1`, which lets it take focus without joining the tab order.
     * A target that already carries a `tabindex` of its own, or is focusable by nature, is left as it is.
     *
     * @param targets The targets, with a missing one skipped.
     * @returns The function that takes back every `tabindex` this added, and only those.
     */
    export const makeTargetsFocusable = (targets: Array<HTMLElement | undefined>) => {
        const added: HTMLElement[] = [];

        for (const target of targets) {
            if (!target || target.hasAttribute(TAB_INDEX_ATTRIBUTE) || target.tabIndex >= 0) continue;

            target.setAttribute(TAB_INDEX_ATTRIBUTE, PROGRAMMATIC_TAB_INDEX);
            added.push(target);
        }

        return () => {
            for (const target of added) target.removeAttribute(TAB_INDEX_ATTRIBUTE);
        };
    };

    /**
     * Takes the reader to a link's section: its target is scrolled to the top of the view and given focus.
     *
     * Focus is moved without a second scroll, so the target lands where the first one put it.
     *
     * @param target The element the link leads to.
     */
    export const goToTarget = (target: HTMLElement) => {
        target.scrollIntoView({ block: "start" });
        target.focus({ preventScroll: true });
    };

    /**
     * Calls `onInput` the first time the reader turns a wheel, touches the screen, presses a key or presses a pointer
     * anywhere in the document, then stops listening.
     *
     * A pressed link stays current until this fires. Scrolling to a section near the end of a page can stop short of
     * putting its heading at the top, and then the line that decides the current section would land on a later one;
     * the reader asked for this section, so it keeps the mark until they do something else. The scroll the press
     * itself causes is not reader input, so it does not end the hold, and neither does a scroll made from script.
     * Pressing another link ends it before that link's own press takes it over. Listening is in the capture phase,
     * so nothing the page does with these events can hide them.
     *
     * @param onInput Called once, on the first input.
     * @returns The function that stops listening without calling `onInput`.
     */
    export const observeNextReaderInput = (onInput: () => void) => {
        const stop = () => {
            for (const type of READER_INPUT_EVENTS) document.removeEventListener(type, handleInput, true);
        };

        const handleInput = () => {
            stop();
            onInput();
        };

        for (const type of READER_INPUT_EVENTS) {
            document.addEventListener(type, handleInput, { capture: true, passive: true });
        }

        return stop;
    };
}
