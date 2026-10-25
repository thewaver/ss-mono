import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState<SizeValue | undefined>();

    return (
        <div dir={"rtl"}>
            <RadioGroup value={valueState} ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
                {SIZE_OPTIONS.map((option) => (
                    <Radio
                        key={option.value}
                        value={option.value}
                        ariaLabel={option.label}
                        renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};
