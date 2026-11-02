import { shallowRef } from "vue";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-vue";
import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export const appliedLook = shallowRef<PlaygroundLook>(DEFAULT_LOOK);

const applyLook = (look: PlaygroundLook) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_LOOKS));
    document.documentElement.classList.add(PLAYGROUND_LOOKS[look]);
};

export const revealLook = (look: PlaygroundLook, opts: ShapeRevealOpts) => {
    appliedLook.value = look;

    return ShapeRevealUtils.reveal(() => applyLook(look), opts);
};
