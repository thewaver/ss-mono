import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTabsExampleCbs,
    BaseTabsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.types";

export type TabsExampleProps = AccessorValues<BaseTabsExampleValues> & BaseTabsExampleCbs;
