import type { AccessorProps } from "@thewaver/ss-components-solid";
import type { PagePropsPanelScope } from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.types";

export type { PagePropsPanelScope } from "@thewaver/ss-playground/App/PageComponents/PropsPanel/PropsPanel.types";

export type PagePropsPanelProps = AccessorProps<{
    scope: PagePropsPanelScope;
}>;
