import { Show } from "solid-js";

import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import {
    DELAY_STEP_MS,
    DIRS,
    DIR_FIELD_WIDTH,
    DIR_LABELS,
    FIELD_WIDTH,
    MAX_DELAY_MS,
    MAX_SLIDE_COUNT,
    MIN_DELAY_MS,
    MIN_SLIDE_COUNT,
    SLIDE_COUNT_STEP,
} from "./Carousels.const";
import type { CarouselsControls } from "./Carousels.types";

type Props = {
    controls: CarouselsControls;
    hasDelay?: boolean;
};

export const PageCarouselsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp key={"slideCount"} label={"Slide count"}>
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
                <PageProp key={"delayMs"} label={"Rotator delay (ms)"}>
                    <PageNumberField
                        value={controls.delaySignal[0]}
                        min={() => MIN_DELAY_MS}
                        max={() => MAX_DELAY_MS}
                        step={() => DELAY_STEP_MS}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Rotator delay in milliseconds"}
                        onInput={controls.delaySignal[1]}
                    />
                </PageProp>
            </Show>

            <PageProp key={"dir"} label={"Direction"}>
                <PageSelectField
                    value={controls.dirSignal[0]}
                    values={() => DIRS}
                    computeLabel={(dir) => DIR_LABELS[dir]}
                    width={() => DIR_FIELD_WIDTH}
                    ariaLabel={"Direction"}
                    onChange={(dir) => controls.dirSignal[1](() => dir)}
                />
            </PageProp>

            <PageProp key={"isDisabled"} label={"Disabled"}>
                <PageCheckField
                    value={controls.isDisabledSignal[0]}
                    ariaLabel={"Disabled"}
                    onChange={controls.isDisabledSignal[1]}
                />
            </PageProp>
        </PagePropsPanel>
    );
};
