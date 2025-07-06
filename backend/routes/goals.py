from flask import Blueprint, jsonify, request
from models import Goal
from extensions import db
from datetime import datetime,timedelta
from models import User,DailyData
from sqlalchemy import desc
import cohere
import json

goals_bp = Blueprint('goals', __name__)
co = cohere.Client("HCpjrF88IxJNE3kwA6lyOZYxapJ4qB6psPf2oeKA")
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
@goals_bp.route('/goals/complete/<int:user_id>/<int:goal_id>', methods=['PATCH'])
def complete_goal(user_id, goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404

    if goal.completed:
        return jsonify({'message': 'Goal already completed'}), 200

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update goal completion
    goal.completed = True
    goal.date_completed = datetime.utcnow()

    # Award points (use goal.points if it exists, else default to 10)
    awarded_points = getattr(goal, 'points', 10) or 10
    user.totalPoints = user.totalPoints + awarded_points
    print(user.totalPoints)

    db.session.commit()

    return jsonify({
        'message': 'Goal marked as complete',
        'awarded_points': awarded_points,
        'new_total_points': user.totalPoints
    }), 200

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

@goals_bp.route('/generate_goals/<int:user_id>', methods=['POST'])
def generate_goals(user_id):

    latest_goal = Goal.query.filter_by(user_id=user_id).order_by(desc(Goal.generated_at)).first()
    if latest_goal and (datetime.utcnow() - latest_goal.generated_at).days < 7:
        return jsonify({'message': 'Goals already generated recently'}), 200

    recent_data = DailyData.query.filter(
        DailyData.user_id == user_id,
        DailyData.date >= datetime.utcnow().date() - timedelta(days=14)
    ).all()

    if not recent_data:
        return jsonify({'message': 'Not enough data to generate goals'}), 400

    # Step 2: Summarize categories
    summary = {
        'travel': sum(d.travel for d in recent_data),
        'food': sum(d.food for d in recent_data),
        'waste': sum(d.waste for d in recent_data),
        'electricity': sum(d.electricity for d in recent_data),
    }

    # Step 3: Prompt for co.chat
    prompt = f"""
You are an expert environmental assistant. A user has emitted the following carbon emissions in the last 14 days:
- Travel: {summary['travel']} kg CO2
- Food: {summary['food']} kg CO2
- Waste: {summary['waste']} kg CO2
- Electricity: {summary['electricity']} kg CO2

Based on this data, suggest 3 to 5 personalized, actionable sustainability goals that can help reduce their carbon footprint.

For each goal, provide:
- title (string)
- description (string)
- category: one of ['travel', 'food', 'waste', 'electricity']
- points (integer between 10 and 30)

Return only a valid JSON array of objects in the following format:
[
  {{
    "title": "...",
    "description": "...",
    "category": "...",
    "points": 20
  }}
]
No explanation or preamble. Only return the JSON.
"""

    try:
        response = co.chat(
            message=prompt,
            model="command-r",
            temperature=0.7,
            chat_history=[],
        )

        raw_text = response.text.strip()

        # Try parsing as JSON
        goals = json.loads(raw_text)
        print(goals)
        saved_goals = []
        for g in goals:
            goal = Goal(
                user_id=user_id,
                title=g['title'],
                description=g.get('description', ''),
                category=g.get('category', 'general'),
                points=int(g.get('points', 10))
            )
            db.session.add(goal)
            saved_goals.append({
                'title': goal.title,
                'description': goal.description,
                'category': goal.category,
                'points': goal.points
            })

        db.session.commit()

        return jsonify({
            'message': 'Goals generated and saved successfully',
            'goals': saved_goals
        }), 201

    except json.JSONDecodeError:
        return jsonify({'error': 'Response from Cohere was not valid JSON', 'raw': raw_text}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
