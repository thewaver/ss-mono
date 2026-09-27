import { ShadowCaster } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.css";

import type { ShadowCasterExampleProps } from "../ShadowCasterPageReact.types";

type Props = ShadowCasterExampleProps;

export const BadgeExample = (props: Props) => {
    return (
        <div className={styles.stage}>
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
                <div className={styles.badge} />
            </ShadowCaster>
        </div>
    );
};
