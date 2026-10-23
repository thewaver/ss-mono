import type { Accessor, JSX } from "solid-js";

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

import type { InteractionTooltipDefs } from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

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

export type CommandPaletteProps<T> = AccessorValues<BaseCommandPaletteValues> &
    BaseCommandPaletteCbs<T> &
    AccessorProps<{
        /** Whether the palette is open. Left out, the palette keeps its own, opened by `shortcut`. */
        visibility?: SignalSource<boolean>;
        /**
         * What the reader has typed into the search field. The consumer narrows `actions` from it; the palette only
         * shows what it is given. It is emptied once the palette has finished closing.
         */
        query: SignalSource<string>;
        /** Styles the search field's text against its current state. */
        computeFieldTextStyle?: (getFlags: () => InteractionFlags<TextFieldFlags>) => TextFieldTextStyle;
        /** Draws the search field. */
        renderFieldContent: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
        /** Draws the placeholder shown while the search field is empty. */
        renderFieldPlaceholder?: (
            getFlags: () => InteractionFlags<TextFieldFlags>,
            hint: string | undefined,
        ) => JSX.Element;
        /** Draws whatever sits before the text, inside the search field. */
        renderFieldLeading?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
        /** Draws whatever sits after the text, inside the search field. */
        renderFieldTrailing?: (getFlags: () => InteractionFlags<TextFieldFlags>) => JSX.Element;
        /** Draws the backdrop behind the palette. The fade is handed in rather than applied. */
        renderOverlay: (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => JSX.Element;
        /**
         * Draws the palette's body. The search field and the list of actions are handed in rather than built, so the
         * consumer decides where each goes and what surrounds them; a long list needs something that scrolls around
         * it. The fade is handed in rather than applied.
         */
        renderPanel: (
            renderField: () => JSX.Element,
            renderOptions: () => JSX.Element,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
        /**
         * Draws the marker that slides to the highlighted action — the one the pointer or the arrow keys are on —
         * behind it. It fades out while nothing is highlighted, and in a list that only draws what is on screen, while
         * the highlighted action is scrolled away.
         */
        renderHighlightFloater?: (
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }> & {
        /**
         * The actions, in the order they are shown. An entry carrying `options` becomes a group under a heading. The
         * consumer narrows them from `query`; every enabled action's `shortcut` is listened for while the palette is
         * mounted.
         */
        actions: MaybeAccessor<CommandPaletteItem<T>[]>;
        /**
         * Draws one action. It is handed the action and its state, which carries the action's shortcut ready to be
         * written out.
         */
        renderOption: (
            getAction: Accessor<CommandPaletteAction<T>>,
            getRenderProps: () => CommandPaletteOptionRenderProps,
        ) => JSX.Element;
        /** Draws one group heading. */
        renderGroupHeader?: (getGroup: Accessor<CommandPaletteActionGroup<T>>) => JSX.Element;
        /**
         * Draws the box a group sits in, around its heading and its actions, which are handed in to be placed inside
         * it. Refused alongside `computeEstimatedOptionHeight`, since a list that only draws what is on screen places
         * each row on its own and a group has no box there.
         */
        renderGroupBox?: (
            renderContent: () => JSX.Element,
            getGroup: Accessor<CommandPaletteActionGroup<T>>,
        ) => JSX.Element;
    } & SelectGroupBoxExcludesWindowing;
