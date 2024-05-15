package main

import (
	"encoding/hex"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
	"github.com/joho/godotenv"
	"github.com/pintoinfant/iot-heimdall/rpi/functions"
	"github.com/pintoinfant/iot-heimdall/rpi/internal"
	"github.com/pintoinfant/iot-heimdall/rpi/store"
	"github.com/pintoinfant/iot-heimdall/rpi/supabase"
	"github.com/pintoinfant/iot-heimdall/rpi/tools"
)

func main() {
	godotenv.Load(".env")
	var privateKey, address string
	var alicePrivateKey, alicePublicKey []byte

	db := store.OpenDB()
	defer store.CloseDB(db)

	store.CreateBucket(db, "config")

	initiated := store.GetData(db, "config", "initiated")
	if initiated == "" {
		fmt.Println("First run...")
		fmt.Println("Initating heimdall with the following data: ")
		privateKey, address = internal.GenerateECDSAPair()
		alicePrivateKey, alicePublicKey = functions.GenerateKeyPair()
		fmt.Println("Private Key: ", privateKey)
		fmt.Println("Address: ", address)
		store.PutData(db, "config", "address", address)
		store.PutData(db, "config", "initiated", "true")
		store.PutData(db, "config", "privateKey", privateKey)
		store.PutData(db, "config", "alicePrivateKey", string(alicePrivateKey[:]))
		store.PutData(db, "config", "alicePublicKey", string(alicePublicKey[:]))
	} else {
		fmt.Println("Not the first run...")
		privateKey = store.GetData(db, "config", "privateKey")
		address = store.GetData(db, "config", "address")
		fmt.Println("Address: ", address)
		alicePrivateKey = []byte(store.GetData(db, "config", "alicePrivateKey"))
	}

	currentWorkingDirectory, _ := os.Getwd()
	bobPublicKeyBytes := []byte{3, 96, 39, 166, 120, 3, 158, 170, 76, 226, 249, 108, 64, 27, 179, 35, 145, 188, 244, 83, 68, 37, 189, 21, 83, 36, 238, 230, 82, 150, 130, 196, 249}
	bobPublicKey, err := secp256k1.ParsePubKey(bobPublicKeyBytes)
	if err != nil {
		fmt.Println("Error parsing Bob's public key:", err)
		return
	}
	aliceSharedSecret := secp256k1.GenerateSharedSecret(secp256k1.PrivKeyFromBytes(alicePrivateKey), bobPublicKey)
	fmt.Println("Alice Shared Secret: ", aliceSharedSecret)
	fmt.Println("Current working directory: ", currentWorkingDirectory)
	cmd := exec.Command("python3", currentWorkingDirectory+"/script.py")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		fmt.Println("Error creating stdout pipe:", err)
		return
	}

	if err := cmd.Start(); err != nil {
		fmt.Println("Error starting command:", err)
		return
	}

	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := stdout.Read(buf)
			if err != nil {
				fmt.Println("Error reading stdout:", err)
				break
			}
			if n > 0 {
				output := string(buf[:n])
				// privateKey, address = internal.GenerateECDSAPair()
				signature, err := internal.SignData(privateKey, output)
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println("Signature: ", signature)
				encryptedMessage, err := tools.Encrypt(aliceSharedSecret[:], []byte(output))
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println("Encrypted Message: ", hex.EncodeToString(encryptedMessage))
				decimalInt, err := strconv.Atoi(output)
				if err != nil {
					fmt.Println("Error:", err)
					return
				}
				lowerBound, _ := strconv.Atoi(os.Args[1])
				upperBound, _ := strconv.Atoi(os.Args[2])
				fmt.Println("Decimal Int: ", decimalInt)
				fmt.Println("Lower Bound: ", lowerBound)
				fmt.Println("Upper Bound: ", upperBound)
				proof, _ := tools.GenerateProof(int(decimalInt), lowerBound, upperBound)
				fmt.Println("Proof: ", proof)
				// decryptedMessage, err := tools.Decrypt(aliceSharedSecret[:], encryptedMessage)
				// if err != nil {
				// 	fmt.Println(err)
				// }
				// fmt.Println("Decrypted Message: ", string(decryptedMessage))
				dataInserted := supabase.InsertData("proofs", []byte(fmt.Sprintf(`{"address": "%s", "signature": "%s", "encrypted_data": "%s", "proof": "%s"}`, address, signature, hex.EncodeToString(encryptedMessage), proof)))
				if !dataInserted {
					fmt.Println("Error inserting data into Supabase")
				}
				fmt.Println("--------------------------------------------------------------------------------")
			}
		}
	}()

	<-signalCh

	if err := cmd.Process.Kill(); err != nil {
		fmt.Println("Error stopping command:", err)
		return
	}

	fmt.Println("Command stopped.")
}
