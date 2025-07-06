from app import app
from extensions import db
from models import Goal

with app.app_context():
    Goal.query.delete()
    db.session.commit()
    print("✅ All goals deleted.")
