from flask import Blueprint, jsonify
from models import User, Goal, Badge
from extensions import db
from sqlalchemy.sql import func
from datetime import datetime

rewards_bp = Blueprint('rewards', __name__)

def evaluate_badges(user_id):
    user_goals = Goal.query.filter_by(user_id=user_id, completed=True).all()
    total_points = sum(goal.points for goal in user_goals)
    total_completed = len(user_goals)

    badge_defs = {
        '10_goals': ('Goal Getter', 'Complete 10 goals', '🎯'),
        '1000_points': ('Point Master', 'Earn 1000 total points', '🏅')
    }

    for criteria, (name, desc, icon) in badge_defs.items():
        already = Badge.query.filter_by(user_id=user_id, name=name).first()
        if already and already.earned:
            continue

        if criteria == '10_goals' and total_completed >= 10:
            badge = Badge(name=name, description=desc, icon=icon, earned=True, user_id=user_id, earned_date=datetime.utcnow())
            db.session.add(badge)
        elif criteria == '1000_points' and total_points >= 1000:
            badge = Badge(name=name, description=desc, icon=icon, earned=True, user_id=user_id, earned_date=datetime.utcnow())
            db.session.add(badge)

    db.session.commit()

@rewards_bp.route('/rewards/<int:user_id>', methods=['GET'])
def get_rewards(user_id):
    # User total points
    user_goals = Goal.query.filter_by(user_id=user_id, completed=True).all()
    total_points = sum(g.points for g in user_goals)

    # Earned badges
    earned_badges = Badge.query.filter_by(user_id=user_id, earned=True).all()
    available_badges = Badge.query.filter_by(user_id=user_id, earned=False).all()

    # Leaderboard (top 5 users)
    leaderboard = (
        db.session.query(
            User.id,
            User.username,
            func.sum(Goal.points).label('points')
        )
        .join(Goal, Goal.user_id == User.id)
        .filter(Goal.completed == True)
        .group_by(User.id)
        .order_by(func.sum(Goal.points).desc())
        .limit(5)
        .all()
    )

    leaderboard_data = []
    for idx, u in enumerate(leaderboard, start=1):
        leaderboard_data.append({
            'rank': idx,
            'name': u.username,
            'points': int(u.points),
            'avatar': '👤',  # Optionally customize
            'isUser': u.id == user_id
        })

    return jsonify({
        'totalPoints': total_points,
        'earnedBadges': [
            {
                'id': b.id,
                'name': b.name,
                'description': b.description,
                'icon': b.icon,
                'earnedDate': b.earned_date.isoformat() if b.earned_date else None
            } for b in earned_badges
        ],
        'availableBadges': [
            {
                'id': b.id,
                'name': b.name,
                'description': b.description,
                'icon': b.icon
            } for b in available_badges
        ],
        'leaderboard': leaderboard_data
    }), 200
