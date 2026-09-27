import { ContextMenu } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Menus/MenuPage/MenuPage.css";

import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";

type Props = MenuExampleProps;

export const ContextAreaExample = (props: Props) => {
    return (
        <ContextMenu
            items={ACTIONS}
            ariaLabel={"Edit actions"}
            regionAriaLabel={"Editing area"}
            renderRegion={() => <div className={styles.contextRegion}>Right-click anywhere in this box</div>}
            renderItem={renderMenuItem}
            renderPopup={renderMenuPopup}
            onActivate={props.onActivate}
        />
    );
};
