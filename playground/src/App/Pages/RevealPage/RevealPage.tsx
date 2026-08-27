import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { FrostedExample } from "./Examples/Frosted";
import { PromptExample } from "./Examples/Prompt";
import { TorchExample } from "./Examples/Torch";

const EXAMPLES_ROOT = "/src/App/Pages/RevealPage/Examples";
const MIN_RADIUS = 20;
const MAX_RADIUS = 220;
const RADIUS_STEP = 10;
const MIN_ROUNDNESS = 0;
const MAX_ROUNDNESS = 1;
const ROUNDNESS_STEP = 0.05;
const STARTING_ROUNDNESS = 1;
const MIN_SOFTNESS = 0;
const MAX_SOFTNESS = 1;
const SOFTNESS_STEP = 0.05;
const STARTING_RADIUS = 90;
const STARTING_SOFTNESS = 0.45;
const FIELD_WIDTH = 110;

export const RevealPage = () => {
    const [getRadius, setRadius] = createSignal(STARTING_RADIUS);
    const [getRoundness, setRoundness] = createSignal(STARTING_ROUNDNESS);
    const [getSoftness, setSoftness] = createSignal(STARTING_SOFTNESS);
    const [getIsDisabled, setIsDisabled] = createSignal(false);

    const getExamples = createMemo(() => {
        const commonProps = {
            radius: getRadius,
            roundness: getRoundness,
            softness: getSoftness,
            isDisabled: getIsDisabled,
        };

        return [
            {
                key: "torch",
                name: "Torch",
                readout: () => "an opaque cover with a hole cut where the pointer is",
                component: () => <TorchExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Torch.tsx`,
            },
            {
                key: "frosted",
                name: "Frosted",
                readout: () => "the cover blurs rather than hides, so the hole sharpens instead of uncovering",
                component: () => <FrostedExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Frosted.tsx`,
            },
            {
                key: "prompt",
                name: "Cover that knows",
                readout: () => "the cover is told whether a reveal is happening, and says something different",
                component: () => <PromptExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Prompt.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"radius"} label={"Radius (px)"}>
                    <PageNumberField
                        value={getRadius}
                        min={() => MIN_RADIUS}
                        max={() => MAX_RADIUS}
                        step={() => RADIUS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Radius"}
                        onInput={setRadius}
                    />
                </PageProp>

                <PageProp key={"roundness"} label={"Roundness"}>
                    <PageNumberField
                        value={getRoundness}
                        min={() => MIN_ROUNDNESS}
                        max={() => MAX_ROUNDNESS}
                        step={() => ROUNDNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Roundness"}
                        onInput={setRoundness}
                    />
                </PageProp>

                <PageProp key={"softness"} label={"Clear fraction"}>
                    <PageNumberField
                        value={getSoftness}
                        min={() => MIN_SOFTNESS}
                        max={() => MAX_SOFTNESS}
                        step={() => SOFTNESS_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Clear fraction"}
                        onInput={setSoftness}
                    />
                </PageProp>

                <PageProp key={"isDisabled"} label={"Disabled"}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
