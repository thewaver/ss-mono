<script lang="ts">
    import { untrack } from "svelte";

    import {
        toBaseRoute,
        toPageViewRoute,
    } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

    import { navigate, route } from "./App.router";
    import type { RoutePath } from "./App.types";

    $effect(() => {
        untrack(() => void navigate(toPageViewRoute(toBaseRoute(route.pathname), "docs") as RoutePath, { replace: true }));
    });
</script>
