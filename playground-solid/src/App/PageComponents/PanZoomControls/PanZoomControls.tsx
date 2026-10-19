import { For } from "solid-js";

import { Button } from "@thewaver/ss-components-solid";
import { PAN_ZOOM_ACTIONS } from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.css";

import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { PagePanZoomControlsProps } from "./PanZoomControls.types";

export const PagePanZoomControls = (props: PagePanZoomControlsProps) => (
    <div class={styles.panZoomControls}>
        <For each={PAN_ZOOM_ACTIONS}>
            {(action) => (
                <Button
                    id={`${props.idPrefix}${action.key}`}
                    ariaLabel={action.label}
                    renderContent={(getFlags) => <PageControlButtonContent flags={getFlags} glyph={action.glyph} />}
                    onClick={() => {
                        const controller = props.controller();

                        if (!controller) return;

                        if (action.kind === "zoom") controller.zoomBy(action.factor);
                        else controller.panBy(action.ratio);
                    }}
                />
            )}
        </For>
    </div>
);
