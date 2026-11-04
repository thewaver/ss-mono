import { useSyncExternalStore } from "react";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-react";
import type { PlaygroundSkin } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { DEFAULT_SKIN, PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";

let appliedSkin: PlaygroundSkin = DEFAULT_SKIN;

const listeners = new Set<() => void>();

const applySkin = (skin: PlaygroundSkin) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_SKINS));
    document.documentElement.classList.add(PLAYGROUND_SKINS[skin]);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const getAppliedSkin = () => appliedSkin;

export const useAppliedSkin = () => useSyncExternalStore(subscribe, getAppliedSkin);

export const revealSkin = (skin: PlaygroundSkin, opts: ShapeRevealOpts) => {
    appliedSkin = skin;
    listeners.forEach((listener) => listener());

    return ShapeRevealUtils.reveal(() => applySkin(skin), opts);
};
