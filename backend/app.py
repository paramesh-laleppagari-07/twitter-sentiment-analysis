from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)

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
    app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
#
# app = Flask(__name__)
# CORS(app)  # This allows React to talk to Flask
#
# @app.route('/analyze', methods=['POST'])
# def analyze():
#     data = request.get_json()
#     text = data.get('text', '')
#     # Simple sentiment logic (replace with your model)
#     sentiment = 'positive' if 'good' in text.lower() else 'negative'
#     return jsonify({'sentiment': sentiment})
#
# if __name__ == '__main__':
#     app.run(debug=True)
