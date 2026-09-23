import { createMemo, createSignal } from "solid-js";

import { Button } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckField } from "../../StyledComponents/Field/Field";
import { MeetingsExample } from "./Examples/Meetings";
import { TracksExample } from "./Examples/Tracks";
import { TrimExample } from "./Examples/Trim";
import { DAY, REEL, TRIM_CLIPS, formatClock, formatStopwatch } from "./TimelinePage.const";
import type { Clip, TimelineExampleProps } from "./TimelinePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TimelinePage/Examples";

export const TimelinePage = () => {
    const [getIsPannable, setIsPannable] = createSignal(true);
    const [getIsZoomable, setIsZoomable] = createSignal(true);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getPicked, setPicked] = createSignal("nothing yet");

    const daySignal = createSignal(DAY);
    const reelSignal = createSignal(REEL);
    const trimReelSignal = createSignal(REEL);
    const trimClipsSignal = createSignal(TRIM_CLIPS);
    const [getTrimmed, setTrimmed] = createSignal<Clip>();

    const reset = () => {
        daySignal[1](DAY);
        reelSignal[1](REEL);
        trimReelSignal[1](REEL);
        trimClipsSignal[1](TRIM_CLIPS);
        setTrimmed(undefined);
        setPicked("nothing yet");
    };

    const getTrimReadout = () => {
        const trimmed = getTrimmed();

        return trimmed === undefined
            ? "nothing trimmed yet"
            : `${trimmed.name} now runs ${formatStopwatch(trimmed.from)} to ${formatStopwatch(trimmed.to)}`;
    };

    const getExamples = createMemo(() => {
        const commonProps: Omit<TimelineExampleProps, "viewSignal"> = {
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
                    `showing ${formatClock(daySignal[0]().start)} to ${formatClock(daySignal[0]().end)} — the lanes are the component's own answer to what overlaps, and it takes the gestures itself: the wheel zooms where the pointer is, a drag moves the window, and a press that never travels still picks the meeting under it. The red line is a marker at the time on this computer's clock, and it is only drawn while that time is inside the day shown`,
                component: () => <MeetingsExample {...commonProps} viewSignal={daySignal} />,
                path: `${EXAMPLES_ROOT}/Meetings.tsx`,
            },
            {
                key: "tracks",
                name: "Three tracks",
                readout: () =>
                    `showing ${formatStopwatch(reelSignal[0]().start)} to ${formatStopwatch(reelSignal[0]().end)} — here the page says which lane each clip belongs to, and the buttons are the route for anyone who cannot drag or pinch. The orange line is a marker the page moves while it plays`,
                component: () => <TracksExample {...commonProps} viewSignal={reelSignal} />,
                path: `${EXAMPLES_ROOT}/Tracks.tsx`,
            },
            {
                key: "trim",
                name: "Trimming clips",
                readout: () =>
                    `${getTrimReadout()} — drag either end of a clip, or press an end and then press where it should go; from the keyboard, Enter takes hold of a clip's end, Home and End switch ends, the arrows move it a second at a time, Enter drops it and Escape puts it back`,
                component: () => (
                    <TrimExample
                        {...commonProps}
                        viewSignal={trimReelSignal}
                        clipsSignal={trimClipsSignal}
                        onTrim={setTrimmed}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Trim.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"isPannable"}
                    label={"Drag to move"}
                    hint={"Lets the timeline be dragged sideways to move through it."}
                >
                    <PageCheckField value={getIsPannable} ariaLabel={"Drag to move"} onChange={setIsPannable} />
                </PageProp>

                <PageProp
                    key={"isZoomable"}
                    label={"Wheel and pinch to zoom"}
                    hint={"Lets the wheel and a pinch change how much of the timeline is in view."}
                >
                    <PageCheckField
                        value={getIsZoomable}
                        ariaLabel={"Wheel and pinch to zoom"}
                        onChange={setIsZoomable}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the timeline off, so it neither pans, zooms nor picks."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"picked"}
                    label={`Picked: ${getPicked()}`}
                    hint={
                        "Puts the examples back to the item they started on, and clears whatever has been picked since."
                    }
                >
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={520} />
        </>
    );
};
