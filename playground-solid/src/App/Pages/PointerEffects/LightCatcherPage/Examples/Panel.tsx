import { LightCatcher } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";
import type { LightCatcherExampleProps } from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.types";

type Props = LightCatcherExampleProps;

export const PanelExample = (props: Props) => {
    return (
        <div class={styles.stage}>
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
                <div class={styles.panelCard}>Come nearer</div>
            </LightCatcher>
        </div>
    );
};
