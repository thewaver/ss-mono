import { useMemo, useState } from "react";

import { TextInput } from "@thewaver/ss-components-react";
import { CITIES } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
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
import { renderSelectPopup } from "../../SelectPage/SelectPageReact.const";

export const SuggestionsDocsExample = () => {
    const valueState = useState("");
    const value = valueState[0];

    const suggestions = useMemo(() => {
        const query = value.trim().toLocaleLowerCase();

        if (!query) return [];

        return CITIES.filter((city) => city.name.toLocaleLowerCase().startsWith(query));
    }, [value]);

    return (
        <TextInput
            value={valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"City"}
            suggestions={suggestions}
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
};
