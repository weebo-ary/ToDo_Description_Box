from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json
import os
from pymongo import MongoClient
from bson import ObjectId

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):
    def get(self, request):
        # Retrieve all todo items from the MongoDB collection
        todos = list(db.todos.find({}))

        # Convert ObjectId to string for serialization
        serialized_todos = []
        for todo in todos:
            todo['_id'] = str(todo['_id'])
            serialized_todos.append(todo)

        # Serialize the todos to JSON
        return JsonResponse({"todos": serialized_todos}, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a new todo item in the MongoDB collection
        data = request.data
        db.todos.insert_one(data)
        return Response({"message": "Todo created successfully"}, status=status.HTTP_201_CREATED)
    def patch(self, request, todo_id):
        # Retrieve the todo item from the MongoDB collection
        todo = db.todos.find_one({"_id": ObjectId(todo_id)})

        # Check if the todo item exists
        if todo:
            # Toggle the completed status
            todo['completed'] = not todo.get('completed', False)
            # Update the todo item in the MongoDB collection
            db.todos.update_one({"_id": ObjectId(todo_id)}, {"$set": todo})
            return JsonResponse({"message": "Todo status toggled successfully"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self, request, todo_id):
        # Retrieve the todo item from the MongoDB collection
        todo = db.todos.find_one({"_id": ObjectId(todo_id)})

        # Check if the todo item exists
        if todo:
            # Delete the todo item from the MongoDB collection
            db.todos.delete_one({"_id": ObjectId(todo_id)})
            return JsonResponse({"message": "Todo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return JsonResponse({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)    