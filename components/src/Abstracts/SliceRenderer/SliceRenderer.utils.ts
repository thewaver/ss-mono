import type { Rect, Size2d } from "@thewaver/ss-utils";

import { CellAnimationUtils } from "../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import type { SliceAnimationEasing } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.types";
import { SliceAnimationBreakpointUtils } from "../../Generators/SliceAnimationBreakpoints/SliceAnimationBreakpoints.utils";
import type { SliceStop } from "../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import type { SliceAnimationRenderer } from "../SliceAnimation/SliceAnimation.types";
import { SliceRendererConst } from "./SliceRenderer.internal.const";
import type {
    SliceRendererFrame,
    SliceRendererItem,
    SliceRendererMode,
    SliceRendererPicture,
    SliceRendererSlice,
    SliceRendererThread,
    SliceRendererTint,
} from "./SliceRenderer.types";

type OutputCanvas = OffscreenCanvas | HTMLCanvasElement;

type AtlasBatch = { width: number; height: number; count: number };

type InstanceUpload = { item: number; data: Float32Array<ArrayBuffer> };

type TableUpload = { item: number; data: Float32Array<ArrayBuffer>; width: number; height: number };

type FrameMessage = {
    type: "frame";
    id: number;
    batches: AtlasBatch[];
    placements: Float32Array<ArrayBuffer>;
    stride: number;
    instances: InstanceUpload[];
    tables: TableUpload[];
};

type ExecutorMessage =
    | { type: "addItem"; id: number; canvasId: number; canvas?: OutputCanvas }
    | { type: "removeItem"; id: number }
    | { type: "releaseCanvas"; canvasId: number }
    | { type: "setPicture"; id: number; source: ImageBitmap | HTMLImageElement }
    | FrameMessage;

type ExecutorReply =
    | { type: "ready"; maxTextureSize: number; uniformAlignment: number }
    | { type: "failed" }
    | { type: "lost" }
    | { type: "restored" }
    | { type: "shown"; frame: number; readBackMsPerPixel: number | undefined; buffers: ArrayBuffer[] };

type HostMessage =
    | { type: "addItem"; id: number; canvas: HTMLCanvasElement }
    | { type: "removeItem"; id: number }
    | { type: "setPicture"; id: number; source: ImageBitmap | HTMLImageElement }
    | FrameMessage;

type ExecutorParams = {
    vertexShader: string;
    fragmentShader: string;
    samplerNames: string[];
    blockName: string;
    blockMembers: string[];
    blockOffsets: number[];
    contextAttributes: WebGLContextAttributes;
    corners: number[];
    cornerCount: number;
    instanceFloats: number;
    bytesPerFloat: number;
    placement: typeof PLACEMENT;
};

type ExecutorResources = {
    program: WebGLProgram;
    corners: WebGLBuffer;
    items: WebGLBuffer;
    itemsCapacity: number;
    blockSize: number;
    alignment: number;
    textures: Map<number, Map<string, WebGLTexture>>;
};

type ExecutorItem = {
    resources: ExecutorResources;
    vao: WebGLVertexArrayObject;
    instances: WebGLBuffer;
    instancesCapacity: number;
    tableTexture: WebGLTexture;
    canvasId: number;
};

type ExecutorOutput = {
    canvas: OutputCanvas;
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
};

type Link = { thread: SliceRendererThread; send: (message: HostMessage) => void; getIsBusy: () => boolean };

type HostItem = {
    id: number;
    generation: number;
    isDisposed: boolean;
    layoutSlices: SliceRendererSlice[] | undefined;
    layoutTables: SliceStop[][] | undefined;
    layoutEasing: Float32Array | undefined;
    easingRow: number;
};

type Host = {
    link: Link;
    maxTextureSize: number;
    stride: number;
    readBackMsPerMegapixel: number;
    readBackMsPerPixel: number;
    atlas: Size2d;
    isLost: boolean;
    generation: number;
    frameCount: number;
    itemCount: number;
    isFramePending: boolean;
    shows: Map<number, (() => void)[]>;
    pictureIds: Map<string, number>;
    buffers: ArrayBuffer[];
};

type Probe = {
    canvas: OffscreenCanvas;
    gl: WebGL2RenderingContext;
    msPerMegapixel: number;
    maxTextureSize: number;
    uniformAlignment: number;
};

type Submission = {
    item: HostItem;
    frame: SliceRendererFrame;
    width: number;
    height: number;
    onShown: (rect: Rect) => void;
};

type Placement = { submission: Submission; left: number; top: number };

type Batch = { placements: Placement[]; width: number; height: number };

type PictureEntry = {
    picture: SliceRendererPicture;
    image: HTMLImageElement | undefined;
    listeners: Set<() => void>;
};

