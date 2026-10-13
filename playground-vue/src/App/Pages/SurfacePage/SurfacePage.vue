<script setup lang="ts">
import { EXAMPLES_ROOT, EXAMPLE_NAMES } from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/SurfacePage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import AvatarExample from "./Examples/Avatar/Avatar.vue";
import BannerExample from "./Examples/Banner/Banner.vue";
import CardExample from "./Examples/Card/Card.vue";

const EXAMPLES: ExampleDefs[] = [
    {
        key: "avatar",
        name: EXAMPLE_NAMES.avatar,
        path: `${EXAMPLES_ROOT}/Avatar/Avatar.vue`,
    },
    {
        key: "banner",
        name: EXAMPLE_NAMES.banner,
        path: `${EXAMPLES_ROOT}/Banner/Banner.vue`,
    },
    {
        key: "card",
        name: EXAMPLE_NAMES.card,
        path: `${EXAMPLES_ROOT}/Card/Card.vue`,
    },
];
</script>

<template>
    <div :class="styles.root">
        <PageExamples :items="EXAMPLES">
            <template #avatar>
                <AvatarExample />
            </template>

            <template #banner>
                <BannerExample />
            </template>

            <template #card>
                <CardExample />
            </template>
        </PageExamples>
    </div>
</template>
