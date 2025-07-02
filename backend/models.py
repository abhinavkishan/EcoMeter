from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))
    location = db.Column(db.String(100))

class DailyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.Date)
    travel = db.Column(db.Float)
    food = db.Column(db.Float)
    waste = db.Column(db.Float)
    electricity = db.Column(db.Float)

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300))
    category = db.Column(db.String(50))  # 'transport', 'food', etc.
    points = db.Column(db.Integer, default=10)
    completed = db.Column(db.Boolean, default=False)
    date_completed = db.Column(db.DateTime)


class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(10), nullable=False)  # Use emoji or icon name
    criteria = db.Column(db.String(100))  # Like "10_goals", "1000_points", etc.
    earned = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    earned_date = db.Column(db.DateTime)

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(10), nullable=False)  # Use emoji or icon name
    criteria = db.Column(db.String(100))  # Like "10_goals", "1000_points", etc.
    earned = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    earned_date = db.Column(db.DateTime)