const TRACK_KEYS = SliceRendererConst.TRACK_KEYS_IN_ORDER;
const MAX_STOPS = SliceRendererConst.MAX_STOPS_PER_TRACK;
const EASING_SIZE = SliceRendererConst.EASING_SAMPLE_COUNT;
const INSTANCE_FLOATS = 14;
const BYTES_PER_FLOAT = 4;
const TEXEL_FLOATS = 4;
const CORNERS = [0, 0, 1, 0, 0, 1, 1, 1];
const CORNER_COUNT = 4;
const WHOLE_WINDOW: [number, number, number] = [0, 0.5, 1];
const NO_TINT: SliceRendererTint = [1, 1, 1, 1];
const NO_TINT_COLOR = "#ffffff";
const NO_DIRECT: [number, number, number, number] = [1, 1, 0, 1];
const NO_SIZE: Size2d = { width: 0, height: 0 };
const NOTHING_TO_NOTIFY = () => undefined;
const SPRITE_RESOLUTION = 128;
const ATLAS_WIDTH_PX = 4096;
const ATLAS_HEADROOM = 0.01;
const ATLAS_SHRINK_FRAMES = 60;
const ATLAS_SHRINK_COST_MS = 16;
const WORKER_READ_BACK_MS_PER_MEGAPIXEL = 1;
const READ_BACK_PROBE_MEGAPIXELS = 4;
const READ_BACK_PROBE_PX = 1024;
const PIXELS_PER_MEGAPIXEL = 1_000_000;
const CONTEXT_ATTRIBUTES: WebGLContextAttributes = { premultipliedAlpha: true, antialias: true };
const MODES: Record<SliceRendererMode, number> = { slices: 0, particles: 1, direct: 2 };
const CHANNEL_MODES = { additive: 1, subtractive: 2 } as const;
const NO_CHANNELS = 0;
const NO_PERSPECTIVE = 0;
const PERCENT = 100;
const BLUR_REACH = 3;
const CHANNEL_MAX = 255;
const MULTI_FRAME_FORMATS = /^data:image\/(gif|png|apng|webp|avif)|\.(gif|png|apng|webp|avif)([?#]|$)/i;
const SAMPLER_NAMES = ["u_src", "u_tables"];
const PLACEMENT = {
    areaX: 0,
    areaY: 1,
    areaWidth: 2,
    areaHeight: 3,
    sizeWidth: 4,
    sizeHeight: 5,
    viewportWidth: 6,
    viewportHeight: 7,
    scaleX: 8,
    scaleY: 9,
    timeline: 10,
    half: 11,
    desc: 12,
    clock: 13,
    lifetime: 14,
    perspective: 15,
    sourceScale: 16,
    easingRow: 17,
    mode: 18,
    channelMode: 19,
    isSprite: 20,
    item: 24,
    left: 25,
    top: 26,
    width: 27,
    height: 28,
    isDrawn: 29,
    count: 30,
    picture: 31,
    textureWidth: 32,
    textureHeight: 33,
};
const PLACEMENT_MIN_FLOATS = PLACEMENT.textureHeight + 1;
const BLOCK_SLOTS: Record<string, number> = {
    u_area: PLACEMENT.areaX,
    u_size: PLACEMENT.sizeWidth,
    u_viewport: PLACEMENT.viewportWidth,
    u_scale: PLACEMENT.scaleX,
    u_timeline: PLACEMENT.timeline,
    u_half: PLACEMENT.half,
    u_desc: PLACEMENT.desc,
    u_clock: PLACEMENT.clock,
    u_lifetime: PLACEMENT.lifetime,
    u_perspective: PLACEMENT.perspective,
    u_srcScale: PLACEMENT.sourceScale,
    u_easingRow: PLACEMENT.easingRow,
    u_mode: PLACEMENT.mode,
    u_channelMode: PLACEMENT.channelMode,
    u_isSprite: PLACEMENT.isSprite,
};
const EXECUTOR_PARAMS: ExecutorParams = {
    vertexShader: SliceRendererConst.VERTEX_SHADER,
    fragmentShader: SliceRendererConst.FRAGMENT_SHADER,
    samplerNames: SAMPLER_NAMES,
    blockName: SliceRendererConst.ITEM_BLOCK_NAME,
    blockMembers: SliceRendererConst.ITEM_BLOCK_MEMBERS,
    blockOffsets: SliceRendererConst.ITEM_BLOCK_MEMBERS.map((member) => BLOCK_SLOTS[member] * BYTES_PER_FLOAT),
    contextAttributes: CONTEXT_ATTRIBUTES,
    corners: CORNERS,
    cornerCount: CORNER_COUNT,
    instanceFloats: INSTANCE_FLOATS,
    bytesPerFloat: BYTES_PER_FLOAT,
    placement: PLACEMENT,
};

const pictures = new Map<string, PictureEntry>();
const framesChecked = new Set<string>();
const subscribers = new Set<() => void>();
const tints = new Map<string, SliceRendererTint>();

let renderer: Host | null | undefined;
let tintContext: CanvasRenderingContext2D | null | undefined;
let flushId: ReturnType<typeof requestAnimationFrame> | undefined;

const shrink = { frames: 0, width: 0, height: 0, costMs: 0 };

const submissions = new Map<HostItem, Submission>();

const notify = () => {
    for (const subscriber of [...subscribers]) subscriber();
};

const runExecutor = (
    params: ExecutorParams,
    send: (reply: ExecutorReply, transfer?: Transferable[]) => void,
    given?: OffscreenCanvas,
) => {
    const atlas = given ?? new OffscreenCanvas(1, 1);
    const gl = atlas.getContext("webgl2", params.contextAttributes);
    const field = params.placement;
    const stride = params.instanceFloats * params.bytesPerFloat;
    const items = new Map<number, ExecutorItem>();
    const outputs = new Map<number, ExecutorOutput>();
    const sources = new Map<number, ImageBitmap | HTMLImageElement>();

    if (!gl) {
        send({ type: "failed" });

        return (_message: ExecutorMessage) => undefined;
    }

    const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);

        if (!shader) throw new Error("SliceRenderer: the graphics card refused to create a shader.");

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "");

        return shader;
    };

    const createResources = (): ExecutorResources => {
        const corners = gl.createBuffer();
        const program = gl.createProgram();

        gl.bindBuffer(gl.ARRAY_BUFFER, corners);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(params.corners), gl.STATIC_DRAW);
        gl.attachShader(program, compileShader(gl.VERTEX_SHADER, params.vertexShader));
        gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, params.fragmentShader));
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "");

        const blockIndex = gl.getUniformBlockIndex(program, params.blockName);
        const memberIndices = gl.getUniformIndices(program, params.blockMembers) ?? [];
        const memberOffsets: number[] = gl.getActiveUniforms(program, memberIndices, gl.UNIFORM_OFFSET);

        if (params.blockOffsets.some((offset, idx) => memberOffsets[idx] !== offset)) {
            throw new Error(`SliceRenderer: the graphics card lays the item block out as ${memberOffsets.join(", ")}.`);
        }

        gl.uniformBlockBinding(program, blockIndex, 0);
        gl.useProgram(program);
        params.samplerNames.forEach((name, unit) => gl.uniform1i(gl.getUniformLocation(program, name), unit));

        return {
            program,
            corners,
            items: gl.createBuffer(),
            itemsCapacity: 0,
            blockSize: gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE),
            alignment: gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT),
            textures: new Map(),
        };
    };

    let resources: ExecutorResources | undefined;

    try {
        resources = createResources();
    } catch {
        send({ type: "failed" });

        return (_message: ExecutorMessage) => undefined;
    }

    atlas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        resources = undefined;
        send({ type: "lost" });
    });

    atlas.addEventListener("webglcontextrestored", () => {
        resources = createResources();
        send({ type: "restored" });
    });

    const pointInstances = (item: ExecutorItem, offset: number) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, item.instances);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, offset);
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, offset + 4 * params.bytesPerFloat);
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, offset + 5 * params.bytesPerFloat);
        gl.vertexAttribPointer(4, 4, gl.FLOAT, false, stride, offset + 6 * params.bytesPerFloat);
        gl.vertexAttribPointer(5, 4, gl.FLOAT, false, stride, offset + 10 * params.bytesPerFloat);
    };

    const addItem = (id: number, canvasId: number, canvas: OutputCanvas | undefined) => {
        if (canvas) {
            outputs.set(canvasId, {
                canvas,
                context: canvas instanceof OffscreenCanvas ? canvas.getContext("2d") : canvas.getContext("2d"),
            });
        }

        if (!resources) return;

        const item: ExecutorItem = {
            resources,
            vao: gl.createVertexArray(),
            instances: gl.createBuffer(),
            instancesCapacity: 0,
            tableTexture: gl.createTexture(),
            canvasId,
        };

        gl.bindTexture(gl.TEXTURE_2D, item.tableTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindVertexArray(item.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, resources.corners);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        for (const location of [1, 2, 3, 4, 5]) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribDivisor(location, 1);
        }

        pointInstances(item, 0);
        gl.bindVertexArray(null);
        items.set(id, item);
    };

    const removeItem = (id: number) => {
        const item = items.get(id);

        items.delete(id);

        if (!item || item.resources !== resources) return;

        gl.deleteVertexArray(item.vao);
        gl.deleteBuffer(item.instances);
        gl.deleteTexture(item.tableTexture);
    };

    const uploadTexture = (source: ImageBitmap | HTMLImageElement, width: number, height: number) => {
        const scaled = new OffscreenCanvas(width, height);
        const context = scaled.getContext("2d");
        const texture = gl.createTexture();

        if (context) {
            context.imageSmoothingQuality = "high";
            context.drawImage(source, 0, 0, width, height);
        }

        gl.activeTexture(gl.TEXTURE0);
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

    const getTexture = (current: ExecutorResources, picture: number, width: number, height: number) => {
        const source = sources.get(picture);

        if (!source) return undefined;

        const bySource = current.textures.get(picture) ?? new Map<string, WebGLTexture>();
        const key = `${width}x${height}`;
        const existing = bySource.get(key);

        if (existing) return existing;

        const texture = uploadTexture(source, width, height);

        bySource.set(key, texture);
        current.textures.set(picture, bySource);

        return texture;
    };

    const drawLayers = (item: ExecutorItem, channelMode: number, count: number) => {
        for (let idx = 0; idx < count; idx++) {
            if (idx === 0) {
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            } else if (channelMode === 1) {
                gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }

            pointInstances(item, idx * stride);
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, params.cornerCount, 1);
        }

        pointInstances(item, 0);
    };

    const render = (
        current: ExecutorResources,
        placements: Float32Array,
        ints: Int32Array,
        at: number,
        blockAt: number,
        atlasHeight: number,
    ) => {
        const item = items.get(placements[at + field.item]);
        const left = placements[at + field.left];
        const top = placements[at + field.top];
        const width = placements[at + field.width];
        const height = placements[at + field.height];
        const bottom = atlasHeight - top - height;

        gl.viewport(left, bottom, width, height);
        gl.scissor(left, bottom, width, height);

        if (!item || item.resources !== current || placements[at + field.isDrawn] === 0) return;

        const texture = getTexture(
            current,
            placements[at + field.picture],
            placements[at + field.textureWidth],
            placements[at + field.textureHeight],
        );

        if (!texture) return;

        const count = placements[at + field.count];
        const channelMode = ints[at + field.channelMode];

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, item.tableTexture);
        gl.bindVertexArray(item.vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindBufferRange(gl.UNIFORM_BUFFER, 0, current.items, blockAt * params.bytesPerFloat, current.blockSize);

        if (channelMode > 0) {
            drawLayers(item, channelMode, count);
        } else {
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, params.cornerCount, count);
        }

        gl.bindVertexArray(null);
    };

    const present = (placements: Float32Array, at: number, picture: ImageBitmap) => {
        const item = items.get(placements[at + field.item]);
        const output = item && outputs.get(item.canvasId);

        if (!output?.context) return;

        const left = placements[at + field.left];
        const top = placements[at + field.top];
        const width = placements[at + field.width];
        const height = placements[at + field.height];

        if (output.canvas.width !== width || output.canvas.height !== height) {
            output.canvas.width = width;
            output.canvas.height = height;
        } else {
            output.context.clearRect(0, 0, width, height);
        }

        output.context.drawImage(picture, left, top, width, height, 0, 0, width, height);
    };

    const giveBack = (message: FrameMessage) => [
        message.placements.buffer,
        ...message.instances.map((upload) => upload.data.buffer),
        ...message.tables.map((upload) => upload.data.buffer),
    ];

    const drawFrame = (message: FrameMessage) => {
        const current = resources;

        if (!current) {
            const buffers = giveBack(message);

            send({ type: "shown", frame: message.id, readBackMsPerPixel: undefined, buffers }, buffers);

            return;
        }

        for (const upload of message.instances) {
            const item = items.get(upload.item);

            if (!item || item.resources !== current) continue;

            gl.bindBuffer(gl.ARRAY_BUFFER, item.instances);

            if (upload.data.byteLength > item.instancesCapacity) {
                item.instancesCapacity = Math.max(upload.data.byteLength, item.instancesCapacity * 2);
                gl.bufferData(gl.ARRAY_BUFFER, item.instancesCapacity, gl.DYNAMIC_DRAW);
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, upload.data);
        }

        for (const upload of message.tables) {
            const item = items.get(upload.item);

            if (!item || item.resources !== current) continue;

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, item.tableTexture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, upload.width, upload.height, 0, gl.RGBA, gl.FLOAT, upload.data);
        }

        const alignmentFloats = current.alignment / params.bytesPerFloat;
        const blockStride = Math.ceil(message.stride / alignmentFloats) * alignmentFloats;
        const blocks =
            blockStride === message.stride
                ? message.placements
                : new Float32Array((message.placements.length / message.stride) * blockStride);
        const ints = new Int32Array(
            message.placements.buffer,
            message.placements.byteOffset,
            message.placements.length,
        );

        if (blocks !== message.placements) {
            const from = new Uint32Array(
                message.placements.buffer,
                message.placements.byteOffset,
                message.placements.length,
            );
            const into = new Uint32Array(blocks.buffer);

            for (let idx = 0; idx * message.stride < from.length; idx++) {
                into.set(from.subarray(idx * message.stride, (idx + 1) * message.stride), idx * blockStride);
            }
        }

        gl.bindBuffer(gl.UNIFORM_BUFFER, current.items);

        if (blocks.byteLength > current.itemsCapacity) {
            current.itemsCapacity = Math.max(blocks.byteLength, current.itemsCapacity * 2);
            gl.bufferData(gl.UNIFORM_BUFFER, current.itemsCapacity, gl.DYNAMIC_DRAW);
        }

        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, blocks);
        gl.useProgram(current.program);
        gl.enable(gl.BLEND);

        let start = 0;
        let readBackMsPerPixel = 0;

        for (const batch of message.batches) {
            const end = start + batch.count * message.stride;

            if (atlas.width !== batch.width) atlas.width = batch.width;
            if (atlas.height !== batch.height) atlas.height = batch.height;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.disable(gl.SCISSOR_TEST);
            gl.viewport(0, 0, atlas.width, atlas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.SCISSOR_TEST);

            for (let at = start; at < end; at += message.stride) {
                render(current, message.placements, ints, at, (at / message.stride) * blockStride, atlas.height);
            }

            gl.disable(gl.SCISSOR_TEST);

            const readBackStartMs = performance.now();
            const picture = atlas.transferToImageBitmap();

            readBackMsPerPixel = (performance.now() - readBackStartMs) / (atlas.width * atlas.height);

            for (let at = start; at < end; at += message.stride) present(message.placements, at, picture);

            picture.close();
            start = end;
        }

        const buffers = giveBack(message);

        send({ type: "shown", frame: message.id, readBackMsPerPixel, buffers }, buffers);
    };

    send({
        type: "ready",
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        uniformAlignment: gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT),
    });

    return (message: ExecutorMessage) => {
        switch (message.type) {
            case "addItem":
                addItem(message.id, message.canvasId, message.canvas);
                break;
            case "removeItem":
                removeItem(message.id);
                break;
            case "releaseCanvas":
                outputs.delete(message.canvasId);
                break;
            case "setPicture":
                sources.set(message.id, message.source);
                break;
            case "frame":
                drawFrame(message);
                break;
        }
    };
};

