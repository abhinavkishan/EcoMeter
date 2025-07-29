from flask import Blueprint, jsonify
from models import User, Goal, Badge, UserBadge
from extensions import db
from sqlalchemy.sql import func
from datetime import datetime

rewards_bp = Blueprint('rewards', __name__)

# Updated badge definitions with name, description, and icon
badge_defs = {
    'first_goal': ('First Step', 'Complete your first goal', '👣'),
    '5_goals': ('Starter', 'Complete 5 goals', '🚀'),
    '10_goals': ('Goal Getter', 'Complete 10 goals', '🎯'),
    '25_goals': ('Goal Chaser', 'Complete 25 goals', '🏃'),
    '50_goals': ('Achiever', 'Complete 50 goals', '🏆'),
    '100_goals': ('Legend', 'Complete 100 goals', '👑'),
    '500_points': ('Rising Star', 'Earn 500 points', '⭐'),
    '750_points': ('Almost There', 'Earn 750 points', '⏳'),
    '1000_points': ('Point Master', 'Earn 1000 total points', '🏅'),
    '2000_points': ('Elite Performer', 'Earn 2000 points', '🥇'),
}

def evaluate_badges(user_id):
    user_goals = Goal.query.filter_by(user_id=user_id, completed=True).all()
    total_points = sum(goal.points for goal in user_goals)
    total_completed = len(user_goals)

    user_badge_ids = {ub.badge_id for ub in UserBadge.query.filter_by(user_id=user_id).all()}
    earned = []

    for key, (name, description, icon) in badge_defs.items():
        badge = Badge.query.filter_by(name=name).first()

        if not badge:
            badge = Badge(name=name, description=description, icon=icon)
            db.session.add(badge)
            db.session.flush()  # Ensures badge.id is available

        if badge.id in user_badge_ids:
            continue

        if key == 'first_goal' and total_completed >= 1:
            pass
        elif key.endswith('_goals') and total_completed >= int(key.split('_')[0]):
            pass
        elif key.endswith('_points') and total_points >= int(key.split('_')[0]):
            pass
        else:
            continue

        user_badge = UserBadge(user_id=user_id, badge_id=badge.id, earned_date=datetime.utcnow())
        db.session.add(user_badge)
        earned.append(user_badge)

    db.session.commit()
    return earned

@rewards_bp.route('/rewards/<int:user_id>', methods=['GET'])
def get_rewards(user_id):
    user_goals = Goal.query.filter_by(user_id=user_id, completed=True).all()
    total_points = sum(g.points for g in user_goals)
    
    # Evaluate and assign new badges
    newly_earned = evaluate_badges(user_id)

    # All earned badges for user
    earned_user_badges = UserBadge.query.filter_by(user_id=user_id).all()
    earned_badge_ids = {ub.badge_id for ub in earned_user_badges}
    earned_badges = [ub.badge for ub in earned_user_badges]

    # All badges from DB
    all_badges = Badge.query.all()

    # Available = All - Earned
    available_badges = [b for b in all_badges if b.id not in earned_badge_ids]

    # Leaderboard
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
            'avatar': '👤',
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
                'earnedDate': next((ub.earned_date.isoformat() for ub in earned_user_badges if ub.badge_id == b.id), None)
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

        'allBadges': [
            {
                'id': b.id,
                'name': b.name,
                'description': b.description,
                'icon': b.icon
            } for b in all_badges
        ],

        'leaderboard': leaderboard_data
    }), 200
