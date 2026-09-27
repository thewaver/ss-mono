import { SegmentedInput } from "@thewaver/ss-components-solid";
import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground-core/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
import { FIELD_GAP } from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSegmentedInputCell } from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent";
import type { SegmentedInputExampleProps } from "../SegmentedInputPage.types";

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
