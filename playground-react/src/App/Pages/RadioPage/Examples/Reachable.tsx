import { Radio, RadioGroup } from "@thewaver/ss-components-react";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioExampleProps } from "../RadioPage.types";

const REACHABLE_VALUE = "medium";

type Props = RadioExampleProps;

export const ReachableExample = (props: Props) => (
    <RadioGroup value={props.value} ariaLabel={"Partly disabled size"} gap={RADIO_GROUP_GAP}>
        {SIZE_OPTIONS.map((option) => (
            <Radio
                key={option.value}
                value={option.value}
                ariaLabel={option.label}
                isDisabled={option.value === REACHABLE_VALUE}
                isReachableWhenDisabled={option.value === REACHABLE_VALUE}
                renderContent={(flags) => <PageRadioContent flags={flags}>{option.label}</PageRadioContent>}
                tooltipDefs={
                    option.value === REACHABLE_VALUE
                        ? {
                              placement: { x: "center", y: "top-out" },
                              offset: { x: 0, y: 10 },
                              renderContent: (visibilityTarget, transitionDurationMs) => (
                                  <PageTooltipContent
                                      visibilityTarget={visibilityTarget}
                                      transitionDurationMs={transitionDurationMs}
                                  >
                                      Arrow keys still land here so this tooltip can be read, but they must not select
                                      it and clicking must leave the value alone.
                                  </PageTooltipContent>
                              ),
                          }
                        : undefined
                }
            />
        ))}
    </RadioGroup>
);
