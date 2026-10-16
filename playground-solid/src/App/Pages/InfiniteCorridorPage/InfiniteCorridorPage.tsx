import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CorridorLayoutDefaults,
    type CorridorLayoutEntry,
    CorridorLayoutUtils,
    CorridorLayouts,
    INFINITE_CORRIDOR_DEFAULTS,
} from "@thewaver/ss-components-solid";
import { CorridorLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/CorridorLayouts.const";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    LAYOUT_FIELD_WIDTH,
    toRoomName,
} from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ClockExample } from "./Examples/Clock";
import { ScrolledExample } from "./Examples/Scrolled";
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageSolid.types";

const MS_PER_SECOND = 1000;
const FULL_TURN = 360;

export const InfiniteCorridorPage = () => {
    const [getLayoutKey, setLayoutKey] = createSignal<CorridorLayouts.SampleKey>(InfiniteCorridorKnobs.STARTING_LAYOUT);
    const [getItemCount, setItemCount] = createSignal(InfiniteCorridorKnobs.STARTING_ITEM_COUNT);
    const [getGlideDurationMs, setGlideDurationMs] = createSignal(INFINITE_CORRIDOR_DEFAULTS.glideDurationMs);

    const [getSpinDegreesPerSecond, setSpinDegreesPerSecond] = createSignal(
        CorridorLayoutKnobs.STARTING_SPIN_DEGREES_PER_SECOND,
    );
    const [getSpinDegrees, setSpinDegrees] = createSignal(0);
    const [layoutDefs, setLayoutDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getFamily = () => CorridorLayouts.SAMPLE_LAYOUTS[getLayoutKey()].family;
    const getKnobs = () => CorridorLayoutKnobs.KNOBS_BY_FAMILY[getFamily()] as Record<string, Knob>;
    const getDefaults = () => CorridorLayoutDefaults.DEFAULTS_BY_FAMILY[getFamily()] as Record<string, unknown>;
    const getDefs = () => layoutDefs[getLayoutKey()] ?? {};

    createEffect(() => {
        const degreesPerSecond = getSpinDegreesPerSecond();

        if (getFamily() !== "tube" || degreesPerSecond === 0) return;

        let frameId: number;
        let lastMs = performance.now();

        const spin = () => {
            const nowMs = performance.now();

            setSpinDegrees((degrees) => (degrees + ((nowMs - lastMs) / MS_PER_SECOND) * degreesPerSecond) % FULL_TURN);
            lastMs = nowMs;
            frameId = requestAnimationFrame(spin);
        };

        frameId = requestAnimationFrame(spin);

        onCleanup(() => cancelAnimationFrame(frameId));
    });

    const getLayout = createMemo(() =>
        CorridorLayoutUtils.toLayoutRule({
            family: getFamily(),
            defs: { spinDegrees: getSpinDegrees(), ...getDefs() },
        } as unknown as CorridorLayoutEntry),
    );

    const getItems = createMemo(() => Array.from({ length: getItemCount() }, (_, index) => toRoomName(index)));

    const getExamples = createMemo(() => {
        const commonProps: InfiniteCorridorExampleProps = {
            items: getItems,
            glideDurationMs: getGlideDurationMs,
            startingLapMs: () => InfiniteCorridorKnobs.STARTING_LAP_MS_BY_FAMILY[getFamily()],
            get layout() {
                return getLayout();
            },
        };

        return [
            {
                key: "scrolled",
                name: EXAMPLE_NAMES.scrolled,
                readout: () =>
                    "scrolling the box walks the corridor one lap from top to bottom — Tab to a room out of view and the corridor brings it in, scrolling the box there",
                component: () => <ScrolledExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
            },
            {
                key: "clock",
                name: EXAMPLE_NAMES.clock,
                readout: () =>
                    "the progress is advanced on every frame, so the corridor walks by itself until paused — it starts paused when the visitor has asked for reduced motion",
                component: () => <ClockExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Clock.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"layout"}
                        label={"Layout"}
                        hint={
                            "Where the items stand: walls is one row on each wall, from flat against it to turned towards the viewer, and tube lines the inside of a ring of sides, every item upright towards the centre. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageSelectField
                            value={getLayoutKey}
                            values={() => CorridorLayouts.SAMPLE_KEYS}
                            width={() => LAYOUT_FIELD_WIDTH}
                            ariaLabel={"Layout"}
                            onChange={(key) => setLayoutKey(() => key)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getKnobs}
                        defaults={getDefaults}
                        values={getDefs}
                        width={() => FIELD_WIDTH}
                        onInput={(key, value) =>
                            setLayoutDefs(getLayoutKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />

                    <Show when={getFamily() === "tube"}>
                        <PageProp
                            key={"spinDegreesPerSecond"}
                            label={"Rotation speed (°/s)"}
                            hint={
                                "How fast the tube spins round its axis, whatever the corridor's position. The page turns the layout's spinDegrees on a clock; 0 stops it, and below 0 spins it the other way."
                            }
                        >
                            <PageNumberField
                                value={getSpinDegreesPerSecond}
                                min={() => CorridorLayoutKnobs.MIN_SPIN_DEGREES_PER_SECOND}
                                max={() => CorridorLayoutKnobs.MAX_SPIN_DEGREES_PER_SECOND}
                                step={() => CorridorLayoutKnobs.SPIN_STEP_DEGREES_PER_SECOND}
                                width={() => FIELD_WIDTH}
                                ariaLabel={"Rotation speed in degrees per second"}
                                onInput={setSpinDegreesPerSecond}
                            />
                        </PageProp>
                    </Show>
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        key={"itemCount"}
                        label={"Item count"}
                        hint={
                            "How many rooms line the corridor. Too few to fill it are repeated, and only the copy nearest the viewer can be reached."
                        }
                    >
                        <PageNumberField
                            value={getItemCount}
                            min={() => InfiniteCorridorKnobs.MIN_ITEM_COUNT}
                            max={() => InfiniteCorridorKnobs.MAX_ITEM_COUNT}
                            step={() => InfiniteCorridorKnobs.ITEM_COUNT_STEP}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Item count"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp
                        key={"glideDurationMs"}
                        label={"Glide (ms)"}
                        hint={
                            "How long the corridor takes to bring a room into view when it is tabbed to from out of view. It times nothing else, so it shows only on Tab."
                        }
                    >
                        <PageNumberField
                            value={getGlideDurationMs}
                            min={() => InfiniteCorridorKnobs.MIN_GLIDE_DURATION_MS}
                            max={() => InfiniteCorridorKnobs.MAX_GLIDE_DURATION_MS}
                            step={() => InfiniteCorridorKnobs.GLIDE_DURATION_STEP_MS}
                            width={() => FIELD_WIDTH}
                            ariaLabel={"Glide duration in milliseconds"}
                            onInput={setGlideDurationMs}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} />
        </>
    );
};
