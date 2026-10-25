import { createSignal } from "solid-js";

import { TextArea } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH, LONG_TEXT, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextAreaGrowingDocsExampleProps } from "../TextAreaPageSolid.types";

type Props = TextAreaGrowingDocsExampleProps;

export const GrowingDocsExample = (props: Props) => {
    const valueSignal = createSignal(LONG_TEXT);

    return (
        <TextArea
            value={valueSignal}
            isAutoSizing={true}
            minRows={MIN_ROWS}
            maxRows={props.maxRows}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Message"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => (
                <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} isStretched={true} />
            )}
        />
    );
};
