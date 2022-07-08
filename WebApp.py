from flask import Flask, send_file, render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/games')
def games():
    return render_template('games.html')


@app.route('/community')
def community():
    return render_template('contacts.html')


@app.route('/PuzzleMinefield')
def puzzleMinefield():
    return render_template('PuzzleMinefield.html')

@app.route('/PuzzleMinefield/downloads')
def puzzleMinefieldDownloads():
    return render_template('PMFDownloads.html')


@app.route('/PuzzleMinefield/community')
def puzzleMinefieldCommunity():
    return render_template('PMFcommunity.html')


@app.route('/PuzzleMinefield/download-jar')
def download_file():
    p = "static\PuzzleMinefield\Downloads\desktop-0.2.3-alpha.jar"
    return send_file(p, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
