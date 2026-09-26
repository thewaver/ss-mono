import type { JSX, Signal } from "solid-js";

import { Select } from "@thewaver/ss-components";
import type { MaybeAccessor, SelectItem } from "@thewaver/ss-components";

import { SelectKnobs } from "../../../Knobs/Selects.const";
import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PLACEHOLDER, renderSelectPopup } from "../SelectPage.const";
import type { Delivery } from "../SelectPage.types";

import * as styles from "../SelectPage.css";

const STRESS_COUNT_FIELD_WIDTH = 120;
const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = {
    valueSignal: Signal<Delivery | undefined>;
    visibilitySignal: Signal<boolean>;
    options: MaybeAccessor<SelectItem<Delivery>[]>;
    hasGroups?: MaybeAccessor<boolean>;
    count: MaybeAccessor<number>;
    onCountChange: (count: number) => void;
    measureOpen: (renderOptions: () => JSX.Element) => JSX.Element;
};

export const VirtualizedExample = (props: Props) => {
    return (
        <div class={styles.column}>
            <Select
                valueSignal={props.valueSignal}
                visibilitySignal={props.visibilitySignal}
                options={props.options}
                ariaLabel={"Route"}
                computeEstimatedOptionHeight={() => STRESS_OPTION_HEIGHT}
                computeEstimatedGroupHeight={() => STRESS_GROUP_HEIGHT}
                renderGroup={(getGroup) => <PageSelectGroupContent>{getGroup().label}</PageSelectGroupContent>}
                computeCustomText={(option) => option.value.name}
                renderContent={(getSelectedOption, getFlags) => (
                    <PageSelectContent flags={getFlags}>
                        {getSelectedOption()?.value.name ?? PLACEHOLDER}
                    </PageSelectContent>
                )}
                renderOption={(getOption, getFlags) => (
                    <PageSelectOptionContent flags={getFlags} description={() => getOption().value.description}>
                        {getOption().value.name}
                    </PageSelectOptionContent>
                )}
                renderPopup={(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement) =>
                    renderSelectPopup(
                        () => props.measureOpen(renderOptions),
                        getVisibilityTarget,
                        getTransitionDurationMs,
                        getPlacement,
                    )
                }
            />

            <PageExampleKnobs>
                <PageProp
                    key={"stressCount"}
                    label={"Option count"}
                    hint={
                        "How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
                    }
                >
                    <PageNumberField
                        value={props.count}
                        min={() => SelectKnobs.MIN_STRESS_COUNT}
                        max={() => SelectKnobs.MAX_STRESS_COUNT}
                        step={() => SelectKnobs.STRESS_COUNT_STEP}
                        width={() => STRESS_COUNT_FIELD_WIDTH}
                        ariaLabel={"Option count"}
                        onInput={props.onCountChange}
                    />
                </PageProp>
            </PageExampleKnobs>
        </div>
    );
};
