import { ShadowCaster } from "@thewaver/ss-components";

import type { ShadowCasterExampleProps } from "../ShadowCasterPage.types";

import * as styles from "../ShadowCasterPage.css";

type Props = ShadowCasterExampleProps;

export const BadgeExample = (props: Props) => {
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
                <div class={styles.badge} />
            </ShadowCaster>
        </div>
    );
};
