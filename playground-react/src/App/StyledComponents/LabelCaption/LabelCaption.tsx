import type { PropsWithChildren } from "react";

import { LabelReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/LabelCaption/LabelCaption.css";

import type { PageLabelCaptionProps } from "./LabelCaptionReact.types";

export const PageLabelCaption = (props: PropsWithChildren<PageLabelCaptionProps>) => {
    const id = LabelReactUtils.useCaptionId(props.id);

    return (
        <div className={styles.labelCaption} id={id}>
            {props.children}
        </div>
    );
};
