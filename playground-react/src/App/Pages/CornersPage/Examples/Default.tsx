import { Corners } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/CornersPage/CornersPage.css";

import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <div className={styles.frame}>
            <Corners
                color={props.color}
                cornerLength={props.cornerLength}
                strokeThickness={props.strokeThickness}
                transitionDurationMs={props.transitionDurationMs}
                visibleCorners={props.visibleCorners}
            >
                <div className={styles.frameBody}>Whatever it is put around</div>
            </Corners>
        </div>
    );
};
