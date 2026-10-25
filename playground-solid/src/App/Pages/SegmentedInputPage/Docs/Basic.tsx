import { createSignal } from "solid-js";

import { SegmentedInput } from "@thewaver/ss-components-solid";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import type { SegmentedInputBasicDocsExampleProps } from "../SegmentedInputPageSolid.types";

type Props = SegmentedInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal("");

    return (
        <SegmentedInput
            value={valueSignal}
            cellCount={ONE_TIME_CODE_LENGTH}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"One-time code"}
            autoComplete={"one-time-code"}
            renderCell={(getCell) => <PageSegmentedInputCell renderProps={getCell} />}
        />
    );
};
