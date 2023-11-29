from bson import ObjectId
from rest_framework.response import Response
from rest_framework.views import APIView
from display_videos_10 import display_api
from asgiref.sync import async_to_sync
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes , authentication_classes
import asyncio
import json

@permission_classes([AllowAny])
@authentication_classes([])
class VideoDisplay(APIView):
  
    def post(self, request):
        print("request received ................................")
        try:
            data = (display_api(request.data["email"], request.data["title"]))
            # Convert ObjectId to string for JSON serialization
            serialized_data = json.loads(json.dumps(data, default=str))
            return Response({"Message": "Connected", "data": serialized_data})
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error: {e}")
            # Provide a generic error message to the client
            return Response({"Message": str(e)})


# Rest of your code...
