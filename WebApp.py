# Handles serving html files and other content
from flask import Flask, send_file, render_template, redirect
app = Flask(__name__)

# Homepage for the entire website.
@app.route('/')
def home():
    return render_template('PyroNeon/index.html')

# Showcase for all the products provided by PN
@app.route('/products')
def products():
    return render_template('PyroNeon/products.html')

# Contacts / Social links page for the company
@app.route('/community')
def community():
    return render_template('PyroNeon/community.html')

# Contact Us by email.
@app.route('/contact-us/email')
def emailContactUs():
    return render_template('PyroNeon/contact-us/emails.html')

# Directs to the 404 page.
@app.route('/missing')
def missingpage():
    return render_template('PyroNeon/404.html')







# Landing page for the Puzzle Minefield game
@app.route('/PuzzleMinefield')
def puzzleMinefield():
    return render_template('PuzzleMinefield/index.html')

# Puzzle Minefield's downloads page
@app.route('/PuzzleMinefield/downloads')
def puzzleMinefieldDownloads():
    return render_template('PuzzleMinefield/downloads.html')

# Contacts and social links for Puzzle Minefield
@app.route('/PuzzleMinefield/community')
def puzzleMinefieldCommunity():
    return render_template('PuzzleMinefield/community.html')

# Frequently Asked Questions about Puzzle Minefield
@app.route('/PuzzleMinefield/FAQ')
def puzzleMinefieldFAQ():
    return render_template('PuzzleMinefield/faq.html')

# Downloading Puzzle Minefield as a JAR file
@app.route('/PuzzleMinefield/download-jar')
def download_pmf_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.jar", code=302)

# Downloading Puzzle Minefield as an EXE file
@app.route('/PuzzleMinefield/download-exe')
def download_pmf_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/PuzzleMinefield-Releases/releases/latest/download/PuzzleMinefield.exe", code=302)

# Reporting a bug in Puzzle Minefield.
@app.route('/PuzzleMinefield/report-a-bug')
def puzzleMinefieldBugReport():
    return redirect("https://forms.gle/jJkvXrN67hCTx2ot7", code=302)

# Puzzle Minefield TOS
@app.route('/PuzzleMinefield/tos')
def puzzleMinefieldTOS():
    return render_template('PuzzleMinefield/legal/tos.html')





# Landing page for CLIPnP
@app.route('/clipnp')
def clipnp():
    return render_template('CLIPnP/index.html')


# Landing page for MUD
@app.route('/mudtool')
def mudtool():
    return render_template('MUDTool/index.html')

# Downloading MUD as an EXE file
@app.route('/mudtool/download-exe')
def download_mudtool_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/MultimediaUtilityDownloadTool/releases/latest/download/MultimediaUtilityDownloadTool.exe", code=302)



# Landing page for muSign
@app.route('/musign')
def musignTool():
    return render_template('muSign/index.html')

# Downloading muSign as an EXE file
@app.route('/musign/download-exe')
def download_musign_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/muSign/releases/latest/download/muSign.exe", code=302)




# Landing page for Scraps
@app.route('/scraps')
def scraps():
    return render_template('Scraps/index.html')

@app.route('/scraps/join')
def scrapsJoin():
    return render_template('Scraps/join.html')

@app.route('/scraps/community')
def scrapsCommunity():
    return render_template('Scraps/community.html')

@app.route('/scraps/guide')
def scrapsGuide():
    return render_template('Scraps/guide.html')






@app.route('/experimental/TUMULT')
def tumult():
    return render_template('TUMULT/index.html')
# Downloading TUMULT as a JAR file
@app.route('/experimental/TUMULT/download-jar')
def tum_download_jar():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/TUMULT-Releases/releases/latest/download/Tumult.jar", code=302)

# Downloading TUMULT as an EXE file
@app.route('/experimental/TUMULT/download-exe')
def tum_download_exe():
    # This will only work for Full Releases; 'Pre-Releases' will not work..
    return redirect("https://github.com/JLeopolt/TUMULT-Releases/releases/latest/download/Tumult.exe", code=302)








@app.route('/accounts')
def accountsHomepage():
    return redirect("/accounts/account-dashboard", code=302)

# Register for a new PN account
@app.route('/accounts/register')
def registerAccount():
    return render_template('Accounts/register.html')

@app.route('/accounts/email/account-created-success')
def createdAccountSuccessfully():
    return render_template('Accounts/email/account-created-success.html')

@app.route('/accounts/email/activate')
def activateEmailAddress():
    return render_template('Accounts/email/activate-email-address.html')

@app.route('/accounts/email/resend-email-code')
def resendEmailCode():
    return render_template('Accounts/email/resend-confirmation-code.html')

@app.route('/accounts/email/enter-manual-confirmation-code')
def enterManualConfirmationCode():
    return render_template('Accounts/email/enter-manual-confirmation-code.html')

@app.route('/accounts/login')
def login():
    return render_template('Accounts/login.html')

@app.route('/accounts/account-dashboard')
def accountDashboard():
    return render_template('Accounts/account-dashboard.html')

@app.route('/accounts/update/delete-account')
def deleteAccount():
    return render_template('Accounts/updates/delete-account.html')

@app.route('/accounts/update/change-username')
def changeUsername():
    return render_template('Accounts/updates/change-username.html')

@app.route('/accounts/update/change-password')
def changePassword():
    return render_template('Accounts/updates/change-password.html')

@app.route('/accounts/update/change-email-address')
def changeEmailAddress():
    return render_template('Accounts/updates/change-email-address.html')

@app.route('/accounts/forgot-password')
def forgotPassword():
    return render_template('Accounts/password/forgot-password.html')
@app.route('/accounts/reset-password')
def resetPassword():
    return render_template('Accounts/password/reset-password.html')

# Terms of service for PyroNeon Accounts
@app.route('/accounts/legal/terms-of-service')
def termsOfService():
    return render_template('Accounts/legal/tos.html')

# Privacy policy for PyroNeon Accounts
@app.route('/accounts/legal/privacy-policy')
def privacyPolicy():
    return render_template('Accounts/legal/privacy-policy.html')



# Handles users entering a wrong link or other 404 errors.
@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('PyroNeon/404.html'), 404

# Registers the 404 error handler
app.register_error_handler(404, page_not_found)

# Runs the program, accepting traffic from any ip address
if __name__ == "__main__":
    app.run(host="0.0.0.0")
