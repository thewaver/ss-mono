import type { Accessor, JSX } from "solid-js";

import type {
    AnchorPlacement,
    BaseTextInputCbs,
    BaseTextInputValues,
    InteractionFlags,
    SelectOptionFlags,
} from "@thewaver/ss-components";

import type { TextFieldPresetProps } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorValues } from "../../../Utils/typeUtils";

export type TextInputSuggestionProps<T> =
    | {
          suggestions?: undefined;
          suggestionsAriaLabel?: undefined;
          renderSuggestion?: undefined;
          renderSuggestionPopup?: undefined;
          computeCustomSuggestionText?: undefined;
          onSuggestionPick?: undefined;
      }
    | (AccessorValues<BaseTextInputValues<T>> &
          BaseTextInputCbs<T> & {
              /** Draws one suggestion. `isHighlighted` is where the arrows are; `isSelected` is never set. */
              renderSuggestion: (
                  getSuggestion: Accessor<T>,
                  getFlags: () => InteractionFlags<SelectOptionFlags>,
              ) => JSX.Element;
              /**
               * Draws the surface the suggestions sit on. The suggestions are handed in rather than built, so the
               * consumer decides what surrounds them.
               */
              renderSuggestionPopup: (
                  renderSuggestions: () => JSX.Element,
                  getVisibilityTarget: () => 0 | 1,
                  getTransitionDurationMs: () => number,
                  getPlacement: () => AnchorPlacement,
              ) => JSX.Element;
          });

export type TextInputProps<T = string> = TextFieldPresetProps & TextInputSuggestionProps<T>;
