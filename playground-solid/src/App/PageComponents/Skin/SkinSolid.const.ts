import { createSignal } from "solid-js";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-solid";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";

const [getAppliedSkin, setAppliedSkin] = createSignal<PlaygroundSkin>(NavSettingsUtils.loadSkin());

const applySkin = (skin: PlaygroundSkin) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_SKINS));
    document.documentElement.classList.add(PLAYGROUND_SKINS[skin]);
};

export { getAppliedSkin };

export const revealSkin = (skin: PlaygroundSkin, opts: ShapeRevealOpts) => {
    setAppliedSkin(skin);
    NavSettingsUtils.save("skin", skin);

    return ShapeRevealUtils.reveal(() => applySkin(skin), opts);
};
