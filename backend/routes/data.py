from flask import Blueprint, request, jsonify
from models import  DailyData
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import func
from dotenv import load_dotenv
import os
import cohere
from openai import OpenAI
import json

data_bp = Blueprint('data', __name__, url_prefix='/data')

load_dotenv()
co = cohere.Client("HCpjrF88IxJNE3kwA6lyOZYxapJ4qB6psPf2oeKA")
@data_bp.route('/add/<int:user_id>', methods=['POST'])
def add_data(user_id):
    data = request.json
    new_entry = DailyData(
        user_id = user_id,
        date=datetime.utcnow().date(),
        travel=data['travel'],
        food=data['food'],
        waste=data['waste'],
        electricity=data['electricity']
    )
    existing = DailyData.query.filter_by(user_id=user_id, date=datetime.utcnow().date()).first()
    if existing:
        return jsonify({'message': 'Data for today already exists'}), 400
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Data added'}), 201

@data_bp.route('/chart/<int:user_id>/<string:filter_type>', methods=['GET'])
def get_chart_data(user_id, filter_type):
    now = datetime.utcnow().date()
    print(user_id)
    print(filter_type)
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
    recent_data = DailyData.query.filter(
        DailyData.user_id == user_id,
        DailyData.date >= datetime.utcnow().date() - timedelta(days=30)
    ).all()

    if not recent_data:
        return jsonify({'message': 'No data found'}), 404

    # Summarize total emissions
    summary = {
        'travel': sum(d.travel for d in recent_data),
        'food': sum(d.food for d in recent_data),
        'waste': sum(d.waste for d in recent_data),
        'electricity': sum(d.electricity for d in recent_data)
    }

    prompt = f"""
    A user has emitted the following carbon emissions over the past 30 days:
    - Travel: {summary['travel']} kg CO2
    - Food: {summary['food']} kg CO2
    - Waste: {summary['waste']} kg CO2
    - Electricity: {summary['electricity']} kg CO2

    Based on this data:
    1. Suggest 3 priority actions with high CO2 savings.
       Each should include: title, impact (High/Medium/Low), effort, estimated daily CO2 savings, and a short description.
    2. Recommend 3–5 actionable tips each for:
       - Transportation
       - Food & Diet
       - Energy Usage
       - Waste Reduction

    Return the result as a valid JSON in this format:
    {{
      "priority_actions": [
        {{
          "title": "...",
          "impact": "...",
          "effort": "...",
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
    Only return the JSON. No extra explanation.
    """

    try:
        response = co.chat(
            model="command-r",
            message=prompt,
            chat_history=[],
            temperature=0.7
        )

        json_text = response.text.strip()
        structured_data = json.loads(json_text)
        print(structured_data)
        return jsonify(structured_data)

    except json.JSONDecodeError:
        return jsonify({"error": "Cohere response was not valid JSON", "raw": json_text}), 500
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

