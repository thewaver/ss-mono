import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

export const PageBeam = (props: PageBeamProps) => (
    <path
        className={[styles.beam, styles.beamDirectionVariants[props.direction], !props.isPlaying && styles.beamPaused]
            .filter(Boolean)
            .join(" ")}
        d={props.d}
        pathLength={1}
        data-beam
    />
);
