import type { NavigatorDirection } from "../../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { PlacementLayout, PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../../Abstracts/Placement/Placement.utils";
import type { RadioGroupEntry } from "./RadioGroup.context.types";
import type { RadioGroupFloaterBounds } from "./RadioGroup.types";

/** A placement's position is its center, so the box starts half its size back from it. */
const HALF = 0.5;

/** A placement with no angle is drawn upright. */
const NO_ANGLE = 0;

/** What `indexOf` answers for an entry that is not in the list. */
const MISSING_ENTRY = -1;

/** Where the walk starts when no radio is focused and none holds the tab stop. */
const FIRST_POSITION = 0;

/**
 * The part of a radio group that is not about drawing it: the order its radios are in, which of them the arrows
 * walk, which one holds the group's single tab stop, where an arrow key goes, and where the marker behind the picked
 * radio sits.
 *
 * A group takes its radios as children rather than as a list of records, so each radio registers an entry with the
 * group and everything here works over those entries.
 */
export namespace RadioGroupUtils {
    /**
     * Warns that a radio found no group around it.
     *
     * A radio outside a group can neither read nor write a selection, and the walk, the mutual exclusion and the
     * single tab stop are all inert, which looks like a working radio until it is pressed. This says so once, where
     * the radio is made.
     *
     * @param hasGroup Whether a group was found.
     */
    export const warnIfOrphaned = (hasGroup: boolean) => {
        if (hasGroup) return;

        console.warn(
            "Radio: no RadioGroup ancestor found — the radio cannot read or write a selection, and mutual exclusion, arrow-key navigation and the group's single tab stop are all inert.",
        );
    };

