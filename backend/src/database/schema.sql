-- Module Levels (A1-A2, B1-B2, etc.)
CREATE TABLE module_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL UNIQUE,  -- e.g., 'A1-A2', 'B1-B2'
    slug VARCHAR(20) NOT NULL UNIQUE,  -- e.g., 'beginner', 'intermediate'
    display_order INT NOT NULL,    -- 1, 2, 3, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules
CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    sequence INT NOT NULL,         -- Order within the level
    points INT NOT NULL DEFAULT 50, -- Points awarded for completion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(level_id, sequence),
    FOREIGN KEY (level_id) REFERENCES module_levels(id)
);

-- Module Slides
CREATE TABLE module_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,             -- HTML/Markdown content
    sequence INT NOT NULL,         -- Order within the module
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_id, sequence),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Module Quiz Questions
CREATE TABLE module_quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL DEFAULT 'multiple_choice',
    options JSON NOT NULL,            -- Array of possible answers
    correct_answer TEXT NOT NULL,      -- The correct answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- User Module Progress
CREATE TABLE user_module_progress (
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Test Questions
CREATE TABLE test_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL DEFAULT 'multiple_choice',
    options JSON NOT NULL,            -- Array of possible answers
    correct_answer TEXT NOT NULL,      -- The correct answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- User Test Progress
CREATE TABLE user_test_progress (
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, test_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_modules_level_id ON modules(level_id);
CREATE INDEX idx_module_slides_module_id ON module_slides(module_id);
CREATE INDEX idx_module_quiz_questions_module_id ON module_quiz_questions(module_id);
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module_id ON user_module_progress(module_id);
CREATE INDEX idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX idx_user_test_progress_user_id ON user_test_progress(user_id);
CREATE INDEX idx_user_test_progress_test_id ON user_test_progress(test_id); 