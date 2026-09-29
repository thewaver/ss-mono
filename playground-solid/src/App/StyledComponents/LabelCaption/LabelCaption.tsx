import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaption.types";

export const PageLabelCaption = (props: ParentProps<PageLabelCaptionProps>) => {
    return (
        <div class={styles.labelCaption} id={access(props.id)}>
            {props.children}
        </div>
    );
};
