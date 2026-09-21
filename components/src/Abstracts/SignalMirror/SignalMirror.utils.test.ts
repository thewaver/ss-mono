import { createRoot, createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { SignalMirrorUtils } from "./SignalMirror.utils";

type Minutes = { minutes: number };
type Clock = { hours: number; minutes: number };

const withRoot = <T>(build: () => T, run: (built: T) => void) => {
    let built!: T;

    const dispose = createRoot((disposeRoot) => {
        built = build();

        return disposeRoot;
    });

    run(built);
    dispose();
};

const toClock = (minutes: number): Clock => ({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });

const toMinutes = (clock: Clock) => clock.hours * 60 + clock.minutes;

describe("createPassThrough", () => {
    it("reads the current value rather than a copy taken when it was built", () => {
        const [getValue, setValue] = createSignal("first");
        const [getMirrored] = SignalMirrorUtils.createPassThrough(getValue, setValue);

        expect(getMirrored()).toBe("first");

        setValue("second");

        expect(getMirrored()).toBe("second");
    });

    it("sends a write straight out to the setter it was given", () => {
        const [getValue, setValue] = createSignal("first");
        const [, setMirrored] = SignalMirrorUtils.createPassThrough(getValue, setValue);

        setMirrored("second");

        expect(getValue()).toBe("second");
    });

    it("hands the previous value to a function-form write", () => {
        const [getValue, setValue] = createSignal(2);
        const [, setMirrored] = SignalMirrorUtils.createPassThrough(getValue, setValue);

        setMirrored((previous) => previous * 5);

        expect(getValue()).toBe(10);
    });

    it("drops a write that changes nothing, so a parent listening for changes is not woken by one", () => {
        const written: string[] = [];
        const [getValue, setValue] = createSignal("first");
        const [, setMirrored] = SignalMirrorUtils.createPassThrough(getValue, (value) => {
            written.push(value);
            setValue(value);
        });

        setMirrored("first");

        expect(written).toEqual([]);

        setMirrored("second");

        expect(written).toEqual(["second"]);
    });
});

describe("createOptional", () => {
    it("keeps its own value when the caller supplied no signal", () => {
        const [getValue, setValue] = SignalMirrorUtils.createOptional<string>(() => undefined, "fallback");

        expect(getValue()).toBe("fallback");

        setValue("typed");

        expect(getValue()).toBe("typed");
    });

    it("reads and writes the caller's signal when there is one, leaving the initial value unused", () => {
        const outer = createSignal("theirs");
        const [getValue, setValue] = SignalMirrorUtils.createOptional(() => outer, "fallback");

        expect(getValue()).toBe("theirs");

        setValue("typed");

        expect(outer[0]()).toBe("typed");
    });

    it("switches to a signal the caller supplies later, and that signal's value wins over what was typed", () => {
        const [getSource, setSource] = createSignal<ReturnType<typeof createSignal<string>>>();
        const [getValue, setValue] = SignalMirrorUtils.createOptional(() => getSource(), "fallback");

        setValue("typed");

        expect(getValue()).toBe("typed");

        const outer = createSignal("theirs");

        setSource(() => outer);

        expect(getValue(), "the caller now owns the value, so what was typed into the fallback is gone").toBe("theirs");
    });
});

describe("createMirror", () => {
    it("seeds the inner value by converting the outer one", () => {
        withRoot(
            () => {
                const [getOuter, setOuter] = createSignal(90);

                return SignalMirrorUtils.createMirror(getOuter, setOuter, { toInner: toClock, toOuter: toMinutes });
            },
            ([getInner]) => {
                expect(getInner()).toEqual({ hours: 1, minutes: 30 });
            },
        );
    });

    it("converts an outer change on its way in", () => {
        withRoot(
            () => {
                const outer = createSignal(90);
                const inner = SignalMirrorUtils.createMirror(outer[0], outer[1], {
                    toInner: toClock,
                    toOuter: toMinutes,
                });

                return { outer, inner };
            },
            ({ outer, inner }) => {
                outer[1](45);

                expect(inner[0]()).toEqual({ hours: 0, minutes: 45 });
            },
        );
    });

    it("converts an inner change on its way out", () => {
        withRoot(
            () => {
                const outer = createSignal(90);
                const inner = SignalMirrorUtils.createMirror(outer[0], outer[1], {
                    toInner: toClock,
                    toOuter: toMinutes,
                });

                return { outer, inner };
            },
            ({ outer, inner }) => {
                inner[1]({ hours: 2, minutes: 0 });

                expect(outer[0]()).toBe(120);
            },
        );
    });

    it("settles after one pass instead of bouncing the value between the two sides", () => {
        const written: number[] = [];

        withRoot(
            () => {
                const [getOuter, setOuter] = createSignal(90);

                return SignalMirrorUtils.createMirror(
                    getOuter,
                    (value) => {
                        written.push(value);
                        setOuter(value);
                    },
                    { toInner: toClock, toOuter: toMinutes },
                );
            },
            ([, setInner]) => {
                expect(written, "seeding the inner side is not a change to the outer one").toEqual([]);

                setInner({ hours: 2, minutes: 0 });

                expect(written, "and one inner edit reaches the outer side exactly once").toEqual([120]);
            },
        );
    });

    it("leaves the inner value alone when a fresh outer object says the same thing", () => {
        withRoot(
            () => {
                const outer = createSignal<Minutes>({ minutes: 90 });
                const inner = SignalMirrorUtils.createMirror(outer[0], outer[1], {
                    toInner: (value: Minutes) => toClock(value.minutes),
                    toOuter: (value: Clock) => ({ minutes: toMinutes(value) }),
                    getIsSame: (a, b) => a.minutes === b.minutes,
                });

                return { outer, inner };
            },
            ({ outer, inner }) => {
                const seeded = inner[0]();

                outer[1]({ minutes: 90 });

                expect(inner[0](), "the same reading in a new object is not an edit").toBe(seeded);

                outer[1]({ minutes: 91 });

                expect(inner[0](), "a different reading is").not.toBe(seeded);
            },
        );
    });
});

describe("createValueMirror", () => {
    it("carries the value both ways with no conversion", () => {
        withRoot(
            () => {
                const outer = createSignal("first");
                const inner = SignalMirrorUtils.createValueMirror(outer[0], outer[1]);

                return { outer, inner };
            },
            ({ outer, inner }) => {
                expect(inner[0]()).toBe("first");

                outer[1]("second");

                expect(inner[0]()).toBe("second");

                inner[1]("third");

                expect(outer[0]()).toBe("third");
            },
        );
    });

    it("takes a comparison for values that are equal without being the same object", () => {
        const written: Clock[] = [];

        withRoot(
            () => {
                const [getOuter, setOuter] = createSignal<Clock>({ hours: 1, minutes: 30 });

                return SignalMirrorUtils.createValueMirror(
                    getOuter,
                    (value) => {
                        written.push(value);
                        setOuter(value);
                    },
                    (a, b) => a.hours === b.hours && a.minutes === b.minutes,
                );
            },
            ([, setInner]) => {
                setInner({ hours: 1, minutes: 30 });

                expect(written).toEqual([]);

                setInner({ hours: 2, minutes: 0 });

                expect(written).toEqual([{ hours: 2, minutes: 0 }]);
            },
        );
    });
});

describe("createSplit", () => {
    const compose = (first: number, second: number) => ({ first, second });
    const decompose = (whole: { first: number; second: number }): [number, number] => [whole.first, whole.second];
    const getIsSame = (
        a: { first: number; second: number } | undefined,
        b: { first: number; second: number } | undefined,
    ) => a?.first === b?.first && a?.second === b?.second;

    const build = (initial?: { first: number; second: number }) =>
        createRoot(() => {
            const outer = createSignal<{ first: number; second: number } | undefined>(initial);
            const halves = SignalMirrorUtils.createSplit(outer, { compose, decompose, getIsSame });

            return { outer, ...halves };
        });

    it("reports nothing until both halves are filled in", () => {
        const { outer, firstSignal, secondSignal } = build();

        firstSignal[1](1);
        expect(outer[0]()).toBe(undefined);

        secondSignal[1](2);
        expect(outer[0]()).toEqual({ first: 1, second: 2 });
    });

    it("keeps the other half when one is cleared from inside", () => {
        const { outer, firstSignal, secondSignal } = build({ first: 1, second: 2 });

        secondSignal[1](undefined);

        expect(outer[0](), "the pair is no longer reportable").toBe(undefined);
        expect(firstSignal[0](), "but the half nobody touched is still held").toBe(1);

        secondSignal[1](3);
        expect(outer[0](), "so retyping it brings the pair straight back").toEqual({ first: 1, second: 3 });
    });

    it("clears both halves when the clear comes from outside", () => {
        const { outer, firstSignal, secondSignal } = build({ first: 1, second: 2 });

        outer[1](undefined);

        expect(firstSignal[0]()).toBe(undefined);
        expect(secondSignal[0]()).toBe(undefined);
    });

    it("tells an outside clear from the echo of an inside one", () => {
        const { outer, firstSignal, secondSignal } = build({ first: 1, second: 2 });

        secondSignal[1](undefined);

        expect(outer[0](), "the pair stops being reportable").toBe(undefined);
        expect(firstSignal[0](), "and the echo of our own write leaves the held half alone").toBe(1);

        outer[1]({ first: 9, second: 9 });

        expect(firstSignal[0](), "while a real write from outside still reaches both halves").toBe(9);
    });

    it("cannot see a consumer clearing a value that is already cleared, which is a limit of signals", () => {
        const { outer, firstSignal, secondSignal } = build({ first: 1, second: 2 });

        secondSignal[1](undefined);
        outer[1](undefined);

        expect(firstSignal[0](), "the outer value never changed, so nothing was there to hear").toBe(1);
    });

    it("pushes a whole value in from outside", () => {
        const { outer, firstSignal, secondSignal } = build();

        outer[1]({ first: 7, second: 8 });

        expect(firstSignal[0]()).toBe(7);
        expect(secondSignal[0]()).toBe(8);
    });
});
