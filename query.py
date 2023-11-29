import copy
from pymongo import MongoClient
import mysql.connector
from mysql.connector import Error
from datetime import datetime

def connect_to_mongodb(database_name, collection_name):
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')  # Update the connection string as needed
    db = client[database_name]
    collection = db[collection_name]
    return client, collection

def signup(connection1, username, password):
    try:
        cursor = connection1.cursor()
        # print(timestamp)
        query = f"INSERT INTO user_table (username, password) " \
                f"VALUES ('{username}', '{password}')"
        cursor.execute(query)
        connection1.commit()
        print("Account Created successfully")
    except Error as e:
        print(f"Error while signing up: {e}")

def login(connection1, username, password):
    try:
        cursor = connection1.cursor()
        query = f"SELECT * FROM user_table WHERE username = {username} AND password = {password}"
        cursor.execute(query)
        result = cursor.fetchone()
        connection1.commit()
        if result:
            print("Login successfully")
            return result
        else:
            return None
    except Error as e:
        print(f"Error while logging in: {e}")
def user_login_and_signup(connection1):
    choice = input("Enter '1' for SignUp \n Enter '2' for LogIn")
    if int(choice) == 1:
        print("Redirecting to signup portal")
        username = input("Enter your username")
        password = input("Enter your new password")
        signup(connection1, username, password)
    elif int(choice) == 2:
        print("Redirecting to login portal")
        username = input("Enter your username")
        password = input("Enter your password")
        login(connection1, username, password)



def connect_to_mysql():
    # Connect to MySQL
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='MDNTube3117',
            database='mdntube'
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

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
    print("Display Res",result)
    # Display search results
    for doc in result:
        print(doc)
        print("Video ID:", doc['videoInfo']['id'])
        print("Title:", doc['videoInfo']['snippet']['title'])
        # Add other fields you want to display
        print("Score:", doc['score'])
        print("------------------------")

def log_click_through(connection, search_query, video_id, rank):
    # Log click-through information to MySQL
    try:
        cursor = connection.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # print(timestamp)
        query = f"INSERT INTO click_through_log_table (search_query, video_id, `rank`, timestamp) " \
                f"VALUES ('{search_query}', '{video_id}', {rank}, '{timestamp}')"
        cursor.execute(query)
        connection.commit()
        print("Click-through information logged successfully")
    except Error as e:
        print(f"Error logging click-through information: {e}")

def close_mysql_connection(connection):
    # Close the MySQL connection
    if connection.is_connected():
        connection.close()
        print("MySQL connection closed")

def close_mongodb_connection(client):
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

    # Connect to MySQL
    mysql_connection = connect_to_mysql()

    if mysql_connection:
        # Perform text search
        result = perform_text_search(collection, search_query)
        result1=copy.copy(result)
        # Display search results
        display_search_results(result)
        # print('res1', result)

        # Log click-through information to MySQL
        # if result:
        # selected_video = result[0]  # Assuming the first result is selected
        r=1
        for doc in result1:
            print("Logging click through called")
            video_id = doc['videoInfo']['id']
            rank = r  # You may need to adjust this based on your application logic
            log_click_through(mysql_connection, search_query, video_id, rank)
            print("Logging click through called back")
            r = r+1

        # Close connections
        close_mysql_connection(mysql_connection)

    # Close the MongoDB connection
    close_mongodb_connection(client)

if __name__ == "__main__":
    main()
