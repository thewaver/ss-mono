import type { VNodeChild } from "vue";

import type {
    BaseCommandPaletteProps,
    CommandPaletteActionGroupRecord,
    CommandPaletteActionRecord,
    CommandPaletteItemRecord,
    CommandPaletteOptionRenderProps,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";
import type { SelectOptionTooltipDefs } from "../../Input/Select/Select.types";

export type CommandPaletteAction<T> = CommandPaletteActionRecord<T, SelectOptionTooltipDefs>;

export type CommandPaletteActionGroup<T> = CommandPaletteActionGroupRecord<T, SelectOptionTooltipDefs>;

export type CommandPaletteItem<T> = CommandPaletteItemRecord<T, SelectOptionTooltipDefs>;

export type CommandPaletteProps<T> = BaseCommandPaletteProps<T> & {
    /** Whether the palette is open. Left out, the palette keeps its own, opened by `shortcut`. */
    "visibility"?: boolean;
    /** Receives whether the palette is open as it opens and closes, which is what `v-model:visibility` binds. */
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    /**
     * What the reader has typed into the search field. The consumer narrows `actions` from it; the palette only
     * shows what it is given. It is emptied once the palette has finished closing.
     */
    "query": string;
    /** Receives what the reader types, which is what `v-model:query` binds. */
    "onUpdate:query"?: (query: string) => void;
    /** Styles the search field's text against its current state. */
    "computeFieldTextStyle"?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
    /**
     * The actions, in the order they are shown. An entry carrying `options` becomes a group under a heading. The
     * consumer narrows them from `query`; every enabled action's `shortcut` is listened for while the palette is
     * mounted.
     */
    "actions": CommandPaletteItem<T>[];
};

export type CommandPaletteSlots<T> = {
    /** Draws the search field. */
    renderFieldContent: (flags: InteractionFlags<TextFieldFlags>) => VNodeChild;
    /** Draws the placeholder shown while the search field is empty. */
    renderFieldPlaceholder?: (props: {
        flags: InteractionFlags<TextFieldFlags>;
        hint: string | undefined;
    }) => VNodeChild;
    /** Draws whatever sits before the text, inside the search field. */
    renderFieldLeading?: (flags: InteractionFlags<TextFieldFlags>) => VNodeChild;
    /** Draws whatever sits after the text, inside the search field. */
    renderFieldTrailing?: (flags: InteractionFlags<TextFieldFlags>) => VNodeChild;
    /** Draws the backdrop behind the palette. The fade is handed in rather than applied. */
    renderOverlay: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws the palette's body. The search field and the list of actions are handed in rather than built, so the
     * consumer decides where each goes and what surrounds them; a long list needs something that scrolls around
     * it. The fade is handed in rather than applied. `renderField` and `renderOptions` draw them, from a template as
     * `<component :is="renderField" />`.
     */
    renderPanel: (props: {
        renderField: () => VNodeChild;
        renderOptions: () => VNodeChild;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
    }) => VNodeChild;
    /**
     * Draws the marker that slides to the highlighted action — the one the pointer or the arrow keys are on —
     * behind it. It fades out while nothing is highlighted, and in a list that only draws what is on screen, while
     * the highlighted action is scrolled away.
     */
    renderHighlightFloater?: (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;
    /**
     * Draws one action. It is handed the action and its state, which carries the action's shortcut ready to be
     * written out.
     */
    renderOption: (props: {
        action: CommandPaletteAction<T>;
        renderProps: CommandPaletteOptionRenderProps;
    }) => VNodeChild;
    /** Draws one group heading. */
    renderGroupHeader?: (props: { group: CommandPaletteActionGroup<T> }) => VNodeChild;
    /**
     * Draws the box a group sits in, around its heading and its actions, which are handed in to be placed inside
     * it. Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places
     * each row on its own and a group has no box there. `renderContent` draws them, from a template as
     * `<component :is="renderContent" />`.
     */
    renderGroupBox?: (props: { renderContent: () => VNodeChild; group: CommandPaletteActionGroup<T> }) => VNodeChild;
};
