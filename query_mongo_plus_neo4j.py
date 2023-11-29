import copy
import json
import logging
from pymongo import MongoClient
from py2neo import Graph, Node, Relationship
from collections import Counter
from difflib import SequenceMatcher
import nltk
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to MongoDB
def connect_to_mongodb(database_name, collection_name):
    client = MongoClient('mongodb+srv://nitish:mdntube@cluster0.luknjg4.mongodb.net/')
    db = client[database_name]
    collection = db[collection_name]
    return client, collection

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

# def get_most_frequent_tags(mongo_result):
#     # mongo_documents = list(mongo_result)
#     #
#     # # Print the entire list of documents for debugging
#     # print("Mongo Documents:", mongo_documents)
#     # Assuming mongo_result is a list of documents with a 'videoInfo' key
#     tags_list = [tag for document in list(mongo_result) for tag in document.get('videoInfo', {}).get('snippet', {}).get('tags', [])]
#     print("Tags list",tags_list)
#
#     # Use Counter to count the occurrences of each tag
#     tag_counts = Counter(tags_list)
#
#     # Get the most common tags
#     most_common_tags = tag_counts.most_common(5)  # You can adjust the number as needed
#
#     # Extract only the tag names from the result
#     frequent_tags = [tag for tag, count in most_common_tags]
#     print("Frequent Tags",frequent_tags)
#
#     return frequent_tags


def is_noun(tag):
    return tag.startswith('N')


# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

def get_lemmas_from_tags(tags):
    lemmas = []
    for tag in tags:
        # Tokenize the tag into words
        words = word_tokenize(tag)

        # Perform lemmatization
        lemmatized_words = [lemmatizer.lemmatize(word) for word in words]

        # Combine lemmatized words back into the tag
        lemmatized_tag = ' '.join(lemmatized_words)
        lemmas.append(lemmatized_tag)

    return lemmas

# Update the get_nouns_from_tags function
def get_nouns_from_tags(tags):
    nouns = []

    for tag in tags:
        # Tokenize the tag into words
        words = word_tokenize(tag)

        # Perform part-of-speech tagging
        tagged_words = pos_tag(words)

        # Extract nouns and filter out words shorter than 4 characters
        nouns.extend([word for word, tag in tagged_words if is_noun(tag) and len(word) >= 4])

    return nouns
def get_unique_nouns_from_tags(tags):
    nouns = []
    for tag in tags:
        words = word_tokenize(tag)
        tagged_words = pos_tag(words)
        nouns.extend([word for word, tag in tagged_words if is_noun(tag)])

    unique_nouns = set(nouns)
    return unique_nouns

def slice_dict(input_dict, start, end):
    # Convert dictionary items to a list and slice it
    sliced_items = list(input_dict.items())[start:end]

    # Convert the sliced list back to a dictionary
    sliced_dict = dict(sliced_items)

    return sliced_dict
def get_most_frequent_tags(mongo_result, preferences_dict):
    # Convert the cursor to a list of documents
    mongo_documents = list(mongo_result)

    # Assuming the structure is correct, extract tags
    tags_list = [tag for document in mongo_documents for tag in document.get('videoInfo', {}).get('snippet', {}).get('tags', [])][:5]

    # Extract nouns from tags
    nouns_list = get_nouns_from_tags(get_unique_nouns_from_tags(tags_list))



    noun_counts = Counter(nouns_list)
    print("Noun_counts",noun_counts)
    # Update the preferences dictionary
    for noun, count in noun_counts.items():
        # Check if the noun is a synonym of any existing noun in preferences
        existing_nouns = list(preferences_dict.keys())
        similar_nouns = [existing_noun for existing_noun in existing_nouns if similar(noun, existing_noun) > 0.8]
        print("Similar Nouns",similar_nouns)
        if similar_nouns:
            # If similar nouns exist, update the count of the most similar noun
            most_similar_noun = max(similar_nouns, key=lambda existing_noun: similar(noun, existing_noun))
            preferences_dict[most_similar_noun] += count
        else:
            # If the noun is not in preferences, add it with a count of 1
            preferences_dict[noun] = count

    # Sort the dictionary by counts in descending order
    sorted_preferences = dict(sorted(preferences_dict.items(), key=lambda item: item[1], reverse=True))

    return sorted_preferences
def display_search_results(result):
    # print("Display Res",result)
    # Display search results
    for doc in result:
        print(doc)
        print("Video ID:", doc['videoInfo']['id'])
        print("Title:", doc['videoInfo']['snippet']['title'])
        # Add other fields you want to display
        print("Score:", doc['score'])
        print("------------------------")


def fetch_user_preferences_videos(mongo_collection, user_preferences,fetch_n_videos):
    # Extract tags from user preferences
    user_tags = list(user_preferences.keys())

    # Perform text search for each user tag
    user_videos = []
    for tag in user_tags:
        result = perform_text_search(mongo_collection, tag)
        user_videos.extend(result)

    # Remove duplicates based on video ID
    unique_user_videos = slice_dict({video['videoInfo']['id']: video for video in user_videos},0,fetch_n_videos).values()
    print("Show",type(unique_user_videos))
    return unique_user_videos

def fetch_user_preferences(neo_graph, username):
    # Fetch user preferences from Neo4j
    user_node = neo_graph.nodes.match("user", username=username).first()
    if user_node:
        preferences_str = user_node.get("preferences", {})
        preferences = json.loads(preferences_str) if preferences_str else {}
        return preferences
    return {}

