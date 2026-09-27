import { useState } from "react";

import { Button } from "@thewaver/ss-components-react";
import { TimelineKnobs } from "@thewaver/ss-playground-core/App/Knobs/Timelines.const";
import type { Clip } from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelineItems.types";
import {
    DAY,
    REEL,
    TRIM_CLIPS,
    formatClock,
    formatStopwatch,
} from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelinePage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { MeetingsExample } from "./Examples/Meetings";
import { TracksExample } from "./Examples/Tracks";
import { TrimExample } from "./Examples/Trim";
import type { TimelineExampleProps } from "./TimelinePage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TimelinePage/Examples";

export const TimelinePage = () => {
    const [isPannable, setIsPannable] = useState(TimelineKnobs.STARTING_IS_PANNABLE);
    const [isZoomable, setIsZoomable] = useState(TimelineKnobs.STARTING_IS_ZOOMABLE);
    const [isDisabled, setIsDisabled] = useState(TimelineKnobs.STARTING_IS_DISABLED);
    const [picked, setPicked] = useState("nothing yet");

    const dayState = useState(DAY);
    const reelState = useState(REEL);
    const trimReelState = useState(REEL);
    const trimClipsState = useState(TRIM_CLIPS);
    const [trimmed, setTrimmed] = useState<Clip>();

    const reset = () => {
        dayState[1](DAY);
        reelState[1](REEL);
        trimReelState[1](REEL);
        trimClipsState[1](TRIM_CLIPS);
        setTrimmed(undefined);
        setPicked("nothing yet");
    };

    const trimReadout =
        trimmed === undefined
            ? "nothing trimmed yet"
            : `${trimmed.name} now runs ${formatStopwatch(trimmed.from)} to ${formatStopwatch(trimmed.to)}`;

    const commonProps: Omit<TimelineExampleProps, "viewState"> = {
        isPannable,
        isZoomable,
        isDisabled,
        onPick: setPicked,
    };

    const examples = [
        {
            key: "meetings",
            name: "A day of meetings",
            readout: () =>
                `showing ${formatClock(dayState[0].start)} to ${formatClock(dayState[0].end)} — the lanes are the component's own answer to what overlaps, and it takes the gestures itself: the wheel zooms where the pointer is, a drag moves the window, and a press that never travels still picks the meeting under it. The red line is a marker at the time on this computer's clock, and it is only drawn while that time is inside the day shown`,
            component: () => <MeetingsExample {...commonProps} viewState={dayState} />,
            path: `${EXAMPLES_ROOT}/Meetings.tsx`,
        },
        {
            key: "tracks",
            name: "Three tracks",
            readout: () =>
                `showing ${formatStopwatch(reelState[0].start)} to ${formatStopwatch(reelState[0].end)} — here the page says which lane each clip belongs to, and the buttons are the route for anyone who cannot drag or pinch. The orange line is a marker the page moves while it plays`,
            component: () => <TracksExample {...commonProps} viewState={reelState} />,
            path: `${EXAMPLES_ROOT}/Tracks.tsx`,
        },
        {
            key: "trim",
            name: "Trimming clips",
            readout: () =>
                `${trimReadout} — drag either end of a clip, or press an end and then press where it should go; from the keyboard, Enter takes hold of a clip's end, Home and End switch ends, the arrows move it a second at a time, Enter drops it and Escape puts it back`,
            component: () => (
                <TrimExample
                    {...commonProps}
                    viewState={trimReelState}
                    clipsState={trimClipsState}
                    onTrim={setTrimmed}
                />
            ),
            path: `${EXAMPLES_ROOT}/Trim.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"isPannable"}
                    label={"Drag to move"}
                    hint={"Lets the timeline be dragged sideways to move through it."}
                >
                    <PageCheckField value={isPannable} ariaLabel={"Drag to move"} onChange={setIsPannable} />
                </PageProp>

                <PageProp
                    itemKey={"isZoomable"}
                    label={"Wheel and pinch to zoom"}
                    hint={"Lets the wheel and a pinch change how much of the timeline is in view."}
                >
                    <PageCheckField value={isZoomable} ariaLabel={"Wheel and pinch to zoom"} onChange={setIsZoomable} />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the timeline off, so it neither pans, zooms nor picks."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"picked"}
                    label={`Picked: ${picked}`}
                    hint={
                        "Puts the examples back to the item they started on, and clears whatever has been picked since."
                    }
                >
                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={520} />
        </>
    );
};
