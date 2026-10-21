import { Menu } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";
import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import { NESTED_ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPageSolid.const";
import type { MenuExampleProps } from "../MenuPageSolid.types";

type Props = MenuExampleProps;

export const RightToLeftPlacedExample = (props: Props) => (
    <div dir={"rtl"} class={styles.endAlignedBox}>
        <Menu
            renderHighlightFloater={renderPageHighlightFloater}
            items={NESTED_ACTIONS}
            ariaLabel={"File actions"}
            submenuPlacement={{ x: "right_out", y: "top_in" }}
            submenuOffset={() => ({ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET })}
            renderContent={(getFlags) => <PageMenuTriggerContent flags={getFlags}>File</PageMenuTriggerContent>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    </div>
);
