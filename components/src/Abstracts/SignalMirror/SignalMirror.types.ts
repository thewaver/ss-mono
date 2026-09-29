import type { Store } from "@thewaver/ss-utils";

export type SignalMirrorSplitHalves<TFirst, TSecond> = {
    first: TFirst | undefined;
    second: TSecond | undefined;
};

export type SignalMirrorSplitDefs<TWhole, TFirst, TSecond> = {
    compose: (first: TFirst, second: TSecond) => TWhole | undefined;
    decompose: (whole: TWhole) => [TFirst, TSecond];
    getIsSame: (a: TWhole | undefined, b: TWhole | undefined) => boolean;
};

export type SignalMirrorSplitter<TWhole, TFirst, TSecond> = Store<SignalMirrorSplitHalves<TFirst, TSecond>> & {
    receive: (whole: TWhole | undefined) => void;
    setFirst: (first: TFirst | undefined) => void;
    setSecond: (second: TSecond | undefined) => void;
};
