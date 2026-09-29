import type { SelectItem, SelectOption } from "@thewaver/ss-components-svelte";
import type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type SelectExampleProps = {
    value: string | undefined;
    options?: SelectItem<string>[];
};

export type SelectClearableExampleProps = {
    value: string | undefined;
    onSelectionChange: (value: string | undefined) => void;
};

export type SelectAirportExampleProps = {
    value: Airport | undefined;
};

export type SelectDeliveryExampleProps = {
    value: Delivery | undefined;
};

export type SelectRoutesExampleProps = SelectDeliveryExampleProps & {
    options: SelectOption<Delivery>[];
    hasMore: boolean;
    isFetching: boolean;
    onReachEnd: () => void;
};
