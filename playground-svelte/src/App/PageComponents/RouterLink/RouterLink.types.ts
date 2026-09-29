import type { HTMLAnchorAttributes } from "svelte/elements";

export type PageRouterLinkProps = HTMLAnchorAttributes & {
    href: string;
    replace?: boolean;
};
