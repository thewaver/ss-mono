import { CellAnimationBreakpointUtils, CellAnimationKeyframeUtils, CellAnimationUtils } from "@thewaver/ss-components";
import type { CellAnimationEasing, CellAnimationFn, CellStop, SVGColorMixing } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import {
    CELL_GPU_DRAW_FRAGMENT,
    CELL_GPU_DRAW_VERTEX,
    CELL_GPU_EASING_SIZE,
    CELL_GPU_MAX_STOPS,
    CELL_GPU_TRACK_KEYS,
} from "./CellGpu.const";
import type { CellGpuCell, CellGpuFrame, CellGpuItem, CellGpuMode, CellGpuPresenter } from "./CellGpu.types";

type Program = {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null>;
};

type Source = {
    image: HTMLImageElement;
    isReady: boolean;
    listeners: Set<() => void>;
    textures: Map<string, WebGLTexture>;
};

type Renderer = {
    gl: WebGL2RenderingContext;
    canvas: OffscreenCanvas;
    draw: Program;
    corners: WebGLBuffer;
    sources: Map<string, Source>;
    maxTextureSize: number;
};

const INSTANCE_FLOATS = 14;
const BYTES_PER_FLOAT = 4;
const TEXEL_FLOATS = 4;
const CORNERS = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
const CORNER_COUNT = 4;
const WHOLE_WINDOW: [number, number, number] = [0, 0.5, 1];
const NO_TINT: [number, number, number, number] = [1, 1, 1, 1];
const NO_DIRECT: [number, number, number, number] = [1, 1, 0, 1];
const SPRITE_RESOLUTION = 128;
const SPRITE_KEY = "sprite";
const MODES: Record<CellGpuMode, number> = { slices: 0, particles: 1, direct: 2 };
const CHANNEL_MODES = { additive: 1, subtractive: 2 } as const;
const NO_CHANNELS = 0;
const NO_PERSPECTIVE = 0;
const PERCENT = 100;
const BLUR_REACH = 3;
const UNIFORM_NAMES = [
    "u_tables",
    "u_easingRow",
    "u_mode",
    "u_timeline",
    "u_half",
    "u_desc",
    "u_clock",
    "u_lifetime",
    "u_size",
    "u_area",
    "u_perspective",
    "u_viewport",
    "u_scale",
    "u_src",
    "u_channelMode",
    "u_isSprite",
    "u_srcScale",
];

let renderer: Renderer | null | undefined;

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);

    if (!shader) throw new Error("No shader");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "");

    return shader;
};

const linkProgram = (gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): Program => {
    const program = gl.createProgram();

    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "");

    return {
        program,
        uniforms: Object.fromEntries(UNIFORM_NAMES.map((name) => [name, gl.getUniformLocation(program, name)])),
    };
};

const createRenderer = (): Renderer | null => {
    if (typeof OffscreenCanvas === "undefined") return null;

    const canvas = new OffscreenCanvas(1, 1);
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: true });

    if (!gl) return null;

    const corners = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, corners);
    gl.bufferData(gl.ARRAY_BUFFER, CORNERS, gl.STATIC_DRAW);

    return {
        gl,
        canvas,
        draw: linkProgram(gl, CELL_GPU_DRAW_VERTEX, CELL_GPU_DRAW_FRAGMENT),
        corners,
        sources: new Map(),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    };
};

const getRenderer = () => {
    if (renderer === undefined) renderer = createRenderer();

    return renderer;
};

const loadSource = (current: Renderer, src: string, onReady: () => void) => {
    const existing = current.sources.get(src);

    if (existing) {
        if (!existing.isReady) existing.listeners.add(onReady);

        return existing;
    }

    const entry: Source = { image: new Image(), isReady: false, listeners: new Set([onReady]), textures: new Map() };

    current.sources.set(src, entry);
    entry.image.src = src;
    entry.image
        .decode()
        .then(() => {
            entry.isReady = true;

            for (const listener of entry.listeners) listener();

            entry.listeners.clear();
        })
        .catch(() => entry.listeners.clear());

    return entry;
};

