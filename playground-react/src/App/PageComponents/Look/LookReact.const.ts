import { useSyncExternalStore } from "react";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-react";
import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import type { PlaygroundLook } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

let appliedLook: PlaygroundLook = DEFAULT_LOOK;

const listeners = new Set<() => void>();

const applyLook = (look: PlaygroundLook) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_LOOKS));
    document.documentElement.classList.add(PLAYGROUND_LOOKS[look]);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const getAppliedLook = () => appliedLook;

export const useAppliedLook = () => useSyncExternalStore(subscribe, getAppliedLook);

export const revealLook = (look: PlaygroundLook, opts: ShapeRevealOpts) => {
    appliedLook = look;
    listeners.forEach((listener) => listener());

    return ShapeRevealUtils.reveal(() => applyLook(look), opts);
};
