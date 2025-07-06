from flask import Blueprint, request, jsonify
from models import User
from extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 400

    base_footprints = {
        'urban': 12.5,
        'suburban': 16.2,
        'rural': 18.8
    }
    location = data.get('location_type', '').lower()
    multiplier = base_footprints.get(location, 15.0)
    size = data.get('household_size', 1)
    baseline = multiplier * size

    user = User(
        username=data['username'],
        password=data['password'],
        full_name=data['full_name'],
        location_type=location,
        household_size=size,
        baseline_footprint=baseline,
        setup_complete=True,
        totalPoints=0
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'full_name': user.full_name,
        'totalPoints': user.totalPoints
    }), 200