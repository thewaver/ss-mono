import { SegmentedInput } from "@thewaver/ss-components-solid";
import { RECOVERY_CODE_LENGTH } from "@thewaver/ss-playground-core/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import type { SegmentedInputExampleProps } from "../SegmentedInputPage.types";

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
