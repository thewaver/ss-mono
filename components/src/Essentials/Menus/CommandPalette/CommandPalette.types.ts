import type { CSSMargin, CSSPadding } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { ResolvedShortcut, Shortcut } from "../../../Abstracts/Shortcut/Shortcut.types";
import type { SelectOptionFlags, SelectOptionGroupRecord, SelectOptionRecord } from "../../Input/Select/Select.types";
import type { ModalAlignment } from "../../Overlays/Modal/Modal.types";

export type CommandPaletteActionRecord<T, TTooltipDefs = unknown> = SelectOptionRecord<T, TTooltipDefs> & {
    /**
     * Runs the action from anywhere on the page while the palette is mounted, open or not, and is handed to the
     * option's painter to draw. A disabled action's shortcut does nothing.
     */
    shortcut?: Shortcut;
};

export type CommandPaletteActionGroupRecord<T, TTooltipDefs = unknown> = Omit<
    SelectOptionGroupRecord<T, TTooltipDefs>,
    "options"
> & {
    /** The actions under the group's heading, in the order they are shown. */
    options: CommandPaletteActionRecord<T, TTooltipDefs>[];
};

export type CommandPaletteItemRecord<T, TTooltipDefs = unknown> =
    CommandPaletteActionRecord<T, TTooltipDefs> | CommandPaletteActionGroupRecord<T, TTooltipDefs>;

export type CommandPaletteOptionRenderProps = InteractionFlags<SelectOptionFlags> & {
    /**
     * The action's shortcut with `"mod"` turned into the key it is on this platform and the modifiers in a fixed
     * order, ready to be written out. `undefined` for an action with none.
     */
    shortcut: ResolvedShortcut | undefined;
};

export type BaseCommandPaletteValues = {
    /** Identifies the search field. Left out, one is generated. */
    id?: string;
    /** Names the dialog for assistive technology. A dialog has to be named, so this cannot be left out. */
    ariaLabel: string;
    /** Names the search field for assistive technology. A combobox has to be named, so this cannot be left out. */
    fieldAriaLabel: string;
    /** Names the list of actions for assistive technology. A listbox has to be named, so this cannot be left out. */
    listAriaLabel: string;
    /**
     * The shortcut that opens the palette, from anywhere on the page while nothing else is open over it. Like every
     * action's own shortcut, it is listened for while the palette is mounted, open or not, and stays quiet while the
     * palette or any other dialog is open on top of the page it was mounted in.
     */
    shortcut?: Shortcut;
    /** Where the palette sits on the screen. */
    alignment?: ModalAlignment;
    /** How far the palette is held off the edges of the screen. */
    margins?: CSSMargin;
    /** Whether clicking the backdrop closes the palette. Escape always does. */
    isDismissableOnOverlayClick?: boolean;
    /** How long the palette and its backdrop take to fade in and out. */
    transitionDurationMs?: number;
    /** How much room is left inside the search field, around its text. */
    fieldPadding?: CSSPadding | number;
    /** The space between the search field's text and whatever sits before or after it. */
    fieldGap?: number;
    /** Whether there are more actions to come, so the list can say so rather than looking finished. */
    hasMoreOptions?: boolean;
    /** How long the highlight's marker takes to slide from one action to the next, and to fade. */
    floaterTransitionDurationMs?: number;
};

export type BaseCommandPaletteCbs<T> = {
    /**
     * Runs when an action is picked from the list, or when its own shortcut is pressed. A pick from the list closes
     * the palette.
     */
    onActivate: (value: T) => void;
    /** Runs when the reader reaches the end of the list, for a consumer fetching more actions as they scroll. */
    onReachEnd?: () => void;
    /**
     * Guesses how tall an action will be before it is drawn, which is what lets a long list render only what is on
     * screen. The list has to sit inside something that scrolls.
     */
    computeEstimatedOptionHeight?: (index: number) => number;
    /** Guesses how tall a group heading will be before it is drawn, for the same reason. */
    computeEstimatedGroupHeight?: (index: number) => number;
};

export type BaseCommandPaletteProps<T> = BaseCommandPaletteValues & BaseCommandPaletteCbs<T>;
