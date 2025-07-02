from flask import Blueprint, request, jsonify
from models import db, DailyData
from datetime import datetime, timedelta
from sqlalchemy import func
from dotenv import load_dotenv
import os
import openai

data_bp = Blueprint('data', __name__, url_prefix='/data')

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

@data_bp.route('/add', methods=['POST'])
def add_data():
    data = request.json
    new_entry = DailyData(
        user_id=data['user_id'],
        date=datetime.utcnow().date(),
        travel=data['travel'],
        food=data['food'],
        waste=data['waste'],
        electricity=data['electricity']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Data added'}), 201

@data_bp.route('/chart/<int:user_id>/<string:filter_type>', methods=['GET'])
def get_chart_data(user_id, filter_type):
    now = datetime.utcnow().date()

    if filter_type == 'weekly':
        start_date = now - timedelta(days=7)
    elif filter_type == 'monthly':
        start_date = now - timedelta(days=30)
    else:
        start_date = now - timedelta(days=1)

    records = DailyData.query.filter(
        DailyData.user_id == user_id,
        DailyData.date >= start_date
    ).all()

    result = []
    for record in records:
        result.append({
            'date': record.date.strftime('%Y-%m-%d'),
            'travel': record.travel,
            'food': record.food,
            'waste': record.waste,
            'electricity': record.electricity,
            'total': record.travel + record.food + record.waste + record.electricity
        })
    return jsonify(result)

@data_bp.route('/fact', methods=['GET'])
def get_daily_fact():
    import random
    facts = [
        "If everyone recycled newspapers, we could save over 250 million trees each year.",
        "Turning off your computer at night can save up to 40 watts per hour.",
        "Reducing meat consumption reduces greenhouse gas emissions.",
        "Using public transport can reduce your footprint by 30%.",
    ]
    return jsonify({'fact': random.choice(facts)})

@data_bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    # Fetch recent user data (last 30 days)
    from datetime import datetime, timedelta
    recent_data = DailyData.query.filter(
        DailyData.user_id == user_id,
        DailyData.date >= datetime.utcnow().date() - timedelta(days=30)
    ).all()

    if not recent_data:
        return jsonify({'message': 'No data found'}), 404

    # Summarize total emissions by category
    summary = {
        'travel': sum(d.travel for d in recent_data),
        'food': sum(d.food for d in recent_data),
        'waste': sum(d.waste for d in recent_data),
        'electricity': sum(d.electricity for d in recent_data)
    }

    prompt = f"""
    You are an environmental advisor AI. A user has emitted the following total carbon over the last 30 days:
    - Travel: {summary['travel']} kg
    - Food: {summary['food']} kg
    - Waste: {summary['waste']} kg
    - Electricity: {summary['electricity']} kWh

    Based on this data:
    1. Suggest **3 priority actions** with high CO2 savings (format: title, impact, effort, estimated CO2 saved daily, short description).
    2. Give 3–5 actionable tips each for these categories: Transportation, Food & Diet, Energy Usage, Waste Reduction.
    3. Return the output as a **structured JSON** in this format:
    {{
      "priority_actions": [
        {{
          "title": "...",
          "impact": "High",
          "effort": "Medium",
          "co2Savings": "...",
          "description": "..."
        }}
      ],
      "recommendations": [
        {{
          "category": "...",
          "tips": ["...", "..."]
        }}
      ]
    }}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You generate eco-friendly recommendations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        reply = response['choices'][0]['message']['content']
        import json
        structured_data = json.loads(reply)
        return jsonify(structured_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
