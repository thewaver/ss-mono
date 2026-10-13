<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import AvatarExample from "./Examples/Avatar/Avatar.svelte";
    import BannerExample from "./Examples/Banner/Banner.svelte";
    import CardExample from "./Examples/Card/Card.svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT } from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.const";

    const EXAMPLES: ExampleDefs[] = [
        {
            key: "avatar",
            name: EXAMPLE_NAMES.avatar,
            component: avatarExample,
            path: `${EXAMPLES_ROOT}/Avatar/Avatar.svelte`,
        },
        {
            key: "banner",
            name: EXAMPLE_NAMES.banner,
            component: bannerExample,
            path: `${EXAMPLES_ROOT}/Banner/Banner.svelte`,
        },
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card/Card.svelte`,
        },
    ];
</script>

{#snippet avatarExample()}
    <AvatarExample />
{/snippet}

{#snippet bannerExample()}
    <BannerExample />
{/snippet}

{#snippet cardExample()}
    <CardExample />
{/snippet}

<div class={styles.root}>
    <PageExamples items={EXAMPLES} />
</div>
