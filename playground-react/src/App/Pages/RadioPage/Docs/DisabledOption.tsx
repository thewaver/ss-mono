import { useState } from "react";

import { Radio, RadioGroup } from "@thewaver/ss-components-react";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { RadioDisabledOptionDocsExampleProps } from "../RadioPageReact.types";

const DISABLED_VALUE: SizeValue = "medium";

type Props = RadioDisabledOptionDocsExampleProps;

export const DisabledOptionDocsExample = (props: Props) => {
    const valueState = useState<SizeValue>("small");

    return (
        <RadioGroup value={valueState} ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
            {SIZE_OPTIONS.map((option) => (
                <Radio
                    key={option.value}
                    value={option.value}
                    ariaLabel={option.label}
                    isDisabled={option.value === DISABLED_VALUE}
                    isReachableWhenDisabled={props.isReachableWhenDisabled}
                    renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                    tooltipDefs={
                        option.value === DISABLED_VALUE
                            ? {
                                  placement: { x: "center", y: "top_out" },
                                  offset: { x: 0, y: 10 },
                                  renderContent: (visibilityTarget, transitionDurationMs) => (
                                      <PageTooltipContent
                                          visibilityTarget={visibilityTarget}
                                          transitionDurationMs={transitionDurationMs}
                                      >
                                          Out of stock in this size.
                                      </PageTooltipContent>
                                  ),
                              }
                            : undefined
                    }
                />
            ))}
        </RadioGroup>
    );
};
