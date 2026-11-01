import { createContext, useContext, useState } from "react";

const PlaybackGroupContext = createContext<
    ((key: string) => readonly [boolean, (isPlaying: boolean) => void]) | undefined
>(undefined);

export const PlaybackGroupContextProvider = PlaybackGroupContext.Provider;

export const usePagePlayback = (key: string): readonly [boolean, (isPlaying: boolean) => void] => {
    const ownPlayback = useState(true);

    return useContext(PlaybackGroupContext)?.(key) ?? ownPlayback;
};
