import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/StaircaseContent/StaircaseContent.css";

import type { PageStaircaseStepProps } from "./StaircaseContent.types";

export const PageStaircaseStep = (props: PropsWithChildren<PageStaircaseStepProps>) => {
    return (
        <div className={styles.staircaseStep}>
            <div>{props.children}</div>

            <div className={styles.staircaseStepIndent}>{`${Math.round(props.state.stepIndent)}px`}</div>
        </div>
    );
};
