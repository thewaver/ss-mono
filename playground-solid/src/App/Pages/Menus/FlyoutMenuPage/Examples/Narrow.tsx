import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.css";

import type { FlyoutMenuExampleProps } from "../FlyoutMenuPageSolid.types";
import { ShopExample } from "./Shop";

type Props = FlyoutMenuExampleProps;

export const NarrowExample = (props: Props) => (
    <div class={styles.narrowFrame}>
        <ShopExample {...props} />
    </div>
);
