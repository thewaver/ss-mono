import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Button, DateInput, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-react";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageReact.const";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

const EMPTY_ENTRY = "(empty)";

const describeEntries = (data: FormData) =>
    Array.from(new Set(data.keys()), (key) => `${key}: ${data.getAll(key).join(", ") || EMPTY_ENTRY}`).join("; ");

export const ValuesDocsExample = () => {
    const planState = useState<string | undefined>();
    const topicsState = useState<string[]>([]);
    const startState = useState<DateValue | undefined>();
    const [outcome, setOutcome] = useState("Not sent yet.");

    return (
        <Form
            ariaLabel={"Booking"}
            onSubmit={(data) => setOutcome(`Sent: ${describeEntries(data)}.`)}
            onReset={() => {
                planState[1](undefined);
                topicsState[1]([]);
                startState[1](undefined);
                setOutcome("Not sent yet.");
            }}
            renderContent={() => (
                <PageFormStack>
                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                        renderControl={() => (
                            <Select
                                renderHighlightFloater={renderPageHighlightFloater}
                                name={"plan"}
                                value={planState}
                                options={PLANS}
                                ariaLabel={"Plan"}
                                renderContent={(selectedOption, flags) => (
                                    <PageSelectContent flags={flags}>
                                        {selectedOption?.value ?? PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(option, flags) => (
                                    <PageSelectOptionContent isGliding flags={flags}>
                                        {option.value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                        renderControl={() => (
                            <MultiSelect
                                renderHighlightFloater={renderPageHighlightFloater}
                                name={"topics"}
                                values={topicsState}
                                options={TOPICS}
                                ariaLabel={"Topics"}
                                renderContent={(selectedOptions, flags) => (
                                    <PageSelectContent flags={flags}>
                                        {selectedOptions.length
                                            ? selectedOptions.map((option) => option.value).join(", ")
                                            : PLACEHOLDER}
                                    </PageSelectContent>
                                )}
                                renderOption={(option, flags) => (
                                    <PageSelectOptionContent isGliding flags={flags}>
                                        {option.value}
                                    </PageSelectOptionContent>
                                )}
                                renderPopup={renderSelectPopup}
                            />
                        )}
                    />

                    <FormField
                        renderCaption={() => <PageFormFieldCaption>Start date</PageFormFieldCaption>}
                        renderControl={() => (
                            <DateInput
                                name={"start"}
                                value={startState}
                                locale={LOCALE}
                                ariaLabel={"Start date"}
                                partHints={DATE_PART_HINTS}
                                padding={FIELD_PADDING}
                                gap={FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                                renderPlaceholder={(flags, hint) => (
                                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                                )}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Book</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>

                    <div className={exampleStyles.exampleReadout} data-readout>
                        {outcome}
                    </div>
                </PageFormStack>
            )}
        />
    );
};
