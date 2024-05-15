package internal

import (
	"crypto/ecdsa"
	"crypto/rand"
	"fmt"
	"io"
	"log"
	"strconv"
	"strings"

	"github.com/cloudflare/circl/dh/x25519"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

type X25519KeyPair struct {
	X25519PrivateKey x25519.Key
	X25519PublicKey  x25519.Key
}

func GenerateECDSAPair() (string, string) {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		log.Fatal(err)
	}

	privateKeyBytes := crypto.FromECDSA(privateKey)
	privateKeyHex := hexutil.Encode(privateKeyBytes)[2:]
	// fmt.Println(hexutil.Encode(privateKeyBytes)[2:]) // fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}

	// publicKeyBytes := crypto.FromECDSAPub(publicKeyECDSA)
	// fmt.Println(hexutil.Encode(publicKeyBytes)[4:]) // 9a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05

	address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()
	// fmt.Println(address) // 0x96216849c49358B10257cb55b28eA603c874b05E

	return privateKeyHex, address
}

func SignData(privateKeyHex, message string) (string, error) {
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return "", err
	}

	data := []byte(message)
	hash := crypto.Keccak256Hash(data)
	signature, err := crypto.Sign(hash.Bytes(), privateKey)

	if err != nil {
		return "", err
	}

	return hexutil.Encode(signature), nil
}

func GenerateX25519KeyPair() X25519KeyPair {
	var privKey, pubKey x25519.Key

	// Generating Heimdall's secret and public keys
	_, _ = io.ReadFull(rand.Reader, privKey[:])
	x25519.KeyGen(&pubKey, &privKey)

	return X25519KeyPair{
		X25519PrivateKey: privKey,
		X25519PublicKey:  pubKey,
	}
}

func GenerateEncryptionKey() x25519.Key {

	deviceKeyPair := GenerateX25519KeyPair()

	//Secret Network Pub Key
	publicKeyStr := strings.Split("2,18,190,38,136,23,181,172,158,56,89,8,175,44,167,62,207,207,10,176,52,79,58,186,241,198,117,117,105,100,212,145,14", ",")

	var byteArray []byte
	for _, numStr := range publicKeyStr {
		num, err := strconv.Atoi(numStr) // Convert string to integer
		if err != nil {
			fmt.Println("Error converting string to integer:", err)
		}
		byteArray = append(byteArray, byte(num)) // Append integer as byte to byte slice
	}

	var keyArray x25519.Key
	copy(keyArray[:], byteArray)

	var sharedKey x25519.Key
	x25519.Shared(&sharedKey, &deviceKeyPair.X25519PrivateKey, &keyArray)

	// fmt.Println("Shared Key: ", hex.EncodeToString(sharedKey[:]))
	return sharedKey
}
