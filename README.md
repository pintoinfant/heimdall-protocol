## Inspiration
Industrial IoT (IIoT) is a transformative technology enabling companies to create smart factories and optimize processes.  While connectivity offers operational cost reductions and efficiency gains, it also introduces new security risks. IIoT security acts as a protective shield for these smart machines and systems, safeguarding them from cyberattacks and digital threats. IIoT security is paramount for ensuring the safe, reliable, and efficient operation of industrial processes. By implementing robust security measures, companies can harness the full potential of IIoT while mitigating the associated risks.

## What it does
The Heimdall Protocol project aims to secure Industrial Internet of Things (IIoT) sensor data effectively. Real-world incidents, like the Equifax data breach[3], emphasize the critical need for robust data protection in interconnected industries. By using Zero-Knowledge Proofs (ZKPs)[4] and the Elliptic-curve Diffie–Hellman (ECDH)[5] algorithm on the Secp256k1[6] curve, Heimdall ensures confidential data verification without exposing recorded values. 

This is crucial, especially in sectors like healthcare, where patient privacy is vital. The project's microservice architecture and blockchain integration guarantee data integrity and security, similar to how blockchain secures financial transactions. Components like the Authentication Module, Encryption, and Proof Generation & Verification work together to provide a comprehensive security solution.

Overall, Heimdall's purpose is to elevate IIoT data security standards, drawing from real-world incidents and advanced technologies to safeguard industrial data and improve data integrity protection methods.


## How we built it
The decentralized infrastructure for IoT devices comprises four key modules: Proof generation, Encrypted storage, Historic data and Proof verification. The device has a script that generates a zero knowledge proof to prove the authenticity of the data that it records from the sensor. The GO script creates the wallet, signs the data and generates a proof and is stored in a PostgreSQL database. The data is encrypted by using a shared secret generated between the owner of the device and the device using the ECDH algorithm. The data can be decrypted only by the device and its owner using the shared secret. The encrypted data can be stored by the device owner or in the backend of the protocol. The users can view and verify historic data by verifying the proofs generated and stored in the backend. The user verifies the proof by passing the constraints through the user interface directly interacting to the smart contracts deployed on the blockchain. 


## Challenges we ran into
Implementing Proof generation in Raspberry Pi was difficult since Nargo doesn't support the architecture of the device. I found a alternative way of using the NoirJS to generate the Proofs in the raspberry Pi by minimizing the resource usage.

## Accomplishments that we're proud of
By harnessing state-of-the-art technologies such as Zero-Knowledge Proofs (ZKPs), Heimdall presents a formidable defense against unauthorized access and data breaches. Through the utilization of ZKPs and the ECDH algorithm, the project ensures confidential data verification without compromising data integrity, thereby fortifying the resilience of industrial systems.

## Deployed Contracts
The contracts are deployed on the Lisk Sepolia Chain. The contract addresses are
- Verifier Contract - 0x2c8CEc9B25DbFEAC623b42CbAb268A4409Fe73E1
- Heimdall Protocol - 0xa9D91ad719B84c1483f2e756b91cb6a5d9B67C0f

## How to Run Heimdall Protocol

### Setup the Raspberry Pi
1. **Clone the Repository**
   - Clone the Heimdall Protocol repository on your Raspberry Pi.

2. **Modify Data Collection Script**
   - Navigate to the `rpi` folder.
   - Modify `venv/script.py` to collect the data according to your needs.

3. **Install Necessary Packages**
   - Navigate to the `noir-js` folder.
   - Run `yarn` to install the necessary packages.

4. **Complete Heimdall Protocol Setup**
   - The setup is now completed.

5. **Specify Data Range**
   - To run the Heimdall Protocol, specify the range in which the recorded value exists.

6. **Run the Protocol**
   - Use the command: 
     ```go
     go run main.go <lowerBoundValue> <upperBoundValue>
     ```
   - This will start recording the data and update the data in the off-chain database.

### Register the Device Onchain
1. **Access the Mint Page**
   - Go to `https://iot-heimdall.vercel.app` and click on the "Mint" button in the Navbar.

2. **Enter Device Address**
   - Enter the device address shown in the Raspberry Pi terminal.

3. **Fill in Device Details**
   - Complete the details and click on "Mint Device."

4. **Mint Device**
   - The device will be minted to your address as an ERC721 token on the Lisk Sepolia chain.

5. **View Registered Devices**
   - Click on the "Devices" button in the Navbar to see all registered devices.

6. **Verify Device Data**
   - When a device is selected, the data recorded by that particular device is shown, and the user can verify the proof of the data.
   - If the device visibility is set to private, only authorized users can verify the data.
