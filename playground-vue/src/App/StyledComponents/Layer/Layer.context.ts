import { computed } from "vue";

import { DEFAULT_LEVEL } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

import { useLayerContext } from "../../PageComponents/Layer/Layer.context";

export const useLayerClass = () => {
    const context = useLayerContext();

    return computed(() => styles.layerLevelVariants[context?.level ?? DEFAULT_LEVEL]);
};
