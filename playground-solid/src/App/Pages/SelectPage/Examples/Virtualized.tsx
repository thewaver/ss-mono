import { Select } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageSelectContent } from "../../../StyledComponents/SelectContent/SelectContent";
import { PageSelectGroupContent } from "../../../StyledComponents/SelectGroupContent/SelectGroupContent";
import { PageSelectOptionContent } from "../../../StyledComponents/SelectOptionContent/SelectOptionContent";
import type { SelectVirtualizedExampleProps } from "../SelectPage.types";
import { PLACEHOLDER, renderSelectPopup } from "../SelectPageSolid.const";

const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = SelectVirtualizedExampleProps;

export const VirtualizedExample = (props: Props) => {
    return (
        <div class={styles.column}>
            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                value={props.value}
                visibility={props.visibility}
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
                    <PageSelectOptionContent
                        isGliding
                        flags={getFlags}
                        description={() => getOption().value.description}
                    >
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
        </div>
    );
};
