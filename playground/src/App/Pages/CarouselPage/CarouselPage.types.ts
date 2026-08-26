import type { Signal } from "solid-js";

import type { AccessorProps, CarouselAxis, CarouselDir } from "@thewaver/ss-components";

export type CarouselExampleProps = AccessorProps<{
    slides: string[];
    isDisabled: boolean;
    dir: CarouselDir;
    autoplayDelayMs?: number;
    indexSignal: Signal<number>;
    playingSignal?: Signal<boolean>;
}>;

export type DrumCarouselExampleProps = Omit<CarouselExampleProps, "dir"> &
    AccessorProps<{
        axis: CarouselAxis;
    }>;
