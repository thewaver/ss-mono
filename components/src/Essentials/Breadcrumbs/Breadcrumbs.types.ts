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

export type BaseBreadcrumbsValues<T> = {
    /** The space between crumbs and separators. */
    gap?: number;
    /**
     * Names the trail for assistive technology. Required, because the `<nav>` around it is a landmark and nothing
     * else can name it — a page with two unnamed navigation landmarks gives a reader no way to tell them apart.
     */
    ariaLabel: string;
    /** The crumbs, from the root to where the reader is now. */
    crumbs: Breadcrumb<T>[];
};

export type BaseBreadcrumbsCbs<T> = {
    /** Runs when a crumb is chosen. */
    onSelect?: (value: T) => void;
};

export type BaseBreadcrumbsProps<T> = BaseBreadcrumbsValues<T> & BaseBreadcrumbsCbs<T>;
