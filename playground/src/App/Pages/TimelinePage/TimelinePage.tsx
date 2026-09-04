import { createMemo, createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { MeetingsExample } from "./Examples/Meetings";
import { TracksExample } from "./Examples/Tracks";
import { DAY, REEL, formatClock, formatStopwatch } from "./TimelinePage.const";
import type { TimelineExampleProps } from "./TimelinePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TimelinePage/Examples";

const MIN_LANE_SIZE = 20;
const MAX_LANE_SIZE = 64;
const LANE_SIZE_STEP = 2;
const STARTING_LANE_SIZE = 32;
const MIN_TICK_GAP = 24;
const MAX_TICK_GAP = 200;
const TICK_GAP_STEP = 4;
const STARTING_TICK_GAP = 72;
const FIELD_WIDTH = 90;
const MIN_COLUMN_WIDTH = 520;

export const TimelinePage = () => {
    const [getLaneSize, setLaneSize] = createSignal(STARTING_LANE_SIZE);
    const [getMinTickGap, setMinTickGap] = createSignal(STARTING_TICK_GAP);
    const [getIsPannable, setIsPannable] = createSignal(true);
    const [getIsZoomable, setIsZoomable] = createSignal(true);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getPicked, setPicked] = createSignal("nothing yet");

    const daySignal = createSignal(DAY);
    const reelSignal = createSignal(REEL);

    const reset = () => {
        daySignal[1](DAY);
        reelSignal[1](REEL);
        setPicked("nothing yet");
    };

    const getExamples = createMemo(() => {
        const commonProps: Omit<TimelineExampleProps, "viewSignal"> = {
            laneSize: getLaneSize,
            minTickGap: getMinTickGap,
            isPannable: getIsPannable,
            isZoomable: getIsZoomable,
            isDisabled: getIsDisabled,
            onPick: setPicked,
        };

        return [
            {
                key: "meetings",
                name: "A day of meetings",
                readout: () =>
                    `showing ${formatClock(daySignal[0]().start)} to ${formatClock(daySignal[0]().end)} — the lanes are the component's own answer to what overlaps, and it takes the gestures itself: the wheel zooms where the pointer is, a drag moves the window, and a press that never travels still picks the meeting under it`,
                component: () => <MeetingsExample {...commonProps} viewSignal={daySignal} />,
                path: `${EXAMPLES_ROOT}/Meetings.tsx`,
            },
            {
                key: "tracks",
                name: "Three tracks",
                readout: () =>
                    `showing ${formatStopwatch(reelSignal[0]().start)} to ${formatStopwatch(reelSignal[0]().end)} — here the page says which lane each clip belongs to, and the buttons are the route for anyone who cannot drag or pinch`,
                component: () => <TracksExample {...commonProps} viewSignal={reelSignal} />,
                path: `${EXAMPLES_ROOT}/Tracks.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"laneSize"} label={"Lane size (px)"}>
                    <PageNumberField
                        value={getLaneSize}
                        min={() => MIN_LANE_SIZE}
                        max={() => MAX_LANE_SIZE}
                        step={() => LANE_SIZE_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Lane size in pixels"}
                        onInput={setLaneSize}
                    />
                </PageProp>

                <PageProp key={"minTickGap"} label={"Smallest tick gap (px)"}>
                    <PageNumberField
                        value={getMinTickGap}
                        min={() => MIN_TICK_GAP}
                        max={() => MAX_TICK_GAP}
                        step={() => TICK_GAP_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Smallest tick gap in pixels"}
                        onInput={setMinTickGap}
                    />
                </PageProp>

                <PageProp key={"isPannable"} label={"Drag to move"}>
                    <PageCheckField value={getIsPannable} ariaLabel={"Drag to move"} onChange={setIsPannable} />
                </PageProp>

                <PageProp key={"isZoomable"} label={"Wheel and pinch to zoom"}>
                    <PageCheckField
                        value={getIsZoomable}
                        ariaLabel={"Wheel and pinch to zoom"}
                        onChange={setIsZoomable}
                    />
                </PageProp>

                <PageProp key={"isDisabled"} label={"Disabled"}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp key={"picked"} label={`Picked: ${getPicked()}`}>
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={() => MIN_COLUMN_WIDTH} />
        </>
    );
};
