import { useCallback, useMemo, useState } from "react";

import {
    CorridorLayoutDefaults,
    type CorridorLayoutEntry,
    CorridorLayoutUtils,
    CorridorLayouts,
    INFINITE_CORRIDOR_DEFAULTS,
} from "@thewaver/ss-components-react";
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
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageReact.types";

const ScrolledExampleWrapper = (props: InfiniteCorridorExampleProps) => {
    const [scrollLength, setScrollLength] = useState(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

    return (
        <>
            <ScrolledExample {...props} scrollLength={scrollLength} />

            <PageExampleKnobs>
                <PageProp itemKey={"scrollLength"} {...InfiniteCorridorKnobs.SCROLL_LENGTH_TEXT}>
                    <PageNumberField
                        value={scrollLength}
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

const ClockExampleWrapper = (props: InfiniteCorridorExampleProps & { startingLapMs: number }) => {
    const [lapMs, setLapMs] = useState(props.startingLapMs);
    const [followedStartingLapMs, setFollowedStartingLapMs] = useState(props.startingLapMs);

    if (props.startingLapMs !== followedStartingLapMs) {
        setFollowedStartingLapMs(props.startingLapMs);
        setLapMs(props.startingLapMs);
    }

    return (
        <>
            <ClockExample {...props} lapMs={lapMs} />

            <PageExampleKnobs>
                <PageProp itemKey={"lapMs"} {...InfiniteCorridorKnobs.LAP_MS_TEXT}>
                    <PageNumberField
                        value={lapMs}
                        resetValue={props.startingLapMs}
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

const NO_DEFS: Record<string, number | boolean> = {};

export const InfiniteCorridorPage = () => {
    const [layoutKey, setLayoutKey] = useState<CorridorLayouts.SampleKey>(InfiniteCorridorKnobs.STARTING_LAYOUT);
    const [itemCount, setItemCount] = useState(InfiniteCorridorKnobs.STARTING_ITEM_COUNT);
    const [glideDurationMs, setGlideDurationMs] = useState(INFINITE_CORRIDOR_DEFAULTS.glideDurationMs);

    const [spinDegreesPerSecond, setSpinDegreesPerSecond] = useState(
        CorridorLayoutKnobs.STARTING_SPIN_DEGREES_PER_SECOND,
    );
    const [layoutDefs, setLayoutDefs] = useState<Record<string, Record<string, number | boolean>>>({});

    const family = CorridorLayouts.SAMPLE_LAYOUTS[layoutKey].family;
    const knobs = CorridorLayoutKnobs.KNOBS_BY_FAMILY[family] as Record<string, Knob>;
    const defaults = CorridorLayoutDefaults.DEFAULTS_BY_FAMILY[family] as Record<string, unknown>;
    const defs = layoutDefs[layoutKey] ?? NO_DEFS;

    const toLayout = useCallback(
        (spinDegrees: number) =>
            CorridorLayoutUtils.toLayoutRule({
                family,
                defs: { spinDegrees, ...defs },
            } as unknown as CorridorLayoutEntry),
        [family, defs],
    );

    const items = useMemo(() => Array.from({ length: itemCount }, (_, index) => toRoomName(index)), [itemCount]);

    const commonProps: InfiniteCorridorExampleProps = {
        items,
        glideDurationMs,
        spinDegreesPerSecond: family === "tube" ? spinDegreesPerSecond : 0,
        toLayout,
    };

    const examples = [
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
                    startingLapMs={InfiniteCorridorKnobs.STARTING_LAP_MS_BY_FAMILY[family]}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clock.tsx`,
        },
    ];

    return (
        <>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp itemKey={"layout"} {...InfiniteCorridorKnobs.LAYOUT_TEXT}>
                        <PageSelectField
                            value={layoutKey}
                            values={CorridorLayouts.SAMPLE_KEYS}
                            width={LAYOUT_FIELD_WIDTH}
                            ariaLabel={"Layout"}
                            onChange={setLayoutKey}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={knobs}
                        defaults={defaults}
                        values={defs}
                        width={FIELD_WIDTH}
                        onInput={(key, value) =>
                            setLayoutDefs((previous) => ({
                                ...previous,
                                [layoutKey]: { ...previous[layoutKey], [key]: value },
                            }))
                        }
                    />

                    {family === "tube" && (
                        <PageProp
                            itemKey={"spinDegreesPerSecond"}
                            {...InfiniteCorridorKnobs.SPIN_DEGREES_PER_SECOND_TEXT}
                        >
                            <PageNumberField
                                value={spinDegreesPerSecond}
                                min={CorridorLayoutKnobs.MIN_SPIN_DEGREES_PER_SECOND}
                                max={CorridorLayoutKnobs.MAX_SPIN_DEGREES_PER_SECOND}
                                step={CorridorLayoutKnobs.SPIN_STEP_DEGREES_PER_SECOND}
                                width={FIELD_WIDTH}
                                ariaLabel={"Rotation speed in degrees per second"}
                                onInput={setSpinDegreesPerSecond}
                            />
                        </PageProp>
                    )}
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp itemKey={"itemCount"} {...InfiniteCorridorKnobs.ITEM_COUNT_TEXT}>
                        <PageNumberField
                            value={itemCount}
                            min={InfiniteCorridorKnobs.MIN_ITEM_COUNT}
                            max={InfiniteCorridorKnobs.MAX_ITEM_COUNT}
                            step={InfiniteCorridorKnobs.ITEM_COUNT_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Item count"}
                            onInput={setItemCount}
                        />
                    </PageProp>

                    <PageProp itemKey={"glideDurationMs"} {...InfiniteCorridorKnobs.GLIDE_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={glideDurationMs}
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

            <PageExamples items={examples} />
        </>
    );
};
