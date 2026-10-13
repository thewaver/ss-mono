import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioExampleProps } from "../RadioPageReact.types";

type Props = RadioExampleProps;

export const DisabledExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Disabled size"} gap={RADIO_GROUP_GAP}>
        {SIZE_OPTIONS.map((option) => (
            <Radio
                key={option.value}
                value={option.value}
                ariaLabel={option.label}
                isDisabled={true}
                renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
            />
        ))}
    </RadioGroup>
);
