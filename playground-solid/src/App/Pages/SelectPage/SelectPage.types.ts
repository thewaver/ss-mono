import type { JSX, Signal } from "solid-js";

import type { AccessorProps, MaybeAccessor, SelectItem, SelectOption } from "@thewaver/ss-components-solid";
import type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type { Airport, Delivery } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

export type SelectExampleProps = AccessorProps<{
    value: Signal<string | undefined>;
    options?: SelectItem<string>[];
}>;

export type SelectClearableExampleProps = {
    value: Signal<string | undefined>;
    onSelectionChange: (value: string | undefined) => void;
};

export type SelectAirportExampleProps = {
    value: Signal<Airport | undefined>;
};

export type SelectDeliveryExampleProps = {
    value: Signal<Delivery | undefined>;
};

export type SelectRoutesExampleProps = SelectDeliveryExampleProps &
    AccessorProps<{
        options: SelectOption<Delivery>[];
        hasMore: boolean;
        isFetching: boolean;
        onReachEnd: () => void;
    }>;

export type SelectVirtualizedExampleProps = SelectDeliveryExampleProps & {
    visibility: Signal<boolean>;
    options: MaybeAccessor<SelectItem<Delivery>[]>;
    hasGroups?: MaybeAccessor<boolean>;
    measureOpen: (renderOptions: () => JSX.Element) => JSX.Element;
};
