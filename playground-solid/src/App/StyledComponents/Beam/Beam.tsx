import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Beam/Beam.css";

import type { PageBeamProps } from "./Beam.types";

export const PageBeam = (props: PageBeamProps) => (
    <path
        classList={{
            [styles.beam]: true,
            [styles.beamDirectionVariants.forward]: access(props.direction) === "forward",
            [styles.beamDirectionVariants.backward]: access(props.direction) === "backward",
            [styles.beamPaused]: !access(props.isPlaying),
        }}
        d={access(props.d)}
        pathLength={1}
        data-beam
    />
);
