import { Select } from "@thewaver/ss-components-react";
import type { SelectItem } from "@thewaver/ss-components-react";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { Delivery } from "../SelectPage.types";

const STRESS_COUNT_FIELD_WIDTH = 120;
const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = {
    value: readonly [Delivery | undefined, (value: Delivery | undefined) => void];
    visibility: readonly [boolean, (isOpen: boolean) => void];
    options: SelectItem<Delivery>[];
    count: number;
    onCountChange: (count: number) => void;
};

export const VirtualizedExample = (props: Props) => {
    return (
        <div className={styles.column}>
            <Select
                value={props.value}
                visibility={props.visibility}
                options={props.options}
                ariaLabel={"Route"}
                computeEstimatedOptionHeight={() => STRESS_OPTION_HEIGHT}
                computeEstimatedGroupHeight={() => STRESS_GROUP_HEIGHT}
                renderGroup={(group) => <PageSelectGroupContent>{group.label}</PageSelectGroupContent>}
                computeCustomText={(option) => option.value.name}
                renderContent={(selectedOption, flags) => (
                    <PageSelectContent flags={flags}>{selectedOption?.value.name ?? PLACEHOLDER}</PageSelectContent>
                )}
                renderOption={(option, flags) => (
                    <PageSelectOptionContent flags={flags} description={option.value.description}>
                        {option.value.name}
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"stressCount"}
                    label={"Option count"}
                    hint={
                        "How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
                    }
                >
                    <PageNumberField
                        value={props.count}
                        min={SelectKnobs.MIN_STRESS_COUNT}
                        max={SelectKnobs.MAX_STRESS_COUNT}
                        step={SelectKnobs.STRESS_COUNT_STEP}
                        width={STRESS_COUNT_FIELD_WIDTH}
                        ariaLabel={"Option count"}
                        onInput={props.onCountChange}
                    />
                </PageProp>
            </PageExampleKnobs>
        </div>
    );
};
