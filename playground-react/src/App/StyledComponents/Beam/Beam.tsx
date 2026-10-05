import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { computeBeamLengthPx, observeBeamLength } from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { PageBeamProps } from "./Beam.types";

export const PageBeam = (props: PageBeamProps) => {
    const pathRef = useRef<SVGPathElement>(null);

    const [lengthPx, setLengthPx] = useState(0);

    useEffect(() => {
        if (!pathRef.current) return;

        return observeBeamLength(pathRef.current, setLengthPx);
    }, []);

    useLayoutEffect(() => {
        if (pathRef.current) setLengthPx(computeBeamLengthPx(pathRef.current));
    }, [props.d]);

    return (
        <path
            ref={pathRef}
            className={[
                styles.beam,
                styles.beamDirectionVariants[props.direction],
                !props.isPlaying && styles.beamPaused,
            ]
                .filter(Boolean)
                .join(" ")}
            style={assignInlineVars({ [styles.beamLengthVar]: `${lengthPx}px` })}
            d={props.d}
            data-beam
        />
    );
};
