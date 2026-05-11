from flask import request, jsonify
from app import app, db
from models import User, Feedback, FAQ, Response
from werkzeug.security import generate_password_hash, check_password_hash

# ===============================
# 1. REGISTER API
# ===============================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    ALLOWED_DOMAIN = '@pgcmuridke.edu.pk'
    if not data['email'].endswith(ALLOWED_DOMAIN):
        return jsonify({'message': 'Sirf college email allowed hai!'}), 400

    # Check karo email pehle se hai ya nahi
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_pw,
        role=data.get('role', 'student')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201

# ===============================
# 2. LOGIN API
# ===============================
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    return jsonify({
        'message': 'Login successful!',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200

# ===============================
# 3. FEEDBACK APIs
# ===============================
@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    
    new_feedback = Feedback(
        user_id=data['user_id'],
        category=data['category'],
        message=data['message'],
        title=data.get('title', ''),
        rating=data.get('rating', 0)

    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback submitted!'}), 201

@app.route('/feedback', methods=['GET'])
def get_feedback():
    feedbacks = Feedback.query.all()
    result = []
    for f in feedbacks:
        result.append({
            'id': f.id,
            'user_id': f.user_id,
            'category': f.category,
            'message': f.message,
            'status': f.status,
            'submitted_at': str(f.submitted_at)
        })
    return jsonify(result), 200

# ===============================
# 4. FAQ APIs
# ===============================
@app.route('/faq', methods=['GET'])
def get_faq():
    faqs = FAQ.query.all()
    result = []
    for f in faqs:
        result.append({
            'id': f.id,
            'question': f.question,
            'answer': f.answer
        })
    return jsonify(result), 200

@app.route('/faq', methods=['POST'])
def add_faq():
    data = request.get_json()
    new_faq = FAQ(
        question=data['question'],
        answer=data['answer']
    )
    db.session.add(new_faq)
    db.session.commit()
    return jsonify({'message': 'FAQ added!'}), 201

@app.route('/feedback/user/<int:user_id>', methods=['GET'])
def get_user_feedback(user_id):
    feedbacks = Feedback.query.filter_by(user_id=user_id).all()
    result = []
    for f in feedbacks:
        result.append({
            'id': f.id,
            'category': f.category,
            'message': f.message,
            'status': f.status,
            'submitted_at': str(f.submitted_at),
            'title': f.title,
            'rating': f.rating
        })
    return jsonify(result), 200    
 # ==============================
# ADMIN - Users Count
# ==============================
@app.route('/users/count', methods=['GET'])
def get_users_count():
    count = User.query.count()
    return jsonify({'count': count}), 200

# ==============================
# ADMIN - Get All Feedbacks
# ==============================
@app.route('/feedback/all', methods=['GET'])
def get_all_feedbacks():
    from datetime import datetime

    category  = request.args.get('category')
    from_date = request.args.get('from_date')
    to_date   = request.args.get('to_date')

    query = Feedback.query

    if category:
        query = query.filter(Feedback.category == category)

    if from_date:
        try:
            fd = datetime.strptime(from_date, '%Y-%m-%d')
            query = query.filter(Feedback.submitted_at >= fd)
        except ValueError:
            pass

    if to_date:
        try:
            td = datetime.strptime(to_date, '%Y-%m-%d')
            td = td.replace(hour=23, minute=59, second=59)
            query = query.filter(Feedback.submitted_at <= td)
        except ValueError:
            pass

    feedbacks = query.order_by(Feedback.submitted_at.desc()).all()

    return jsonify([{
        'id':           f.id,
        'title':        f.title,
        'category':     f.category,
        'message':      f.message,
        'rating':       f.rating,
        'status':       f.status,
        'submitted_at': str(f.submitted_at)
    } for f in feedbacks])
@app.route('/feedback/<int:id>', methods=['GET'])
def get_feedback_by_id(id):
    feedback = Feedback.query.get(id)
    if feedback:
        return jsonify({
            'id': feedback.id,
            'title': feedback.title,
            'category': feedback.category,
            'message': feedback.message,
            'status': feedback.status,
            'rating': feedback.rating,
            'submitted_at': str(feedback.submitted_at)
        }), 200
    return jsonify({'error': 'Not found'}), 404
@app.route('/feedback/<int:id>/status', methods=['PUT'])
def update_feedback_status(id):
    data = request.get_json()
    feedback = Feedback.query.get(id)
    if feedback:
        feedback.status = data['status']
        db.session.commit()
        return jsonify({'message': 'Status updated'}), 200
    return jsonify({'error': 'Not found'}), 404
@app.route('/feedback/<int:id>/reply', methods=['POST'])
def add_reply(id):
    data = request.get_json()
    new_response = Response(
        feedback_id=id,
        admin_id=data['admin_id'],
        message=data['message']
    )
    db.session.add(new_response)
    db.session.commit()
    return jsonify({'message': 'Reply added!'}), 201

@app.route('/feedback/<int:id>/replies', methods=['GET'])
def get_replies(id):
    replies = Response.query.filter_by(feedback_id=id).all()
    result = []
    for r in replies:
        admin = User.query.get(r.admin_id)
        result.append({
            'id': r.id,
            'message': r.message,
            'admin_email': admin.email if admin else 'Admin',
            'responded_at': str(r.responded_at)
        })
    return jsonify(result), 200