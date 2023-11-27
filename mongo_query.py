from pymongo import MongoClient

def connect_to_mongodb(database_name, collection_name):
    # Connect to MongoDB
    client = MongoClient('mongodb+srv://nitish:mdntube@cluster0.luknjg4.mongodb.net/')  # Update the connection string as needed
    db = client[database_name]
    collection = db[collection_name]
    return client, collection

def create_text_index(collection, fields):
    # Create a text index on specified fields
    index_fields = [(field, "text") for field in fields]
    collection.create_index(index_fields)

def perform_text_search(collection, search_query):
    # Perform text search
    result = collection.find(
        {
            "$text": {"$search": search_query}
        },
        {
            "score": {"$meta": "textScore"},
            # Add other fields you want to retrieve in the result
        }
    ).sort([("score", {"$meta": "textScore"})])

    return result

def display_search_results(result):
    # Display search results
    for doc in result:
        print(doc)
        print("Video ID:", doc['videoInfo']['id'])
        print("Title:", doc['videoInfo']['snippet']['title'])
        # Add other fields you want to display
        print("Score:", doc['score'])
        print("------------------------")

def close_connection(client):
    # Close the MongoDB connection
    client.close()

def main():
    # Replace with your actual database name and collection name
    database_name = 'MDNTube'
    collection_name = 'Video Dataset'

    # Replace with the fields you want to perform text search on
    search_fields = ['videoInfo.snippet.title', 'videoInfo.snippet.tags', 'videoInfo.snippet.localized.description']

    # Specify the search query
    search_query = input("Enter your query")  # Replace with the search term you want

    # Connect to MongoDB
    client, collection = connect_to_mongodb(database_name, collection_name)

    # Create a text index
    create_text_index(collection, search_fields)

    # Perform text search
    result = perform_text_search(collection, search_query)

    # Display search results
    display_search_results(result)

    # Close the MongoDB connection
    close_connection(client)

if __name__ == "__main__":
    main()
