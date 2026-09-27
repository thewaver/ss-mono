import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/Layer/Layer.css";

import { useLayerContext } from "../../PageComponents/Layer/Layer.context";

const DEFAULT_LEVEL = 0;

export const useLayerClass = () => {
    const context = useLayerContext();

    return () => styles.layerLevelVariants[context?.level() ?? DEFAULT_LEVEL];
};
