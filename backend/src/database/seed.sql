-- Insert Modules
INSERT INTO modules (level_id, title, description, sequence) VALUES
(1, 'The Alphabet', 'Learn about the English alphabet and its letters', 1),
(1, 'Basic Numbers', 'Introduction to numbers and counting', 2),
(1, 'Common Greetings', 'Learn how to greet people in English', 3);

-- Insert additional Modules for A1-A2 (level_id = 1)
INSERT INTO modules (level_id, title, description, sequence) VALUES
(1, 'Module 4', 'Description for Module 4', 4),
(1, 'Module 5', 'Description for Module 5', 5),
(1, 'Module 6', 'Description for Module 6', 6),
(1, 'Module 7', 'Description for Module 7', 7),
(1, 'Module 8', 'Description for Module 8', 8),
(1, 'Module 9', 'Description for Module 9', 9),
(1, 'Module 10', 'Description for Module 10', 10),
(1, 'Module 11', 'Description for Module 11', 11),
(1, 'Module 12', 'Description for Module 12', 12),
(1, 'Module 13', 'Description for Module 13', 13),
(1, 'Module 14', 'Description for Module 14', 14),
(1, 'Module 15', 'Description for Module 15', 15);

-- Insert Modules for B1-B2 (level_id = 2)
INSERT INTO modules (level_id, title, description, sequence) VALUES
(2, 'Module 1', 'Description for Module 1', 1),
(2, 'Module 2', 'Description for Module 2', 2),
(2, 'Module 3', 'Description for Module 3', 3),
(2, 'Module 4', 'Description for Module 4', 4),
(2, 'Module 5', 'Description for Module 5', 5),
(2, 'Module 6', 'Description for Module 6', 6),
(2, 'Module 7', 'Description for Module 7', 7),
(2, 'Module 8', 'Description for Module 8', 8),
(2, 'Module 9', 'Description for Module 9', 9),
(2, 'Module 10', 'Description for Module 10', 10),
(2, 'Module 11', 'Description for Module 11', 11),
(2, 'Module 12', 'Description for Module 12', 12),
(2, 'Module 13', 'Description for Module 13', 13),
(2, 'Module 14', 'Description for Module 14', 14),
(2, 'Module 15', 'Description for Module 15', 15);

-- Insert Modules for C1-C2 (level_id = 3)
INSERT INTO modules (level_id, title, description, sequence) VALUES
(3, 'Module 1', 'Description for Module 1', 1),
(3, 'Module 2', 'Description for Module 2', 2),
(3, 'Module 3', 'Description for Module 3', 3),
(3, 'Module 4', 'Description for Module 4', 4),
(3, 'Module 5', 'Description for Module 5', 5),
(3, 'Module 6', 'Description for Module 6', 6),
(3, 'Module 7', 'Description for Module 7', 7),
(3, 'Module 8', 'Description for Module 8', 8),
(3, 'Module 9', 'Description for Module 9', 9),
(3, 'Module 10', 'Description for Module 10', 10),
(3, 'Module 11', 'Description for Module 11', 11),
(3, 'Module 12', 'Description for Module 12', 12),
(3, 'Module 13', 'Description for Module 13', 13),
(3, 'Module 14', 'Description for Module 14', 14),
(3, 'Module 15', 'Description for Module 15', 15);

