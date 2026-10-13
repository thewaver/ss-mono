import type { ReactNode } from "react";

import type { AnchorPlacement, BaseTextInputProps, InteractionFlags, SelectOptionFlags } from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextField.types";

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
          renderSuggestion: (suggestion: T, flags: InteractionFlags<SelectOptionFlags>) => ReactNode;
          /**
           * Draws the surface the suggestions sit on. The suggestions are handed in rather than built, so the consumer
           * decides what surrounds them.
           */
          renderSuggestionPopup: (
              renderSuggestions: () => ReactNode,
              visibilityTarget: 0 | 1,
              transitionDurationMs: number,
              placement: AnchorPlacement,
          ) => ReactNode;
      });

export type TextInputProps<T = string> = TextFieldPresetProps & TextInputSuggestionProps<T>;