const probeReadBack = (): Probe | null => {
    if (typeof OffscreenCanvas === "undefined") return null;

    const canvas = new OffscreenCanvas(READ_BACK_PROBE_PX, READ_BACK_PROBE_PX);
    const gl = canvas.getContext("webgl2", CONTEXT_ATTRIBUTES);

    if (!gl) return null;

    const readBack = () => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        canvas.transferToImageBitmap().close();
    };
    const pixels = canvas.width * canvas.height;
    const count = Math.ceil((READ_BACK_PROBE_MEGAPIXELS * PIXELS_PER_MEGAPIXEL) / pixels);

    readBack();

    const startMs = performance.now();

    for (let idx = 0; idx < count; idx++) readBack();

    const elapsedMs = performance.now() - startMs;

    return {
        canvas,
        gl,
        msPerMegapixel: (elapsedMs * PIXELS_PER_MEGAPIXEL) / (pixels * count),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        uniformAlignment: gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT),
    };
};

const toStride = (alignmentBytes: number) => {
    const alignmentFloats = Math.max(1, alignmentBytes / BYTES_PER_FLOAT);

    return Math.ceil(PLACEMENT_MIN_FLOATS / alignmentFloats) * alignmentFloats;
};

const getCanUseWorker = () =>
    typeof Worker !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    "transferControlToOffscreen" in HTMLCanvasElement.prototype;

