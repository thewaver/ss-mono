import type { SelectItem, SelectOption } from "@thewaver/ss-components-react";
import type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type SelectExampleProps = {
    value: readonly [string | undefined, (value: string | undefined) => void];
    options?: SelectItem<string>[];
};

export type SelectClearableExampleProps = {
    value: readonly [string | undefined, (value: string | undefined) => void];
    onSelectionChange: (value: string | undefined) => void;
};

export type SelectAirportExampleProps = {
    value: readonly [Airport | undefined, (value: Airport | undefined) => void];
};

export type SelectDeliveryExampleProps = {
    value: readonly [Delivery | undefined, (value: Delivery | undefined) => void];
};

export type SelectRoutesExampleProps = SelectDeliveryExampleProps & {
    options: SelectOption<Delivery>[];
    hasMore: boolean;
    isFetching: boolean;
    onReachEnd: () => void;
};
