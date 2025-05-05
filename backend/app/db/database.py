from pymongo import MongoClient
from ..config import settings


class MongoDB:
    client: MongoClient = None
    db = None

    @classmethod
    def connect_to_mongodb(cls):
        cls.client = MongoClient(settings.MONGODB_URL)
        cls.db = cls.client[settings.MONGODB_DB_NAME]
        print("Connected to MongoDB!")
        return cls.db

    @classmethod
    def close_mongodb_connection(cls):
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed.")