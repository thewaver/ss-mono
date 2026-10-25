import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { DateInput, DateValueUtils } from "@thewaver/ss-components-solid";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CAESAR, FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageEraCycle } from "../../../PageComponents/EraCycle/EraCycle";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const EraDocsExample = () => {
    const valueSignal = createSignal<DateValue | undefined>(CAESAR);

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? DateValueUtils.toIso(value) : "nothing";
    };

    return (
        <>
            <DateInput
                value={valueSignal}
                locale={LOCALE}
                ariaLabel={"Historical date"}
                partHints={DATE_PART_HINTS}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
                renderLeading={(getFlags, era) => (
                    <PageEraCycle
                        era={era.getValue}
                        options={era.getOptions}
                        isDisabled={() => getFlags().isDisabled ?? false}
                        onChange={era.set}
                    />
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
