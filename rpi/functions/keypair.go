package functions

import (
	"fmt"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

func GenerateKeyPair() ([]byte, []byte) {
	// Alice generates her private key and public key
	alicePrivKey, err := secp256k1.GeneratePrivateKey() // Generate random key
	if err != nil {
		fmt.Println("Error generating Alice's private key:", err)
		return nil, nil
	}
	alicePubKey := alicePrivKey.PubKey() //secp256k1.Serialize() // Get serialized public key
	return alicePrivKey.Serialize(), alicePubKey.SerializeCompressed()
}
