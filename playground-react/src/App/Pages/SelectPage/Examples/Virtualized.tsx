import { Select } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { SelectVirtualizedExampleProps } from "../SelectPage.types";
import { PLACEHOLDER, renderSelectPopup } from "../SelectPageReact.const";

const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = SelectVirtualizedExampleProps;

export const VirtualizedExample = (props: Props) => {
    return (
        <div className={styles.column}>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
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
                    <PageSelectOptionContent isGliding flags={flags} description={option.value.description}>
                        {option.value.name}
                    </PageSelectOptionContent>
                )}
                renderPopup={renderSelectPopup}
            />
        </div>
    );
};
