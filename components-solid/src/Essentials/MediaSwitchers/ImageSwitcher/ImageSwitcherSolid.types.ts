import type { BaseImageSwitcherCbs, BaseImageSwitcherValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type ImageSwitcherProps = AccessorValues<BaseImageSwitcherValues> & BaseImageSwitcherCbs;
