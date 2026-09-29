import { Label, Radio, RadioGroup } from "@thewaver/ss-components-react";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { LabelRadioExampleProps, PlanValue } from "../LabelPage.types";

const GAP = 20;

const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
];

type Props = LabelRadioExampleProps;

export const LabelPerRadioExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Plan"} gap={GAP}>
        {PLAN_OPTIONS.map((option) => (
            <Label key={option.value}>
                <Radio value={option.value} renderContent={(flags) => <PageRadioContent flags={flags} />} />

                <PageLabelCaption>{option.label}</PageLabelCaption>
            </Label>
        ))}
    </RadioGroup>
);
