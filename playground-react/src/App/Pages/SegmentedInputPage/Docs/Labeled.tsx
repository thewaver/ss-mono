import { useState } from "react";

import { Label, SegmentedInput } from "@thewaver/ss-components-react";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState("");

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Verification code</PageLabelCaption>

            <SegmentedInput
                value={valueState}
                cellCount={ONE_TIME_CODE_LENGTH}
                gap={FIELD_GAP}
                autoComplete={"one-time-code"}
                renderCell={(cell) => <PageSegmentedInputCell renderProps={cell} />}
            />
        </Label>
    );
};
