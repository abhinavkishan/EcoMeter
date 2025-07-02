from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = 'your-secret-key'

db = SQLAlchemy(app)

from routes import auth, data
from routes.goals import goals_bp
from routes.rewards import rewards_bp


app.register_blueprint(rewards_bp)
app.register_blueprint(auth.auth_bp)
app.register_blueprint(data.data_bp)
app.register_blueprint(goals_bp)

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
