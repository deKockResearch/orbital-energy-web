from flask import Flask, render_template
import json
app = Flask(__name__)

@app.route("/")
def home():
    with open('elements.json', 'r') as src:
        elements = json.loads(src.read())

    return render_template('home.html', elements = elements)

if __name__ == '__main__':
    app.run(debug=True)