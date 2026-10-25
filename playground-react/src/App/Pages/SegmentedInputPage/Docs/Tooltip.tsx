import { useState } from "react";

import { SegmentedInput } from "@thewaver/ss-components-react";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { SegmentedInputTooltipDocsExampleProps } from "../SegmentedInputPageReact.types";

type Props = SegmentedInputTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueState = useState("");

    return (
        <SegmentedInput
            value={valueState}
            cellCount={ONE_TIME_CODE_LENGTH}
            gap={FIELD_GAP}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            ariaLabel={"Disabled but reachable code"}
            renderCell={(cell) => <PageSegmentedInputCell renderProps={cell} />}
            tooltipDefs={{
                placement: { x: "center", y: "top_out" },
                offset: { x: 0, y: 10 },
                renderContent: (visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        Focusable so this tooltip can be read, but nothing typed may reach the cells.
                    </PageTooltipContent>
                ),
            }}
        />
    );
};
