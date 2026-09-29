import type { MouseEvent } from "react";
import { useHref, useLinkClickHandler } from "react-router";

import type { PageRouterLinkProps } from "./RouterLink.types";

export const PageRouterLink = ({ href, replace, onClick, ...rest }: PageRouterLinkProps) => {
    const resolvedHref = useHref(href);
    const navigateOnClick = useLinkClickHandler<HTMLAnchorElement>(href, { replace });

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);

        if (!e.defaultPrevented) navigateOnClick(e);
    };

    return <a {...rest} href={resolvedHref} onClick={handleClick} />;
};
