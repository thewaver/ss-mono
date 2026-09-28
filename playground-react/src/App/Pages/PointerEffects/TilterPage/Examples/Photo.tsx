import { Tilter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";
import knight from "@thewaver/ss-playground/App/knight_profile.webp";

import type { TilterExampleProps } from "../TilterPageReact.types";

type Props = TilterExampleProps;

export const PhotoExample = (props: Props) => {
    return (
        <Tilter
            isDisabled={props.isDisabled}
            activeRangePx={props.activeRangePx}
            smoothingMs={props.smoothingMs}
            tiltRangePx={props.tiltRangePx}
            maxTiltDegrees={props.maxTiltDegrees}
            perspectivePx={props.perspectivePx}
        >
            <img className={styles.photo} src={knight} alt={"A knight, tilting with the pointer"} />
        </Tilter>
    );
};
