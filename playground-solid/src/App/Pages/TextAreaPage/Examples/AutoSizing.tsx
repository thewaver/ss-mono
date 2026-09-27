import { TextArea } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH, MIN_ROWS } from "@thewaver/ss-playground-core/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

type Props = TextAreaExampleProps;

export const AutoSizingExample = (props: Props) => (
    <TextArea
        valueSignal={props.valueSignal}
        isAutoSizing={true}
        minRows={() => MIN_ROWS}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Message"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => (
            <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} isStretched={true} />
        )}
        renderPlaceholder={(getFlags) => (
            <PageTextFieldPlaceholder flags={getFlags} isTopAligned={true}>
                Type across several lines
            </PageTextFieldPlaceholder>
        )}
    />
);
