import { useState } from "react";

import { SegmentedInput } from "@thewaver/ss-components-react";
import {
    ONE_TIME_CODE_LENGTH,
    ONE_TIME_CODE_RIGHT_LABEL,
} from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState("123");

    return (
        <div dir={"rtl"}>
            <SegmentedInput
                value={valueState}
                cellCount={ONE_TIME_CODE_LENGTH}
                gap={FIELD_GAP}
                ariaLabel={ONE_TIME_CODE_RIGHT_LABEL}
                autoComplete={"one-time-code"}
                renderCell={(cell) => <PageSegmentedInputCell renderProps={cell} />}
            />
        </div>
    );
};
