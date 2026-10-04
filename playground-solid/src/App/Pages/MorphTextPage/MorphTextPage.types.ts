import type { AccessorProps } from "@thewaver/ss-components-solid";

export type MorphTextExampleProps = AccessorProps<{
    morphDurationMs: number;
    maxBlurPx: number;
    onWordChange: (word: string) => void;
}>;
