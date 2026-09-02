import { MathUtils } from "@thewaver/ss-utils";

import type { ScrambleTextSegment } from "./ScrambleText.types";

const SINGLE_CHARACTER = 1;
const NO_TIME = 0;

export namespace ScrambleTextUtils {
    export const getIsWhitespace = (character: string) => !character.trim();

    export const getSegments = (characters: string[]) =>
        characters.reduce<ScrambleTextSegment[]>((segments, character, index) => {
            const isWhitespace = getIsWhitespace(character);
            const last = segments[segments.length - SINGLE_CHARACTER];

            if (last?.isWhitespace === isWhitespace) {
                last.characters.push(character);

                return segments;
            }

            return [...segments, { isWhitespace, startIndex: index, characters: [character] }];
        }, []);

    export const resolveWeights = (count: number, computed: number[] | undefined) => {
        const span = Math.max(count - SINGLE_CHARACTER, SINGLE_CHARACTER);

        return Array.from({ length: count }, (_unused, index) => MathUtils.clamp01(computed?.[index] ?? index / span));
    };

    export const getSettleTimes = (weights: number[], initialDelayMs: number, durationMs: number) =>
        weights.map((weight) => initialDelayMs + weight * durationMs);

    export const getStartTimes = (settleTimes: number[], churnDurationMs: number | undefined) =>
        settleTimes.map((settleTime) => (churnDurationMs === undefined ? NO_TIME : settleTime - churnDurationMs));

    export const pickGlyph = (glyphs: string[], excluded: string, roll: number) => {
        const options = glyphs.filter((glyph) => glyph !== excluded);

        if (!options.length) return excluded;

        return options[Math.min(Math.floor(roll * options.length), options.length - SINGLE_CHARACTER)];
    };
}
