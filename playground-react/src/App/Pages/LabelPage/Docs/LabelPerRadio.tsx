import { useState } from "react";

import { Label, Radio, RadioGroup } from "@thewaver/ss-components-react";
import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";

const GAP = 20;

const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
];

export const LabelPerRadioDocsExample = () => {
    const valueState = useState<PlanValue>("free");

    return (
        <RadioGroup value={valueState} ariaLabel={"Plan"} gap={GAP}>
            {PLAN_OPTIONS.map((option) => (
                <Label key={option.value}>
                    <Radio value={option.value} renderContent={(flags) => <PageRadioContent flags={flags} />} />

                    <PageLabelCaption>{option.label}</PageLabelCaption>
                </Label>
            ))}
        </RadioGroup>
    );
};
