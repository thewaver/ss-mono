export type ImageSwitcherState = {
    prevSrc: string | undefined;
    currentSrc: string | undefined;
    version: number;
};

export type ImageSwitcherLayer = {
    src: string | undefined;
    isShown: boolean;
};
