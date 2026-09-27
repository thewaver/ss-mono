import { Radio, RadioGroup } from "@thewaver/ss-components-react";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import { SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioExampleProps } from "../RadioPage.types";

type Props = RadioExampleProps;

export const SegmentedExample = (props: Props) => (
    <PageRadioSegmentGroup>
        <RadioGroup
            valueState={props.valueState}
            ariaLabel={"Segmented size"}
            orientation={"horizontal"}
            gap={0}
            renderFloater={(visibilityTarget, transitionDurationMs) => (
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
