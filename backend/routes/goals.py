from flask import Blueprint, jsonify, request
from models import Goal, db
from datetime import datetime

goals_bp = Blueprint('goals', __name__)

def add_sample_goals(user_id):
    from models import Goal
    sample_goals = [
        Goal(user_id=user_id, title="Use public transport for a week", category="transport", points=20),
        Goal(user_id=user_id, title="Eat vegetarian meals 3 times a week", category="food", points=15),
        Goal(user_id=user_id, title="Turn off unused lights", category="electricity", points=10),
    ]
    db.session.bulk_save_objects(sample_goals)
    db.session.commit()

# Fetch all goals for a user
@goals_bp.route('/goals/<int:user_id>', methods=['GET'])
def get_goals(user_id):
    goals = Goal.query.filter_by(user_id=user_id).all()
    goal_list = []
    for g in goals:
        goal_list.append({
            'id': g.id,
            'title': g.title,
            'description': g.description,
            'category': g.category,
            'points': g.points,
            'completed': g.completed,
            'dateCompleted': g.date_completed.isoformat() if g.date_completed else None
        })
    return jsonify(goal_list), 200

# Mark goal as complete
@goals_bp.route('/goals/complete/<int:goal_id>', methods=['POST'])
def complete_goal(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
    goal.completed = True
    goal.date_completed = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Goal marked as complete'}), 200

# Optional: Add a goal
@goals_bp.route('/goals/<int:user_id>', methods=['POST'])
def add_goal(user_id):
    data = request.json
    goal = Goal(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        category=data.get('category', 'general'),
        points=data.get('points', 10)
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify({'message': 'Goal added'}), 201
