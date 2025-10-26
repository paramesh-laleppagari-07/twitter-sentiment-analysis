from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

app = Flask(__name__)
CORS(app)

# ✅ Ensure vader_lexicon is available, even in Render or server
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize VADER
sia = SentimentIntensityAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    # Get sentiment scores
    scores = sia.polarity_scores(text)
    compound = scores['compound']

    # Determine sentiment
    if compound >= 0.05:
        sentiment = 'Positive'
    elif compound <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    return jsonify({'sentiment': sentiment})

@app.route('/')
def home():
    return "Flask backend is running"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
