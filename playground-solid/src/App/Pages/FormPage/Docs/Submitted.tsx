import { createSignal } from "solid-js";

import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-solid";
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
import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPageSolid.const";

const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

export const SubmittedDocsExample = () => {
    const planSignal = createSignal<string | undefined>();
    const topicsSignal = createSignal<string[]>([]);
    const [getOutcome, setOutcome] = createSignal("Not sent yet.");

    const getIsComplete = () => planSignal[0]() !== undefined && topicsSignal[0]().length > 0;

    return (
        <Form
            ariaLabel={"Newsletter"}
            onSubmit={() => {
                if (!getIsComplete()) return;

                setOutcome(`Sent: ${planSignal[0]()}, ${topicsSignal[0]().join(", ")}.`);
            }}
            onReset={() => {
                planSignal[1](undefined);
                topicsSignal[1]([]);
                setOutcome("Not sent yet.");
            }}
            renderContent={(getState) => {
                const getPlanMessage = () =>
                    getState().hasSubmitted && planSignal[0]() === undefined ? "Pick a plan." : "";

                const getTopicsMessage = () =>
                    getState().hasSubmitted && topicsSignal[0]().length < 1 ? "Pick at least one topic." : "";

                return (
                    <PageFormStack>
                        <FormField
                            hasError={() => getPlanMessage().length > 0}
                            message={getPlanMessage}
                            renderCaption={() => <PageFormFieldCaption>Plan</PageFormFieldCaption>}
                            renderMessage={(getFieldState) => (
                                <PageFormFieldMessage state={getFieldState}>{getPlanMessage()}</PageFormFieldMessage>
                            )}
                            renderControl={(getFieldState) => (
                                <Select
                                    renderHighlightFloater={renderPageHighlightFloater}
                                    value={planSignal}
                                    options={PLANS}
                                    isRequired={true}
                                    hasError={() => getFieldState().hasError}
                                    renderContent={(getSelectedOption, getFlags) => (
                                        <PageSelectContent flags={getFlags}>
                                            {getSelectedOption()?.value ?? PLACEHOLDER}
                                        </PageSelectContent>
                                    )}
                                    renderOption={(getOption, getFlags) => (
                                        <PageSelectOptionContent isGliding flags={getFlags}>
                                            {getOption().value}
                                        </PageSelectOptionContent>
                                    )}
                                    renderPopup={renderSelectPopup}
                                />
                            )}
                        />

                        <FormField
                            hasError={() => getTopicsMessage().length > 0}
                            message={getTopicsMessage}
                            renderCaption={() => <PageFormFieldCaption>Topics</PageFormFieldCaption>}
                            renderMessage={(getFieldState) => (
                                <PageFormFieldMessage state={getFieldState}>{getTopicsMessage()}</PageFormFieldMessage>
                            )}
                            renderControl={(getFieldState) => (
                                <MultiSelect
                                    renderHighlightFloater={renderPageHighlightFloater}
                                    values={topicsSignal}
                                    options={TOPICS}
                                    isRequired={true}
                                    hasError={() => getFieldState().hasError}
                                    renderContent={(getSelectedOptions, getFlags) => (
                                        <PageSelectContent flags={getFlags}>
                                            {getSelectedOptions().length
                                                ? getSelectedOptions()
                                                      .map((option) => option.value)
                                                      .join(", ")
                                                : PLACEHOLDER}
                                        </PageSelectContent>
                                    )}
                                    renderOption={(getOption, getFlags) => (
                                        <PageSelectOptionContent isGliding flags={getFlags}>
                                            {getOption().value}
                                        </PageSelectOptionContent>
                                    )}
                                    renderPopup={renderSelectPopup}
                                />
                            )}
                        />

                        <PageFormButtons>
                            <Button
                                type={"submit"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Subscribe</PageButtonContent>
                                )}
                            />

                            <Button
                                type={"reset"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Reset</PageButtonContent>
                                )}
                            />
                        </PageFormButtons>

                        <div class={exampleStyles.exampleReadout} data-readout>
                            {getOutcome()}
                        </div>
                    </PageFormStack>
                );
            }}
        />
    );
};
