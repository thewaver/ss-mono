import { For, createSignal } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../../StyledComponents/RadioSegmentContent/RadioSegmentContent";

export const SegmentedDocsExample = () => {
    const valueSignal = createSignal<SizeValue>("medium");

    return (
        <PageRadioSegmentGroup>
            <RadioGroup
                value={valueSignal}
                ariaLabel={"Size"}
                orientation={"horizontal"}
                gap={0}
                renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageRadioSegmentFloater
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
            >
                <For each={SIZE_OPTIONS}>
                    {(option) => (
                        <Radio
                            value={() => option.value}
                            ariaLabel={() => option.label}
                            renderContent={(getFlags) => (
                                <PageRadioSegmentContent flags={getFlags}>{option.label}</PageRadioSegmentContent>
                            )}
                        />
                    )}
                </For>
            </RadioGroup>
        </PageRadioSegmentGroup>
    );
};
