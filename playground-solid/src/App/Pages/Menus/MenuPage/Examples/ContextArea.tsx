import { ContextMenu } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater";
import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const ContextAreaExample = (props: Props) => {
    return (
        <ContextMenu
            renderHighlightFloater={renderPageHighlightFloater}
            items={() => ACTIONS}
            ariaLabel={"Edit actions"}
            regionAriaLabel={"Editing area"}
            renderRegion={() => <div class={styles.contextRegion}>Right-click anywhere in this box</div>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
