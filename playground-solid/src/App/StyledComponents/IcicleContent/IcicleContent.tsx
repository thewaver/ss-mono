import { access } from "@thewaver/ss-components-solid";
import {
    LABEL_HIDDEN,
    LABEL_SHOWN,
    MIN_LABEL_HEIGHT,
} from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageIcicleCellProps } from "./IcicleContentSolid.types";

export const PageIcicleCell = (props: PageIcicleCellProps) => {
    const getLayerClass = useLayerClass();

    const getFamily = () => access(props.family);

    return (
        <div
            class={[
                `${styles.icicleCell} ${getFamily() === undefined ? styles.icicleCellRoot : styles.icicleCellFamily[getFamily()!]}`,
                getLayerClass(),
            ].join(" ")}
            title={access(props.title)}
        >
            <span
                class={styles.icicleLabel}
                style={{ opacity: access(props.state).rect.height > MIN_LABEL_HEIGHT ? LABEL_SHOWN : LABEL_HIDDEN }}
            >
                {access(props.name)} <span class={styles.icicleWeight}>{access(props.weight)}</span>
            </span>
        </div>
    );
};
