import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

import { getLayerContext } from "../../PageComponents/Layer/Layer.context";

const DEFAULT_LEVEL = 0;

export const getLayerClass = () => {
    const context = getLayerContext();

    return () => styles.layerLevelVariants[context?.level ?? DEFAULT_LEVEL];
};