def create_text_index(collection, fields):
    # Create a text index on specified fields
    index_fields = [(field, "text") for field in fields]
    collection.create_index(index_fields)
# Connect to Neo4j
def connect_to_neo4j(uri, username, password):
    return Graph(uri, user=username, password=password)

# Function to create a user node in Neo4j with a preference list
def create_user_node(neo_graph, username, preference_dict):
    # Convert dictionary to a JSON-compatible string
    preference_json = json.dumps(preference_dict)

    # Create the user node with the JSON string
    user_node = Node("user", username=username, preferences=preference_json)

    # Create the user node in Neo4j
    neo_graph.create(user_node)

    return user_node

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

# def get_most_frequent_tags(mongo_result, preferences_dict):
#     # Convert the cursor to a list of documents
#     mongo_documents = list(mongo_result)
#
#     # Assuming the structure is correct, extract tags
#     tags_list = [tag for document in mongo_documents for tag in document.get('videoInfo', {}).get('snippet', {}).get('tags', [])]
#
#     # Count the occurrences of each tag
#     tag_counts = Counter(tags_list)
#
#     # Update the preferences dictionary
#     for tag, count in tag_counts.items():
#         # Check if the tag is a synonym of any existing tag in preferences
#         existing_tags = list(preferences_dict.keys())
#         similar_tags = [existing_tag for existing_tag in existing_tags if similar(tag, existing_tag) > 0.8]
#
#         if similar_tags:
#             # If similar tags exist, update the count of the most similar tag
#             most_similar_tag = max(similar_tags, key=lambda existing_tag: similar(tag, existing_tag))
#             preferences_dict[most_similar_tag] += count
#         else:
#             # If the tag is not in preferences, add it with a count of 1
#             preferences_dict[tag] = count
#
#     # Sort the dictionary by counts in descending order
#     sorted_preferences = dict(sorted(preferences_dict.items(), key=lambda item: item[1], reverse=True))
#
#     return sorted_preferences

# Function to update the preference list of a user node in Neo4j
def update_user_preferences(neo_graph, user_node, new_preferences):
    # Convert the dictionary to a string before updating in Neo4j
    preferences_str = json.dumps(new_preferences)
    user_node["preferences"] = preferences_str
    neo_graph.push(user_node)


# Main function
def main():
    # MongoDB details
    database_name = 'MDNTube'
    collection_name = 'Video Dataset'
    search_fields = ['videoInfo.snippet.title', 'videoInfo.snippet.tags', 'videoInfo.snippet.localized.description']

    # Neo4j details
    neo4j_uri = "bolt://localhost:7687"
    neo4j_username = "neo4j"
    neo4j_password = "nitish@31"

    # Get search query and username from the user
    search_query = input("Enter your search query: ")
    username = input("Enter your username: ")

    # Connect to MongoDB
    mongo_client, mongo_collection = connect_to_mongodb(database_name, collection_name)

    # Connect to Neo4j
    neo_graph = connect_to_neo4j(neo4j_uri, neo4j_username, neo4j_password)

    # Create a text index in MongoDB
    create_text_index(mongo_collection, search_fields)

    # Perform text search in MongoDB
    mongo_result = perform_text_search(mongo_collection, search_query)
    # Assuming mongo_result is a pymongo.cursor.Cursor
    # document_count = mongo_result.count()
    print(type(mongo_result))
    document_count = 0
    temp= copy.copy(mongo_result)
    for c in temp:
        document_count+=1


    print(f"Number of documents: {document_count}")
    n = 10 - document_count
    print("User preferences to be displayed",n)
    mongo_result1 = copy.copy(mongo_result)
    # Display search results from MongoDB
    display_search_results(mongo_result)

    # Check if the user node exists in Neo4j
    user_node = neo_graph.nodes.match("user", username=username).first()
    print("Usernode",user_node)
    if user_node:
        logger.info(f"User '{username}' found in Neo4j.")
        existing_preferences = user_node.get("preferences", {})
        existing_preferences = json.loads(existing_preferences)
        print("Existing preferences",type(existing_preferences))
        # Extract most frequent tags from MongoDB results
        frequent_tags = get_most_frequent_tags(mongo_result1, existing_preferences)
        # frequent_tags = ['1','2','3']
        logger.info(f"Updating preferences for user '{username}' in Neo4j with tags: {frequent_tags}")
        # Update user preferences in Neo4j
        update_user_preferences(neo_graph, user_node, frequent_tags)

    else:
        logger.info(f"User '{username}' not found in Neo4j. Creating user node...")
        # Extract most frequent tags from MongoDB results
        frequent_tags = get_most_frequent_tags(mongo_result1,{})
        print("Check", frequent_tags)
        # Create a user node in Neo4j with the preference list
        user_node = create_user_node(neo_graph, username, frequent_tags)
        logger.info(f"User node created for '{username}' in Neo4j.")
    print("User Preference Videos:")
    # Fetch user preferences from Neo4j
    user_preferences = fetch_user_preferences(neo_graph, username)
    # user_preferences = slice_dict(user_preferences, 1, 7)

    # Fetch user preference videos from MongoDB
    user_preference_videos = fetch_user_preferences_videos(mongo_collection, user_preferences,n)
    display_search_results(user_preference_videos)
    # Close connections
    mongo_client.close()

if __name__ == "__main__":
    main()
