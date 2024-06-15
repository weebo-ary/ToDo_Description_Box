from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging 
from bson import ObjectId
from .services import mongo_service
from .exceptions import TodoNotFoundException

logger = logging.getLogger(__name__)

class TodoListView(APIView):
    def get(self, request):
        try:
            todos = mongo_service.get_all_todos()
            serialized_todos = [self.serialize_todo(todo) for todo in todos]
            return Response({"todos": serialized_todos}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in API call: {e}")
            return Response({"error": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            data = request.data
            result = mongo_service.create_todo(data)
            return Response({"message": "Todo created successfully", "id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
           logger.error(f"Error in API call: Exception (An error occured in API call while posting the tasks)")
           return Response({"error": "An error occurred while posting your task"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, todo_id):
        try:
            todo = mongo_service.find_todo_by_id(todo_id)
            if not todo:
                raise TodoNotFoundException(todo_id)

            todo['completed'] = not todo.get('completed', False)
            mongo_service.update_todo_by_id(todo_id, todo)
            return Response({"message": "Todo status toggled successfully"}, status=status.HTTP_200_OK)
        except TodoNotFoundException as e:
            logger.warning(f"Task not found: Exception: (The Todo you choose for changing the status is not found)")
            return Response({"error": "Error! Task Not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in API call: Exception: (An error occured in API call while updating the status of the task)")
            return Response({"error": "An error occurred while updating task"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, todo_id):
        try:
            result = mongo_service.delete_todo_by_id(todo_id)
            if result.deleted_count == 1:
                return Response({"message": "Todo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            else:
                raise TodoNotFoundException(todo_id)
        except TodoNotFoundException as e:
                logger.warning(f"Todo not found: Exception: (The Todo you choose to delete is not found)")
                return Response({"error": "Todo not found while deleting"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                logger.error(f"Error in API call: An error occurred while deleting the task")
                return Response({"error": "An error occurred while deleting the task"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Helper method to serialize todo object
    def serialize_todo(self, todo):
        todo['_id'] = str(todo['_id'])
        return todo