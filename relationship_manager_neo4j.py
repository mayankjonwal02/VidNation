import logging
from pymongo import MongoClient
from py2neo import Graph, Node, Relationship

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to MongoDB
mongo_client = MongoClient('mongodb://localhost:27017')
mongo_db = mongo_client['MDNTube']
mongo_collection = mongo_db['Video Dataset']

# Connect to Neo4j
neo_graph = Graph("neo4j+s://neo4j@120090f6.databases.neo4j.io:7687", user="neo4j", password="JUH1BLZ1MOs7OAn4mOsk4jLE1fVB091EsgsAXgi2Fxg")  # Update with your Neo4j credentials

def create_video_node(video_data):
    video_id = video_data["videoInfo"]["id"]
    title = video_data["videoInfo"]["snippet"]["title"]

    video_node = Node("Video", id=video_id, title=title)
    neo_graph.create(video_node)

    # Create relationships with tags
    tags = video_data["videoInfo"]["snippet"].get("tags", [])
    for tag in tags:
        tag_node = Node("Tag", name=tag)
        neo_graph.create(tag_node)
        neo_graph.create(Relationship(video_node, "HAS_TAG", tag_node))

    # Create relationships with thumbnails
    thumbnails = video_data["videoInfo"]["snippet"].get("thumbnails", {})
    for thumbnail_type, thumbnail_data in thumbnails.items():
        thumbnail_node = Node("Thumbnail", type=thumbnail_type, url=thumbnail_data["url"])
        neo_graph.create(thumbnail_node)
        neo_graph.create(Relationship(video_node, "HAS_THUMBNAIL", thumbnail_node))

    # Create relationship with channel
    channel_id = video_data["videoInfo"]["snippet"].get("channelId")
    channel_title = video_data["videoInfo"]["snippet"].get("channelTitle")
    if channel_id:
        channel_node = Node("Channel", id=channel_id, title=channel_title)
        neo_graph.create(channel_node)
        neo_graph.create(Relationship(video_node, "UPLOADED_BY", channel_node))

    # Create relationship with statistics
    statistics = video_data["videoInfo"].get("statistics", {})
    view_count = statistics.get("viewCount")
    like_count = statistics.get("likeCount")
    dislike_count = statistics.get("dislikeCount")
    if view_count is not None or like_count is not None or dislike_count is not None:
        statistics_node = Node("Statistics", viewCount=view_count, likeCount=like_count, dislikeCount=dislike_count)
        neo_graph.create(statistics_node)
        neo_graph.create(Relationship(video_node, "HAS_STATISTICS", statistics_node))

    return video_node

# Retrieve data from MongoDB
mongo_documents = mongo_collection.find()
num=1
# Create nodes and relationships in Neo4j
for document in mongo_documents:
    logger.info(f'Adding Video with id={document["videoInfo"]["id"]}, title={document["videoInfo"]["snippet"]["title"]}')
    create_video_node(document)
    logger.info(f'Successfully Added {num} Document')
    num=num+1

# Close connections
mongo_client.close()
