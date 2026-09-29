<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Collapsible } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/App.css";

import { DEPENDENCY_GROUPS, DEPENDENCY_SECTIONS, EMPTY_DEPENDENCY_NAMES } from "./App.const";
import { AppUtils } from "./App.utils";
import PageRouterLink from "./PageComponents/RouterLink/RouterLink.vue";
import type { PageViewKey } from "./PageComponents/ViewTabs/ViewTabs.types";
import { useLayerClass } from "./StyledComponents/Layer/Layer.context";

const props = defineProps<{ name: string; view: PageViewKey }>();

const expandedSections = shallowRef<string[]>([]);

watch(
    () => props.name,
    () => {
        expandedSections.value = [];
    },
);

const layerClass = useLayerClass();

const dependencies = computed(() => AppUtils.DEPENDENCIES_BY_KEY.get(props.name.toLowerCase()));

const shownSections = computed(() =>
    DEPENDENCY_SECTIONS.map((section) => ({
        section,
        sectionNames: dependencies.value?.[section.key] ?? EMPTY_DEPENDENCY_NAMES,
    })).filter(({ sectionNames }) => DEPENDENCY_GROUPS.some((group) => sectionNames[group.key].length)),
);

const setIsSectionExpanded = (key: string, next: boolean) => {
    const previous = expandedSections.value;

    expandedSections.value = next ? [...previous, key] : previous.filter((candidate) => candidate !== key);
};
</script>

<template>
    <div :class="[styles.pageDependencies, layerClass]">
        <template v-for="{ section, sectionNames } in shownSections" :key="section.key">
            <span :class="styles.dependencySectionLabel">{{ section.label }}</span>

            <div :class="styles.dependencyDisclosure">
                <Collapsible
                    :expanded="expandedSections.includes(section.key)"
                    sizing="fill"
                    is-panel-built-on-expand
                    @update:expanded="(next: boolean) => setIsSectionExpanded(section.key, next)"
                >
                    <template #renderTrigger="flags">
                        <div
                            :class="[
                                styles.dependencySummary,
                                flags.isExpanded && styles.isExpanded,
                                flags.isHovered && styles.isHovered,
                            ]"
                        >
                            <span>{{ AppUtils.computeDependencySummary(sectionNames) }}</span>

                            <span :class="styles.dependencySummaryMarker" aria-hidden="true">▶</span>
                        </div>
                    </template>

                    <template #renderPanel="{ visibilityTarget, transitionDurationMs }">
                        <div
                            :class="styles.dependencyGroups"
                            :style="{ opacity: visibilityTarget, transition: `opacity ${transitionDurationMs}ms` }"
                        >
                            <template v-for="group in DEPENDENCY_GROUPS" :key="group.key">
                                <div v-if="sectionNames[group.key].length" :class="styles.dependencyGroup">
                                    <span :class="styles.dependencyLabel">{{ group.label }}</span>

                                    <template v-for="dependencyName in sectionNames[group.key]" :key="dependencyName">
                                        <PageRouterLink
                                            v-if="AppUtils.CONFIGS_BY_KEY.get(dependencyName.toLowerCase())"
                                            :class="styles.dependencyLink"
                                            :href="
                                                AppUtils.toPageHref(
                                                    AppUtils.CONFIGS_BY_KEY.get(dependencyName.toLowerCase())!,
                                                    view,
                                                )
                                            "
                                        >
                                            {{ dependencyName }}
                                        </PageRouterLink>

                                        <span v-else :class="styles.dependencyName">{{ dependencyName }}</span>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </template>
                </Collapsible>
            </div>
        </template>
    </div>
</template>
