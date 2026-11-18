import { Show, createEffect, createMemo, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CorridorLayoutDefaults,
    type CorridorLayoutEntry,
    CorridorLayoutUtils,
    CorridorLayouts,
    INFINITE_CORRIDOR_DEFAULTS,
    access,
} from "@thewaver/ss-components-solid";
import type { AccessorValues } from "@thewaver/ss-components-solid";
import { CorridorLayoutKnobs } from "@thewaver/ss-playground/App/Knobs/CorridorLayouts.const";
import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    LAYOUT_FIELD_WIDTH,
    toRoomName,
} from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ClockExample } from "./Examples/Clock";
import { ScrolledExample } from "./Examples/Scrolled";
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageSolid.types";

const ScrolledExampleWrapper = (props: InfiniteCorridorExampleProps) => {
    const [getScrollLength, setScrollLength] = createSignal(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

    return (
        <>
            <ScrolledExample {...props} scrollLength={getScrollLength} />

            <PageExampleKnobs>
                <PageProp key={"scrollLength"} {...InfiniteCorridorKnobs.SCROLL_LENGTH_TEXT}>
                    <PageNumberField
                        value={getScrollLength}
                        min={InfiniteCorridorKnobs.MIN_SCROLL_LENGTH}
                        max={InfiniteCorridorKnobs.MAX_SCROLL_LENGTH}
                        step={InfiniteCorridorKnobs.SCROLL_LENGTH_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Scroll length in box heights"}
                        onInput={setScrollLength}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ClockExampleWrapper = (props: InfiniteCorridorExampleProps & AccessorValues<{ startingLapMs: number }>) => {
    const [getLapMs, setLapMs] = createSignal(access(props.startingLapMs));

    createEffect(on(() => access(props.startingLapMs), setLapMs, { defer: true }));

    return (
        <>
            <ClockExample {...props} lapMs={getLapMs} />

            <PageExampleKnobs>
                <PageProp key={"lapMs"} {...InfiniteCorridorKnobs.LAP_MS_TEXT}>
                    <PageNumberField
                        value={getLapMs}
                        resetValue={() => access(props.startingLapMs)}
                        min={InfiniteCorridorKnobs.MIN_LAP_MS}
                        max={InfiniteCorridorKnobs.MAX_LAP_MS}
                        step={InfiniteCorridorKnobs.LAP_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"Lap duration in milliseconds"}
                        onInput={setLapMs}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const InfiniteCorridorPage = () => {
    const [getLayoutKey, setLayoutKey] = createSignal<CorridorLayouts.SampleKey>(InfiniteCorridorKnobs.STARTING_LAYOUT);
    const [getItemCount, setItemCount] = createSignal(InfiniteCorridorKnobs.STARTING_ITEM_COUNT);
    const [getGlideDurationMs, setGlideDurationMs] = createSignal(INFINITE_CORRIDOR_DEFAULTS.glideDurationMs);

    const [getSpinDegreesPerSecond, setSpinDegreesPerSecond] = createSignal(
        CorridorLayoutKnobs.STARTING_SPIN_DEGREES_PER_SECOND,
    );
    const [layoutDefs, setLayoutDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getFamily = () => CorridorLayouts.SAMPLE_LAYOUTS[getLayoutKey()].family;
    const getKnobs = () => CorridorLayoutKnobs.KNOBS_BY_FAMILY[getFamily()] as Record<string, Knob>;
    const getDefaults = () => CorridorLayoutDefaults.DEFAULTS_BY_FAMILY[getFamily()] as Record<string, unknown>;
    const getDefs = () => layoutDefs[getLayoutKey()] ?? {};

    const toLayout = (spinDegrees: number) =>
        CorridorLayoutUtils.toLayoutRule({
            family: getFamily(),
            defs: { spinDegrees, ...getDefs() },
        } as unknown as CorridorLayoutEntry);

    const getItems = createMemo(() => Array.from({ length: getItemCount() }, (_, index) => toRoomName(index)));

    const getExamples = createMemo(() => {
        const commonProps: InfiniteCorridorExampleProps = {
            items: getItems,
            glideDurationMs: getGlideDurationMs,
            spinDegreesPerSecond: () => (getFamily() === "tube" ? getSpinDegreesPerSecond() : 0),
            toLayout,
        };

        return [
            {
                key: "scrolled",
                name: EXAMPLE_NAMES.scrolled,
                readout: () =>
                    "scrolling the box walks the corridor one lap from top to bottom — Tab to a room out of view and the corridor brings it in, scrolling the box there",
                component: () => <ScrolledExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
            },
            {
                key: "clock",
                name: EXAMPLE_NAMES.clock,
                readout: () =>
                    "the progress is advanced on every frame, so the corridor walks by itself until paused — it starts paused when the visitor has asked for reduced motion",
                component: () => (
                    <ClockExampleWrapper
                        {...commonProps}
                        startingLapMs={() => InfiniteCorridorKnobs.STARTING_LAP_MS_BY_FAMILY[getFamily()]}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Clock.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp key={"layout"} {...InfiniteCorridorKnobs.LAYOUT_TEXT}>
                        <PageSelectField
                            value={getLayoutKey}
                            values={CorridorLayouts.SAMPLE_KEYS}
                            width={LAYOUT_FIELD_WIDTH}
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
                        <PageProp key={"spinDegreesPerSecond"} {...InfiniteCorridorKnobs.SPIN_DEGREES_PER_SECOND_TEXT}>
                            <PageNumberField
                                value={getSpinDegreesPerSecond}
                                min={CorridorLayoutKnobs.MIN_SPIN_DEGREES_PER_SECOND}
                                max={CorridorLayoutKnobs.MAX_SPIN_DEGREES_PER_SECOND}
                                step={CorridorLayoutKnobs.SPIN_STEP_DEGREES_PER_SECOND}
                                width={FIELD_WIDTH}
                                ariaLabel={"Rotation speed in degrees per second"}
                                onInput={setSpinDegreesPerSecond}
                            />
                        </PageProp>
                    </Show>
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp key={"itemCount"} {...InfiniteCorridorKnobs.ITEM_COUNT_TEXT}>
                        <PageNumberField
                            value={getItemCount}
                            min={InfiniteCorridorKnobs.MIN_ITEM_COUNT}
                            max={InfiniteCorridorKnobs.MAX_ITEM_COUNT}
                            step={InfiniteCorridorKnobs.ITEM_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Item count"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp key={"glideDurationMs"} {...InfiniteCorridorKnobs.GLIDE_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={getGlideDurationMs}
                            min={InfiniteCorridorKnobs.MIN_GLIDE_DURATION_MS}
                            max={InfiniteCorridorKnobs.MAX_GLIDE_DURATION_MS}
                            step={InfiniteCorridorKnobs.GLIDE_DURATION_STEP_MS}
                            width={FIELD_WIDTH}
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
