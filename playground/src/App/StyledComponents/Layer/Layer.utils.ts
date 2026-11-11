import type { LayerLevel } from "../../PageComponents/Layer/Layer.context.types";
import { DEFAULT_LEVEL, MAX_LEVEL } from "./Layer.const";

export namespace LayerUtils {
    export const computeNextLevel = (level: LayerLevel | undefined): LayerLevel =>
        Math.min((level ?? DEFAULT_LEVEL) + 1, MAX_LEVEL) as LayerLevel;
}
