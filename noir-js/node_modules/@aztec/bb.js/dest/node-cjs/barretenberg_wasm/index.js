"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarretenbergWasm = exports.fetchModuleAndThreads = void 0;
const tslib_1 = require("tslib");
const comlink_1 = require("comlink");
const debug_1 = tslib_1.__importDefault(require("debug"));
const index_js_1 = require("./barretenberg_wasm_main/factory/node/index.js");
const index_js_2 = require("./helpers/node/index.js");
const index_js_3 = require("./barretenberg_wasm_main/index.js");
const index_js_4 = require("./fetch_code/index.js");
const debug = (0, debug_1.default)('bb.js:wasm');
async function fetchModuleAndThreads(desiredThreads) {
    const shared = (0, index_js_2.getSharedMemoryAvailable)();
    const threads = shared ? desiredThreads : 1;
    const code = await (0, index_js_4.fetchCode)(shared);
    const module = await WebAssembly.compile(code);
    return { module, threads };
}
exports.fetchModuleAndThreads = fetchModuleAndThreads;
class BarretenbergWasm extends index_js_3.BarretenbergWasmMain {
    /**
     * Construct and initialize BarretenbergWasm within a Worker. Return both the worker and the wasm proxy.
     * Used when running in the browser, because we can't block the main thread.
     */
    static async new(desiredThreads) {
        const worker = (0, index_js_1.createMainWorker)();
        const wasm = (0, index_js_2.getRemoteBarretenbergWasm)(worker);
        const { module, threads } = await fetchModuleAndThreads(desiredThreads);
        await wasm.init(module, threads, (0, comlink_1.proxy)(debug));
        return { worker, wasm };
    }
}
exports.BarretenbergWasm = BarretenbergWasm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFycmV0ZW5iZXJnX3dhc20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFDQUFnQztBQUNoQywwREFBZ0M7QUFDaEMsNkVBQWtGO0FBQ2xGLHNEQUE4RjtBQUM5RixnRUFBcUc7QUFDckcsb0RBQWtEO0FBRWxELE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBVyxFQUFDLFlBQVksQ0FBQyxDQUFDO0FBRWpDLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxjQUF1QjtJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFBLG1DQUF3QixHQUFFLENBQUM7SUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsb0JBQVMsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBTkQsc0RBTUM7QUFFRCxNQUFhLGdCQUFpQixTQUFRLCtCQUFvQjtJQUN4RDs7O09BR0c7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUF1QjtRQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFBLDJCQUFnQixHQUFFLENBQUM7UUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBQSxvQ0FBeUIsRUFBNkIsTUFBTSxDQUFDLENBQUM7UUFDM0UsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUEsZUFBSyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFaRCw0Q0FZQyJ9