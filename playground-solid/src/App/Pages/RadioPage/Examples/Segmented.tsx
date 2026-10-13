import { For } from "solid-js";

import { Radio, RadioGroup } from "@thewaver/ss-components-solid";
import { SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import {
    PageRadioSegmentContent,
    PageRadioSegmentFloater,
    PageRadioSegmentGroup,
} from "../../../StyledComponents/RadioSegmentContent/RadioSegmentContent";
import type { RadioExampleProps } from "../RadioPageSolid.types";

type Props = RadioExampleProps;

export const SegmentedExample = (props: Props) => (
    <PageRadioSegmentGroup>
        <RadioGroup
            value={props.value}
            ariaLabel={"Segmented size"}
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
