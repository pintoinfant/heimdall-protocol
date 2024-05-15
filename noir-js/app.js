const fs = require('fs');
const { BarretenbergBackend } = require('@noir-lang/backend_barretenberg');
const { Noir } = require('@noir-lang/noir_js');

// Load the JSON file synchronously using fs.readFileSync
const circuit = require('./heimdall_proofs.json')
// const circuit = require('../heimdall_proofs/target/heimdall_proofs.json')


// Get command-line arguments excluding the first two elements (node executable and script file)
const args = process.argv.slice(2);


function uint8ArrayToHex(uint8Array) {
    // Use map to convert each byte to a two-digit hexadecimal string
    const hexArray = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0'));
    // Concatenate the hexadecimal strings to form the final hex string
    const hexString = hexArray.join('');
    return hexString;
}

const main = async () => {
    const recorded_value = args[0]
    const lower_bound = args[1]
    const higher_bound = args[2]
    // console.log(operator, value)
    try {
        const backend = new BarretenbergBackend(circuit);
        const noir = new Noir(circuit, backend);
        const input = {
            recorded_value: Number(recorded_value),
            lower_check_value: Number(lower_bound),
            higher_check_value: Number(higher_bound)
        };

        const proof = await noir.generateProof(input);
        console.log(uint8ArrayToHex(proof.proof));
        noir.destroy()
    } catch (e) {
        console.error(e);
    }
};

main(); // Run the main function


// usage
// node app.js 5 20