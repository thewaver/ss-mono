import { useState } from "react";

import { CornerHighlight, Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

export const DecoratedDocsExample = () => {
    const valueState = useState<SizeValue>("medium");

    return (
        <RadioGroup value={valueState} ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
            {SIZE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    value={option.value}
                    ariaLabel={option.label}
                    renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                    renderDecoration={(flags) => (
                        <CornerHighlight
                            color={flags.checkedState === true ? "yellow" : "transparent"}
                            cornerLength={CORNER_LENGTH}
                            strokeThickness={STROKE_THICKNESS}
                        />
                    )}
                />
            ))}
        </RadioGroup>
    );
};
