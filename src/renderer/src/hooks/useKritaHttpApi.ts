import { uniqueId } from "lodash"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"

type UseKritaHttpApiResult<T> = [res: KritaHttpApiResponse<T> & {i: number}, refetch: () => Promise<void>]

export type State = {
    tool: string,
    eraserMode: boolean,
    canvasOnly: boolean,
    brushPreset: string,
    theme: string,
    editTime: number,
    brushSize: number,
    brushRotation: number,
    blendingMode: string,
    gradient: string,
    pattern: string,
    opacity: number,
    flow: number,
    foreground: [number, number, number, number],
    background: [number, number, number, number],
    fileName: string | null,
    zoomFactor: number,
    withSelection: boolean,
    picResolution: [number, number],
}

export type SetDockerStateParam = {
    objectName: string,
    visible?: boolean,
    floating?: boolean,
    pos?: [number, number],
    size?: [number, number],
    withHeader?: boolean,
}

export type ViewState = {
    viewId: number,
    display: 'MAXIMIZED' | 'MINIMIZED' | 'NORMAL',
    docId: string,
    isFile: boolean,
    filename: string,
    frameless: boolean,
    stayOnTop: boolean,
    viewFrameSize: [number, number],
    viewFramePos: [number, number],
    viewClientSize: [number, number],
    viewClientPos: [number, number],
    canvasRotation: number,
    canvasScale: number, 
    canvasPan: [number, number],
    canvasToImageMetrix: [number, number, number, number, number, number, number, number, number]
    areaSize: [number, number],
    areaPos: [number, number],
}

export function useKritaApi(code: 'icon'): (param: {iconName: string}) => Promise<KritaHttpApiResponse<string>>;
export function useKritaApi(code: 'view/list'): (param: '') => Promise<KritaHttpApiResponse<ViewState[]>>;
export function useKritaApi(code: 'resource-icon'): (param: {resourceName: string, resourceType: string}) => Promise<KritaHttpApiResponse<string>>;
export function useKritaApi(code: 'state/set'): (param: Partial<State>) => Promise<KritaHttpApiResponse<void>>;
export function useKritaApi(code: 'state/get'): (param: '') => Promise<KritaHttpApiResponse<State>>;
export function useKritaApi(code: 'action/listen'): (param: '') => Promise<KritaHttpApiResponse<string[]>>;
export function useKritaApi(code: 'docker/set-state'): (param: SetDockerStateParam) => Promise<KritaHttpApiResponse<void>>;
export function useKritaApi(code: 'docker/get-state'): (param: string) => Promise<KritaHttpApiResponse<Required<SetDockerStateParam>>>;
export function useKritaApi<P, T>(code: string): (param: P) => Promise<KritaHttpApiResponse<T>>;
export function useKritaApi<P, T>(code: string): (param: P) => Promise<KritaHttpApiResponse<T>> {
    // TODO 以后换成context
    const url = 'http://localhost:1976'
    const cb = useCallback((param: P) => {
        return fetchKritaHttpApi<P, T>(url, code, param)
    }, [code])
    return cb
}

// export function useKritaStateApi(code: 'state/get'): UseKritaHttpApiResult<State>;
// export function useKritaStateApi<T>(code: string): UseKritaHttpApiResult<T>;
// export function useKritaStateApi<T>(code: string): UseKritaHttpApiResult<T> {

//     // TODO 以后换成context
//     const url = 'http://localhost:1976'
//     const [i, refresh] = useReducer(x => x + 1, 0)
//     const [result, setResult] = useState<KritaHttpApiResponse<T> & {i: number}>({i, ok: false, type: 'NOT_READY', call_stack: '', data: '', msg: ''})

//     const refreshCb = useRef<Record<number, () => void>>({})

//     const asyncRefresh = useCallback(() => {
//         refresh()
//         return new Promise<void>(resolve => {
//             refreshCb.current[i] = resolve
//         })
//     }, [i])

//     useEffect(() => {
//         let ignore = false
//         setResult({i, ok: false, type: 'NOT_READY', call_stack: '', data: '', msg: ''})
        
