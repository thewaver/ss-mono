import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import {
    DURATION_STEP_MS,
    FIELD_WIDTH,
    IDLE_DELAY_STEP_MS,
    MAX_DURATION_MS,
    MAX_IDLE_DELAY_MS,
    MAX_TURNS,
    MAX_WEDGE_COUNT,
    MIN_DURATION_MS,
    MIN_IDLE_DELAY_MS,
    MIN_TURNS,
    MIN_WEDGE_COUNT,
    SPIN_STYLE_KEYS,
    TURNS_STEP,
    WEDGE_COUNT_STEP,
} from "./Wheels.const";
import type { WheelsControls } from "./Wheels.types";

type Props = {
    controls: WheelsControls;
};

export const PageWheelsPanel = (props: Props) => {
    const controls = props.controls;

    return (
        <PagePropsPanel scope={"global"}>
            <PageProp key={"wedgeCount"} label={"Wedges"}>
                <PageNumberField
                    value={controls.wedgeCountSignal[0]}
                    min={() => MIN_WEDGE_COUNT}
                    max={() => MAX_WEDGE_COUNT}
                    step={() => WEDGE_COUNT_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Wedges"}
                    onInput={controls.wedgeCountSignal[1]}
                />
            </PageProp>

            <PageProp key={"spinDurationMs"} label={"Spin duration (ms)"}>
                <PageNumberField
                    value={controls.spinDurationSignal[0]}
                    min={() => MIN_DURATION_MS}
                    max={() => MAX_DURATION_MS}
                    step={() => DURATION_STEP_MS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Spin duration"}
                    onInput={controls.spinDurationSignal[1]}
                />
            </PageProp>

            <PageProp key={"turns"} label={"Turns per spin"}>
                <PageNumberField
                    value={controls.turnsSignal[0]}
                    min={() => MIN_TURNS}
                    max={() => MAX_TURNS}
                    step={() => TURNS_STEP}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Turns per spin"}
                    onInput={controls.turnsSignal[1]}
                />
            </PageProp>

            <PageProp key={"settleDurationMs"} label={"Settle duration (ms)"}>
                <PageNumberField
                    value={controls.settleDurationSignal[0]}
                    min={() => MIN_DURATION_MS}
                    max={() => MAX_DURATION_MS}
                    step={() => DURATION_STEP_MS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Settle duration"}
                    onInput={controls.settleDurationSignal[1]}
                />
            </PageProp>

            <PageProp key={"doesResume"} label={"Turns again after a spin"}>
                <PageCheckField
                    value={controls.doesResumeSignal[0]}
                    ariaLabel={"Turns again after a spin"}
                    onChange={controls.doesResumeSignal[1]}
                />
            </PageProp>

            <PageProp key={"restDurationMs"} label={"Rest after a spin (ms)"}>
                <PageNumberField
                    value={controls.restDurationSignal[0]}
                    min={() => MIN_DURATION_MS}
                    max={() => MAX_DURATION_MS}
                    step={() => DURATION_STEP_MS}
                    width={() => FIELD_WIDTH}
                    isDisabled={() => !controls.doesResumeSignal[0]()}
                    ariaLabel={"Rest after a spin"}
                    onInput={controls.restDurationSignal[1]}
                />
            </PageProp>

            <PageProp key={"isIdlingAllowed"} label={"Turns by itself"}>
                <PageCheckField
                    value={controls.isIdlingAllowedSignal[0]}
                    ariaLabel={"Turns by itself"}
                    onChange={controls.isIdlingAllowedSignal[1]}
                />
            </PageProp>

            <PageProp key={"idleDelayMs"} label={"Idle step delay (ms)"}>
                <PageNumberField
                    value={controls.idleDelaySignal[0]}
                    min={() => MIN_IDLE_DELAY_MS}
                    max={() => MAX_IDLE_DELAY_MS}
                    step={() => IDLE_DELAY_STEP_MS}
                    width={() => FIELD_WIDTH}
                    isDisabled={() => !controls.isIdlingAllowedSignal[0]()}
                    ariaLabel={"Idle step delay"}
                    onInput={controls.idleDelaySignal[1]}
                />
            </PageProp>

            <PageProp key={"spinStyleKey"} label={"Spin style"}>
                <PageSelectField
                    value={controls.spinStyleSignal[0]}
                    values={() => SPIN_STYLE_KEYS}
                    width={() => FIELD_WIDTH}
                    ariaLabel={"Spin style"}
                    onChange={(key) => controls.spinStyleSignal[1](() => key)}
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
