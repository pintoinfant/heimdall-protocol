package store

import (
	"log"

	"go.etcd.io/bbolt"
)

func OpenDB() *bbolt.DB {
	db, err := bbolt.Open("./heimdall.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func CloseDB(db *bbolt.DB) {
	if err := db.Close(); err != nil {
		log.Fatal(err)
	}
}

func CreateBucket(db *bbolt.DB, bucketName string) {
	err := db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(bucketName))
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}

func PutData(db *bbolt.DB, bucketName, key, value string) {
	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		err := b.Put([]byte(key), []byte(value))
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}

func GetData(db *bbolt.DB, bucketName, key string) string {
	var value []byte
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		value = b.Get([]byte(key))
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
	return string(value)
}

func DeleteData(db *bbolt.DB, bucketName, key string) {
	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		err := b.Delete([]byte(key))
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}

func GetAllData(db *bbolt.DB, bucketName string) map[string]string {
	data := make(map[string]string)
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		b.ForEach(func(k, v []byte) error {
			data[string(k)] = string(v)
			return nil
		})
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
	return data
}
