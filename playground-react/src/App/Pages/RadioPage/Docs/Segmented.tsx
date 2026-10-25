import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../../StyledComponents/RadioSegmentContent/RadioSegmentContent";

export const SegmentedDocsExample = () => {
    const valueState = useState<SizeValue>("medium");

    return (
        <PageRadioSegmentGroup>
            <RadioGroup
                value={valueState}
                ariaLabel={"Size"}
                orientation={"horizontal"}
                gap={0}
                renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageRadioSegmentFloater
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    />
                )}
            >
                {SIZE_OPTIONS.map((option) => (
                    <Radio
                        key={option.value}
                        value={option.value}
                        ariaLabel={option.label}
                        renderContent={(flags) => (
                            <PageRadioSegmentContent flags={flags}>{option.label}</PageRadioSegmentContent>
                        )}
                    />
                ))}
            </RadioGroup>
        </PageRadioSegmentGroup>
    );
};
