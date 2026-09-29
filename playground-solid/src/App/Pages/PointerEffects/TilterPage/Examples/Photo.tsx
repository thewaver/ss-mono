import { Tilter } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";
import type { TilterExampleProps } from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.types";
import knight from "@thewaver/ss-playground/App/knight_profile.webp";

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
            <img class={styles.photo} src={knight} alt={"A knight, tilting with the pointer"} />
        </Tilter>
    );
};
