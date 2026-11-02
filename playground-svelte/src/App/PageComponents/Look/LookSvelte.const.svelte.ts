import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-svelte";
import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

let appliedLook = $state<PlaygroundLook>(DEFAULT_LOOK);

const applyLook = (look: PlaygroundLook) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_LOOKS));
    document.documentElement.classList.add(PLAYGROUND_LOOKS[look]);
};

export const getAppliedLook = () => appliedLook;

export const revealLook = (look: PlaygroundLook, opts: ShapeRevealOpts) => {
    appliedLook = look;

    return ShapeRevealUtils.reveal(() => applyLook(look), opts);
};
