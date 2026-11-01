import { createContext, createSignal, useContext } from "solid-js";

import type { SignalPair } from "@thewaver/ss-components-solid";

const PlaybackGroupContext = createContext<(key: string) => SignalPair<boolean>>();

export const PlaybackGroupContextProvider = PlaybackGroupContext.Provider;

export const usePagePlayback = (key: string): SignalPair<boolean> =>
    useContext(PlaybackGroupContext)?.(key) ?? createSignal(true);
