import type { AnchorHTMLAttributes, Ref } from "react";

export type PageRouterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    ref?: Ref<HTMLAnchorElement>;
    replace?: boolean;
};
