import { proxy } from 'comlink';
import createDebug from 'debug';
import { createMainWorker } from './barretenberg_wasm_main/factory/node/index.js';
import { getRemoteBarretenbergWasm, getSharedMemoryAvailable } from './helpers/node/index.js';
import { BarretenbergWasmMain } from './barretenberg_wasm_main/index.js';
import { fetchCode } from './fetch_code/index.js';
const debug = createDebug('bb.js:wasm');
export async function fetchModuleAndThreads(desiredThreads) {
    const shared = getSharedMemoryAvailable();
    const threads = shared ? desiredThreads : 1;
    const code = await fetchCode(shared);
    const module = await WebAssembly.compile(code);
    return { module, threads };
}
export class BarretenbergWasm extends BarretenbergWasmMain {
    /**
     * Construct and initialize BarretenbergWasm within a Worker. Return both the worker and the wasm proxy.
     * Used when running in the browser, because we can't block the main thread.
     */
    static async new(desiredThreads) {
        const worker = createMainWorker();
        const wasm = getRemoteBarretenbergWasm(worker);
        const { module, threads } = await fetchModuleAndThreads(desiredThreads);
        await wasm.init(module, threads, proxy(debug));
        return { worker, wasm };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFycmV0ZW5iZXJnX3dhc20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLFdBQVcsTUFBTSxPQUFPLENBQUM7QUFDaEMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDbEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLHdCQUF3QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUE4QixNQUFNLG1DQUFtQyxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVsRCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFeEMsTUFBTSxDQUFDLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxjQUF1QjtJQUNqRSxNQUFNLE1BQU0sR0FBRyx3QkFBd0IsRUFBRSxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUVELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxvQkFBb0I7SUFDeEQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBdUI7UUFDN0MsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztRQUNsQyxNQUFNLElBQUksR0FBRyx5QkFBeUIsQ0FBNkIsTUFBTSxDQUFDLENBQUM7UUFDM0UsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUNGIn0=