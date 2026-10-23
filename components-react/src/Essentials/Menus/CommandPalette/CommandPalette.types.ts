import type { ReactNode } from "react";

import type {
    BaseCommandPaletteCbs,
    BaseCommandPaletteValues,
    CommandPaletteActionGroupRecord,
    CommandPaletteActionRecord,
    CommandPaletteItemRecord,
    CommandPaletteOptionRenderProps,
    InteractionFlags,
    SelectGroupBoxExcludesWindowing,
    SelectOptionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components";

import type { InteractionTooltipDefs } from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";

export type CommandPaletteAction<
    T,
    TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>,
> = CommandPaletteActionRecord<T, TTooltipDefs>;

export type CommandPaletteActionGroup<
    T,
    TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>,
> = CommandPaletteActionGroupRecord<T, TTooltipDefs>;

export type CommandPaletteItem<T, TTooltipDefs = InteractionTooltipDefs<SelectOptionFlags>> = CommandPaletteItemRecord<
    T,
    TTooltipDefs
>;

export type CommandPaletteProps<T> = BaseCommandPaletteValues &
    BaseCommandPaletteCbs<T> & {
        /**
         * Whether the palette is open, with its setter. Left out, the palette keeps its own, opened by `shortcut`.
         */
        visibility?: readonly [boolean, (isOpen: boolean) => void];
        /**
         * What the reader has typed into the search field, with its setter. The consumer narrows `actions` from it;
         * the palette only shows what it is given. It is emptied once the palette has finished closing.
         */
        query: readonly [string, (query: string) => void];
        /** Styles the search field's text against its current state. */
        computeFieldTextStyle?: (flags: InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
        /** Draws the search field. */
        renderFieldContent: (flags: InteractionFlags<TextFieldFlags>) => ReactNode;
        /** Draws the placeholder shown while the search field is empty. */
        renderFieldPlaceholder?: (flags: InteractionFlags<TextFieldFlags>, hint: string | undefined) => ReactNode;
        /** Draws whatever sits before the text, inside the search field. */
        renderFieldLeading?: (flags: InteractionFlags<TextFieldFlags>) => ReactNode;
        /** Draws whatever sits after the text, inside the search field. */
        renderFieldTrailing?: (flags: InteractionFlags<TextFieldFlags>) => ReactNode;
        /** Draws the backdrop behind the palette. The fade is handed in rather than applied. */
        renderOverlay: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
        /**
         * Draws the palette's body. The search field and the list of actions are handed in rather than built, so the
         * consumer decides where each goes and what surrounds them; a long list needs something that scrolls around
         * it. The fade is handed in rather than applied.
         */
        renderPanel: (
            renderField: () => ReactNode,
            renderOptions: () => ReactNode,
            visibilityTarget: 0 | 1,
            transitionDurationMs: number,
        ) => ReactNode;
        /**
         * Draws the marker that slides to the highlighted action — the one the pointer or the arrow keys are on —
         * behind it. It fades out while nothing is highlighted, and in a list that only draws what is on screen, while
         * the highlighted action is scrolled away.
         */
        renderHighlightFloater?: (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;
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
        renderOption: (action: CommandPaletteAction<T>, renderProps: CommandPaletteOptionRenderProps) => ReactNode;
        /** Draws one group heading. */
        renderGroupHeader?: (group: CommandPaletteActionGroup<T>) => ReactNode;
        /**
         * Draws the box a group sits in, around its heading and its actions, which are handed in to be placed inside
         * it. Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places
         * each row on its own and a group has no box there.
         */
        renderGroupBox?: (renderContent: () => ReactNode, group: CommandPaletteActionGroup<T>) => ReactNode;
    } & SelectGroupBoxExcludesWindowing;
