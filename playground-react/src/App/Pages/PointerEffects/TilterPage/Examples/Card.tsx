import { Tilter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/TilterPage/TilterPage.css";

import type { TilterExampleProps } from "../TilterPageReact.types";

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
            renderSheen={(state) => (
                <div
                    className={styles.sheen}
                    style={{
                        opacity: props.sheenOpacity * state.strength,
                        backgroundImage: `linear-gradient(${SHEEN_ANGLE_DEGREES}deg, transparent ${state.sheenPosition - props.sheenSpreadPercent}%, rgb(255 255 255 / 0.5) ${state.sheenPosition}%, transparent ${state.sheenPosition + props.sheenSpreadPercent}%)`,
                    }}
                />
            )}
        >
            <div className={styles.card}>Tip me</div>
        </Tilter>
    );
};
