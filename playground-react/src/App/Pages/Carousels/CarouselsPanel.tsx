import { CAROUSEL_ORIENTATIONS } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    FIELD_WIDTH,
    ORIENTATION_FIELD_WIDTH,
    ORIENTATION_LABELS,
} from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
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
            <PageProp itemKey={"slideCount"} label={"Slide count"} hint={"How many slides the carousel holds."}>
                <PageNumberField
                    value={controls.slideCountState[0]}
                    min={CarouselKnobs.MIN_SLIDE_COUNT}
                    max={CarouselKnobs.MAX_SLIDE_COUNT}
                    step={CarouselKnobs.SLIDE_COUNT_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Slide count"}
                    onInput={controls.slideCountState[1]}
                />
            </PageProp>

            {props.hasDelay && (
                <PageProp
                    itemKey={"delayMs"}
                    label={"RotatorUtils delay (ms)"}
                    hint={"How long a slide is held before the carousel moves to the next one on its own."}
                >
                    <PageNumberField
                        value={controls.delayState[0]}
                        min={CarouselKnobs.MIN_DELAY_MS}
                        max={CarouselKnobs.MAX_DELAY_MS}
                        step={CarouselKnobs.DELAY_STEP_MS}
                        width={FIELD_WIDTH}
                        ariaLabel={"RotatorUtils delay in milliseconds"}
                        onInput={controls.delayState[1]}
                    />
                </PageProp>
            )}

            <PageProp
                itemKey={"orientation"}
                label={"Orientation"}
                hint={"Which way the slides run, and so which way the arrows and the arrow keys move."}
            >
                <PageSelectField
                    value={controls.orientationState[0]}
                    values={CAROUSEL_ORIENTATIONS}
                    computeLabel={(orientation) => ORIENTATION_LABELS[orientation]}
                    width={ORIENTATION_FIELD_WIDTH}
                    ariaLabel={"Orientation"}
                    onChange={(orientation) => controls.orientationState[1](orientation)}
                />
            </PageProp>

            {props.hasLooping && (
                <PageProp
                    itemKey={"isLooping"}
                    label={"Looping"}
                    hint={
                        "Whether stepping past the last slide comes round to the first. Off, the end controls are disabled, a swipe past an end springs back, and rotation stops on the last slide."
                    }
                >
                    <PageCheckField
                        value={controls.isLoopingState[0]}
                        ariaLabel={"Looping"}
                        onChange={controls.isLoopingState[1]}
                    />
                </PageProp>
            )}

            <PageProp
                itemKey={"isDisabled"}
                label={"Disabled"}
                hint={"Turns the carousel off, so neither its controls nor its swipes do anything."}
            >
                <PageCheckField
                    value={controls.isDisabledState[0]}
                    ariaLabel={"Disabled"}
                    onChange={controls.isDisabledState[1]}
                />
            </PageProp>
        </PagePropsPanel>
    );
};
