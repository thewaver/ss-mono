import { LightCatcher } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import type { LightCatcherExampleProps } from "../LightCatcherPageReact.types";

type Props = LightCatcherExampleProps;

export const PanelExample = (props: Props) => {
    return (
        <div className={styles.stage}>
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
                <div className={styles.panelCard}>Come nearer</div>
            </LightCatcher>
        </div>
    );
};