const createInThreadLink = (onReply: (reply: ExecutorReply) => void, canvas: OffscreenCanvas | undefined): Link => {
    const receive = runExecutor(EXECUTOR_PARAMS, onReply, canvas);

    return {
        thread: "in_thread",
        getIsBusy: () => false,
        send: (message) => {
            if (message.type === "addItem") {
                receive({ type: "addItem", id: message.id, canvasId: message.id, canvas: message.canvas });
            } else if (message.type === "removeItem") {
                receive(message);
                receive({ type: "releaseCanvas", canvasId: message.id });
            } else {
                receive(message);
            }
        },
    };
};

const createWorkerLink = (
    onReply: (reply: ExecutorReply) => void,
    onFailure: (queued: HostMessage[]) => void,
): Link | undefined => {
    const url = URL.createObjectURL(
        new Blob(
            [
                `const receive = (${runExecutor.toString()})(${JSON.stringify(EXECUTOR_PARAMS)}, (reply, transfer) => self.postMessage(reply, transfer ?? []));\nself.onmessage = (event) => receive(event.data);`,
            ],
            { type: "text/javascript" },
        ),
    );

    let worker: Worker;

    try {
        worker = new Worker(url);
    } catch {
        URL.revokeObjectURL(url);

        return undefined;
    }

    const canvasIds = new WeakMap<HTMLCanvasElement, number>();
    const released = new FinalizationRegistry<number>((canvasId) =>
        worker.postMessage({ type: "releaseCanvas", canvasId } satisfies ExecutorMessage),
    );

    let queue: HostMessage[] | undefined = [];
    let canvasCount = 0;
    let isFrameInFlight = false;
    let isStopped = false;

    const stop = () => {
        isStopped = true;
        isFrameInFlight = false;
        worker.terminate();
    };

    const fail = () => {
        const queued = queue ?? [];

        queue = undefined;
        stop();
        URL.revokeObjectURL(url);
        onFailure(queued);
    };

    const forward = (message: HostMessage) => {
        if (message.type === "addItem") {
            const known = canvasIds.get(message.canvas);

            if (known !== undefined) {
                worker.postMessage({ type: "addItem", id: message.id, canvasId: known } satisfies ExecutorMessage);

                return;
            }

            let canvas: OffscreenCanvas;

            try {
                canvas = message.canvas.transferControlToOffscreen();
            } catch {
                return;
            }

            const canvasId = ++canvasCount;

            canvasIds.set(message.canvas, canvasId);
            released.register(message.canvas, canvasId);
            worker.postMessage({ type: "addItem", id: message.id, canvasId, canvas } satisfies ExecutorMessage, [
                canvas,
            ]);
        } else if (message.type === "setPicture") {
            worker.postMessage(message, message.source instanceof ImageBitmap ? [message.source] : []);
        } else if (message.type === "frame") {
            worker.postMessage(message, [
                message.placements.buffer,
                ...message.instances.map((upload) => upload.data.buffer),
                ...message.tables.map((upload) => upload.data.buffer),
            ]);
        } else {
            worker.postMessage(message);
        }
    };

    worker.onmessage = (event: MessageEvent<ExecutorReply>) => {
        const reply = event.data;

        if (reply.type === "shown") isFrameInFlight = false;

        if (queue && reply.type === "failed") {
            fail();

            return;
        }

        if (queue && reply.type === "ready") {
            const queued = queue;

            queue = undefined;
            URL.revokeObjectURL(url);
            queued.forEach(forward);
        }

        onReply(reply);
    };

    worker.onerror = () => {
        if (queue) {
            fail();
        } else if (!isStopped) {
            stop();
            onReply({ type: "failed" });
        }
    };

    return {
        thread: "worker",
        getIsBusy: () => isFrameInFlight,
        send: (message) => {
            if (isStopped) return;

            if (message.type === "frame") isFrameInFlight = true;

            if (queue) {
                queue.push(message);
            } else {
                forward(message);
            }
        },
    };
};

const handleReply = (host: Host, reply: ExecutorReply) => {
    switch (reply.type) {
        case "ready":
            host.maxTextureSize = Math.min(host.maxTextureSize, reply.maxTextureSize);
            host.stride = Math.max(host.stride, toStride(reply.uniformAlignment));
            break;
        case "failed":
            host.isLost = true;
            host.shows.clear();

            if (renderer === host) notify();

            break;
        case "lost":
            host.isLost = true;
            host.generation++;
            host.shows.clear();
            notify();
            break;
        case "restored":
            host.isLost = false;
            notify();
            break;
        case "shown": {
            const shows = host.shows.get(reply.frame);

            if (reply.readBackMsPerPixel !== undefined) host.readBackMsPerPixel = reply.readBackMsPerPixel;

            host.buffers.push(...reply.buffers);

            host.shows.delete(reply.frame);
            shows?.forEach((show) => show());

            if (renderer === host && host.isFramePending) {
                host.isFramePending = false;

                if (flushId !== undefined) cancelAnimationFrame(flushId);

                flush();
            }

            break;
        }
    }
};

