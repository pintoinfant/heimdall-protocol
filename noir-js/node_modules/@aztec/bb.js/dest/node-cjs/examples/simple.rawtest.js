"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_js_1 = require("../crs/index.js");
const debug_1 = tslib_1.__importDefault(require("debug"));
const index_js_2 = require("../barretenberg/index.js");
const index_js_3 = require("../types/index.js");
debug_1.default.enable('*');
const debug = (0, debug_1.default)('simple_test');
async function main() {
    const CIRCUIT_SIZE = 2 ** 19;
    debug('starting test...');
    const api = await index_js_2.Barretenberg.new();
    // Important to init slab allocator as first thing, to ensure maximum memory efficiency.
    await api.commonInitSlabAllocator(CIRCUIT_SIZE);
    // Plus 1 needed!
    const crs = await index_js_1.Crs.new(CIRCUIT_SIZE + 1);
    await api.srsInitSrs(new index_js_3.RawBuffer(crs.getG1Data()), crs.numPoints, new index_js_3.RawBuffer(crs.getG2Data()));
    const iterations = 10;
    let totalTime = 0;
    for (let i = 0; i < iterations; ++i) {
        const start = new Date().getTime();
        debug(`iteration ${i} starting...`);
        await api.examplesSimpleCreateAndVerifyProof();
        totalTime += new Date().getTime() - start;
    }
    await api.destroy();
    debug(`avg iteration time: ${totalTime / iterations}ms`);
    debug('test complete.');
}
void main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLnJhd3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXhhbXBsZXMvc2ltcGxlLnJhd3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQXNDO0FBQ3RDLDBEQUFnQztBQUNoQyx1REFBd0Q7QUFDeEQsZ0RBQThDO0FBRTlDLGVBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFXLEVBQUMsYUFBYSxDQUFDLENBQUM7QUFFekMsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUU3QixLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMxQixNQUFNLEdBQUcsR0FBRyxNQUFNLHVCQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFckMsd0ZBQXdGO0lBQ3hGLE1BQU0sR0FBRyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRWhELGlCQUFpQjtJQUNqQixNQUFNLEdBQUcsR0FBRyxNQUFNLGNBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLG9CQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLG9CQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVwRyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25DLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEMsTUFBTSxHQUFHLENBQUMsa0NBQWtDLEVBQUUsQ0FBQztRQUMvQyxTQUFTLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRXBCLEtBQUssQ0FBQyx1QkFBdUIsU0FBUyxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUM7SUFDekQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELEtBQUssSUFBSSxFQUFFLENBQUMifQ==