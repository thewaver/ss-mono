export type BreadcrumbsFlags = {
    isCurrent: boolean;
};

export type Breadcrumb<T> = {
    value: T;
    href?: string;
    isDisabled?: boolean;
    /**
     * Keeps this crumb in the tab order while it is disabled, so focus can land on it and a reader hears its name and
     * that it is unavailable. It still cannot be followed.
     */
    isReachableWhenDisabled?: boolean;
    id?: string;
};
