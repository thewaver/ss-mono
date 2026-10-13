import {
    LABEL_HIDDEN,
    LABEL_SHOWN,
    MIN_LABEL_HEIGHT,
} from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageIcicleCellProps } from "./IcicleContentReact.types";

export const PageIcicleCell = (props: PageIcicleCellProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                `${styles.icicleCell} ${props.family === undefined ? styles.icicleCellRoot : styles.icicleCellFamily[props.family]}`,
                layerClass,
            ].join(" ")}
            title={props.title}
        >
            <span
                className={styles.icicleLabel}
                style={{ opacity: props.state.rect.height > MIN_LABEL_HEIGHT ? LABEL_SHOWN : LABEL_HIDDEN }}
            >
                {props.name} <span className={styles.icicleWeight}>{props.weight}</span>
            </span>
        </div>
    );
};
