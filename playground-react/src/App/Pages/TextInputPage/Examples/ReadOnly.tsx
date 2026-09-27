import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const ReadOnlyExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        isReadOnly={true}
        ariaLabel={"Read-only field"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
    />
);
