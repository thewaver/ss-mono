import { useState } from "react";

import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormFieldMessage,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageReact.const";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

export const SubmittedDocsExample = () => {
    const planState = useState<string | undefined>();
    const topicsState = useState<string[]>([]);
    const [outcome, setOutcome] = useState("Not sent yet.");

    const isComplete = planState[0] !== undefined && topicsState[0].length > 0;

    return (
        <Form
            ariaLabel={"Newsletter"}
            onSubmit={() => {
                if (!isComplete) return;

                setOutcome(`Sent: ${planState[0]}, ${topicsState[0].join(", ")}.`);
            }}
            onReset={() => {
                planState[1](undefined);
                topicsState[1]([]);
                setOutcome("Not sent yet.");
            }}
            renderContent={(state) => {
                const planMessage = state.hasSubmitted && planState[0] === undefined ? "Pick a plan." : "";

                const topicsMessage = state.hasSubmitted && topicsState[0].length < 1 ? "Pick at least one topic." : "";

                return (
                    <PageFormStack>
                        <FormField
                            hasError={planMessage.length > 0}
                            message={planMessage}
                            renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                            renderMessage={(fieldState) => (
                                <PageFormFieldMessage state={fieldState}>{planMessage}</PageFormFieldMessage>
                            )}
                            renderControl={(fieldState) => (
                                <Select
                                    renderHighlightFloater={renderPageHighlightFloater}
                                    value={planState}
                                    options={PLANS}
                                    ariaLabel={"Plan"}
                                    isRequired={true}
                                    hasError={fieldState.hasError}
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
                            hasError={topicsMessage.length > 0}
                            message={topicsMessage}
                            renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                            renderMessage={(fieldState) => (
                                <PageFormFieldMessage state={fieldState}>{topicsMessage}</PageFormFieldMessage>
                            )}
                            renderControl={(fieldState) => (
                                <MultiSelect
                                    renderHighlightFloater={renderPageHighlightFloater}
                                    values={topicsState}
                                    options={TOPICS}
                                    ariaLabel={"Topics"}
                                    isRequired={true}
                                    hasError={fieldState.hasError}
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

                        <PageFormButtons>
                            <Button
                                type={"submit"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>Subscribe</PageButtonContent>
                                )}
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
                );
            }}
        />
    );
};
