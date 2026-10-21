import { ContextMenu } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { NESTED_ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuExampleProps } from "../MenuPageSolid.types";

type Props = MenuExampleProps;

export const ContextRightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <ContextMenu
                renderHighlightFloater={renderPageHighlightFloater}
                items={NESTED_ACTIONS}
                ariaLabel={"File actions"}
                regionAriaLabel={"Editing area in a right-to-left box"}
                submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
                renderRegion={() => <div class={styles.contextRegion}>Right-click anywhere in this box</div>}
                renderItem={renderMenuItem}
                renderPopup={renderMenuPopup}
                onActivate={props.onActivate}
            />
        </div>
    );
};
