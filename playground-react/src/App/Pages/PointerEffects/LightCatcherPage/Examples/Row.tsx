import { LightCatcher } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import type { LightCatcherExampleProps } from "../LightCatcherPageReact.types";

const LAMPS = [1, 2, 3, 4, 5];

type Props = LightCatcherExampleProps;

export const RowExample = (props: Props) => {
    return (
        <div className={styles.row}>
            {LAMPS.map((lamp) => (
                <div key={lamp} className={styles.lampSlot}>
                    <LightCatcher
                        isDisabled={props.isDisabled}
                        activeRangePx={props.activeRangePx}
                        smoothingMs={props.smoothingMs}
                        lightRangePx={props.lightRangePx}
                        maxBrightness={props.maxBrightness}
                        restingBrightness={props.restingBrightness}
                        maxLightness={props.maxLightness}
                        restingLightness={props.restingLightness}
                    >
                        <div className={styles.lamp}>{lamp}</div>
                    </LightCatcher>
                </div>
            ))}
        </div>
    );
};
