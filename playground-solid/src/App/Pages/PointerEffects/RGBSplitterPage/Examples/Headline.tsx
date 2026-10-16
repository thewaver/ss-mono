import { RGBSplitter } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.css";

import type { RGBSplitterExampleProps } from "../RGBSplitterPageSolid.types";

type Props = RGBSplitterExampleProps;

export const HeadlineExample = (props: Props) => {
    return (
        <div class={styles.stage}>
            <RGBSplitter
                isDisabled={props.isDisabled}
                activeRangePx={props.activeRangePx}
                smoothingMs={props.smoothingMs}
                splitRangePx={props.splitRangePx}
                maxOffsetPx={props.maxOffsetPx}
                colorMixing={props.colorMixing}
            >
                <div class={styles.headline}>Signal</div>
            </RGBSplitter>
        </div>
    );
};
