from flask import Flask
from flask_cors import CORS
from extensions import db

# Import blueprints after db is initialized
from routes import auth, data
from routes.goals import goals_bp
from routes.rewards import rewards_bp

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Optional, suppresses warning
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize extensions
db.init_app(app)

# Register Blueprints
app.register_blueprint(auth.auth_bp)
app.register_blueprint(data.data_bp)
app.register_blueprint(goals_bp)
app.register_blueprint(rewards_bp)

# Create tables and run app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
