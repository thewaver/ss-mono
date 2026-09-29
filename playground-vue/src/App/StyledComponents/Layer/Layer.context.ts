import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

import { useLayerContext } from "../../PageComponents/Layer/Layer.context";

const DEFAULT_LEVEL = 0;

export const useLayerClass = () => {
    const context = useLayerContext();

    return computed(() => styles.layerLevelVariants[context?.level ?? DEFAULT_LEVEL]);
};
