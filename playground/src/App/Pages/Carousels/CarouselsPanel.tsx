import { Show } from "solid-js";

import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import {
    DELAY_STEP_MS,
    FIELD_WIDTH,
    MAX_DELAY_MS,
    MAX_SLIDE_COUNT,
    MIN_DELAY_MS,
    MIN_SLIDE_COUNT,
    ORIENTATIONS,
    ORIENTATION_FIELD_WIDTH,
    ORIENTATION_LABELS,
    SLIDE_COUNT_STEP,
} from "./Carousels.const";
import type { CarouselsControls } from "./Carousels.types";

type Props = {
    controls: CarouselsControls;
    hasDelay?: boolean;
    hasLooping?: boolean;
};

export const PageCarouselsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp key={"slideCount"} label={"Slide count"} hint={"How many slides the carousel holds."}>
                <PageNumberField
                    value={controls.slideCountSignal[0]}
                    min={() => MIN_SLIDE_COUNT}
                    max={() => MAX_SLIDE_COUNT}
                    step={() => SLIDE_COUNT_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Slide count"}
                    onInput={controls.slideCountSignal[1]}
                />
            </PageProp>

            <Show when={props.hasDelay}>
                <PageProp
                    key={"delayMs"}
                    label={"RotatorUtils delay (ms)"}
                    hint={"How long a slide is held before the carousel moves to the next one on its own."}
                >
                    <PageNumberField
                        value={controls.delaySignal[0]}
                        min={() => MIN_DELAY_MS}
                        max={() => MAX_DELAY_MS}
                        step={() => DELAY_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"RotatorUtils delay in milliseconds"}
                        onInput={controls.delaySignal[1]}
                    />
                </PageProp>
            </Show>

            <PageProp
                key={"orientation"}
                label={"Orientation"}
                hint={"Which way the slides run, and so which way the arrows and the arrow keys move."}
            >
                <PageSelectField
                    value={controls.orientationSignal[0]}
                    values={() => ORIENTATIONS}
                    computeLabel={(orientation) => ORIENTATION_LABELS[orientation]}
                    width={() => ORIENTATION_FIELD_WIDTH}
                    ariaLabel={"Orientation"}
                    onChange={(orientation) => controls.orientationSignal[1](() => orientation)}
                />
            </PageProp>

            <Show when={props.hasLooping}>
                <PageProp
                    key={"isLooping"}
                    label={"Looping"}
                    hint={
                        "Whether stepping past the last slide comes round to the first. Off, the end controls are disabled, a swipe past an end springs back, and rotation stops on the last slide."
                    }
                >
                    <PageCheckField
                        value={controls.isLoopingSignal[0]}
                        ariaLabel={"Looping"}
                        onChange={controls.isLoopingSignal[1]}
                    />
                </PageProp>
            </Show>

            <PageProp
                key={"isDisabled"}
                label={"Disabled"}
                hint={"Turns the carousel off, so neither its controls nor its swipes do anything."}
            >
                <PageCheckField
                    value={controls.isDisabledSignal[0]}
                    ariaLabel={"Disabled"}
                    onChange={controls.isDisabledSignal[1]}
                />
            </PageProp>
        </PagePropsPanel>
    );
};
