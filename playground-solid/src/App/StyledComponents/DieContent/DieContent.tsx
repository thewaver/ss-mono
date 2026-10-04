import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageDieFaceProps, PageDieIconProps } from "./DieContent.types";

const LABEL_SHARE = 0.35;
const ICON_SHARE = 0.5;

export const PageDieFace = (props: PageDieFaceProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.dieFace}
            classList={{ [getLayerClass()]: true, [styles.dieFaceShowing]: access(props.state).isShowing }}
            style={{
                "font-size": `${Math.min(access(props.state).size.width, access(props.state).size.height) * LABEL_SHARE}px`,
            }}
            aria-hidden="true"
        >
            {access(props.label)}
        </div>
    );
};

export const PageDieIcon = (props: PageDieIconProps) => (
    <div
        class={styles.dieIcon}
        style={{
            "font-size": `${Math.min(access(props.state).size.width, access(props.state).size.height) * ICON_SHARE}px`,
        }}
        aria-hidden="true"
    >
        {access(props.icon)}
    </div>
);
