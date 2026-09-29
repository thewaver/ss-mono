import type { VNodeChild } from "vue";

import type { AnchorPlacement, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

import type { TextFieldPresetProps, TextFieldSlots } from "../../../Primitives/TextField/TextField.types";

export type TextInputSuggestionProps<T> =
    | {
          suggestions?: undefined;
          suggestionsAriaLabel?: undefined;
          computeCustomSuggestionText?: undefined;
          onSuggestionPick?: undefined;
      }
    | {
          /** Names the list of suggestions for assistive technology. A listbox has to be named, so it cannot be left out. */
          suggestionsAriaLabel: string;
          /**
           * What the field suggests as the reader types. Passing it turns the field into a combobox: typing and the down
           * arrow open the list, the arrows walk it, Enter writes the highlighted suggestion's text into the field and
           * Escape closes it. The value stays whatever text is in the field, and nothing is highlighted until the reader
           * moves into the list, so Enter on typed text still means that text. The consumer narrows the list; the field
           * never decides what matches, and the list closes by itself while there is nothing to show. Give the
           * `renderSuggestion` and `renderSuggestionPopup` slots with it, since they are what draw the list.
           */
          suggestions: T[];
          /**
           * The text a picked suggestion writes into the field. Left out, it is the suggestion's text as a screen reader
           * would read it, which skips anything the painter marked `aria-hidden`.
           */
          computeCustomSuggestionText?: (suggestion: T) => string;
          /** Runs when a suggestion is picked, after its text has been written into the field. */
          onSuggestionPick?: (suggestion: T) => void;
      };

export type TextInputProps<T = string> = TextFieldPresetProps & TextInputSuggestionProps<T>;

export type TextInputSlots<T = string> = TextFieldSlots & {
    /** Draws one suggestion. `isHighlighted` is where the arrows are; `isSelected` is never set. */
    renderSuggestion?: (props: { suggestion: T; flags: InteractionFlags<SelectOptionFlags> }) => VNodeChild;
    /**
     * Draws the surface the suggestions sit on. The suggestions are handed in rather than built, so the consumer
     * decides what surrounds them: `renderSuggestions` draws them, from a template as
     * `<component :is="renderSuggestions" />`.
     */
    renderSuggestionPopup?: (props: {
        renderSuggestions: () => VNodeChild;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
    }) => VNodeChild;
};
