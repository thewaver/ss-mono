import { createSignal } from "solid-js";

import { TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextInputBasicDocsExampleProps } from "../TextInputPageSolid.types";

type Props = TextInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal("");

    return (
        <TextInput
            value={valueSignal}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            isReadOnly={props.isReadOnly}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            ariaLabel={"Your name"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
            renderPlaceholder={(getFlags) => (
                <PageTextFieldPlaceholder flags={getFlags}>Your name</PageTextFieldPlaceholder>
            )}
        />
    );
};