const uploadTexture = (gl: WebGL2RenderingContext, image: CanvasImageSource, width: number, height: number) => {
    const scaled = new OffscreenCanvas(width, height);
    const context = scaled.getContext("2d");
    const texture = gl.createTexture();

    if (context) {
        context.imageSmoothingQuality = "high";
        context.drawImage(image, 0, 0, width, height);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scaled);
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
};

const getSliceTexture = (current: Renderer, source: Source, width: number, height: number) => {
    const key = `${width}x${height}`;
    const existing = source.textures.get(key);

    if (existing) return existing;

    const texture = uploadTexture(current.gl, source.image, width, height);

    source.textures.set(key, texture);

    return texture;
};

const getSpriteTexture = (current: Renderer, source: Source) => {
    const existing = source.textures.get(SPRITE_KEY);

    if (existing) return existing;

    const longest = Math.max(source.image.naturalWidth, source.image.naturalHeight, 1);
    const ratio = SPRITE_RESOLUTION / longest;
    const texture = uploadTexture(
        current.gl,
        source.image,
        Math.max(1, Math.round(source.image.naturalWidth * ratio)),
        Math.max(1, Math.round(source.image.naturalHeight * ratio)),
    );

    source.textures.set(SPRITE_KEY, texture);

    return texture;
};

const toTableData = (tables: CellStop[][], easing: Float32Array, maxTextureSize: number) => {
    const tracks = tables.map((stops) =>
        CELL_GPU_TRACK_KEYS.map((key) => {
            const track = stops.filter((stop) => stop[key] !== undefined);

            if (track.length > CELL_GPU_MAX_STOPS) {
                throw new Error(
                    `A table has ${track.length} stops for "${key}"; the renderer reads ${CELL_GPU_MAX_STOPS}.`,
                );
            }

            return track.map((stop) => [stop.at, stop[key] ?? 0]);
        }),
    );
    const rowWidths = tracks.map((table) => CELL_GPU_TRACK_KEYS.length + table.reduce((sum, t) => sum + t.length, 0));
    const width = Math.max(CELL_GPU_EASING_SIZE, ...rowWidths);
    const height = tables.length + 1;

    if (width > maxTextureSize || height > maxTextureSize) {
        throw new Error(`The tables need a ${width} × ${height} texture; this graphics card allows ${maxTextureSize}.`);
    }

    const data = new Float32Array(width * height * TEXEL_FLOATS);

    tracks.forEach((table, row) => {
        let offset = CELL_GPU_TRACK_KEYS.length;

        table.forEach((track, trackIdx) => {
            data.set([offset, track.length, 0, 0], (row * width + trackIdx) * TEXEL_FLOATS);
            track.forEach(([at, value], stopIdx) => {
                data.set([at, value, 0, 0], (row * width + offset + stopIdx) * TEXEL_FLOATS);
            });
            offset += track.length;
        });
    });

    easing.forEach((value, idx) => {
        data[((height - 1) * width + idx) * TEXEL_FLOATS] = value;
    });

    return { data, width, height, easingRow: height - 1 };
};

const toInstanceData = (cells: CellGpuCell[], mode: CellGpuMode) => {
    const ordered =
        mode === "slices"
            ? cells
                  .map((cell, idx) => ({ cell, idx, depth: CellAnimationUtils.computeCellDepth(cell.weight) }))
                  .sort((a, b) => a.depth - b.depth || a.idx - b.idx)
                  .map(({ cell }) => cell)
            : cells;
    const data = new Float32Array(ordered.length * INSTANCE_FLOATS);

    ordered.forEach((cell, idx) => {
        data.set(
            [
                cell.left,
                cell.top,
                cell.width,
                cell.height,
                cell.weight,
                cell.table,
                ...(cell.tint ?? NO_TINT),
                ...(cell.direct ?? NO_DIRECT),
            ],
            idx * INSTANCE_FLOATS,
        );
    });

    return data;
};

