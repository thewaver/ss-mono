import { TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { renderSelectPopup } from "../../SelectPage/SelectPage.const";
import type { TextInputCitiesExampleProps } from "../TextInputPage.types";

type Props = TextInputCitiesExampleProps;

export const CitiesExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"City"}
        suggestions={props.suggestions}
        suggestionsAriaLabel={"Cities"}
        computeCustomSuggestionText={(city) => city.name}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>Any city</PageTextFieldPlaceholder>}
        renderSuggestion={(city, flags) => (
            <PageSelectOptionContent flags={flags} description={city.country}>
                {city.name}
            </PageSelectOptionContent>
        )}
        renderSuggestionPopup={renderSelectPopup}
    />
);
