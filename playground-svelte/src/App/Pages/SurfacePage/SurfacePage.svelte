<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.css";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import AvatarExample from "./Examples/Avatar/Avatar.svelte";
    import BannerExample from "./Examples/Banner/Banner.svelte";
    import CardExample from "./Examples/Card/Card.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/SurfacePage/Examples";

    const EXAMPLES: ExampleDefs[] = [
        {
            key: "avatar",
            name: "Avatar",
            component: avatarExample,
            path: `${EXAMPLES_ROOT}/Avatar/Avatar.svelte`,
        },
        {
            key: "banner",
            name: "Banner",
            component: bannerExample,
            path: `${EXAMPLES_ROOT}/Banner/Banner.svelte`,
        },
        {
            key: "card",
            name: "Card",
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
