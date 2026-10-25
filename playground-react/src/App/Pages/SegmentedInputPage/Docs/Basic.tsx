import { useState } from "react";

import { SegmentedInput } from "@thewaver/ss-components-react";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import type { SegmentedInputBasicDocsExampleProps } from "../SegmentedInputPageReact.types";

type Props = SegmentedInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState("");

    return (
        <SegmentedInput
            value={valueState}
            cellCount={ONE_TIME_CODE_LENGTH}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"One-time code"}
            autoComplete={"one-time-code"}
            renderCell={(cell) => <PageSegmentedInputCell renderProps={cell} />}
        />
    );
};
