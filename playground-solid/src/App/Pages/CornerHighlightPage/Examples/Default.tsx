import { CornerHighlight } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

import type { CornerHighlightExampleProps } from "../CornerHighlightPageSolid.types";

type Props = CornerHighlightExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <div class={styles.frame}>
            <CornerHighlight
                color={props.color}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            >
                <div class={styles.frameBody}>Whatever it is put around</div>
            </CornerHighlight>
        </div>
    );
};
