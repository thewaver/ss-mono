import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import {
    computeBeamLengthPx,
    computeBeamMotion,
    observeBeamLength,
} from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

const NO_LENGTH = 0;

export const PageBeam = (props: PageBeamProps) => {
    const [getRef, setRef] = createSignal<SVGPathElement>();
    const [getLengthPx, setLengthPx] = createSignal(NO_LENGTH);

    createEffect(() => {
        const path = getRef();

        if (!path) return;

        onCleanup(observeBeamLength(path, setLengthPx));
    });

    createEffect(() => {
        access(props.d);

        const path = getRef();

        if (path) setLengthPx(computeBeamLengthPx(path));
    });

    createEffect(() => {
        props.onLengthPx?.(getLengthPx());
    });

    onCleanup(() => props.onLengthPx?.(undefined));

    const getMotion = createMemo(() =>
        computeBeamMotion({
            lengthPx: getLengthPx(),
            startPx: access(props.routeStartPx) ?? NO_LENGTH,
            totalPx: access(props.routeLengthPx) ?? getLengthPx(),
            direction: access(props.direction),
        }),
    );

    createEffect(() => {
        const path = getRef();
        const motion = getMotion();

        if (!path || motion.durationMs <= NO_LENGTH) return;

        const animation = path.animate(
            [{ strokeDashoffset: `${motion.fromPx}px` }, { strokeDashoffset: `${motion.toPx}px` }],
            { duration: motion.durationMs, iterations: Infinity },
        );

        animation.currentTime = performance.now() % motion.durationMs;

        if (!access(props.isPlaying)) animation.pause();

        onCleanup(() => animation.cancel());
    });

    return (
        <path
            ref={setRef}
            class={styles.beam}
            style={{ "stroke-dasharray": getMotion().dashArray }}
            d={access(props.d)}
            data-beam
        />
    );
};
