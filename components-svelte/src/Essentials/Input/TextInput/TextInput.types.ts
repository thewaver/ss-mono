import type { Snippet } from "svelte";

import type { AnchorPlacement, BaseTextInputProps, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types.js";

export type TextInputSuggestionProps<T> =
    | {
          suggestions?: undefined;
          suggestionsAriaLabel?: undefined;
          renderSuggestion?: undefined;
          renderSuggestionPopup?: undefined;
          computeCustomSuggestionText?: undefined;
          onSuggestionPick?: undefined;
      }
    | (BaseTextInputProps<T> & {
          /** Draws one suggestion. `isHighlighted` is where the arrows are; `isSelected` is never set. */
          renderSuggestion: Snippet<[suggestion: T, flags: InteractionFlags<SelectOptionFlags>]>;
          /**
           * Draws the surface the suggestions sit on. The suggestions are handed in rather than built, so the consumer
           * decides what surrounds them.
           */
          renderSuggestionPopup: Snippet<
              [
                  renderSuggestions: Snippet,
                  visibilityTarget: 0 | 1,
                  transitionDurationMs: number,
                  placement: AnchorPlacement,
              ]
          >;
      });

export type TextInputProps<T = string> = TextFieldPresetProps & TextInputSuggestionProps<T>;
