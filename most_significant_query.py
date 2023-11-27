import nltk
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from collections import Counter

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')

def extract_nouns(sentence):
    # Tokenize the sentence into words
    words = word_tokenize(sentence)

    # Part-of-speech tagging
    tagged_words = pos_tag(words)

    # Extract nouns
    nouns = [word for word, tag in tagged_words if tag.startswith('N')]

    return nouns

def get_most_significant_words(nouns, top_n=5):
    # Use Counter to count the occurrences of each noun
    noun_counts = Counter(nouns)

    # Get the most common nouns
    most_common_nouns = noun_counts.most_common(top_n)

    # Extract only the noun names from the result
    most_significant_words = [noun for noun, count in most_common_nouns]

    return most_significant_words

# Example usage
user_query = "Nitish Modi Kumar is simp"
extracted_nouns = extract_nouns(user_query)
most_significant_words = get_most_significant_words(extracted_nouns)

print("Extracted Nouns:", extracted_nouns)
print("Most Significant Words:", most_significant_words)
