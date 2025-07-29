from extensions import db
from app import app  
import models

def init_badges():
    badge_defs = {
        '10_goals': ('Goal Getter', 'Complete 10 goals', '🎯'),
        '1000_points': ('Point Master', 'Earn 1000 total points', '🏅'),
        '5_goals': ('Starter', 'Complete 5 goals', '🚀'),
        '500_points': ('Rising Star', 'Earn 500 points', '⭐'),
        'first_goal': ('First Step', 'Complete your first goal', '👣'),
        '50_goals': ('Achiever', 'Complete 50 goals', '🏆'),
        '2000_points': ('Elite Performer', 'Earn 2000 points', '🥇'),
        '25_goals': ('Goal Chaser', 'Complete 25 goals', '🏃'),
        '750_points': ('Almost There', 'Earn 750 points', '⏳'),
        '100_goals': ('Legend', 'Complete 100 goals', '👑'),
    }

    for key, (name, desc, icon) in badge_defs.items():
        existing = Badge.query.filter_by(name=name).first()
        if not existing:
            db.session.add(Badge(name=name, description=desc, icon=icon))

    db.session.commit()


with app.app_context():
    db.drop_all()   
    db.create_all() 
