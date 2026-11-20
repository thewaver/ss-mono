import type { MouseEvent } from "react";
import { useHref, useLinkClickHandler } from "react-router";

import type { PageRouterLinkProps } from "./RouterLink.types";

export const PageRouterLink = (props: PageRouterLinkProps) => {
    const { href, replace, onClick, ...rest } = props;

    const resolvedHref = useHref(props.href);
    const navigateOnClick = useLinkClickHandler<HTMLAnchorElement>(props.href, { replace: props.replace });

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        props.onClick?.(e);

        if (!e.defaultPrevented) navigateOnClick(e);
    };

    return <a {...rest} href={resolvedHref} onClick={handleClick} />;
};
