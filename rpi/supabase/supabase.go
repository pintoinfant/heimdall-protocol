package supabase

import (
	"bytes"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// Insert the encrypted data into heimdall table
func InsertData(tableName string, requestBody []byte) bool {
	godotenv.Load(".env")
	url := os.Getenv("SUPABASE_URL") + "/rest/v1/" + tableName
	apiKey := os.Getenv("SUPABASE_KEY")

	// Create a new HTTP client
	client := &http.Client{}

	// Create a new request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		panic(err)
	}

	// Set headers
	req.Header.Set("apikey", apiKey)
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=minimal")

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	return resp.StatusCode == 201
	// fmt.Println("Response Status:", resp.Status)
}
