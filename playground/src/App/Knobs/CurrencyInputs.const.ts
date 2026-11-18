export namespace CurrencyInputKnobs {
    export const LOCALES = ["en-GB", "en-US", "de-DE", "fr-FR", "ja-JP", "en-IN"];
    export const DECIMALS = [0, 2, 3];
    export const GROUPINGS: (number[] | undefined)[] = [undefined, [3], [4], [3, 2]];

    export const STARTING_LOCALE = "en-GB";
    export const STARTING_HAS_SIGN = false;
    export const MIN_MAX = 100;
    export const MAX_MAX = 100_000;
    export const MAX_STEP = 100;

    export const IS_READ_ONLY_TEXT = {
        label: "Read-only",
        hint: "Its amount can be selected and copied, but neither typing nor pasting changes it.",
        controls: "Sets CurrencyInputProps.isReadOnly",
    };

    export const HAS_ERROR_TEXT = {
        label: "Error",
        hint: "Marks the field invalid, for screen readers as well as for the painter.",
        controls: "Sets CurrencyInputProps.hasError",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it.",
        controls: "Sets CurrencyInputProps.isDisabled",
    };

    export const LOCALE_TEXT = {
        label: "Locale",
        hint: "Which country's conventions the amount is written in, which decides the separators.",
        controls: "Sets CurrencyInputProps.locale",
    };

    export const DECIMALS_TEXT = {
        label: "Decimals",
        hint: "How many digits are kept after the decimal separator.",
        controls: "Sets CurrencyInputProps.decimals",
    };

    export const GROUP_SIZES_TEXT = {
        label: "Grouping",
        hint: "How the digits before the decimal separator are grouped: the locale's own way, or a pattern such as threes or the Indian lakh.",
        controls: "Sets CurrencyInputProps.groupSizes",
    };

    export const MAX_TEXT = {
        label: "Max",
        hint: "The largest amount the field accepts.",
        controls: "Sets CurrencyInputProps.max",
    };

    export const HAS_SIGN_TEXT = {
        label: "Signed",
        hint: "Allows negative amounts to be typed. With it off, a minus sign is refused.",
        controls: "Sets CurrencyInputProps.hasSign",
    };
}