//         fetchKritaHttpApi<Record<string,number>,T>(url, code, {}).then(newResult => {
//             for (const key of [...Object.keys(refreshCb.current)].map(x=>+x)) {
//                 if (key > i) {
//                     continue
//                 }
//                 refreshCb.current[key]()
//                 delete refreshCb.current[key]
//             }
//             if (ignore) {
//                 return
//             }
//             setResult({i, ...newResult})
//         })
//         return () => {
//             ignore = true
//         }
//     }, [url, code, i])

//     return [result, asyncRefresh]
// }

type KritaHttpApiResponse<T> = {
    ok: true,
    data: T,
} | {
    ok: false,
    type: 'API_ERROR' | 'NETWORK_ERROR' | 'NOT_READY',
    msg: string,
    data: unknown,
    call_stack: string,
}

export function mkSemaphare(count = 1): {wait: () => Promise<void>, signal: () => void} {
    const cbs: (() => void)[] = []
    return {
        wait: () => new Promise(resolve => {
            if (count > 0) {
                resolve()
                count--
            } else {
                cbs.push(() => resolve())
            }
        }),
        signal: (): void => {
            count++
            const cb = cbs.shift()
            cb && cb()
        }
    }
}

function createWebsocket(url: string) {
    let websocket: WebSocket | null = null;
    let RECONNECTION_TIMEOUT = 1000; // Initial reconnect interval in ms
    let lastError = false;
    let messageListeners: ((msg: string | Uint8Array) => void)[] = [];
    let messageQueue: (string | Uint8Array)[] = [];

    const open = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!lastError && websocket) {
                return resolve()
            }

            websocket = new WebSocket(url);

            websocket.onopen = () => {
                RECONNECTION_TIMEOUT = 1000; // Reset reconnect interval
                lastError = false;
                resolve();
            };

            websocket.onerror = (err) => {
                lastError = true;
                reject(err);
                setTimeout(open, RECONNECTION_TIMEOUT);
                websocket = null
            };

            websocket.onclose = () => {
                websocket = null;
                setTimeout(open, RECONNECTION_TIMEOUT);
            };

            websocket.onmessage = (event) => {
                const data = typeof event.data === 'string' ? event.data : new Uint8Array(event.data);
                messageListeners.forEach((cb) => cb(data));
                messageQueue.push(data);
            };
        });
    };

    const readyState = (): number => {
        return !lastError ? websocket!.readyState : -1;
    };

    const send = (msg: string | Uint8Array): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(msg);
                resolve();
            } else {
                reject('WebSocket is not open');
            }
        });
    };

    const waitMessage = (): Promise<string | Uint8Array> => {
        return new Promise((resolve) => {
            if (messageQueue.length > 0) {
                resolve(messageQueue.shift()!);
            } else {
                const listener = (msg: string | Uint8Array) => {
                    removeMessageListener(listener);
                    resolve(msg);
                };
                messageListeners.push(listener);
            }
        });
    };

    const onMessage = (cb: (msg: string | Uint8Array) => void): void => {
        messageListeners.push(cb);
    };

    const removeMessageListener = (cb: (msg: string | Uint8Array) => void): void => {
        const index = messageListeners.indexOf(cb);
        if (index !== -1) {
            messageListeners.splice(index, 1);
        }
    };

    return {
        open,
        readyState,
        send,
        waitMessage,
        onMessage,
        removeMessageListener,
    };
}

const websocket = createWebsocket('ws://127.0.0.1:1949')

const kritaApiSemaphare = mkSemaphare(8)
/**
 * api hook, never throws exception
 */
async function fetchKritaHttpApi<P, T>(url: string, code: string, param: P): Promise<KritaHttpApiResponse<T>> {
    await kritaApiSemaphare.wait()
    const res: KritaHttpApiResponse<T> = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            code,
            param,
        }),
        keepalive: true,
    }).then(async response => {
        const res: KritaHttpApiResponse<T> = await response.json()
        if (!res.ok) {
            res.type = 'API_ERROR'
        }
        return res
    }).catch(e => {
        console.error(e)
        return {
            ok: false,
            type: 'NETWORK_ERROR',
            msg: `访问 ${url} 网络异常`,
            data: e,
            call_stack: '' + e,
        }
    })
    kritaApiSemaphare.signal()
    return res
}