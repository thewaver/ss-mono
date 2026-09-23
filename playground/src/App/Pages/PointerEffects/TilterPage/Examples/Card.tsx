import { Tilter } from "@thewaver/ss-components";

import type { TilterExampleProps } from "../TilterPage.types";

import * as styles from "../TilterPage.css";

const SHEEN_ANGLE_DEGREES = 115;

type Props = TilterExampleProps;

export const CardExample = (props: Props) => {
    return (
        <Tilter
            isDisabled={props.isDisabled}
            activeRangePx={props.activeRangePx}
            smoothingMs={props.smoothingMs}
            tiltRangePx={props.tiltRangePx}
            maxTiltDegrees={props.maxTiltDegrees}
            perspectivePx={props.perspectivePx}
            renderSheen={(getState) => (
                <div
                    class={styles.sheen}
                    style={{
                        "opacity": props.sheenOpacity() * getState().strength,
                        "background-image": `linear-gradient(${SHEEN_ANGLE_DEGREES}deg, transparent ${getState().sheenPosition - props.sheenSpreadPercent()}%, rgb(255 255 255 / 0.5) ${getState().sheenPosition}%, transparent ${getState().sheenPosition + props.sheenSpreadPercent()}%)`,
                    }}
                />
            )}
        >
            <div class={styles.card}>Tip me</div>
        </Tilter>
    );
};
