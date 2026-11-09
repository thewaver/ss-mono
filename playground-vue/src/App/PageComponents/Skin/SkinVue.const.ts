import { shallowRef } from "vue";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-vue";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";

export const appliedSkin = shallowRef<PlaygroundSkin>(NavSettingsUtils.loadSkin());

const applySkin = (skin: PlaygroundSkin) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_SKINS));
    document.documentElement.classList.add(PLAYGROUND_SKINS[skin]);
};

export const revealSkin = (skin: PlaygroundSkin, opts: ShapeRevealOpts) => {
    appliedSkin.value = skin;
    NavSettingsUtils.save("skin", skin);

    return ShapeRevealUtils.reveal(() => applySkin(skin), opts);
};