    /**
     * The entries in the order their radios appear in the document.
     *
     * Registration order is whatever order the radios were made in, which a list rendered conditionally or reordered
     * does not keep; the document order is what a reader walks. It can only be read once every radio has an element,
     * so until then the registration order stands.
     *
     * @param entries The entries, in the order they registered.
     * @returns A new list in document order, or `entries` itself while any radio has no element yet.
     */
    export const orderEntries = (entries: RadioGroupEntry[]) => {
        if (entries.some((entry) => entry.getElementRef() === undefined)) return entries;

        return [...entries].sort((a, b) =>
            a.getElementRef()!.compareDocumentPosition(b.getElementRef()!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
    };

    /**
     * The entries the arrow keys walk.
     *
     * A disabled radio is left out unless it asked to stay reachable, so the walk steps over it rather than landing
     * on something that cannot be picked and says nothing about why.
     *
     * @param ordered The entries in document order, from {@link orderEntries}.
     * @returns The walkable entries, in the same order.
     */
    export const computeNavigableEntries = (ordered: RadioGroupEntry[]) =>
        ordered.filter((entry) => !entry.getIsDisabled() || entry.getIsReachable());

    /**
     * Which radio holds the group's single tab stop.
     *
     * The picked radio does, so tabbing into the group lands on the choice already made; failing that, the first
     * walkable radio.
     *
     * @param navigable The walkable entries, from {@link computeNavigableEntries}.
     * @param value The group's value, compared with each radio's by identity.
     * @returns The entry to make tabbable, or `undefined` when no radio can take focus at all — which is what drops
     * the group out of the tab order.
     */
    export const computeRovingEntry = (navigable: RadioGroupEntry[], value: unknown) =>
        navigable.find((entry) => entry.getValue() === value) ?? navigable[0];

    /**
     * Which radio is picked.
     *
     * @param ordered The entries in document order.
     * @param value The group's value, compared with each radio's by identity.
     * @returns The picked entry, disabled or not, or `undefined` when no radio carries the value.
     */
    export const computeSelectedEntry = (ordered: RadioGroupEntry[], value: unknown) =>
        ordered.find((entry) => entry.getValue() === value);

    /**
     * Where a layout put one radio.
     *
     * A layout places items by their position in the run, and a radio's position is its place in document order.
     *
     * @param ordered The entries in document order.
     * @param layout The group's layout, if it has one.
     * @param entry The radio asking.
     * @returns Its placement, or `undefined` when the group is a plain row or column, or when the radio has not
     * registered.
     */
    export const computePlacement = (
        ordered: RadioGroupEntry[],
        layout: PlacementLayout | undefined,
        entry: RadioGroupEntry,
    ): PlacementRect | undefined => {
        const index = ordered.indexOf(entry);

        return index === MISSING_ENTRY ? undefined : layout?.placements[index];
    };

    /**
     * Where an arrow, Home or End key sends focus.
     *
     * The walk runs over the walkable radios only, answers both pairs of arrows and wraps at both ends. It starts
     * from the radio that has focus, or from the one holding the tab stop when focus is elsewhere. Only a plain row
     * or column turns with the text direction: a laid-out group has no reading order to follow. The caller moves
     * focus to the answer, and picks it unless it is disabled, so a reachable disabled radio can be landed on
     * without being chosen.
     *
     * @param key The `key` of the keyboard event.
     * @param navigable The walkable entries.
     * @param opts.focusedElement The element that has focus.
     * @param opts.rovingEntry The entry holding the tab stop, from {@link computeRovingEntry}.
     * @param opts.direction Which way text runs at the group, or `undefined` for a laid-out group.
     * @returns The entry to move to, or `undefined` when the key means nothing here — which the caller should leave
     * to the browser rather than prevent.
     */
    export const computeKeyTarget = (
        key: string,
        navigable: RadioGroupEntry[],
        opts: {
            focusedElement: Element | null;
            rovingEntry: RadioGroupEntry | undefined;
            direction: NavigatorDirection | undefined;
        },
    ) => {
        if (navigable.length < 1) return undefined;

        const focused = navigable.find((entry) => entry.getElementRef() === opts.focusedElement);
        const from = focused ?? opts.rovingEntry;
        const position = NavigatorUtils.computeNextPosition(
            key,
            from ? navigable.indexOf(from) : FIRST_POSITION,
            navigable.length,
            { orientation: "both", direction: opts.direction },
        );

        return position === undefined ? undefined : navigable[position];
    };

    /**
     * Where the marker's box goes for a radio a layout placed.
     *
     * @param placement The placement the layout gave the picked radio.
     * @returns The box, in shares of the group's width so it scales with it, turned the way the radio was.
     */
    export const computePlacedBounds = (placement: PlacementRect): RadioGroupFloaterBounds => ({
        top: PlacementUtils.toContainerWidth(placement.topShare - placement.heightShare * HALF),
        left: PlacementUtils.toContainerWidth(placement.leftShare - placement.widthShare * HALF),
        width: PlacementUtils.toContainerWidth(placement.widthShare),
        height: PlacementUtils.toContainerWidth(placement.heightShare),
        transform: `rotate(${placement.angle ?? NO_ANGLE}deg)`,
    });

    /**
     * Where the marker's box goes, whichever kind of group it is.
     *
     * A laid-out group computes the box from the picked radio's placement; a plain row or column measures it, and
     * the measurement is handed in.
     *
     * @param layout The group's layout, if it has one.
     * @param measuredBounds The last measurement, for a group with no layout.
     * @param placement The picked radio's placement, from {@link computePlacement}.
     * @returns The box, or `undefined` when there is nothing to put it round yet.
     */
    export const computeFloaterBounds = (
        layout: PlacementLayout | undefined,
        measuredBounds: RadioGroupFloaterBounds | undefined,
        placement: PlacementRect | undefined,
    ) => {
        if (layout === undefined) return measuredBounds;
        if (placement === undefined) return undefined;

        return computePlacedBounds(placement);
    };

    /**
     * Where the marker's box goes, and keeps going, for a group laid out as a plain row or column.
     *
     * The box is the one around the picked radio, measured against the group, and it is measured again whenever
     * either of the two changes size — so a label that grows, or a group that is squeezed, carries the marker with
     * it. The first reading arrives as soon as observing starts. `Tabs` measures its marker the same way, copied
     * rather than shared while there are two of them.
     *
     * @param root The group itself.
     * @param item The picked radio's element. Its offset parent, the box the radio is wrapped in, is what is
     * measured.
     * @param onBounds Called with each reading.
     * @returns The function that stops measuring. Nothing is measured, and stopping does nothing, when the radio has
     * no box around it yet.
     */
    export const observeSelectedBounds = (
        root: HTMLElement,
        item: HTMLElement,
        onBounds: (bounds: RadioGroupFloaterBounds) => void,
    ) => {
        const wrapper = item.offsetParent as HTMLElement | null;

        if (!wrapper) return () => {};

        const observer = new ResizeObserver(() => {
            onBounds({
                top: `${wrapper.offsetTop}px`,
                left: `${wrapper.offsetLeft}px`,
                width: `${wrapper.offsetWidth}px`,
                height: `${wrapper.offsetHeight}px`,
            });
        });

        observer.observe(root);
        observer.observe(wrapper);

        return () => observer.disconnect();
    };
}
