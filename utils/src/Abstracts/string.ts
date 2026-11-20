const JAVASCRIPT_SCHEME =
    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

/** Punctuation that belongs to the word after it: an opening bracket or quote, a currency sign, a minus sign. */
const isOpeningPunctuation = (s: string) => /^[\p{Ps}\p{Pi}\p{Sc}"'\-\u2212]+$/u.test(s);

let graphemeSegmenter: Intl.Segmenter | undefined;

const getGraphemeSegmenter = () => (graphemeSegmenter ??= new Intl.Segmenter(undefined, { granularity: "grapheme" }));

/** Text helpers: case and naming conversions, line breaks and white space, word pieces, and safe link addresses. */
export namespace StringUtils {
    /**
     * Splits text into the characters a reader sees, rather than into code points.
     *
     * A letter with a combining accent, a flag, or several emoji joined into one family each come back as one piece,
     * where `Array.from` would split them and a box per piece would draw them apart.
     *
     * @param text The text to split.
     * @returns The characters, in order. An empty string gives an empty list.
     */
    export const splitGraphemes = (text: string): string[] =>
        Array.from(getGraphemeSegmenter().segment(text), (segment) => segment.segment);

    /**
     * Applies a CSS `text-transform` to a string.
     *
     * `capitalize` raises the first letter of every word, accented words included, so `état` becomes
     * `État` rather than `éTat`. A letter after an apostrophe inside a word, or after a combining accent, does not
     * start a word, so `don't` stays `Don't`.
     *
     * @param text The text to change.
     * @param transform One of `uppercase`, `lowercase` or `capitalize`. Anything else,
     * including `none` or nothing at all, returns the text untouched.
     * @returns The transformed text. Applying the same transform twice changes nothing
     * further, so it is safe to call more than once.
     */
    export const applyTextTransform = (
        text: string,
        transform?: "capitalize" | "lowercase" | "uppercase" | (string & {}),
    ): string => {
        switch (transform) {
            case "uppercase":
                return text.toUpperCase();
            case "lowercase":
                return text.toLowerCase();
            case "capitalize":
                return text.replace(/(?<![\p{L}\p{N}\p{M}])(?<![\p{L}\p{N}]['’])\p{L}/gu, (m) => m.toUpperCase());
            default:
                return text;
        }
    };

    /**
     * Converts a JavaScript-style name to a CSS-style one, so `backgroundColor`
     * becomes `background-color`.
     *
     * Runs of capitals are handled sensibly: `borderTRBLWidth` becomes
     * `border-trbl-width` rather than splitting every letter. A name that begins with a capital is a vendor-prefixed
     * one, so `WebkitTransform` becomes `-webkit-transform`, and a custom property such as `--myVar` is passed through
     * untouched, since its case is part of its name.
     */
    export const camelToKebabCase = (key: string) => {
        if (key.startsWith("--")) return key;

        const kebab = key
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .toLowerCase();

        return /^[A-Z]/.test(key) ? `-${kebab}` : kebab;
    };

    /**
     * Converts a CSS-style name to a JavaScript-style one, so `background-color`
     * becomes `backgroundColor`.
     */
    export const kebabToCamelCase = (key: string) => key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    /** Tests whether a string is made up **entirely** of line breaks. Empty strings are not. */
    export const isLineBreak = (value: string) => /^[\r\n\f\v\p{Zl}\p{Zp}]+$/u.test(value);

    /** Tests whether a string contains at least one line break anywhere. */
    export const containsLineBreak = (value: string) => /[\r\n\f\v\p{Zl}\p{Zp}]/u.test(value);

    /** Strips every line break out of a string, joining the surrounding text together. */
    export const omitLineBreaks = (value: string) => value.replace(/[\r\n\f\v\p{Zl}\p{Zp}]/gu, "");

    /**
     * Splits text into runs, keeping the line breaks as entries of their own.
     *
     * `"a\nb"` becomes `["a", "\n", "b"]`. A Windows `\r\n` pair stays together as one
     * entry. This lets a caller walk the text and handle breaks explicitly rather than
     * losing them.
     */
    export const splitByLinebreaks = (s: string) =>
        s.match(/\r\n|[\r\n\f\v\p{Zl}\p{Zp}]|[^\r\n\f\v\p{Zl}\p{Zp}]+/gu) ?? [];

    /** Tests whether a string is made up **entirely** of whitespace. Empty strings are not. */
    export const isWhitespace = (s: string) => /^\s+$/.test(s);

    /**
     * Tests whether a string is punctuation that belongs tight against the word before
     * it — a full stop, a closing bracket, a closing quote.
     *
     * Opening quotes are excluded, since those attach to the word that *follows*.
     * Empty strings are not closing punctuation.
     */
    export const isClosingPunctuation = (s: string) => /^[\p{Pe}\p{Pf}\p{Po}\p{S}]+$/u.test(s) && !/^\p{Pi}+$/u.test(s);

    /** Strips invisible control characters out of a string. */
    export const omitControlChars = (value: string) => value.replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, "");

    /**
     * Replaces tabs with single spaces, the way HTML rendering collapses them.
     *
     * A run of tabs becomes one space, and a tab that already sits next to a space is dropped rather than doubling
     * up.
     */
    export const replaceTabs = (text: string) => text.replace(/\v/g, "").replace(/ *\t[\t ]*/g, " ");

    /** Pulls the plain strings out of an `Intl.Segmenter` result. */
    export const intlSegmentsToStrings = (segments: Intl.Segments): string[] => Array.from(segments, (s) => s.segment);

    /** Pulls the plain strings out of several `Intl.Segmenter` results and flattens them into one list. */
    export const intlSegmentsArrayToStrings = (segmentsArr: Intl.Segments[]): string[] =>
        segmentsArr.flatMap((segments) => intlSegmentsToStrings(segments));

    /**
     * Glues punctuation onto the word it belongs to.
     *
     * Word splitters hand back `["Hi", "!"]`, which would let a line wrap between the
     * word and its exclamation mark. This rejoins them into `["Hi!"]` so they travel
     * as one unit. Trailing punctuation following a space, or starting the list, is left alone. An opening bracket,
     * an opening quote, a currency sign or a minus sign at the start of a word goes onto the word after it, so
     * `["(", "see"]` becomes `["(see"]` and `["$", "5"]` becomes `["$5"]`.
     *
     * @param tokens The pieces to fix up. Never modified.
     * @returns A new list, the same length or shorter.
     */
    export const mergePunctuation = (tokens: string[]) => {
        const result: string[] = [];

        let shouldAttachToLast = false;
        let opening = "";

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const next = tokens[i + 1];

            if (
                (opening !== "" || !shouldAttachToLast) &&
                isOpeningPunctuation(token) &&
                next !== undefined &&
                !isWhitespace(next)
            ) {
                opening += token;

                continue;
            }

            if (opening !== "") {
                result.push(opening + token);

                opening = "";
                shouldAttachToLast = true;
            } else if (isClosingPunctuation(token)) {
                if (!result.length || !shouldAttachToLast) {
                    result.push(token);
                } else {
                    result[result.length - 1] += token;
                }

                shouldAttachToLast = true;
            } else {
                result.push(token);

                shouldAttachToLast = !isWhitespace(token);
            }
        }

        return result;
    };

    /**
     * A link address safe to write into an `href`, or `undefined` for one that would run script.
     *
     * An address beginning `javascript:` runs its script in the page when the link is followed, so one taken from
     * data that people wrote — a saved bookmark, a title with a link — can attack whoever clicks it. Such an address is
     * refused however it is disguised: in any case, after leading spaces or control characters, or with tabs and line
     * breaks between its letters, which the browser ignores. Every other address passes unchanged: relative paths,
     * `https:`, `mailto:`, `tel:` and the rest.
     *
     * @param href The address, or nothing.
     * @returns The address, or `undefined` when it was missing or refused.
     */
    export const toSafeHref = (href: string | undefined) =>
        href === undefined || JAVASCRIPT_SCHEME.test(href) ? undefined : href;
}
