import { DEFAULT_LEVEL } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

import { getLayerContext } from "../../PageComponents/Layer/Layer.context";

export const getLayerClass = () => {
    const context = getLayerContext();

    return () => styles.layerLevelVariants[context?.level ?? DEFAULT_LEVEL];
};
