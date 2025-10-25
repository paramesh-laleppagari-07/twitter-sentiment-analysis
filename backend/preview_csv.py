# preview_csv.py
import pandas as pd

path = "tweets.csv"
try:
    df = pd.read_csv(path, encoding='latin-1')
except Exception as e:
    print("Error reading CSV:", e)
    raise SystemExit()

print("CSV shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())
print("\n--- First 10 rows ---")
print(df.head(10))
