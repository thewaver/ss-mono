import { Button } from "@thewaver/ss-components-react";
import { PAN_ZOOM_ACTIONS } from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PanZoomControls/PanZoomControls.css";

import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { PagePanZoomControlsProps } from "./PanZoomControls.types";

export const PagePanZoomControls = (props: PagePanZoomControlsProps) => (
    <div className={styles.panZoomControls}>
        {PAN_ZOOM_ACTIONS.map((action) => (
            <Button
                key={action.key}
                id={`${props.idPrefix}${action.key}`}
                ariaLabel={action.label}
                renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={action.glyph} />}
                onClick={() => {
                    if (!props.controller) return;

                    if (action.kind === "zoom") props.controller.zoomBy(action.factor);
                    else props.controller.panBy(action.ratio);
                }}
            />
        ))}
    </div>
);
