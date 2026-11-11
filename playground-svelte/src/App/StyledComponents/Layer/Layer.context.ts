import { DEFAULT_LEVEL } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import { LayerUtils } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.utils";

import { getLayerContext } from "../../PageComponents/Layer/Layer.context";

export const getLayerClass = () => {
    const context = getLayerContext();

    return () => styles.layerLevelVariants[context?.level ?? DEFAULT_LEVEL];
};

export const getNextLayerClass = () => {
    const context = getLayerContext();

    return () => styles.layerLevelVariants[LayerUtils.computeNextLevel(context?.level)];
};
