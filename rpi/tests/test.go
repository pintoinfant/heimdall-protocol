package tests

import (
	"fmt"

	"github.com/cloudflare/circl/dh/x25519"
	"github.com/pintoinfant/iot-heimdall/rpi/store"
	"github.com/pintoinfant/iot-heimdall/rpi/tools"
)

func RunTests() {

	var secretNetworkPubKey, secretNetworkPrivKey, localPubKey, localPrivKey, sharedKey1, sharedKey2 x25519.Key

	db := store.OpenDB()
	defer store.CloseDB(db)

	secretPubKey := "3,96,39,166,120,3,158,170,76,226,249,108,64,27,179,35,145,188,244,83,68,37,189,21,83,36,238,230,82,150,130,196,249"
	secretPrivKey := "61,166,6,42,86,109,138,52,188,22,22,204,171,47,65,2,77,60,12,119,204,251,208,106,99,40,196,118,157,101,129,89"

	KeyString := store.GetData(db, "config", "encryptionPrivKey")
	copy(localPrivKey[:], []byte(KeyString))

	message := "This is a test funtion"
	copy(secretNetworkPubKey[:], []byte(secretPubKey))
	x25519.Shared(&sharedKey1, &localPrivKey, &secretNetworkPubKey)
	fmt.Println("Using Heimdall's Private Key and Secret's Public Key")
	fmt.Println("Shared Key: ", sharedKey1[:])
	encryptedMessage, _ := tools.Encrypt(sharedKey1[:], []byte(message))
	fmt.Println("Encrypted Message: ", encryptedMessage)
	fmt.Println("----------------------------------------------------------------")

	KeyString = store.GetData(db, "config", "encryptionPubKey")
	copy(localPubKey[:], []byte(KeyString))

	copy(secretNetworkPrivKey[:], []byte(secretPrivKey))
	x25519.Shared(&sharedKey2, &secretNetworkPrivKey, &localPubKey)
	fmt.Println("Using Heimdall's Public Key and Secret's Private Key")
	fmt.Println("Shared Key: ", sharedKey2[:])
	decryptedMessage, _ := tools.Decrypt(sharedKey2[:], encryptedMessage)
	fmt.Println("Decrypted Message: ", decryptedMessage)
	fmt.Println("----------------------------------------------------------------")
}
