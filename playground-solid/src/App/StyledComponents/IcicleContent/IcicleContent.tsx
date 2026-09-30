import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageIcicleCellProps } from "./IcicleContent.types";

const MIN_LABEL_HEIGHT = 16;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

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
