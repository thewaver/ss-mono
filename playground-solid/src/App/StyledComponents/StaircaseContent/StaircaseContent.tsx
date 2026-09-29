import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StaircaseContent/StaircaseContent.css";

import type { PageStaircaseStepProps } from "./StaircaseContent.types";

export const PageStaircaseStep = (props: ParentProps<PageStaircaseStepProps>) => {
    return (
        <div class={styles.staircaseStep}>
            <div>{props.children}</div>

            <div class={styles.staircaseStepIndent}>{`${Math.round(access(props.state).stepIndent)}px`}</div>
        </div>
    );
};
