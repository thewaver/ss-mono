import { For, createSignal } from "solid-js";

import { Label, Radio, RadioGroup } from "@thewaver/ss-components-solid";
import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";

const GAP = 20;

const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
];

export const LabelPerRadioDocsExample = () => {
    const valueSignal = createSignal<PlanValue>("free");

    return (
        <RadioGroup value={valueSignal} ariaLabel={"Plan"} gap={GAP}>
            <For each={PLAN_OPTIONS}>
                {(option) => (
                    <Label>
                        <Radio
                            value={() => option.value}
                            renderContent={(getFlags) => <PageRadioContent flags={getFlags} />}
                        />

                        <PageLabelCaption>{option.label}</PageLabelCaption>
                    </Label>
                )}
            </For>
        </RadioGroup>
    );
};
