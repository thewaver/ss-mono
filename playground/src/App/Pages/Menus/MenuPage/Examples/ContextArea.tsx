import { ContextMenu } from "@thewaver/ss-components";

import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

import * as styles from "../MenuPage.css";

type Props = MenuExampleProps;

export const ContextAreaExample = (props: Props) => {
    return (
        <ContextMenu
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