-- Insert Module Slides for "The Alphabet"
INSERT INTO module_slides (module_id, title, content, sequence) VALUES
(1, 'Introduction to the Alphabet', 'The alphabet consists of a lot of letters

The first of which is A.

There are a lot of other letters', 1),
(1, 'Vowels in the Alphabet', 'The alphabet can have vowels
These are letters: a, e, i, o, u', 2),
(1, 'Using Letters', 'Lots of letters are used!', 3);

-- Insert Quiz Questions for "The Alphabet"
INSERT INTO module_quiz_questions (module_id, question_text, question_type, options, correct_answer) VALUES
(1, 'What is the first letter of the alphabet?', 'multiple_choice', 
 '["A", "B", "C", "D"]', 'A'),
(1, 'Which of these is a vowel?', 'multiple_choice',
 '["B", "C", "A", "D"]', 'A'),
(1, 'Enter a vowel that you know', 'input',
 '[]', 'a'),
(1, 'How many vowels are there in the English alphabet?', 'multiple_choice',
 '["3", "4", "5", "6"]', '5'),
(1, 'Which letter comes after A?', 'multiple_choice',
 '["C", "B", "D", "E"]', 'B'),
(1, 'Enter any consonant', 'input',
 '[]', 'b'),
(1, 'Is the letter "E" a vowel?', 'multiple_choice',
 '["Yes", "No"]', 'Yes'),
(1, 'Which of these is not a vowel?', 'multiple_choice',
 '["A", "E", "B", "I"]', 'B'),
(1, 'Enter the last letter of the alphabet', 'input',
 '[]', 'z'),
(1, 'How many letters are in the English alphabet?', 'multiple_choice',
 '["24", "25", "26", "27"]', '26');

-- Insert Module Slides for "Basic Numbers"
INSERT INTO module_slides (module_id, title, content, sequence) VALUES
(2, 'Introduction to Numbers', 'Numbers are used to count things

The first number is 1', 1),
(2, 'Counting to Ten', 'Let us count from 1 to 10:
1, 2, 3, 4, 5, 6, 7, 8, 9, 10', 2),
(2, 'Using Numbers', 'Numbers are very useful in daily life!', 3);

-- Insert Quiz Questions for "Basic Numbers"
INSERT INTO module_quiz_questions (module_id, question_text, question_type, options, correct_answer) VALUES
(2, 'What is the first number?', 'multiple_choice',
 '["0", "1", "2", "3"]', '1'),
(2, 'Enter the number that comes after 5', 'input',
 '[]', '6'),
(2, 'How many numbers are there from 1 to 10?', 'multiple_choice',
 '["8", "9", "10", "11"]', '10'),
(2, 'What is 2 + 2?', 'multiple_choice',
 '["3", "4", "5", "6"]', '4'),
(2, 'Enter any number between 1 and 10', 'input',
 '[]', '7'),
(2, 'Is 0 a number?', 'multiple_choice',
 '["Yes", "No"]', 'Yes'),
(2, 'What comes after 9?', 'multiple_choice',
 '["8", "9", "10", "11"]', '10'),
(2, 'Enter the number that is half of 10', 'input',
 '[]', '5'),
(2, 'How many even numbers are there from 1 to 10?', 'multiple_choice',
 '["4", "5", "6", "7"]', '5'),
(2, 'What is 10 - 5?', 'multiple_choice',
 '["3", "4", "5", "6"]', '5');

-- Insert Module Slides for "Common Greetings"
INSERT INTO module_slides (module_id, title, content, sequence) VALUES
(3, 'Introduction to Greetings', 'Greetings are important in English

They help us start conversations', 1),
(3, 'Common Greetings', 'Here are some common greetings:
- Hello
- Hi
- Good morning
- Good afternoon
- Good evening', 2),
(3, 'Using Greetings', 'Use these greetings when you meet people!', 3);

-- Insert Quiz Questions for "Common Greetings"
INSERT INTO module_quiz_questions (module_id, question_text, question_type, options, correct_answer) VALUES
(3, 'Which greeting is most common?', 'multiple_choice',
 '["Good morning", "Hello", "Good evening", "Good afternoon"]', 'Hello'),
(3, 'Enter a greeting you would use in the morning', 'input',
 '[]', 'good morning'),
(3, 'Is "Hi" a greeting?', 'multiple_choice',
 '["Yes", "No"]', 'Yes'),
(3, 'Which greeting would you use at night?', 'multiple_choice',
 '["Good morning", "Good afternoon", "Good evening", "Hello"]', 'Good evening'),
(3, 'Enter any greeting you know', 'input',
 '[]', 'hi'),
(3, 'Is "Goodbye" a greeting?', 'multiple_choice',
 '["Yes", "No"]', 'No'),
(3, 'Which greeting is most formal?', 'multiple_choice',
 '["Hi", "Hello", "Good morning", "Hey"]', 'Good morning'),
(3, 'Enter a greeting you would use in the afternoon', 'input',
 '[]', 'good afternoon'),
(3, 'Is "Hey" a greeting?', 'multiple_choice',
 '["Yes", "No"]', 'Yes'),
(3, 'Which greeting is most informal?', 'multiple_choice',
 '["Good morning", "Hello", "Hi", "Good afternoon"]', 'Hi');

-- Create tests table if not exists
CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sequence INT NOT NULL,
  FOREIGN KEY (level_id) REFERENCES module_levels(id)
);

-- Insert placeholder tests for A1-A2 (level_id = 1)
INSERT INTO tests (level_id, title, description, sequence) VALUES
(1, 'Test 1', 'Placeholder description 1', 1),
(1, 'Test 2', 'Placeholder description 2', 2),
(1, 'Test 3', 'Placeholder description 3', 3),
(1, 'Test 4', 'Placeholder description 4', 4),
(1, 'Test 5', 'Placeholder description 5', 5),
(1, 'Test 6', 'Placeholder description 6', 6),
(1, 'Test 7', 'Placeholder description 7', 7),
(1, 'Test 8', 'Placeholder description 8', 8),
(1, 'Test 9', 'Placeholder description 9', 9),
(1, 'Test 10', 'Placeholder description 10', 10);

-- Insert placeholder tests for B1-B2 (level_id = 2)
INSERT INTO tests (level_id, title, description, sequence) VALUES
(2, 'Test 1', 'Placeholder description 1', 1),
(2, 'Test 2', 'Placeholder description 2', 2),
(2, 'Test 3', 'Placeholder description 3', 3),
(2, 'Test 4', 'Placeholder description 4', 4),
(2, 'Test 5', 'Placeholder description 5', 5),
(2, 'Test 6', 'Placeholder description 6', 6),
(2, 'Test 7', 'Placeholder description 7', 7),
(2, 'Test 8', 'Placeholder description 8', 8),
(2, 'Test 9', 'Placeholder description 9', 9),
(2, 'Test 10', 'Placeholder description 10', 10);

-- Insert placeholder tests for C1-C2 (level_id = 3)
INSERT INTO tests (level_id, title, description, sequence) VALUES
(3, 'Test 1', 'Placeholder description 1', 1),
(3, 'Test 2', 'Placeholder description 2', 2),
(3, 'Test 3', 'Placeholder description 3', 3),
(3, 'Test 4', 'Placeholder description 4', 4),
(3, 'Test 5', 'Placeholder description 5', 5),
(3, 'Test 6', 'Placeholder description 6', 6),
(3, 'Test 7', 'Placeholder description 7', 7),
(3, 'Test 8', 'Placeholder description 8', 8),
(3, 'Test 9', 'Placeholder description 9', 9),
(3, 'Test 10', 'Placeholder description 10', 10);

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  xp INT DEFAULT 0
);

-- Insert placeholder users for leaderboard
INSERT INTO users (username, avatar_url, xp) VALUES
('James', NULL, 219),
('Альбина', NULL, 168),
('Kutay Küçük', NULL, 155),
('tu.8zPhLKpsSrIQh', NULL, 128),
('Sanaya Amar', NULL, 112),
('Gökay', NULL, 89),
('evelyn', NULL, 85),
('Ekaterina', NULL, 85),
('Noreen', NULL, 57),
('ぼ', NULL, 55),
('Toby', NULL, 55),
('Danieljohnstone', NULL, 53),
('K', NULL, 52),
('いおり', NULL, 49),
('DemoUser', NULL, 40);

-- Insert more placeholder users for leaderboard demo
INSERT INTO users (username, password, xp, modules_completed, tests_completed, completed_A_modules, completed_B_modules, completed_C_modules, completed_A_tests, completed_B_tests, completed_C_tests) VALUES
('Alice', NULL, 320, 15, 10, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE),
('Bob', NULL, 150, 10, 7, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Charlie', NULL, 275, 14, 9, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE),
('Diana', NULL, 90, 5, 3, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Eve', NULL, 210, 12, 8, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE),
('Frank', NULL, 60, 3, 2, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Grace', NULL, 180, 11, 6, FALSE, TRUE, FALSE, FALSE, TRUE, FALSE),
('Heidi', NULL, 240, 13, 8, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE),
('Ivan', NULL, 130, 8, 5, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('Judy', NULL, 300, 15, 10, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE); 