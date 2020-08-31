from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = '9881527bx0b22zy0c602dgde210wa328'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


if __name__ == '__main__':
    app.run(debug=True)