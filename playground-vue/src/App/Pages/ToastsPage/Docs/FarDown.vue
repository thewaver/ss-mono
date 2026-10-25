<script setup lang="ts">
import { shallowRef } from "vue";

import { Toasts } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.css";

import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.vue";
import type { ToastsFarDownShowAnswer } from "../ToastsPageVue.types";
import FarDownSaveButton from "./FarDownSaveButton.vue";
import FarDownSettingsPanel from "./FarDownSettingsPanel.vue";

const answer = shallowRef<ToastsFarDownShowAnswer>();

const setAnswer = (next: ToastsFarDownShowAnswer) => {
    answer.value = next;
};
</script>

<template>
    <div :class="styles.example">
        <div :class="styles.raiseRow">
            <Toasts ariaLabel="Profile notifications" alignment="middle_center">
                <FarDownSettingsPanel @answer="setAnswer" />

                <template #renderToast="{ toast, visibilityTarget, transitionDurationMs, state, dismiss }">
                    <PageToastContent
                        :toast="toast"
                        :state="state"
                        :visibility-target="visibilityTarget"
                        :transition-duration-ms="transitionDurationMs"
                        @dismiss="dismiss"
                    />
                </template>
            </Toasts>

            <FarDownSaveButton id="farDownOutside" caption="Save outside" @answer="setAnswer" />
        </div>

        <div :class="exampleStyles.exampleReadout" data-readout>
            {{ `show answered: ${answer === undefined ? "nothing yet" : (answer.id ?? "undefined")}` }}
        </div>
    </div>
</template>
