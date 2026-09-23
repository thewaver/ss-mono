import { Tilter } from "@thewaver/ss-components";

import knight from "../../../../knight_profile.webp";
import type { TilterExampleProps } from "../TilterPage.types";

import * as styles from "../TilterPage.css";

type Props = TilterExampleProps;

export const PhotoExample = (props: Props) => {
    return (
        <Tilter
            isDisabled={props.isDisabled}
            activeRangePx={props.activeRangePx}
            tiltRangePx={props.tiltRangePx}
            maxTiltDegrees={props.maxTiltDegrees}
            perspectivePx={props.perspectivePx}
        >
            <img class={styles.photo} src={knight} alt={"A knight, tilting with the pointer"} />
        </Tilter>
    );
};
