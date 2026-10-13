import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTableOfContentsExampleCbs,
    BaseTableOfContentsExampleValues,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.types";

export type TableOfContentsExampleProps = AccessorValues<BaseTableOfContentsExampleValues> &
    BaseTableOfContentsExampleCbs;
