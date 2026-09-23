import type { ScrambleTextGlyphFn } from "./ScrambleTextGlyphs.types";

const DIGITS = "0123456789";
const CAPITALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SMALLS = "abcdefghijklmnopqrstuvwxyz";
const SYMBOLS = "#%&@*+=<>/\\";
const HEXADECIMAL = "0123456789ABCDEF";
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ";
const BINARY = "01";

const matched: ScrambleTextGlyphFn = (character) => {
    if (DIGITS.includes(character)) return DIGITS;
    if (character !== character.toLowerCase()) return CAPITALS;
    if (character !== character.toUpperCase()) return SMALLS;

    return SYMBOLS;
};

const hexadecimal: ScrambleTextGlyphFn = () => HEXADECIMAL;

const katakana: ScrambleTextGlyphFn = () => KATAKANA;

const binary: ScrambleTextGlyphFn = () => BINARY;

export namespace ScrambleTextGlyphs {
    export const SAMPLE_GLYPHS = {
        matched,
        hexadecimal,
        katakana,
        binary,
    } satisfies Record<string, ScrambleTextGlyphFn>;

    export type SampleKey = keyof typeof SAMPLE_GLYPHS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_GLYPHS) as SampleKey[];
}
