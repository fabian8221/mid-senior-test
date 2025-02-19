-- Seed Users
-- Note: Passwords are hashed versions of 'password123' using bcrypt
INSERT INTO users (name, email, password) 
VALUES 
    -- Admin user (admin@admin.com / password123)
    ('Admin User', 'admin@admin.com', '$2a$10$zPiUWYnqt6jFVH0HKGRHGOiAqF3fQYbxP7Q4cOHxP9c6YY1Ub7o1m'),
    
    -- Regular users (user1@example.com / password123)
    ('John Doe', 'user1@example.com', '$2a$10$zPiUWYnqt6jFVH0HKGRHGOiAqF3fQYbxP7Q4cOHxP9c6YY1Ub7o1m'),
    ('Jane Smith', 'user2@example.com', '$2a$10$zPiUWYnqt6jFVH0HKGRHGOiAqF3fQYbxP7Q4cOHxP9c6YY1Ub7o1m'),
    ('Bob Wilson', 'user3@example.com', '$2a$10$zPiUWYnqt6jFVH0HKGRHGOiAqF3fQYbxP7Q4cOHxP9c6YY1Ub7o1m')
ON CONFLICT (email) DO NOTHING;

-- Seed some sample loans
INSERT INTO loans (user_id, amount, purpose, duration, status, remaining_balance)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'user1@example.com' THEN 5000
        WHEN u.email = 'user2@example.com' THEN 10000
        ELSE 15000
    END,
    CASE 
        WHEN u.email = 'user1@example.com' THEN 'Home Renovation'
        WHEN u.email = 'user2@example.com' THEN 'Business Expansion'
        ELSE 'Education'
    END,
    12,
    'Approved',
    CASE 
        WHEN u.email = 'user1@example.com' THEN 5000
        WHEN u.email = 'user2@example.com' THEN 10000
        ELSE 15000
    END
FROM users u
WHERE u.email IN ('user1@example.com', 'user2@example.com', 'user3@example.com');

-- Seed some sample payments
INSERT INTO payments (loan_id, amount_paid, payment_date)
SELECT 
    l.id,
    1000,
    CURRENT_DATE - INTERVAL '1 month'
FROM loans l
JOIN users u ON l.user_id = u.id
WHERE u.email = 'user1@example.com'; 