import { SegmentedInput } from "@thewaver/ss-components";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import { RECOVERY_CODE_LENGTH } from "../SegmentedInputPage.const";
import type { SegmentedInputExampleProps } from "../SegmentedInputPage.types";

import { FIELD_GAP } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = SegmentedInputExampleProps;

const ALPHANUMERIC = /^[A-Za-z0-9]$/;

export const RecoveryCodeExample = (props: Props) => (
    <SegmentedInput
        valueSignal={props.valueSignal}
        cellCount={RECOVERY_CODE_LENGTH}
        gap={FIELD_GAP}
        ariaLabel={"Recovery code"}
        inputMode={"text"}
        computeIsAllowed={(char) => ALPHANUMERIC.test(char)}
        renderCell={(getCell) => <PageSegmentedInputCell renderProps={getCell} />}
    />
);
