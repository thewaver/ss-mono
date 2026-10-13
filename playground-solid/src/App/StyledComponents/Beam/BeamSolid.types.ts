import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { PageBeamDirection } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.types";

export type { PageBeamDirection } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.types";

export type PageBeamProps = AccessorProps<{
    d: string;
    direction: PageBeamDirection;
    isPlaying: boolean;
    routeStartPx?: number;
    routeLengthPx?: number;
}> & {
    onLengthPx?: (lengthPx: number | undefined) => void;
};
