import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-svelte";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { DEFAULT_SKIN, PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";

let appliedSkin = $state<PlaygroundSkin>(DEFAULT_SKIN);

const applySkin = (skin: PlaygroundSkin) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_SKINS));
    document.documentElement.classList.add(PLAYGROUND_SKINS[skin]);
};

export const getAppliedSkin = () => appliedSkin;

export const revealSkin = (skin: PlaygroundSkin, opts: ShapeRevealOpts) => {
    appliedSkin = skin;

    return ShapeRevealUtils.reveal(() => applySkin(skin), opts);
};
