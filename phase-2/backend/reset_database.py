"""
Script to properly reset the database with correct schema for integer IDs
"""
import os
import sys
from sqlmodel import SQLModel, create_engine
from src.database.database import DATABASE_URL
from src import models

def reset_database():
    print("Resetting database with correct schema...")

    # Check if we have the database URL
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("ERROR: DATABASE_URL environment variable is not set!")
        print("Please set your PostgreSQL database URL in the .env file")
        return False

    print(f"Using database: {db_url}")

    try:
        # Create engine
        engine = create_engine(db_url, echo=True)

        # Drop all tables first
        print("Dropping all existing tables...")
        SQLModel.metadata.drop_all(engine)
        print("All tables dropped successfully.")

        # Create all tables with new schema
        print("Creating tables with integer ID schema...")
        SQLModel.metadata.create_all(engine)
        print("Tables created successfully with new schema!")

        # Verify the tables were created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Created tables: {tables}")

        if 'tasks' in tables and 'conversations' in tables and 'messages' in tables:
            print("\n✅ Database reset completed successfully!")
            print("✅ New schema created with integer primary keys for tasks, conversations, and messages.")
            print("\nYou can now run the application with the correct database schema.")
            return True
        else:
            print("\n❌ Some tables were not created properly.")
            return False

    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = reset_database()
    sys.exit(0 if success else 1)