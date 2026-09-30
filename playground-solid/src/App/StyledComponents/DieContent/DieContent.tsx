import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageDieFaceProps } from "./DieContent.types";

const LABEL_SHARE = 0.35;

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
