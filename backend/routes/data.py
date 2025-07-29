from flask import Blueprint, request, jsonify
from models import  DailyData
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import func
from dotenv import load_dotenv
import os
import cohere
from google import genai
from google.genai import types
import json
import re
# import requests

data_bp = Blueprint('data', __name__, url_prefix='/data')

load_dotenv()
# co = cohere.Client("HCpjrF88IxJNE3kwA6lyOZYxapJ4qB6psPf2oeKA")
client=genai.Client()


@data_bp.route('/add/<int:user_id>', methods=['POST'])
def add_data(user_id):
    data = request.json
    today = datetime.utcnow().date()

    # Check if data for today already exists
    existing = DailyData.query.filter_by(user_id=user_id, date=today).first()
    if existing:
        return jsonify({'message': 'Data for today already exists'}), 400

    # # --- Helper function to hit emission API ---
    # def get_emission(activity_id, value, unit):
    #     payload = {
    #         "emission_factor": {
    #             "activity_id": activity_id,
    #             "data_version": "^21"
    #         },
    #         "parameters": {
    #             "energy": value,
    #             "energy_unit": unit
    #         }
    #     }
    #     response = requests.post(
    #         "https://api.climatiq.io/data/v1/estimate",  # Replace with real URL
    #         json=payload,
    #         headers={"Authorization": "Bearer WYDCFEW94X7ZHDPZTT3ZN97F0G", "Content-Type": "application/json"}
    #     )
    #     if response.status_code == 200:
    #         return response.json().get("co2e", 0)  # Assuming 'co2e' is the emission result
        # return 0

    
    travel_emission = 0.192*data["travel"]
    food_emission = 2.5*data["food"]
    waste_emission = 1.5*data["waste"]
    electricity_emission = 4.5*data["electricity"]

    # --- Save emissions to DB ---
    new_entry = DailyData(
        user_id=user_id,
        date=today,
        travel=travel_emission,
        food=food_emission,
        waste=waste_emission,
        electricity=electricity_emission
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Emission data added'}), 201


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
    print("summary:",summary)

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
    "Return a JSON object with strict syntax. No comments or trailing commas."
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",  # or "gemini-2.5-flash" depending on availability
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                top_p=1
            )
        )
        # print(response)
        json_text = response.text.strip()
        print("Raw json text:\n",json_text)
        cleaned_json = re.sub(r"^```json\s*|\s*```$", "", json_text)
        structured_data = json.loads(cleaned_json)
        print("Recommendations: ",structured_data)
        return jsonify(structured_data)

    except json.JSONDecodeError:
        return jsonify({"error": "Gemini response was not valid JSON", "raw": json_text}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

