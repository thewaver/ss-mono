import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageDieFaceProps, PageDieIconProps } from "./DieContent.types";

const LABEL_SHARE = 0.35;
const ICON_SHARE = 0.5;

export const PageDieFace = (props: PageDieFaceProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.dieFace, layerClass, props.state.isShowing && styles.dieFaceShowing]
                .filter(Boolean)
                .join(" ")}
            style={{
                fontSize: `${Math.min(props.state.size.width, props.state.size.height) * LABEL_SHARE}px`,
            }}
            aria-hidden="true"
        >
            {props.label}
        </div>
    );
};

export const PageDieIcon = (props: PageDieIconProps) => (
    <div
        className={styles.dieIcon}
        style={{ fontSize: `${Math.min(props.state.size.width, props.state.size.height) * ICON_SHARE}px` }}
        aria-hidden="true"
    >
        {props.icon}
    </div>
);
