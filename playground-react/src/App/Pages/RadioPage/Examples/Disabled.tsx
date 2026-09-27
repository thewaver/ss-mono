import { Radio, RadioGroup } from "@thewaver/ss-components-react";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioExampleProps } from "../RadioPage.types";

type Props = RadioExampleProps;

export const DisabledExample = (props: Props) => (
    <RadioGroup valueState={props.valueState} ariaLabel={"Disabled size"} gap={RADIO_GROUP_GAP}>
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
