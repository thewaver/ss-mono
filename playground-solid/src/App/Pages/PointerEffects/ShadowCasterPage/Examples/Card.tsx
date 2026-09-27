import { ShadowCaster } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.css";
import type { ShadowCasterExampleProps } from "@thewaver/ss-playground-core/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.types";

type Props = ShadowCasterExampleProps;

export const CardExample = (props: Props) => {
    return (
        <div class={styles.stage}>
            <ShadowCaster
                isDisabled={props.isDisabled}
                activeRangePx={props.activeRangePx}
                smoothingMs={props.smoothingMs}
                lightRangePx={props.lightRangePx}
                maxThrowPx={props.maxThrowPx}
                minBlurPx={props.minBlurPx}
                maxBlurPx={props.maxBlurPx}
                maxOpacity={props.maxOpacity}
                minOpacity={props.minOpacity}
                restingOpacity={props.restingOpacity}
                color={props.color}
            >
                <div class={styles.card}>Move the pointer around me</div>
            </ShadowCaster>
        </div>
    );
};
