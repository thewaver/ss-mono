import { createSignal } from "solid-js";

import { TextArea } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextAreaBasicDocsExampleProps } from "../TextAreaPageSolid.types";

type Props = TextAreaBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal("");

    return (
        <>
            <TextArea
                value={valueSignal}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                isReadOnly={props.isReadOnly}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
                ariaLabel={"Notes"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => (
                    <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
                )}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags} isTopAligned={true}>
                        Notes
                    </PageTextFieldPlaceholder>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Length: ${valueSignal[0]().length}`}
            </div>
        </>
    );
};
