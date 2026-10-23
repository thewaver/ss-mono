import type { Snippet } from "svelte";

import type {
    BaseCommandPaletteProps,
    CommandPaletteActionGroupRecord,
    CommandPaletteActionRecord,
    CommandPaletteItemRecord,
    CommandPaletteOptionRenderProps,
    InteractionFlags,
    SelectGroupBoxExcludesWindowing,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types.js";
import type { SelectOptionTooltipDefs } from "../../Input/Select/Select.types.js";

export type CommandPaletteAction<T, TTooltipDefs = SelectOptionTooltipDefs> = CommandPaletteActionRecord<
    T,
    TTooltipDefs
>;

export type CommandPaletteActionGroup<T, TTooltipDefs = SelectOptionTooltipDefs> = CommandPaletteActionGroupRecord<
    T,
    TTooltipDefs
>;

export type CommandPaletteItem<T, TTooltipDefs = SelectOptionTooltipDefs> = CommandPaletteItemRecord<T, TTooltipDefs>;

export type CommandPaletteProps<T> = BaseCommandPaletteProps<T> & {
    /**
     * Whether the palette is open. Left out, the palette keeps its own, opened by `shortcut`. Bind it with
     * `bind:visibility` to drive or follow it.
     */
    visibility?: boolean;
    /**
     * What the reader has typed into the search field. The consumer narrows `actions` from it; the palette only
     * shows what it is given. It is emptied once the palette has finished closing. Bind it with `bind:query`.
     */
    query: string;
    /** Styles the search field's text against its current state. */
    computeFieldTextStyle?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /** Draws the search field. */
    renderFieldContent: Snippet<[flags: InteractionFlags<TextFieldFlags>]>;
    /** Draws the placeholder shown while the search field is empty. */
    renderFieldPlaceholder?: Snippet<[flags: InteractionFlags<TextFieldFlags>, hint: string | undefined]>;
    /** Draws whatever sits before the text, inside the search field. */
    renderFieldLeading?: Snippet<[flags: InteractionFlags<TextFieldFlags>]>;
    /** Draws whatever sits after the text, inside the search field. */
    renderFieldTrailing?: Snippet<[flags: InteractionFlags<TextFieldFlags>]>;
    /** Draws the backdrop behind the palette. The fade is handed in rather than applied. */
    renderOverlay: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /**
     * Draws the palette's body. The search field and the list of actions are handed in rather than built, so the
     * consumer decides where each goes and what surrounds them; a long list needs something that scrolls around
     * it. The fade is handed in rather than applied.
     */
    renderPanel: Snippet<
        [renderField: Snippet, renderOptions: Snippet, visibilityTarget: 0 | 1, transitionDurationMs: number]
    >;
    /**
     * Draws the marker that slides to the highlighted action — the one the pointer or the arrow keys are on —
     * behind it. It fades out while nothing is highlighted, and in a list that only draws what is on screen, while
     * the highlighted action is scrolled away.
     */
    renderHighlightFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /**
     * The actions, in the order they are shown. An entry carrying `options` becomes a group under a heading. The
     * consumer narrows them from `query`; every enabled action's `shortcut` is listened for while the palette is
     * mounted.
     */
    actions: CommandPaletteItem<T>[];
    /**
     * Draws one action. It is handed the action and its state, which carries the action's shortcut ready to be
     * written out.
     */
    renderOption: Snippet<[action: CommandPaletteAction<T>, renderProps: CommandPaletteOptionRenderProps]>;
    /** Draws one group heading. */
    renderGroupHeader?: Snippet<[group: CommandPaletteActionGroup<T>]>;
    /**
     * Draws the box a group sits in, around its heading and its actions, which are handed in to be placed inside
     * it. Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places
     * each row on its own and a group has no box there.
     */
    renderGroupBox?: Snippet<[renderContent: Snippet, group: CommandPaletteActionGroup<T>]>;
} & SelectGroupBoxExcludesWindowing;