const getTrackExtreme = (stops: CellStop[], key: keyof CellStop, fallback: number) =>
    stops.reduce((most, stop) => Math.max(most, Math.abs(stop[key] ?? fallback)), Math.abs(fallback));

const tints = new Map<string, [number, number, number, number]>();

let tintContext: OffscreenCanvasRenderingContext2D | null | undefined;

const resolveThemeColor = (value: string) => {
    const name = value.match(/^var\((--[^),]+)/)?.[1];

    return name ? getComputedStyle(document.body).getPropertyValue(name).trim() : value;
};

const composeEnvelope = (stops: CellStop[], holdShare: number): CellStop[] => {
    const edge = (1 - holdShare) * 0.5;

    return CELL_GPU_TRACK_KEYS.flatMap((key) => {
        const track = stops.filter((stop) => stop[key] !== undefined);

        if (track.length === 0) return [];
        if (edge <= 0) return [{ at: 0, [key]: track[track.length - 1][key] }];

        return [
            ...track.map((stop) => ({ at: stop.at * edge, [key]: stop[key] })),
            ...[...track].reverse().map((stop) => ({ at: 1 - stop.at * edge, [key]: stop[key] })),
        ];
    });
};

export namespace CellGpuUtils {
    export const getIsAvailable = () => !!getRenderer();

    export const preloadSource = (src: string, onReady: () => void) => {
        const current = getRenderer();

        if (current) loadSource(current, src, onReady);
    };

    export const toTint = (color: string): [number, number, number, number] => {
        const cached = tints.get(color);

        if (cached) return cached;

        if (tintContext === undefined) tintContext = new OffscreenCanvas(1, 1).getContext("2d");

        if (!tintContext) return NO_TINT;

        tintContext.clearRect(0, 0, 1, 1);
        tintContext.fillStyle = color;
        tintContext.fillRect(0, 0, 1, 1);

        const [r, g, b, a] = tintContext.getImageData(0, 0, 1, 1).data;
        const tint: [number, number, number, number] = [r / 255, g / 255, b / 255, a / 255];

        tints.set(color, tint);

        return tint;
    };

