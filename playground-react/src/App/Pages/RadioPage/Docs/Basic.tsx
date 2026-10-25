import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import type { RadioBasicDocsExampleProps } from "../RadioPageReact.types";

type Props = RadioBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<SizeValue | undefined>();

    return (
        <RadioGroup value={valueState} ariaLabel={"Size"} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
            {SIZE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    value={option.value}
                    ariaLabel={option.label}
                    hasError={props.hasError}
                    isDisabled={props.isDisabled}
                    renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                />
            ))}
        </RadioGroup>
    );
};
