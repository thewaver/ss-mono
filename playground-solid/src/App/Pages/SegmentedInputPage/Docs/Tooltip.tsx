import { createSignal } from "solid-js";

import { SegmentedInput } from "@thewaver/ss-components-solid";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { SegmentedInputTooltipDocsExampleProps } from "../SegmentedInputPageSolid.types";

type Props = SegmentedInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal("");

    return (
        <SegmentedInput
            value={valueSignal}
            cellCount={ONE_TIME_CODE_LENGTH}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Disabled but reachable code"}
            renderCell={(getCell) => <PageSegmentedInputCell renderProps={getCell} />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Focusable so this tooltip can be read, but nothing typed may reach the cells.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
