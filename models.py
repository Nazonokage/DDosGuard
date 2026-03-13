from database import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name       = db.Column(db.String(255), nullable=False)
    email      = db.Column(db.String(255), unique=True, nullable=False)
    password   = db.Column(db.String(255), nullable=False)
    address    = db.Column(db.Text, nullable=True)
    work       = db.Column(db.String(255), nullable=True)
    company    = db.Column(db.String(255), nullable=True)
    type       = db.Column(db.String(50), default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    feedbacks  = db.relationship("Feedback", backref="author", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":         self.id,
            "name":       self.name,
            "email":      self.email,
            "address":    self.address,
            "work":       self.work,
            "company":    self.company,
            "type":       self.type,
            "created_at": self.created_at.isoformat(),
        }


class Feedback(db.Model):
    __tablename__ = "feedback"

    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message    = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "user_id":    self.user_id,
            "name":       self.author.name if self.author else "Unknown",
            "message":    self.message,
            "created_at": self.created_at.isoformat(),
        }
