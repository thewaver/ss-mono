import { useState } from "react";

import { SegmentedInput } from "@thewaver/ss-components-react";
import { RECOVERY_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";

const ALPHANUMERIC = /^[A-Za-z0-9]$/;

export const LettersDocsExample = () => {
    const valueState = useState("");

    return (
        <SegmentedInput
            value={valueState}
            cellCount={RECOVERY_CODE_LENGTH}
            gap={FIELD_GAP}
            ariaLabel={"Recovery code"}
            inputMode={"text"}
            computeIsAllowed={(char) => ALPHANUMERIC.test(char)}
            renderCell={(cell) => <PageSegmentedInputCell renderProps={cell} />}
        />
    );
};
