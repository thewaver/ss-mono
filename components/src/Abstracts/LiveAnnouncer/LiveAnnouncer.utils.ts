import type { LiveAnnouncerPoliteness } from "./LiveAnnouncer.types";

/** How long a message stays in the document. Long enough to be read out, short enough that the region does not accumulate. */
const MESSAGE_LIFETIME_MS = 1000;
/** Every level, for tearing all the regions down at once. */
const POLITENESS: LiveAnnouncerPoliteness[] = ["polite", "assertive"];

/** One region per politeness level, reused across announcements. */
const regions = new Map<LiveAnnouncerPoliteness, HTMLElement>();

/**
 * Hides an element from sight while leaving it readable to a screen reader.
 *
 * `display: none` and `visibility: hidden` both take an element out of the accessibility tree,
 * which is exactly what must not happen here. So the region is clipped to nothing instead, which
 * keeps it present.
 */
const applyHiddenStyle = (element: HTMLElement) => {
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.width = "1px";
    element.style.height = "1px";
    element.style.margin = "-1px";
    element.style.padding = "0";
    element.style.overflow = "hidden";
    element.style.clipPath = "inset(50%)";
    element.style.whiteSpace = "nowrap";
    element.style.border = "0";
};

/**
 * The live region for a politeness level, created on first use.
 *
 * The connectedness check matters: a region can be removed by a framework's own cleanup, and a
 * detached region announces nothing, so it is rebuilt rather than reused.
 */
const getRegion = (politeness: LiveAnnouncerPoliteness) => {
    const existing = regions.get(politeness);

    if (existing?.isConnected) return existing;

    const region = document.createElement("div");

    region.setAttribute("role", "log");
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-relevant", "additions");
    applyHiddenStyle(region);
    document.body.appendChild(region);
    regions.set(politeness, region);

    return region;
};

/**
 * Says something out loud to a screen reader.
 *
 * A change a sighted user sees — a row moving, a filter narrowing a list, a toast appearing —
 * reaches a screen reader only if something announces it. Messages go into a shared hidden live
 * region and are removed shortly afterwards, so the region does not grow without bound and a user
 * navigating into it does not find a transcript of the session.
 */
export namespace LiveAnnouncerUtils {
    /**
     * Creates the live region ahead of time, without saying anything.
     *
     * A region added to the document and written to in the same moment is sometimes missed, because
     * assistive technology announces changes to regions it already knows about. Calling this when a
     * component mounts means the first real announcement is heard.
     *
     * @param politeness Which region to create.
     */
    export const reserve = (politeness: LiveAnnouncerPoliteness = "polite") => {
        getRegion(politeness);
    };

    /**
     * Says a message.
     *
     * @param message What to say. An empty string is ignored, so a caller need not guard against one.
     * @param politeness `"polite"` waits for a gap in whatever is being read; `"assertive"` interrupts.
     * Assertive is for things the user must hear immediately — an error, a cancellation — and is
     * otherwise rude.
     */
    export const announce = (message: string, politeness: LiveAnnouncerPoliteness = "polite") => {
        if (!message) return;

        const node = document.createElement("div");

        node.textContent = message;
        getRegion(politeness).appendChild(node);

        setTimeout(() => {
            node.remove();
        }, MESSAGE_LIFETIME_MS);
    };

    /**
     * Removes the live regions from the document.
     *
     * For tests, which would otherwise leak regions between cases. Announcing afterwards works
     * normally, since the regions are rebuilt on demand.
     */
    export const clear = () => {
        for (const politeness of POLITENESS) {
            regions.get(politeness)?.remove();
            regions.delete(politeness);
        }
    };
}
