import type { Signal } from "solid-js";

import type { AccessorProps, SelectItem, SelectOption } from "@thewaver/ss-components-solid";
import type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type SelectExampleProps = AccessorProps<{
    valueSignal: Signal<string | undefined>;
    options?: SelectItem<string>[];
}>;

export type SelectClearableExampleProps = {
    valueSignal: Signal<string | undefined>;
    onSelectionChange: (value: string | undefined) => void;
};

export type SelectAirportExampleProps = {
    valueSignal: Signal<Airport | undefined>;
};

export type SelectDeliveryExampleProps = {
    valueSignal: Signal<Delivery | undefined>;
};

export type SelectRoutesExampleProps = SelectDeliveryExampleProps &
    AccessorProps<{
        options: SelectOption<Delivery>[];
        hasMore: boolean;
        isFetching: boolean;
        onReachEnd: () => void;
    }>;
