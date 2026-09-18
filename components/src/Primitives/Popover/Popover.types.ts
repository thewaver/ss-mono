import type { JSX } from "solid-js";

import { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../Abstracts/Anchor/Anchor.types";
import type { DismisserReason } from "../../Abstracts/Dismisser/Dismisser.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type PopoverRole = "listbox" | "menu" | "dialog";

export type PopoverProps = AccessorProps<{
    /**
     * Identifies the popup, so a trigger can point at it with aria-controls and the dismisser can tell the two apart.
     */
    id: string;
    /**
     * What the popup is announced as — a listbox, a menu, a dialog — which is usually what decides the keyboard
     * contract a consumer has to honour.
     */
    role: PopoverRole;
    /** ARIA attributes for the popup element, for the parts of the contract the role alone does not carry. */
    ariaAttributes?: JSX.AriaAttributes;
    /**
     * Where the popup sits against its anchor, as one choice across and one down. A placement that will not fit falls
     * back within its own family.
     */
    placement?: AnchorPlacement;
    /** How far the popup is held clear of its anchor, in pixels. */
    offset?: Point2d;
    /** Screen room to stay out of, for a consumer with a fixed header or sidebar the popup must not slide under. */
    reservedScreenSize?: Size2d;
    /**
     * How long the popup takes to fade in and out. It stays mounted for the whole fade, so a consumer relying on it
     * being gone should wait for the transition to report finished.
     */
    transitionDurationMs?: number;
    /**
     * Holds the popup at least as wide as its anchor, which is what keeps a dropdown from being narrower than the field
     * it belongs to.
     */
    hasAnchorMinWidth?: boolean;
    /**
     * Moves focus into the popup when it opens. Leave it off for a popup the reader should be able to ignore, such as a
     * list that only suggests.
     */
    hasAutoFocus?: boolean;
    /**
     * Lets the pointer through to whatever is underneath, for a popup that is shown but not meant to be interacted
     * with.
     */
    isTransparentToPointer?: boolean;
    /**
     * Freezes the popup where it first opened instead of following its anchor. Use it when the anchor moves for reasons
     * the popup should not chase.
     */
    isPinned?: boolean;
    /** Treats the popup as sitting under something else, so it gives up its claim on the top of the stack. */
    isCovered?: boolean;
    /**
     * Whether the popup is open. It is the only thing that opens or closes it; the popup never decides that for itself.
     */
    isOpen: boolean;
    /** The element the popup is positioned against and watches for movement. */
    anchorRef: HTMLElement | undefined;
    /**
     * Runs on a key pressed inside the popup, for a consumer adding a keyboard contract the role does not already
     * imply.
     */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Runs when focus leaves the popup. */
    onBlur?: (e: FocusEvent) => void;
    /**
     * Runs when the popup is dismissed from outside — a press elsewhere, focus leaving, or Escape — and is told which
     * of the three it was, since a consumer usually returns focus to the trigger after Escape but not after a press.
     */
    onDismiss?: (reason: DismisserReason) => void;
    /**
     * Runs when the fade starts and again when it finishes, for a consumer that has to wait for the popup to be really
     * gone before doing something else.
     */
    onTransitionStatusChange?: (hasTransitionFinished: boolean) => void;
    /**
     * Draws the popup body. The fade is handed in rather than applied, so the consumer decides what fading looks like.
     */
    renderContent: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
    ) => JSX.Element;
}> & {
    /**
     * A rectangle to position against instead of the anchor's own, for a popup that should sit against part of its
     * anchor rather than all of it.
     */
    anchorRect?: MaybeAccessor<Rect | undefined>;
};
