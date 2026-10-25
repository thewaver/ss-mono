import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import { PageRadioContent } from "../../../StyledComponents/RadioContent/RadioContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { RadioDisabledOptionDocsExampleProps } from "../RadioPageSolid.types";

const DISABLED_VALUE: SizeValue = "medium";

type Props = RadioDisabledOptionDocsExampleProps;

export const DisabledOptionDocsExample = (props: Props) => {
    const valueSignal = createSignal<SizeValue>("small");

    return (
        <RadioGroup value={valueSignal} ariaLabel={"Size"} gap={RADIO_GROUP_GAP}>
            <For each={SIZE_OPTIONS}>
                {(option) => (
                    <Radio
                        value={() => option.value}
                        ariaLabel={() => option.label}
                        isDisabled={() => option.value === DISABLED_VALUE}
                        isReachableWhenDisabled={props.isReachableWhenDisabled}
                        renderContent={(getFlags) => (
                            <PageRadioContent flags={getFlags}>{option.label}</PageRadioContent>
                        )}
                        tooltipDefs={
                            option.value === DISABLED_VALUE
                                ? () => ({
                                      placement: () => ({ x: "center", y: "top_out" }),
                                      offset: () => ({ x: 0, y: 10 }),
                                      renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                                          <PageTooltipContent
                                              visibilityTarget={getVisibilityTarget}
                                              transitionDurationMs={getTransitionDurationMs}
                                          >
                                              Out of stock in this size.
                                          </PageTooltipContent>
                                      ),
                                  })
                                : undefined
                        }
                    />
                )}
            </For>
        </RadioGroup>
    );
};
