class TodoNotFoundException(Exception):
    def __init__(self, todo_id):
        self.message = f"Todo with id '{todo_id}' not found."
        super().__init__(self.message)
