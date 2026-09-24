import { SegmentedInput } from "@thewaver/ss-components";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import { ONE_TIME_CODE_LENGTH } from "../SegmentedInputPage.const";
import type { SegmentedInputExampleProps } from "../SegmentedInputPage.types";

import { FIELD_GAP } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = SegmentedInputExampleProps;

export const OneTimeCodeExample = (props: Props) => (
    <SegmentedInput
        valueSignal={props.valueSignal}
        cellCount={ONE_TIME_CODE_LENGTH}
        gap={FIELD_GAP}
        ariaLabel={"One-time code"}
        autoComplete={"one-time-code"}
        renderCell={(getCell) => <PageSegmentedInputCell renderProps={getCell} />}
    />
);
