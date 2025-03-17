# models.py - Database models
from flask_sqlalchemy import SQLAlchemy
import hashlib  # Import hashlib for SHA-256 hashing

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'  # Explicitly set the table name to 'users'
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)
    work = db.Column(db.String(100))
    company = db.Column(db.String(100))  # New column for company/workplace
    account_type = db.Column(db.Enum("Client", "Admin"), default="Client")
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def set_password(self, password):
        """Hash the password using SHA-256."""
        self.password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

    def check_password(self, password):
        """Verify the password using SHA-256."""
        return self.password_hash == hashlib.sha256(password.encode('utf-8')).hexdigest()

class Feedback(db.Model):
    __tablename__ = 'feedback'
    fb_id = db.Column(db.Integer, primary_key=True)  # Match the column name in the SQL table
    user_id = db.Column(db.Integer, db.ForeignKey("users.uid", ondelete="CASCADE"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

class IPTracking(db.Model):
    __tablename__ = 'ip_tracking'  # Explicitly set the table name to 'ip_tracking'
    ip_id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), unique=True, nullable=False)
    status = db.Column(db.Enum("unmarked", "attempted", "blocked"), default="unmarked")
    attempt_count = db.Column(db.Integer, default=0)
    first_attempt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    last_attempt = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    block_reason = db.Column(db.Text)
    blocked_until = db.Column(db.TIMESTAMP, nullable=True)