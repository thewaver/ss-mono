import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    computeBeamLengthPx,
    computeBeamMotion,
    observeBeamLength,
} from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

const NO_LENGTH = 0;

export const PageBeam = (props: PageBeamProps) => {
    const pathRef = useRef<SVGPathElement>(null);
    const onLengthPx = useRef(props.onLengthPx);

    onLengthPx.current = props.onLengthPx;

    const [lengthPx, setLengthPx] = useState(NO_LENGTH);

    useEffect(() => {
        if (!pathRef.current) return;

        return observeBeamLength(pathRef.current, setLengthPx);
    }, []);

    useLayoutEffect(() => {
        if (pathRef.current) setLengthPx(computeBeamLengthPx(pathRef.current));
    }, [props.d]);

    useEffect(() => {
        onLengthPx.current?.(lengthPx);
    }, [lengthPx]);

    useEffect(() => () => onLengthPx.current?.(undefined), []);

    const motion = computeBeamMotion({
        lengthPx,
        startPx: props.routeStartPx ?? NO_LENGTH,
        totalPx: props.routeLengthPx ?? lengthPx,
        direction: props.direction,
    });

    useLayoutEffect(() => {
        const path = pathRef.current;

        if (!path || motion.durationMs <= NO_LENGTH) return;

        const animation = path.animate(
            [{ strokeDashoffset: `${motion.fromPx}px` }, { strokeDashoffset: `${motion.toPx}px` }],
            { duration: motion.durationMs, iterations: Infinity },
        );

        animation.currentTime = performance.now() % motion.durationMs;

        if (!props.isPlaying) animation.pause();

        return () => animation.cancel();
    }, [motion.fromPx, motion.toPx, motion.durationMs, props.isPlaying]);

    return (
        <path
            ref={pathRef}
            className={styles.beam}
            style={{ strokeDasharray: motion.dashArray }}
            d={props.d}
            data-beam
        />
    );
};
