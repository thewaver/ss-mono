import { RGBSplitter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.css";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

import type { RGBSplitterExampleProps } from "../RGBSplitterPageReact.types";

type Props = RGBSplitterExampleProps;

export const PhotoExample = (props: Props) => {
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
                <img className={styles.photo} src={knightProfile} alt={"A knight in armor"} />
            </RGBSplitter>
        </div>
    );
};
