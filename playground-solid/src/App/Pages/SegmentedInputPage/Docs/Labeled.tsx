import { createSignal } from "solid-js";

import { Label, SegmentedInput } from "@thewaver/ss-components-solid";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueSignal = createSignal("");

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Verification code</PageLabelCaption>

            <SegmentedInput
                value={valueSignal}
                cellCount={ONE_TIME_CODE_LENGTH}
                gap={FIELD_GAP}
                autoComplete={"one-time-code"}
                renderCell={(getCell) => <PageSegmentedInputCell renderProps={getCell} />}
            />
        </Label>
    );
};