const createRenderer = (): Host | null => {
    const probe = probeReadBack();

    if (!probe) return null;

    const thread = probe.msPerMegapixel > WORKER_READ_BACK_MS_PER_MEGAPIXEL ? "worker" : "in_thread";
    const host: Host = {
        link: { thread, send: NOTHING_TO_NOTIFY, getIsBusy: () => false },
        maxTextureSize: probe.maxTextureSize,
        stride: toStride(probe.uniformAlignment),
        readBackMsPerMegapixel: probe.msPerMegapixel,
        readBackMsPerPixel: 0,
        atlas: { width: 1, height: 1 },
        isLost: false,
        generation: 0,
        frameCount: 0,
        itemCount: 0,
        isFramePending: false,
        shows: new Map(),
        pictureIds: new Map(),
        buffers: [],
    };
    const onReply = (reply: ExecutorReply) => handleReply(host, reply);
    const workerLink =
        thread === "worker" && getCanUseWorker()
            ? createWorkerLink(onReply, (queued) => {
                  host.link = createInThreadLink(onReply, undefined);
                  queued.forEach(host.link.send);
              })
            : undefined;

    if (workerLink) {
        probe.gl.getExtension("WEBGL_lose_context")?.loseContext();
        host.link = workerLink;
    } else {
        probe.canvas.width = 1;
        probe.canvas.height = 1;
        host.link = createInThreadLink(onReply, probe.canvas);
    }

    return host;
};

const getRenderer = () => {
    if (renderer === undefined) renderer = createRenderer();

    return renderer;
};

const loadImage = (src: string, isShared: boolean) => {
    const image = new Image();

    if (isShared) image.crossOrigin = "anonymous";

    image.src = src;

    return image.decode().then(() => image);
};

const settlePicture = (
    entry: PictureEntry,
    status: SliceRendererPicture["status"],
    image: HTMLImageElement | undefined,
) => {
    entry.picture = {
        status,
        size: image ? { width: image.naturalWidth, height: image.naturalHeight } : NO_SIZE,
    };
    entry.image = status === "shareable" ? image : undefined;

    for (const listener of [...entry.listeners]) listener();

    entry.listeners.clear();
};

const requestPictureEntry = (src: string, onSettled: () => void) => {
    const existing = pictures.get(src);

    if (existing) {
        if (existing.picture.status === "loading") existing.listeners.add(onSettled);

        return existing;
    }

    const entry: PictureEntry = {
        picture: { status: "loading", size: NO_SIZE },
        image: undefined,
        listeners: new Set([onSettled]),
    };

    pictures.set(src, entry);

    loadImage(src, true)
        .then((image) => settlePicture(entry, "shareable", image))
        .catch(() =>
            loadImage(src, false)
                .then((image) => {
                    console.warn(
                        `SliceRenderer: the server of ${src} gives no cross-origin permission, so the graphics card may not draw it and it is drawn with page elements instead.`,
                    );
                    settlePicture(entry, "unshareable", image);
                })
                .catch(() => settlePicture(entry, "broken", undefined)),
        );

    return entry;
};

const checkFrames = (src: string) => {
    if (framesChecked.has(src)) return;

    framesChecked.add(src);

    if (typeof ImageDecoder === "undefined" || !MULTI_FRAME_FORMATS.test(src)) return;

    fetch(src)
        .then((response) => response.blob())
        .then(async (blob) => {
            if (!(await ImageDecoder.isTypeSupported(blob.type))) return;

            const decoder = new ImageDecoder({ data: blob.stream(), type: blob.type });

            await decoder.tracks.ready;

            if (decoder.tracks.selectedTrack?.animated) {
                console.warn(
                    `SliceRenderer: ${src} has more than one frame, and the graphics card draws only the first. Set the renderer to "elements" to keep it playing.`,
                );
            }

            decoder.close();
        })
        .catch(() => undefined);
};

const rasterize = (image: HTMLImageElement, size: Size2d) => {
    const canvas = new OffscreenCanvas(size.width, size.height);
    const context = canvas.getContext("2d");

    if (!context) return undefined;

    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, size.width, size.height);

    return canvas.transferToImageBitmap();
};

const getPictureId = (current: Host, src: string, image: HTMLImageElement, size: Size2d) => {
    const isWorker = current.link.thread === "worker";
    const key = isWorker ? `${size.width}x${size.height} ${src}` : src;
    const existing = current.pictureIds.get(key);

    if (existing !== undefined) return existing;

    const source = isWorker ? rasterize(image, size) : image;

    if (!source) return undefined;

    const id = current.pictureIds.size + 1;

    current.pictureIds.set(key, id);
    current.link.send({ type: "setPicture", id, source });

    return id;
};

const getSpriteSize = (image: HTMLImageElement): Size2d => {
    const longest = Math.max(image.naturalWidth, image.naturalHeight, 1);
    const ratio = SPRITE_RESOLUTION / longest;

    return {
        width: Math.max(1, Math.round(image.naturalWidth * ratio)),
        height: Math.max(1, Math.round(image.naturalHeight * ratio)),
    };
};

const takeFloats = (current: Host, length: number): Float32Array<ArrayBuffer> => {
    const bytes = length * BYTES_PER_FLOAT;
    const pool = current.buffers;

    let fit = -1;

    pool.forEach((buffer, idx) => {
        if (buffer.byteLength >= bytes && (fit < 0 || buffer.byteLength < pool[fit].byteLength)) fit = idx;
    });

    const buffer = fit < 0 ? new ArrayBuffer(2 ** Math.ceil(Math.log2(Math.max(bytes, BYTES_PER_FLOAT)))) : pool[fit];

    if (fit >= 0) {
        pool[fit] = pool[pool.length - 1];
        pool.pop();
    }

    return new Float32Array(buffer, 0, length).fill(0);
};

