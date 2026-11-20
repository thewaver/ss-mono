import { describe, expect, it } from "vitest";

import { SignalMirrorUtils } from "./SignalMirror.utils";

type Moment = { day: number; time: number };

const createWhole = (initial: Moment | undefined) => {
    let whole = initial;
    const writes: (Moment | undefined)[] = [];

    return {
        signal: [
            () => whole,
            (next: Moment | undefined) => {
                whole = next;
                writes.push(next);
            },
        ] as [() => Moment | undefined, (value: Moment | undefined) => void],
        writes,
        get: () => whole,
    };
};

const DEFS = {
    compose: (day: number, time: number): Moment | undefined => ({ day, time }),
    decompose: (whole: Moment): [number, number] => [whole.day, whole.time],
    getIsSame: (a: Moment | undefined, b: Moment | undefined) => a?.day === b?.day && a?.time === b?.time,
};

describe("SignalMirrorUtils.createSplitter", () => {
    it("starts from the halves of the whole value as it is", () => {
        const whole = createWhole({ day: 3, time: 9 });
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        expect(splitter.get()).toEqual({ first: 3, second: 9 });
    });

    it("writes nothing while only one half is filled in, and the pair once both are", () => {
        const whole = createWhole(undefined);
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        splitter.setSecond(9);

        expect(whole.writes).toEqual([]);

        splitter.setFirst(3);

        expect(whole.writes).toEqual([{ day: 3, time: 9 }]);
    });

    it("keeps the other half when its own cleared write comes back as the whole value", () => {
        const whole = createWhole({ day: 3, time: 9 });
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        splitter.setFirst(undefined);
        splitter.receive(whole.get());

        expect(whole.writes).toEqual([undefined]);
        expect(splitter.get()).toEqual({ first: undefined, second: 9 });
    });

    it("clears both halves when the whole value is cleared from outside", () => {
        const whole = createWhole({ day: 3, time: 9 });
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        splitter.receive(undefined);

        expect(splitter.get()).toEqual({ first: undefined, second: undefined });
    });

    it("splits a whole value handed in from outside", () => {
        const whole = createWhole(undefined);
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        splitter.receive({ day: 5, time: 1 });

        expect(splitter.get()).toEqual({ first: 5, second: 1 });
    });

    it("reports nothing for a pair compose refuses", () => {
        const whole = createWhole(undefined);
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, { ...DEFS, compose: () => undefined });

        splitter.setFirst(3);
        splitter.setSecond(9);

        expect(whole.writes).toEqual([]);
        expect(splitter.get()).toEqual({ first: 3, second: 9 });
    });

    it("does not pass on a write that leaves the whole value as it was", () => {
        const whole = createWhole({ day: 3, time: 9 });
        const splitter = SignalMirrorUtils.createSplitter(whole.signal, DEFS);

        splitter.setFirst(3);

        expect(whole.writes).toEqual([]);
    });
});
