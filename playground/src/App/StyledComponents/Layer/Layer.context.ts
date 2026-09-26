import { useLayerContext } from "../../PageComponents/Layer/Layer.context";

import * as styles from "./Layer.css";

const DEFAULT_LEVEL = 0;

export const useLayerClass = () => {
    const context = useLayerContext();

    return () => styles.layerLevelVariants[context?.level() ?? DEFAULT_LEVEL];
};
