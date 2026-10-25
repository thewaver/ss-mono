import { useState } from "react";

import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputBasicDocsExampleProps } from "../TextInputPageReact.types";

type Props = TextInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState("");

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Your name"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>Your name</PageTextFieldPlaceholder>}
        />
    );
};
