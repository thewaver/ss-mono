import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaption.types";

export const PageLabelCaption = (props: PropsWithChildren<PageLabelCaptionProps>) => {
    return (
        <div className={styles.labelCaption} id={props.id}>
            {props.children}
        </div>
    );
};
