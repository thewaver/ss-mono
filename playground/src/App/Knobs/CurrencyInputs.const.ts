export namespace CurrencyInputKnobs {
    export const LOCALES = ["en-GB", "en-US", "de-DE", "fr-FR", "ja-JP", "en-IN"];
    export const DECIMALS = [0, 2, 3];
    export const GROUPINGS: (number[] | undefined)[] = [undefined, [3], [4], [3, 2]];

    export const STARTING_LOCALE = "en-GB";
    export const STARTING_HAS_SIGN = false;
    export const MIN_MAX = 100;
    export const MAX_MAX = 100_000;
    export const MAX_STEP = 100;
}
