import type { VNodeChild } from "vue";

import type { AnchorPlacement, BaseTextInputProps, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

import type { TextFieldPresetProps, TextFieldSlots } from "../../../Primitives/TextField/TextField.types";

export type TextInputSuggestionProps<T> =
    | {
          suggestions?: undefined;
          suggestionsAriaLabel?: undefined;
          computeCustomSuggestionText?: undefined;
          onSuggestionPick?: undefined;
      }
    | BaseTextInputProps<T>;

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
