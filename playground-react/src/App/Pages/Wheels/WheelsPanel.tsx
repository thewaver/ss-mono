import { FIELD_WIDTH, SPIN_STYLE_KEYS } from "@thewaver/ss-playground-core/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { WheelsControls } from "./Wheels.types";

type Props = {
    controls: WheelsControls;
};

export const PageWheelsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp itemKey={"wedgeCount"} label={"Wedges"} hint={"How many wedges the wheel is divided into."}>
                <PageNumberField
                    value={controls.wedgeCountState[0]}
                    min={WheelKnobs.MIN_WEDGE_COUNT}
                    max={WheelKnobs.MAX_WEDGE_COUNT}
                    step={WheelKnobs.WEDGE_COUNT_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Wedges"}
                    onInput={controls.wedgeCountState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"spinDurationMs"}
                label={"Spin duration (ms)"}
                hint={"How long a spin takes from the moment it is started to the moment it stops."}
            >
                <PageNumberField
                    value={controls.spinDurationState[0]}
                    min={WheelKnobs.MIN_DURATION_MS}
                    max={WheelKnobs.MAX_DURATION_MS}
                    step={WheelKnobs.DURATION_STEP_MS}
                    width={FIELD_WIDTH}
                    ariaLabel={"Spin duration"}
                    onInput={controls.spinDurationState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"turns"}
                label={"Turns per spin"}
                hint={"How many full turns a spin makes before it comes to rest on its wedge."}
            >
                <PageNumberField
                    value={controls.turnsState[0]}
                    min={WheelKnobs.MIN_TURNS}
                    max={WheelKnobs.MAX_TURNS}
                    step={WheelKnobs.TURNS_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Turns per spin"}
                    onInput={controls.turnsState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"settleDurationMs"}
                label={"Settle duration (ms)"}
                hint={"How long the wheel takes to ease into its final position once the spin is over."}
            >
                <PageNumberField
                    value={controls.settleDurationState[0]}
                    min={WheelKnobs.MIN_DURATION_MS}
                    max={WheelKnobs.MAX_DURATION_MS}
                    step={WheelKnobs.DURATION_STEP_MS}
                    width={FIELD_WIDTH}
                    ariaLabel={"Settle duration"}
                    onInput={controls.settleDurationState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"doesResume"}
                label={"Turns again after a spin"}
                hint={"Lets the wheel start turning by itself again after a spin, instead of standing still."}
            >
                <PageCheckField
                    value={controls.doesResumeState[0]}
                    ariaLabel={"Turns again after a spin"}
                    onChange={controls.doesResumeState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"restDurationMs"}
                label={"Rest after a spin (ms)"}
                hint={
                    "How long the wheel stands still after a spin before it resumes. It only applies when it turns again."
                }
            >
                <PageNumberField
                    value={controls.restDurationState[0]}
                    min={WheelKnobs.MIN_DURATION_MS}
                    max={WheelKnobs.MAX_DURATION_MS}
                    step={WheelKnobs.DURATION_STEP_MS}
                    width={FIELD_WIDTH}
                    isDisabled={!controls.doesResumeState[0]}
                    ariaLabel={"Rest after a spin"}
                    onInput={controls.restDurationState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"isIdlingAllowed"}
                label={"Turns by itself"}
                hint={"Lets the wheel turn slowly on its own while nobody is spinning it."}
            >
                <PageCheckField
                    value={controls.isIdlingAllowedState[0]}
                    ariaLabel={"Turns by itself"}
                    onChange={controls.isIdlingAllowedState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"idleDelayMs"}
                label={"Idle step delay (ms)"}
                hint={"How long the wheel waits between steps of its idle turn. It only applies while idling is on."}
            >
                <PageNumberField
                    value={controls.idleDelayState[0]}
                    min={WheelKnobs.MIN_IDLE_DELAY_MS}
                    max={WheelKnobs.MAX_IDLE_DELAY_MS}
                    step={WheelKnobs.IDLE_DELAY_STEP_MS}
                    width={FIELD_WIDTH}
                    isDisabled={!controls.isIdlingAllowedState[0]}
                    ariaLabel={"Idle step delay"}
                    onInput={controls.idleDelayState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"spinStyleKey"}
                label={"Spin style"}
                hint={"The speed curve a spin follows, which is what makes it feel heavy or snappy."}
            >
                <PageSelectField
                    value={controls.spinStyleState[0]}
                    values={SPIN_STYLE_KEYS}
                    width={FIELD_WIDTH}
                    ariaLabel={"Spin style"}
                    onChange={controls.spinStyleState[1]}
                />
            </PageProp>

            <PageProp
                itemKey={"isDisabled"}
                label={"Disabled"}
                hint={"Turns the wheel off, so it can neither be spun nor turn by itself."}
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
