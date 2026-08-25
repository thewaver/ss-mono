import type { Signal } from "solid-js";

import type { AccessorProps, SelectItem, SelectOption } from "@thewaver/ss-components";

export type Airport = {
    code: string;
    city: string;
};

export type Delivery = {
    name: string;
    description: string;
};

export type SelectExampleProps = AccessorProps<{
    valueSignal: Signal<string | undefined>;
    options?: SelectItem<string>[];
}>;

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
