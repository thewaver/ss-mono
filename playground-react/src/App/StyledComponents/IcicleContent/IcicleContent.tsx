import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/IcicleContent/IcicleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageIcicleCellProps } from "./IcicleContent.types";

const MIN_LABEL_HEIGHT = 16;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageIcicleCell = (props: PageIcicleCellProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                `${styles.icicleCell} ${props.family ? styles.icicleCellFamily[props.family] : styles.icicleCellRoot}`,
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
