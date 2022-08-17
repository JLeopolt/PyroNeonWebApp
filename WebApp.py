from flask import Flask, send_file, render_template, redirect

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/products')
def products():
    return render_template('products.html')


@app.route('/community')
def community():
    return render_template('contacts.html')


@app.route('/missing')
def missingpage():
    return render_template('missingpage.html')


@app.route('/PuzzleMinefield')
def puzzleMinefield():
    return render_template('PuzzleMinefield.html')


@app.route('/PuzzleMinefield/downloads')
def puzzleMinefieldDownloads():
    return render_template('PMFDownloads.html')


@app.route('/PuzzleMinefield/community')
def puzzleMinefieldCommunity():
    return render_template('PMFcommunity.html')


@app.route('/PuzzleMinefield/FAQ')
def puzzleMinefieldFAQ():
    return render_template('PMFFAQ.html')


@app.route('/PuzzleMinefield/download-jar')
def download_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.jar", code=302)
    # p = "<filepath>"
    # return send_file(p, as_attachment=True)


@app.route('/PuzzleMinefield/download-exe')
def download_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.exe", code=302)

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('missingpage.html'), 404


app.register_error_handler(404, page_not_found)


if __name__ == "__main__":
    app.run(host="0.0.0.0")
