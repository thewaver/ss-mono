import { Tilter } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/TilterPage/TilterPage.css";
import type { TilterExampleProps } from "@thewaver/ss-playground-core/App/Pages/PointerEffects/TilterPage/TilterPage.types";

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
