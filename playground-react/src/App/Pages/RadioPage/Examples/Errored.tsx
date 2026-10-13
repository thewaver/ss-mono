import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioOptionalExampleProps } from "../RadioPageReact.types";

type Props = RadioOptionalExampleProps;

export const ErroredExample = (props: Props) => {
    const hasError = props.value[0] === undefined;

    return (
        <RadioGroup value={props.value} ariaLabel={"Required size"} gap={RADIO_GROUP_GAP} hasError={hasError}>
            {SIZE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    value={option.value}
                    ariaLabel={option.label}
                    hasError={hasError}
                    renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                />
            ))}
        </RadioGroup>
    );
};
