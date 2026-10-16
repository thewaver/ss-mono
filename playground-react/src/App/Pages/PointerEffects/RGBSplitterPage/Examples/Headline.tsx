import { RGBSplitter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.css";

import type { RGBSplitterExampleProps } from "../RGBSplitterPageReact.types";

type Props = RGBSplitterExampleProps;

export const HeadlineExample = (props: Props) => {
    return (
        <div className={styles.stage}>
            <RGBSplitter
                isDisabled={props.isDisabled}
                activeRangePx={props.activeRangePx}
                smoothingMs={props.smoothingMs}
                splitRangePx={props.splitRangePx}
                maxOffsetPx={props.maxOffsetPx}
                colorMixing={props.colorMixing}
            >
                <div className={styles.headline}>Signal</div>
            </RGBSplitter>
        </div>
    );
};
