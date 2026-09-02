import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type ScrambleTextSegment = {
    isWhitespace: boolean;
    startIndex: number;
    characters: string[];
};

export type ScrambleTextController = {
    restartAnimation: () => boolean;
};

export type ScrambleTextProps = AccessorProps<{
    text: string;
    settleDurationMs?: number;
    churnDurationMs?: number;
    scrambleIntervalMs?: number;
    initialDelayMs?: number;
    computeCharacterWeights?: (count: number) => number[];
    onMount?: (controller: ScrambleTextController) => void;
    onAnimationEnd?: () => void;
}> & {
    glyphs?: MaybeAccessor<string | undefined>;
};
