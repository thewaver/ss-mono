<script setup lang="ts">
import { shallowRef, useId, useModel } from "vue";

import { Button, HoverCard } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageHoverCardContent from "../../../StyledComponents/HoverCardContent/HoverCardContent.vue";
import type { HoverCardExampleProps } from "../HoverCardPage.types";

type Props = HoverCardExampleProps;

const props = defineProps<Props>();

const nameId = useId();

const anchorRef = shallowRef<HTMLElement>();

const visibility = useModel(props, "visibility");
const isFollowing = useModel(props, "following");

const toggleFollowing = () => {
    isFollowing.value = !isFollowing.value;
};
</script>

<template>
    <div :class="styles.sentence">
        {{ "Posted by " }}<button ref="anchorRef" type="button" :class="styles.handle">@sir.aldric</button
        >{{ " to the masons' guild, two hours ago." }}<HoverCard
            v-model:visibility="visibility"
            :anchor-ref="anchorRef"
            :ariaLabelledBy="nameId"
            :offset="offset"
            :transition-duration-ms="transitionDurationMs"
            :focus-show-delay-ms="focusShowDelayMs"
            :hover-show-delay-ms="hoverShowDelayMs"
            :skip-delay-window-ms="skipDelayWindowMs"
        >
            <template #renderContent="{ visibilityTarget, transitionDurationMs: fadeMs }">
                <PageHoverCardContent :visibility-target="visibilityTarget" :transition-duration-ms="fadeMs">
                    <div :class="styles.profileHeader">
                        <img :src="knightProfile" alt="" :class="styles.avatar" />

                        <div>
                            <div :id="nameId" :class="styles.profileName">Sir Aldric of the East Gate</div>

                            <div :class="styles.profileHandle">@sir.aldric</div>
                        </div>
                    </div>

                    <div :class="styles.profileBio">
                        Keeps the east gate and the accounts of the masons who rebuilt it. Writes about lime mortar,
                        horses and the price of oats.
                    </div>

                    <div :class="styles.profileActions">
                        <Button @click="toggleFollowing">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">{{
                                    isFollowing ? "Unfollow" : "Follow"
                                }}</PageButtonContent>
                            </template>
                        </Button>

                        <a href="#sir-aldric">View profile</a>
                    </div>
                </PageHoverCardContent>
            </template>
        </HoverCard>
    </div>
</template>
