import { LightCatcher } from "@thewaver/ss-components";

import type { LightCatcherExampleProps } from "../LightCatcherPage.types";

import * as styles from "../LightCatcherPage.css";

type Props = LightCatcherExampleProps;

export const PanelExample = (props: Props) => {
    return (
        <div class={styles.stage}>
            <LightCatcher
                isDisabled={props.isDisabled}
                activeRangePx={props.activeRangePx}
                lightRangePx={props.lightRangePx}
                maxBrightness={props.maxBrightness}
                restingBrightness={props.restingBrightness}
                maxLightness={props.maxLightness}
                restingLightness={props.restingLightness}
            >
                <div class={styles.panelCard}>Come nearer</div>
            </LightCatcher>
        </div>
    );
};
