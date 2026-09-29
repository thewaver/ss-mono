<script lang="ts">
    import { toOwnAppHref } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";

    import { navigate } from "../../App.router";
    import type { RoutePath } from "../../App.types";
    import type { PageRouterLinkProps } from "./RouterLink.types";

    let { href, replace, onclick, children, ...rest }: PageRouterLinkProps = $props();

    const handleClick = (e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) => {
        onclick?.(e);

        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

        e.preventDefault();
        void navigate(href as RoutePath, { replace });
    };
</script>

<a {...rest} href={toOwnAppHref(href)} onclick={handleClick}>{@render children?.()}</a>
