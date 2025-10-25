# train_model.py
import pandas as pd
import re
import sys
import pickle
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

CSV_PATH = "tweets.csv"

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r'\@\w+|\#','', text)
    text = re.sub(r'[^A-Za-z0-9\s]', '', text)
    return text.strip()

# Read CSV without using first row as header
try:
    df = pd.read_csv(CSV_PATH, encoding='latin-1', header=None)
except Exception as e:
    print("Error reading CSV:", e)
    sys.exit(1)

print("CSV shape:", df.shape)
print("Sample header-like row (first row):", df.iloc[0].tolist()[:4])

# Based on your sample, columns are: [id, category, sentiment_text, tweet_text]
if df.shape[1] >= 4:
    # use column index 3 as text and 2 as label
    df = df[[3,2]].copy()
    df.columns = ["tweet","sentiment"]
else:
    print("CSV doesn't have >=4 columns. Edit script to match your CSV format.")
    sys.exit(1)

print("Using columns -> tweet (index 3) and sentiment (index 2). Example:")
print(df.head(3).to_string(index=False))

# Map textual labels to numeric (-1 negative, 0 neutral, 1 positive)
def map_label(x):
    s = str(x).strip().lower()
    if s in ['positive','pos','p','+','+1','1']:
        return 1
    if s in ['negative','neg','n','-','-1']:
        return -1
    if s in ['neutral','neu','ntrl','0','2','neutrality','irrelevant']:
        return 0

    # try numeric conversion (handles 0/2/4)
    try:
        xi = int(float(s))
        if xi == 4:
            return 1
        if xi == 2:
            return 0
        if xi == 0:
            return -1
        if xi in (-1,0,1):
            return xi
    except:
        pass
    return None

df['sentiment_mapped'] = df['sentiment'].apply(map_label)

# Show any unmapped labels
unmapped = df[df['sentiment_mapped'].isnull()]
if len(unmapped) > 0:
    print("\nFound label values that could not be mapped to -1/0/1. Examples:")
    print(unmapped[['sentiment']].drop_duplicates().head(20).to_string(index=False))
    print("\nEdit the map_label function if your labels are different.")
    sys.exit(1)

# finalize
df['sentiment'] = df['sentiment_mapped'].astype(int)
df['tweet'] = df['tweet'].apply(clean_text)

# split, train
X = df['tweet']
y = df['sentiment']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\nTraining on {len(X_train)} examples, testing on {len(X_test)} examples...")

model = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', MultinomialNB())
])

model.fit(X_train, y_train)

with open("sentiment_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Training complete. Model saved as sentiment_model.pkl")
