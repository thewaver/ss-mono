import type { ParentProps } from "solid-js";

import { LabelSolidUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaptionSolid.types";

export const PageLabelCaption = (props: ParentProps<PageLabelCaptionProps>) => {
    const getId = LabelSolidUtils.registerCaptionId(() => access(props.id));

    return (
        <div class={styles.labelCaption} id={getId()}>
            {props.children}
        </div>
    );
};