const toTableData = (current: Host, tables: SliceStop[][], easing: Float32Array) => {
    const maxTextureSize = current.maxTextureSize;
    const tracks = tables.map((stops) =>
        TRACK_KEYS.map((key) => {
            const track = stops.filter((stop) => stop[key] !== undefined);

            if (track.length > MAX_STOPS) {
                throw new Error(
                    `SliceRenderer: a table has ${track.length} stops for "${key}"; the graphics card reads ${MAX_STOPS}.`,
                );
            }

            return track.map((stop) => [stop.at, stop[key] ?? 0]);
        }),
    );
    const rowWidths = tracks.map((table) => TRACK_KEYS.length + table.reduce((sum, track) => sum + track.length, 0));
    const width = Math.max(EASING_SIZE, ...rowWidths);
    const height = tables.length + 1;

    if (width > maxTextureSize || height > maxTextureSize) {
        throw new Error(
            `SliceRenderer: the tables need a ${width} × ${height} texture; this graphics card allows ${maxTextureSize}.`,
        );
    }

    const data = takeFloats(current, width * height * TEXEL_FLOATS);

    tracks.forEach((table, row) => {
        let offset = TRACK_KEYS.length;

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

const computePerspectivePx = (size: Size2d) =>
    parseFloat(CellAnimationUtils.computePerspective(size)) || NO_PERSPECTIVE;

const writeInstanceData = (
    current: Host,
    slices: SliceRendererSlice[],
    mode: SliceRendererMode,
): Float32Array<ArrayBuffer> => {
    const ordered =
        mode === "slices"
            ? slices
                  .map((slice, idx) => ({ slice, idx, depth: CellAnimationUtils.computeCellDepth(slice.weight) }))
                  .sort((a, b) => a.depth - b.depth || a.idx - b.idx)
                  .map(({ slice }) => slice)
            : slices;
    const data = takeFloats(current, ordered.length * INSTANCE_FLOATS);

    ordered.forEach((slice, idx) => {
        const offset = idx * INSTANCE_FLOATS;
        const tint = slice.tint ?? NO_TINT;
        const direct = slice.direct ?? NO_DIRECT;

        data[offset] = slice.left;
        data[offset + 1] = slice.top;
        data[offset + 2] = slice.width;
        data[offset + 3] = slice.height;
        data[offset + 4] = slice.weight;
        data[offset + 5] = slice.table;
        data[offset + 6] = tint[0];
        data[offset + 7] = tint[1];
        data[offset + 8] = tint[2];
        data[offset + 9] = tint[3];
        data[offset + 10] = direct[0];
        data[offset + 11] = direct[1];
        data[offset + 12] = direct[2];
        data[offset + 13] = direct[3];
    });

    return data;
};

const getTrackExtreme = (stops: SliceStop[], key: keyof SliceStop, fallback: number) =>
    stops.reduce((most, stop) => Math.max(most, Math.abs(stop[key] ?? fallback)), Math.abs(fallback));

const getTrackRange = (stops: SliceStop[], key: keyof SliceStop, fallback: number) =>
    stops.reduce(
        ([least, most], stop) => [Math.min(least, stop[key] ?? fallback), Math.max(most, stop[key] ?? fallback)],
        [fallback, fallback],
    );

const getTintContext = () => {
    if (tintContext === undefined) {
        tintContext =
            typeof document === "undefined"
                ? null
                : document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    }

    return tintContext;
};

const layoutBatches = (pending: Submission[], maxTextureSize: number): Batch[] => {
    const atlasWidth = Math.min(maxTextureSize, Math.max(ATLAS_WIDTH_PX, ...pending.map((item) => item.width)));
    const batches: Batch[] = [];

    let batch: Batch = { placements: [], width: 0, height: 0 };
    let left = 0;
    let rowTop = 0;
    let rowHeight = 0;

    for (const submission of pending) {
        if (left > 0 && left + submission.width > atlasWidth) {
            left = 0;
            rowTop += rowHeight;
            rowHeight = 0;
        }

        if (batch.placements.length > 0 && rowTop + submission.height > maxTextureSize) {
            batches.push(batch);
            batch = { placements: [], width: 0, height: 0 };
            left = 0;
            rowTop = 0;
            rowHeight = 0;
        }

        batch.placements.push({ submission, left, top: rowTop });
        batch.width = Math.max(batch.width, left + submission.width);
        batch.height = Math.max(batch.height, rowTop + submission.height);
        left += submission.width;
        rowHeight = Math.max(rowHeight, submission.height);
    }

    if (batch.placements.length > 0) batches.push(batch);

    return batches;
};

const fitCanvas = (canvas: Size2d, batch: Batch, maxTextureSize: number, readBackMsPerPixel: number) => {
    const width = Math.min(Math.ceil(batch.width * (1 + ATLAS_HEADROOM)), maxTextureSize);
    const height = Math.min(Math.ceil(batch.height * (1 + ATLAS_HEADROOM)), maxTextureSize);

    if (batch.width > canvas.width || batch.height > canvas.height) {
        if (batch.width > canvas.width) canvas.width = width;
        if (batch.height > canvas.height) canvas.height = height;
        shrink.frames = 0;
        shrink.costMs = 0;
    } else if (width >= canvas.width && height >= canvas.height) {
        shrink.frames = 0;
        shrink.costMs = 0;
    } else {
        shrink.width = shrink.frames === 0 ? width : Math.max(shrink.width, width);
        shrink.height = shrink.frames === 0 ? height : Math.max(shrink.height, height);
        shrink.frames++;
        shrink.costMs += Math.max(canvas.width * canvas.height - width * height, 0) * readBackMsPerPixel;

        if (shrink.frames >= ATLAS_SHRINK_FRAMES || shrink.costMs >= ATLAS_SHRINK_COST_MS) {
            canvas.width = shrink.width;
            canvas.height = shrink.height;
            shrink.frames = 0;
            shrink.costMs = 0;
        }
    }
};

const writePlacement = (
    current: Host,
    placement: Placement,
    into: Float32Array,
    ints: Int32Array,
    at: number,
    frame: FrameMessage,
) => {
    const { submission, left, top } = placement;
    const { item, frame: sliceFrame, width, height } = submission;

    into[at + PLACEMENT.item] = item.id;
    into[at + PLACEMENT.left] = left;
    into[at + PLACEMENT.top] = top;
    into[at + PLACEMENT.width] = width;
    into[at + PLACEMENT.height] = height;

    const entry = requestPictureEntry(sliceFrame.src, NOTHING_TO_NOTIFY);
    const image = entry.image;

    if (!sliceFrame.isShown || !image || sliceFrame.slices.length === 0 || sliceFrame.size.width <= 0) return;

    const isSprite = sliceFrame.mode !== "slices";
    const sliceSize = {
        width: Math.max(1, Math.round(sliceFrame.size.width * sliceFrame.scale)),
        height: Math.max(1, Math.round(sliceFrame.size.height * sliceFrame.scale)),
    };
    const textureSize = isSprite ? getSpriteSize(image) : sliceSize;
    const picture = getPictureId(current, sliceFrame.src, image, textureSize);

    if (picture === undefined) return;

    checkFrames(sliceFrame.src);

    if (item.layoutSlices !== sliceFrame.slices) {
        frame.instances.push({ item: item.id, data: writeInstanceData(current, sliceFrame.slices, sliceFrame.mode) });
        item.layoutSlices = sliceFrame.slices;
    }

    if (item.layoutTables !== sliceFrame.tables || item.layoutEasing !== sliceFrame.easing) {
        const tables = toTableData(current, sliceFrame.tables, sliceFrame.easing);

        frame.tables.push({ item: item.id, data: tables.data, width: tables.width, height: tables.height });
        item.layoutTables = sliceFrame.tables;
        item.layoutEasing = sliceFrame.easing;
        item.easingRow = tables.easingRow;
    }

    const sourceScale = isSprite
        ? SPRITE_RESOLUTION / Math.max(sliceFrame.slices[0].width, sliceFrame.slices[0].height, 1)
        : sliceFrame.scale;

    into[at + PLACEMENT.isDrawn] = 1;
    into[at + PLACEMENT.count] = sliceFrame.slices.length;
    into[at + PLACEMENT.picture] = picture;
    into[at + PLACEMENT.textureWidth] = textureSize.width;
    into[at + PLACEMENT.textureHeight] = textureSize.height;
    ints[at + PLACEMENT.mode] = MODES[sliceFrame.mode];
    into[at + PLACEMENT.timeline] = sliceFrame.timeline;
    into[at + PLACEMENT.half] = sliceFrame.half;
    into[at + PLACEMENT.desc] = sliceFrame.isDescending ? 1 : 0;
    into[at + PLACEMENT.clock] = sliceFrame.clockMs ?? 0;
    into[at + PLACEMENT.lifetime] = sliceFrame.lifetimeMs ?? 0;
    into[at + PLACEMENT.sizeWidth] = sliceFrame.size.width;
    into[at + PLACEMENT.sizeHeight] = sliceFrame.size.height;
    into[at + PLACEMENT.areaX] = sliceFrame.area.x;
    into[at + PLACEMENT.areaY] = sliceFrame.area.y;
    into[at + PLACEMENT.areaWidth] = sliceFrame.area.width;
    into[at + PLACEMENT.areaHeight] = sliceFrame.area.height;
    into[at + PLACEMENT.perspective] = sliceFrame.hasPerspective
        ? computePerspectivePx(sliceFrame.size)
        : NO_PERSPECTIVE;
    into[at + PLACEMENT.viewportWidth] = width;
    into[at + PLACEMENT.viewportHeight] = height;
    into[at + PLACEMENT.scaleX] = width / sliceFrame.area.width;
    into[at + PLACEMENT.scaleY] = height / sliceFrame.area.height;
    ints[at + PLACEMENT.isSprite] = isSprite ? 1 : 0;
    into[at + PLACEMENT.sourceScale] = sourceScale;
    ints[at + PLACEMENT.channelMode] = sliceFrame.channelMixing ? CHANNEL_MODES[sliceFrame.channelMixing] : NO_CHANNELS;
    ints[at + PLACEMENT.easingRow] = item.easingRow;
};

const flush = () => {
    flushId = undefined;

    const current = renderer;

    if (current && !current.isLost && current.link.getIsBusy()) {
        current.isFramePending = true;

        return;
    }

    const pending = [...submissions.values()].filter(
        (submission) => submission.item.generation === current?.generation,
    );

    submissions.clear();

    if (!current || current.isLost || pending.length === 0) return;

    const frame: FrameMessage = {
        type: "frame",
        id: ++current.frameCount,
        batches: [],
        placements: takeFloats(current, pending.length * current.stride),
        stride: current.stride,
        instances: [],
        tables: [],
    };
    const ints = new Int32Array(frame.placements.buffer, 0, frame.placements.length);
    const shows: (() => void)[] = [];

    let at = 0;

    for (const batch of layoutBatches(pending, current.maxTextureSize)) {
        fitCanvas(current.atlas, batch, current.maxTextureSize, current.readBackMsPerPixel);

        for (const placement of batch.placements) {
            const { item, frame: sliceFrame, width, height, onShown } = placement.submission;
            const rect = {
                x: sliceFrame.area.x,
                y: sliceFrame.area.y,
                width: width / sliceFrame.scale,
                height: height / sliceFrame.scale,
            };

            writePlacement(current, placement, frame.placements, ints, at, frame);
            shows.push(() => {
                if (!item.isDisposed) onShown(rect);
            });
            at += current.stride;
        }

        frame.batches.push({
            width: current.atlas.width,
            height: current.atlas.height,
            count: batch.placements.length,
        });
    }

    current.shows.set(frame.id, shows);
    current.link.send(frame);
};

const submit = (submission: Submission) => {
    submissions.set(submission.item, submission);

    if (flushId === undefined) flushId = requestAnimationFrame(flush);
};

/**
 * Draws slice animations and particles on the graphics card, into a canvas each component owns.
 *
 * One WebGL context serves the whole page, since browsers keep only a few alive at once. A component asks for an item
 * bound to its own canvas and hands it a frame; once per animation frame, every component's frame is drawn into one
 * shared picture and each is copied from it onto its own canvas. The tables a sample is built from are uploaded once and worked out per
 * slice on the graphics card, so the page only advances the clock. Where taking the shared picture back from the
 * graphics card is slow, the drawing and copying run on a worker thread, so the page's own thread does not wait for
 * it; {@link getThread} says which. Where the graphics card cannot be used — no WebGL 2 in an offscreen canvas, a
 * picture whose server gives no cross-origin permission, a context the browser has taken away — {@link getCanDraw}
 * says so and the component draws with page elements instead.
 */
export namespace SliceRendererUtils {
    /**
     * Whether the graphics card can draw right now.
     *
     * `false` where the browser has no WebGL 2 in an offscreen canvas, and while the browser has taken the context away;
     * {@link subscribe} hears when that changes.
     */
    export const getIsAvailable = () => {
        const current = getRenderer();

        return !!current && !current.isLost;
    };

    /**
     * Which thread draws: `"worker"` where taking the shared picture back from the graphics card costs the page's
     * thread more than it should, `"in_thread"` otherwise and wherever the graphics card is not available.
     *
     * Decided once, the first time the graphics card is asked for, by timing that cost; see
     * {@link getReadBackMsPerMegapixel}.
     */
    export const getThread = (): SliceRendererThread => getRenderer()?.link.thread ?? "in_thread";

    /**
     * What taking a picture back from the graphics card cost on the page's own thread when the renderer started, in
     * milliseconds per million pixels. `0` where the graphics card is not available.
     */
    export const getReadBackMsPerMegapixel = () => getRenderer()?.readBackMsPerMegapixel ?? 0;

    /**
     * Hears whenever the graphics card stops or starts being available, so a component can move between its canvas and
     * its page elements. Items made before a change no longer draw and are made again.
     *
     * @param listener Runs on every change.
     * @returns Stops listening.
     */
    export const subscribe = (listener: () => void) => {
        subscribers.add(listener);

        return () => {
            subscribers.delete(listener);
        };
    };

    /**
     * A picture as the graphics card sees it, loading it the first time it is asked for.
     *
     * The picture is requested with cross-origin permission, which the graphics card needs before it may read it. A
     * server that refuses it gets a second, plain request, so the picture's size is still known; the picture is then
     * `unshareable`, a warning names it, and a component draws it with page elements. A picture that loads neither
     * way is `broken`, and nothing can draw it.
     *
     * @param src The picture's address.
     * @param onSettled Runs once, when a picture still loading has settled. Not run for one already settled.
     * @returns Its status and its own size — `0` by `0` until it has loaded.
     */
    export const requestPicture = (src: string, onSettled: () => void): SliceRendererPicture =>
        requestPictureEntry(src, onSettled).picture;

    /**
     * Whether a component should draw on the graphics card rather than with page elements.
     *
     * @param requested The renderer the consumer asked for.
     * @param picture The picture, from {@link requestPicture}.
     * @returns `true` only when the graphics card was asked for, is available, and may read the picture. A picture
     * still loading counts as readable, so a component does not draw it twice over while it arrives.
     */
    export const getCanDraw = (requested: SliceAnimationRenderer, picture: SliceRendererPicture | undefined) =>
        requested === "graphics_card" &&
        getIsAvailable() &&
        picture?.status !== "unshareable" &&
        picture?.status !== "broken";

    /**
     * Any CSS color as the four numbers the graphics card multiplies a picture by, each `0`–`1`.
     *
     * Parsed by the browser, so a named color, `hsl()` or `color-mix()` all work. Remembered by its text.
     *
     * @param color The color, as CSS writes it. A `var()` is not resolved and comes out as no tint.
     */
    export const toTint = (color: string): SliceRendererTint => {
        const cached = tints.get(color);

        if (cached) return cached;

        const context = getTintContext();

        if (!context) return NO_TINT;

        context.clearRect(0, 0, 1, 1);
        context.fillStyle = NO_TINT_COLOR;
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);

        const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
        const tint: SliceRendererTint = [
            red / CHANNEL_MAX,
            green / CHANNEL_MAX,
            blue / CHANNEL_MAX,
            alpha / CHANNEL_MAX,
        ];

        tints.set(color, tint);

        return tint;
    };

    /**
     * A tint as the two styles that reproduce it on a page element: the color with its alpha taken out, and that
     * alpha as an opacity.
     *
     * @param tint From {@link toTint}.
     */
    export const toTintStyle = ([red, green, blue, alpha]: SliceRendererTint) => ({
        color: `rgb(${Math.round(red * CHANNEL_MAX)} ${Math.round(green * CHANNEL_MAX)} ${Math.round(blue * CHANNEL_MAX)})`,
        opacity: alpha,
    });

    /**
     * An easing curve sampled for the graphics card, which reads it rather than working it out.
     *
     * @param easing The curve; linear if left out.
     */
    export const computeEasing = (easing: SliceAnimationEasing | undefined) =>
        Float32Array.from({ length: EASING_SIZE }, (_, idx) =>
            SliceAnimationBreakpointUtils.computeLocalTimeline(WHOLE_WINDOW, idx / (EASING_SIZE - 1), easing),
        );

    /**
     * The area a component's canvas has to cover for everything its tables move to stay inside it: the box, reaching
     * past each side by as much as anything is carried past that side.
     *
     * Counts only what carries a slice past the box: travel, growth beyond full size, turning, nearness under
     * perspective and blur. Travel reaches only the sides it heads towards, so a slice that only rises adds nothing
     * below the box; everything else reaches every side alike.
     *
     * @param tables The tables the slices play.
     * @param size The largest slice.
     * @param box The component's box.
     * @param perspectiveBox The box slices turning in depth are seen against; `undefined` where nothing is drawn in
     * depth.
     * @returns The area, relative to the box's top-left corner, in the component's own pixels.
     */
    export const computeArea = (
        tables: SliceStop[][],
        size: Size2d,
        box: Size2d,
        perspectiveBox: Size2d | undefined,
    ): Rect => {
        const longest = Math.max(size.width, size.height);
        const diagonal = Math.hypot(size.width, size.height);
        const reach = { left: 0, top: 0, right: 0, bottom: 0 };

        for (const stops of tables) {
            const [leastX, mostX] = getTrackRange(stops, "translateX", 0);
            const [leastY, mostY] = getTrackRange(stops, "translateY", 0);
            const scale =
                Math.max(getTrackExtreme(stops, "scaleX", PERCENT), getTrackExtreme(stops, "scaleY", PERCENT)) /
                PERCENT;
            const isTurned = ["rotate", "skewX", "skewY"].some(
                (key) => getTrackExtreme(stops, key as keyof SliceStop, 0) > 0,
            );
            const isTilted = ["rotateX", "rotateY", "translateZ", "depth"].some(
                (key) => getTrackExtreme(stops, key as keyof SliceStop, 0) > 0,
            );
            const grown = (Math.max(scale, 1) - 1) * longest * 0.5 + (isTurned ? (diagonal - longest) * 0.5 : 0);
            const near = isTilted ? getTrackExtreme(stops, "translateZ", 0) + diagonal * Math.max(scale, 1) * 0.5 : 0;
            const viewer = perspectiveBox ? computePerspectivePx(perspectiveBox) : 0;
            const bulge =
                perspectiveBox && near > 0 && near < viewer
                    ? (Math.max(perspectiveBox.width, perspectiveBox.height) * 0.5 * near) / (viewer - near)
                    : 0;
            const around = grown + bulge + near * (isTilted ? 1 : 0) + BLUR_REACH * getTrackExtreme(stops, "blur", 0);

            reach.left = Math.max(reach.left, Math.ceil(around + (Math.max(-leastX, 0) * size.width) / PERCENT));
            reach.right = Math.max(reach.right, Math.ceil(around + (Math.max(mostX, 0) * size.width) / PERCENT));
            reach.top = Math.max(reach.top, Math.ceil(around + (Math.max(-leastY, 0) * size.height) / PERCENT));
            reach.bottom = Math.max(reach.bottom, Math.ceil(around + (Math.max(mostY, 0) * size.height) / PERCENT));
        }

        return {
            x: -reach.left,
            y: -reach.top,
            width: box.width + reach.left + reach.right,
            height: box.height + reach.top + reach.bottom,
        };
    };

    /**
     * Binds a component's canvas to the shared context.
     *
     * {@link SliceRendererItem.draw} takes a frame and, once its picture reaches the component's canvas, calls back with
     * where that canvas must sit and how large it must be, in the component's own pixels. The picture's top-left corner
     * is the frame's area; it may be larger than that area, and the rest of it is transparent, so the canvas is sized to
     * it rather than to the area. The picture is drawn with every other component's at the next animation frame and
     * copied from one shared picture, so it arrives one animation frame after it was asked for. A component places and sizes its canvas only from that callback, so the
     * canvas never shows one frame's picture at another frame's place.
     *
     * A picture still loading draws nothing; the component hears it arrive through {@link requestPicture} and draws
     * again.
     *
     * @param canvas The component's own canvas. It must not be given another context; where {@link getThread} is
     * `"worker"` it is handed to the worker, after which the page can neither draw into it nor read it.
     * @returns The item, or `undefined` where the graphics card is not available right now.
     */
    export const createItem = (canvas: HTMLCanvasElement): SliceRendererItem | undefined => {
        const current = getRenderer();

        if (!current || current.isLost) return undefined;

        if (current.link.thread === "in_thread") {
            try {
                if (!canvas.getContext("2d")) return undefined;
            } catch {
                return undefined;
            }
        }

        const item: HostItem = {
            id: ++current.itemCount,
            generation: current.generation,
            isDisposed: false,
            layoutSlices: undefined,
            layoutTables: undefined,
            layoutEasing: undefined,
            easingRow: 0,
        };

        current.link.send({ type: "addItem", id: item.id, canvas });

        const draw = (frame: SliceRendererFrame, onShown: (rect: Rect) => void) => {
            if (item.isDisposed || current.isLost || current.generation !== item.generation) return;

            submit({
                item,
                frame,
                width: Math.max(1, Math.round(frame.area.width * frame.scale)),
                height: Math.max(1, Math.round(frame.area.height * frame.scale)),
                onShown,
            });
        };

        const dispose = () => {
            if (item.isDisposed) return;

            item.isDisposed = true;
            submissions.delete(item);
            current.link.send({ type: "removeItem", id: item.id });
        };

        return { draw, dispose };
    };
}
