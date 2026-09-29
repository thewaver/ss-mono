<script setup lang="ts">
import { useModel } from "vue";

import { Button, Modal, Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { ModalLayeredExampleProps } from "../ModalPage.types";

const LAYERED_TITLE_ID = "modal-page-layered-title";

const COUNTRIES: SelectOption<string>[] = [{ value: "Denmark" }, { value: "Portugal" }, { value: "Sweden" }];

type Props = ModalLayeredExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");
const value = useModel(props, "value");

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <Button id="openLayers" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open layers</PageButtonContent>
        </template>
    </Button>

    <Modal v-model:visibility="visibility" :ariaLabelledBy="LAYERED_TITLE_ID">
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :id="LAYERED_TITLE_ID">Where are you flying from?</div>

                <Select v-model:value="value" :options="COUNTRIES" ariaLabel="Country">
                    <template #renderContent="{ selectedOption, flags }">
                        <PageSelectContent :flags="flags">{{ selectedOption?.value ?? "Pick one" }}</PageSelectContent>
                    </template>

                    <template #renderOption="{ option, flags }">
                        <PageSelectOptionContent :flags="flags">{{ option.value }}</PageSelectOptionContent>
                    </template>

                    <template
                        #renderPopup="{
                            renderOptions,
                            visibilityTarget: popupVisibilityTarget,
                            transitionDurationMs: popupTransitionDurationMs,
                            placement,
                        }"
                    >
                        <PagePopoverSurface
                            :visibility-target="popupVisibilityTarget"
                            :transition-duration-ms="popupTransitionDurationMs"
                            :placement="placement"
                        >
                            <component :is="renderOptions" />
                        </PagePopoverSurface>
                    </template>
                </Select>
            </PageModalPanel>
        </template>
    </Modal>
</template>
