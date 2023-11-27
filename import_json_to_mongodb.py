import os
import json
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb+srv://nitish:mdntube@cluster0.luknjg4.mongodb.net/')  # Update the connection string as needed
db = client['MDNTube']  # Replace 'your_database_name' with your actual database name
collection = db['Video Dataset']  # Replace 'your_collection_name' with your actual collection name

def import_json_files(folder_path):
    # List all JSON files in the specified folder
    json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]

    # Iterate through each JSON file and insert its content into the MongoDB collection
    for json_file in json_files:
        with open(os.path.join(folder_path, json_file), 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
                video_id = data['videoInfo']['id']

                # Check if a document with the same video ID already exists
                existing_document = collection.find_one({'videoInfo.id': video_id})

                if existing_document:
                    print(f"Document with video ID {video_id} already exists. Skipping.")
                else:
                    collection.insert_one(data)
                    print(f"Inserted data from {json_file} into MongoDB")
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON in file {json_file}: {e}")

# Specify the path to the folder containing JSON files
folder_path = 'C:/Users/nitis/Downloads/test'  # Update the path to your folder containing JSON files

# Call the function to import JSON files into MongoDB
import_json_files(folder_path)

# Close the MongoDB connection
client.close()