    export const createDotSrc = (lightColor: string, darkColor: string) => {
        const light = resolveThemeColor(lightColor);
        const dark = resolveThemeColor(darkColor);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><radialGradient id="g" cx="0.7" cy="0.3" fx="0.7" fy="0.3" r="0.99"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs><circle cx="32" cy="32" r="32" fill="url(#g)"/></svg>`;

        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    };

    export const createEnvelope = (animation: CellAnimationFn, holdShare: number) => {
        const composed = new WeakMap<CellStop[], CellStop[]>();

        return CellAnimationKeyframeUtils.fromSlices((defs) => {
            const stops = CellAnimationKeyframeUtils.resolveStops(animation, defs) ?? [];
            const existing = composed.get(stops);

            if (existing) return existing;

            const next = composeEnvelope(stops, holdShare);

            composed.set(stops, next);

            return next;
        });
    };

    export const computeEasing = (easing: CellAnimationEasing | undefined) =>
        Float32Array.from({ length: CELL_GPU_EASING_SIZE }, (_, idx) =>
            CellAnimationBreakpointUtils.computeLocalTimeline(WHOLE_WINDOW, idx / (CELL_GPU_EASING_SIZE - 1), easing),
        );

    export const computeReach = (tables: CellStop[][], size: Size2d, box: Size2d | undefined) => {
        const longest = Math.max(size.width, size.height);
        const diagonal = Math.hypot(size.width, size.height);

        return tables.reduce((most, stops) => {
            const travel = Math.max(
                (getTrackExtreme(stops, "translateX", 0) * size.width) / PERCENT,
                (getTrackExtreme(stops, "translateY", 0) * size.height) / PERCENT,
            );
            const scale =
                Math.max(getTrackExtreme(stops, "scaleX", PERCENT), getTrackExtreme(stops, "scaleY", PERCENT)) /
                PERCENT;
            const isTurned = ["rotate", "skewX", "skewY"].some(
                (key) => getTrackExtreme(stops, key as keyof CellStop, 0) > 0,
            );
            const isTilted = ["rotateX", "rotateY", "translateZ", "depth"].some(
                (key) => getTrackExtreme(stops, key as keyof CellStop, 0) > 0,
            );
            const grown = (Math.max(scale, 1) - 1) * longest * 0.5 + (isTurned ? (diagonal - longest) * 0.5 : 0);
            const near = isTilted ? getTrackExtreme(stops, "translateZ", 0) + diagonal * Math.max(scale, 1) * 0.5 : 0;
            const viewer = box ? Math.max(box.width, box.height) * 1.5 : 0;
            const bulge =
                box && near > 0 && near < viewer ? (Math.max(box.width, box.height) * 0.5 * near) / (viewer - near) : 0;

            return Math.max(
                most,
                Math.ceil(
                    travel + grown + bulge + near * (isTilted ? 1 : 0) + BLUR_REACH * getTrackExtreme(stops, "blur", 0),
                ),
            );
        }, 0);
    };

    export const createItem = (
        canvas: HTMLCanvasElement,
        onSourceReady: () => void,
        requested: CellGpuPresenter,
    ): CellGpuItem | undefined => {
        const override = new URLSearchParams(location.search).get("presenter");
        const presenter = override === "copy" || override === "transfer" ? override : requested;
        const current = getRenderer();
        const transferOutput = presenter === "transfer" ? canvas.getContext("bitmaprenderer") : undefined;
        const copyOutput = presenter === "copy" ? canvas.getContext("2d") : undefined;

        if (!current || (!transferOutput && !copyOutput)) return undefined;

        const { gl, draw: program } = current;
        const vao = gl.createVertexArray();
        const instances = gl.createBuffer();
        const tableTexture = gl.createTexture();
        const stride = INSTANCE_FLOATS * BYTES_PER_FLOAT;

        let layoutCells: CellGpuCell[] | undefined;
        let layoutTables: CellStop[][] | undefined;
        let layoutEasing: Float32Array | undefined;
        let easingRow = 0;

        const pointInstances = (offset: number) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, instances);
            gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, offset);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, offset + 4 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, offset + 5 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(4, 4, gl.FLOAT, false, stride, offset + 6 * BYTES_PER_FLOAT);
            gl.vertexAttribPointer(5, 4, gl.FLOAT, false, stride, offset + 10 * BYTES_PER_FLOAT);
        };

        gl.bindTexture(gl.TEXTURE_2D, tableTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, current.corners);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        for (const location of [1, 2, 3, 4, 5]) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribDivisor(location, 1);
        }

        pointInstances(0);
        gl.bindVertexArray(null);

        const prepareCanvas = (width: number, height: number) => {
            if (current.canvas.width < width) current.canvas.width = width;
            if (current.canvas.height < height) current.canvas.height = height;

            const bottom = current.canvas.height - height;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, bottom, width, height);
            gl.clearColor(0, 0, 0, 0);

            if (presenter === "transfer") {
                gl.disable(gl.SCISSOR_TEST);
            } else {
                if (canvas.width !== width) canvas.width = width;
                if (canvas.height !== height) canvas.height = height;

                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(0, bottom, width, height);
            }

            gl.clear(gl.COLOR_BUFFER_BIT);
        };

        const present = (width: number, height: number): Size2d => {
            if (transferOutput) {
                const presented = { width: current.canvas.width, height: current.canvas.height };

                transferOutput.transferFromImageBitmap(current.canvas.transferToImageBitmap());

                return presented;
            }

            if (copyOutput) {
                copyOutput.clearRect(0, 0, width, height);
                copyOutput.drawImage(current.canvas, 0, 0, width, height, 0, 0, width, height);
            }

            return { width, height };
        };

        const drawLayers = (mixing: SVGColorMixing, count: number) => {
            for (let idx = 0; idx < count; idx++) {
                if (idx === 0) {
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                } else if (mixing === "additive") {
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                } else {
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }

                pointInstances(idx * stride);
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, CORNER_COUNT, 1);
            }

            pointInstances(0);
        };

        const draw = (frame: CellGpuFrame) => {
            const width = Math.max(1, Math.round(frame.area.width * frame.scale));
            const height = Math.max(1, Math.round(frame.area.height * frame.scale));

            prepareCanvas(width, height);

            const source = loadSource(current, frame.src, onSourceReady);

            if (!frame.isShown || !source.isReady || frame.cells.length === 0 || frame.size.width <= 0) {
                return present(width, height);
            }

            const isSprite = frame.mode !== "slices";

            if (layoutCells !== frame.cells) {
                gl.bindBuffer(gl.ARRAY_BUFFER, instances);
                gl.bufferData(gl.ARRAY_BUFFER, toInstanceData(frame.cells, frame.mode), gl.DYNAMIC_DRAW);
                layoutCells = frame.cells;
            }

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, tableTexture);

            if (layoutTables !== frame.tables || layoutEasing !== frame.easing) {
                const tables = toTableData(frame.tables, frame.easing, current.maxTextureSize);

                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA32F,
                    tables.width,
                    tables.height,
                    0,
                    gl.RGBA,
                    gl.FLOAT,
                    tables.data,
                );
                layoutTables = frame.tables;
                layoutEasing = frame.easing;
                easingRow = tables.easingRow;
            }

            const sliceWidth = Math.max(1, Math.round(frame.size.width * frame.scale));
            const sliceHeight = Math.max(1, Math.round(frame.size.height * frame.scale));
            const texture = isSprite
                ? getSpriteTexture(current, source)
                : getSliceTexture(current, source, sliceWidth, sliceHeight);
            const spriteScale = isSprite
                ? SPRITE_RESOLUTION / Math.max(frame.cells[0].width, frame.cells[0].height, 1)
                : frame.scale;

            gl.bindVertexArray(vao);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(program.program);
            gl.uniform1i(program.uniforms.u_src, 0);
            gl.uniform1i(program.uniforms.u_tables, 1);
            gl.uniform1i(program.uniforms.u_easingRow, easingRow);
            gl.uniform1i(program.uniforms.u_mode, MODES[frame.mode]);
            gl.uniform1f(program.uniforms.u_timeline, frame.timeline);
            gl.uniform1f(program.uniforms.u_half, frame.half);
            gl.uniform1f(program.uniforms.u_desc, frame.isDescending ? 1 : 0);
            gl.uniform1f(program.uniforms.u_clock, frame.clockMs ?? 0);
            gl.uniform1f(program.uniforms.u_lifetime, frame.lifetimeMs ?? 0);
            gl.uniform2f(program.uniforms.u_size, frame.size.width, frame.size.height);
            gl.uniform4f(program.uniforms.u_area, frame.area.x, frame.area.y, frame.area.width, frame.area.height);
            gl.uniform1f(
                program.uniforms.u_perspective,
                frame.hasPerspective ? parseFloat(CellAnimationUtils.computePerspective(frame.size)) : NO_PERSPECTIVE,
            );
            gl.uniform2f(program.uniforms.u_viewport, width, height);
            gl.uniform2f(program.uniforms.u_scale, width / frame.area.width, height / frame.area.height);
            gl.uniform1i(program.uniforms.u_isSprite, isSprite ? 1 : 0);
            gl.uniform1f(program.uniforms.u_srcScale, spriteScale);
            gl.uniform1i(
                program.uniforms.u_channelMode,
                frame.channelMixing ? CHANNEL_MODES[frame.channelMixing] : NO_CHANNELS,
            );

            if (frame.channelMixing) {
                drawLayers(frame.channelMixing, frame.cells.length);
            } else {
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, CORNER_COUNT, frame.cells.length);
            }

            gl.bindVertexArray(null);

            return present(width, height);
        };

        const dispose = () => {
            gl.deleteVertexArray(vao);
            gl.deleteBuffer(instances);
            gl.deleteTexture(tableTexture);
        };

        return { draw, dispose };
    };
}
