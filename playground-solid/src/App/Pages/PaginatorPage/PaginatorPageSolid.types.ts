import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BasePaginatorExampleCbs,
    BasePaginatorExampleValues,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.types";

export type PaginatorExampleProps = AccessorValues<BasePaginatorExampleValues> & BasePaginatorExampleCbs;
