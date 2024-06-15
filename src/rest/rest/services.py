from pymongo import MongoClient
from bson import ObjectId
import os

class MongoDBService:
    def __init__(self):
        mongo_uri = f"mongodb://{os.getenv('MONGO_HOST')}:{os.getenv('MONGO_PORT')}"
        self.client = MongoClient(mongo_uri)
        self.db = self.client['test_db']

    def get_all_todos(self):
        return list(self.db.todos.find({}))

    def create_todo(self, data):
        return self.db.todos.insert_one(data)

    def find_todo_by_id(self, todo_id):
        return self.db.todos.find_one({"_id": ObjectId(todo_id)})

    def update_todo_by_id(self, todo_id, data):
        return self.db.todos.update_one({"_id": ObjectId(todo_id)}, {"$set": data})

    def delete_todo_by_id(self, todo_id):
        return self.db.todos.delete_one({"_id": ObjectId(todo_id)})

mongo_service = MongoDBService()