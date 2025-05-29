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

-- Insert Modules for B1-B2 (level_id = 2) with order_id
INSERT INTO modules (level_id, title, description, sequence, points, order_id) VALUES
(2, 'Past Simple Tense', 'Learn about the past simple tense and its usage in English', 1, 50, 1),
(2, 'Present Perfect', 'Master the present perfect tense and its applications', 2, 50, 2),
(2, 'Future Tenses', 'Explore different ways to express future actions', 3, 50, 3),
(2, 'Conditional Sentences', 'Learn about different types of conditional sentences', 4, 50, 4);

-- Insert Modules for C1-C2 (level_id = 3) with order_id
INSERT INTO modules (level_id, title, description, sequence, points, order_id) VALUES
(3, 'Reported Speech', 'Learn how to report what others have said', 1, 50, 1),
(3, 'Passive Voice', 'Master the passive voice and its various forms', 2, 50, 2),
(3, 'Modal Verbs', 'Explore the usage of modal verbs in different contexts', 3, 50, 3),
(3, 'Phrasal Verbs', 'Learn common phrasal verbs and their meanings', 4, 50, 4);

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

-- Insert test questions for Test 1 (A1-A2 level)
INSERT INTO test_questions (test_id, question_text, question_type, options, correct_answer) VALUES
(101, 'What is the first letter of the alphabet?', 'multiple_choice', '["A", "B", "C", "D"]', 'A'),
(101, 'Which of these is a vowel?', 'multiple_choice', '["B", "C", "A", "D"]', 'A'),
(101, 'Enter a vowel that you know', 'input', '[]', 'a'),
(101, 'How many vowels are there in the English alphabet?', 'multiple_choice', '["3", "4", "5", "6"]', '5'),
(101, 'Which letter comes after A?', 'multiple_choice', '["C", "B", "D", "E"]', 'B');

-- Level B Modules (Intermediate)
INSERT INTO modules (level_id, title, description, sequence, points) VALUES
(2, 'Past Simple Tense', 'Learn about the past simple tense and its usage in English', 1, 50),
(2, 'Present Perfect', 'Master the present perfect tense and its applications', 2, 50),
(2, 'Future Tenses', 'Explore different ways to express future actions', 3, 50),
(2, 'Conditional Sentences', 'Learn about different types of conditional sentences', 4, 50);

-- Level C Modules (Advanced)
INSERT INTO modules (level_id, title, description, sequence, points) VALUES
(3, 'Reported Speech', 'Learn how to report what others have said', 1, 50),
(3, 'Passive Voice', 'Master the passive voice and its various forms', 2, 50),
(3, 'Modal Verbs', 'Explore the usage of modal verbs in different contexts', 3, 50),
(3, 'Phrasal Verbs', 'Learn common phrasal verbs and their meanings', 4, 50);

-- Module Slides for Level B (order_id 1-4)
INSERT INTO module_slides (module_id, title, content, sequence) VALUES
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'Introduction to Past Simple', 'The past simple tense is used to describe completed actions in the past. It is formed by adding -ed to regular verbs or using the second form of irregular verbs.', 1),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'Regular Verbs', 'Example: I walked to school yesterday. (regular verb)\nShe went to the store last week. (irregular verb)', 2),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'Time Expressions', 'Time expressions often used with past simple: yesterday, last week, last month, in 2020, etc.', 3),

(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Introduction to Present Perfect', 'The present perfect tense connects the past with the present. It is formed using have/has + past participle.', 1),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Examples', 'Example: I have visited Paris three times.\nShe has never been to Asia.', 2),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Common Uses', 'Common uses: experiences, recent actions, actions that started in the past and continue to the present.', 3),

(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Introduction to Future Tenses', 'There are several ways to express future actions in English: will, going to, present continuous, and present simple.', 1),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Examples', 'Example: I will call you tomorrow. (spontaneous decision)\nI am going to study tonight. (planned action)', 2),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Future Arrangements', 'The present continuous is used for future arrangements: I am meeting John at 3 PM.', 3),

(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Introduction to Conditionals', 'Conditional sentences express hypothetical situations and their consequences. There are four main types.', 1),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Examples', 'Example: If it rains, I will stay home. (First conditional)\nIf I had money, I would buy a car. (Second conditional)', 2),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Third Conditional', 'The third conditional is used for past hypothetical situations: If I had studied, I would have passed the exam.', 3);

-- Module Slides for Level C (order_id 1-4)
INSERT INTO module_slides (module_id, title, content, sequence) VALUES
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'Introduction to Reported Speech', 'Reported speech is used to tell someone what another person said. We often need to change tenses and pronouns.', 1),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'Examples', 'Example: Direct: "I am happy."\nReported: She said she was happy.', 2),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'Questions in Reported Speech', 'When reporting questions, we use if/whether for yes/no questions and the original question word for wh-questions.', 3),

(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Introduction to Passive Voice', 'The passive voice is used when the focus is on the action rather than who performs it. It is formed with be + past participle.', 1),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Examples', 'Example: Active: The chef cooked the meal.\nPassive: The meal was cooked by the chef.', 2),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Uses of Passive Voice', 'The passive is often used in formal writing and when the agent is unknown or unimportant.', 3),

(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Introduction to Modal Verbs', 'Modal verbs express ability, possibility, permission, or obligation. They are followed by the base form of the verb.', 1),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Examples', 'Example: can (ability), may (permission), must (obligation), should (advice)', 2),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Modal Verb Rules', 'Modal verbs don\'t change form for third person singular and don\'t use do/does in questions.', 3),

(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'Introduction to Phrasal Verbs', 'Phrasal verbs are combinations of verbs and prepositions or adverbs that create new meanings.', 1),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'Examples', 'Example: give up (stop), look after (take care of), put off (postpone)', 2),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'Types of Phrasal Verbs', 'Some phrasal verbs are separable (put it off) while others are not (look after the children).', 3);

-- Quiz Questions for Level B (order_id 1-4)
INSERT INTO module_quiz_questions (module_id, question_text, question_type, options, correct_answer) VALUES
-- Past Simple Quiz
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'What is the past simple form of "go"?', 'multiple_choice', '["went", "gone", "goed", "going"]', 'went'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'Which sentence is in the past simple tense?', 'multiple_choice', '["I visit my grandparents", "I am visiting my grandparents", "I visited my grandparents last weekend", "I have visited my grandparents"]', 'I visited my grandparents last weekend'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'What is the past simple form of "write"?', 'multiple_choice', '["wrote", "written", "writed", "writing"]', 'wrote'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'Which time expression is NOT used with past simple?', 'multiple_choice', '["yesterday", "last week", "since 2020", "in 2019"]', 'since 2020'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 1, 'What is the past simple form of "eat"?', 'multiple_choice', '["ate", "eaten", "eated", "eating"]', 'ate'),

-- Present Perfect Quiz
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Which sentence is in the present perfect tense?', 'multiple_choice', '["I finish my homework", "I am finishing my homework", "I have finished my homework", "I finished my homework"]', 'I have finished my homework'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'What is the correct form of "be" in present perfect?', 'multiple_choice', '["has been", "have been", "is been", "was been"]', 'has been'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Which time expression is often used with present perfect?', 'multiple_choice', '["yesterday", "last week", "just", "in 2020"]', 'just'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'What is the past participle of "write"?', 'multiple_choice', '["wrote", "written", "writed", "writing"]', 'written'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 2, 'Which sentence shows an experience?', 'multiple_choice', '["I am in Paris", "I went to Paris", "I have been to Paris", "I will go to Paris"]', 'I have been to Paris'),

-- Future Tenses Quiz
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Which sentence uses "going to" for future?', 'multiple_choice', '["I will study tonight", "I am going to study tonight", "I am studying tonight", "I study tonight"]', 'I am going to study tonight'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'What is the correct form for a spontaneous decision?', 'multiple_choice', '["I am going to help you", "I will help you", "I am helping you", "I help you"]', 'I will help you'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Which sentence shows a future arrangement?', 'multiple_choice', '["I will meet John", "I am going to meet John", "I am meeting John at 3 PM", "I meet John"]', 'I am meeting John at 3 PM'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'What is the correct form for a scheduled event?', 'multiple_choice', '["The train will leave at 6 PM", "The train is going to leave at 6 PM", "The train leaves at 6 PM", "The train is leaving at 6 PM"]', 'The train leaves at 6 PM'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 3, 'Which sentence shows a prediction?', 'multiple_choice', '["It is going to rain tomorrow", "It will rain tomorrow", "It is raining tomorrow", "It rains tomorrow"]', 'It will rain tomorrow'),

-- Conditionals Quiz
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Which is a first conditional sentence?', 'multiple_choice', '["If it rains, I will stay home", "If it rained, I would stay home", "If it had rained, I would have stayed home", "If it rains, I stay home"]', 'If it rains, I will stay home'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'What is the correct form for a second conditional?', 'multiple_choice', '["If I have money, I will buy a car", "If I had money, I would buy a car", "If I had had money, I would have bought a car", "If I have money, I buy a car"]', 'If I had money, I would buy a car'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Which is a third conditional sentence?', 'multiple_choice', '["If I study, I will pass the exam", "If I studied, I would pass the exam", "If I had studied, I would have passed the exam", "If I study, I pass the exam"]', 'If I had studied, I would have passed the exam'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'What is the correct form for a zero conditional?', 'multiple_choice', '["If you heat water, it will boil", "If you heated water, it would boil", "If you had heated water, it would have boiled", "If you heat water, it boils"]', 'If you heat water, it boils'),
(SELECT id FROM modules WHERE level_id = 2 AND order_id = 4, 'Which sentence shows an impossible condition?', 'multiple_choice', '["If I am you, I will take the job", "If I were you, I would take the job", "If I had been you, I would have taken the job", "If I am you, I take the job"]', 'If I were you, I would take the job');

-- Quiz Questions for Level C (order_id 1-4)
INSERT INTO module_quiz_questions (module_id, question_text, question_type, options, correct_answer) VALUES
-- Reported Speech Quiz
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'What is the reported form of "I am happy"?', 'multiple_choice', '["She said she is happy", "She said she was happy", "She said she has been happy", "She said she will be happy"]', 'She said she was happy'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'Which is the correct reported form of "I will help you"?', 'multiple_choice', '["He said he will help me", "He said he would help me", "He said he helps me", "He said he helped me"]', 'He said he would help me'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'What is the reported form of "Where do you live?"', 'multiple_choice', '["She asked where do I live", "She asked where I lived", "She asked where I live", "She asked where I am living"]', 'She asked where I lived'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'Which is the correct reported form of "I have finished"?', 'multiple_choice', '["He said he has finished", "He said he had finished", "He said he finished", "He said he was finishing"]', 'He said he had finished'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 1, 'What is the reported form of "Don\'t be late"?', 'multiple_choice', '["She told me don\'t be late", "She told me not to be late", "She told me to not be late", "She told me not be late"]', 'She told me not to be late'),

-- Passive Voice Quiz
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Which sentence is in the passive voice?', 'multiple_choice', '["Shakespeare wrote the book", "The book was written by Shakespeare", "The book is being written", "The book will be written"]', 'The book was written by Shakespeare'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'What is the passive form of "They built the house"?', 'multiple_choice', '["The house is built by them", "The house was built by them", "The house has been built by them", "The house will be built by them"]', 'The house was built by them'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Which is the correct passive form of "Someone stole my car"?', 'multiple_choice', '["My car is stolen", "My car was stolen", "My car has been stolen", "My car will be stolen"]', 'My car was stolen'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'What is the passive form of "They are building a new bridge"?', 'multiple_choice', '["A new bridge is built", "A new bridge was built", "A new bridge is being built", "A new bridge will be built"]', 'A new bridge is being built'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 2, 'Which sentence shows the passive voice in present perfect?', 'multiple_choice', '["The work is completed", "The work was completed", "The work has been completed", "The work will be completed"]', 'The work has been completed'),

-- Modal Verbs Quiz
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Which modal verb expresses obligation?', 'multiple_choice', '["can", "may", "must", "should"]', 'must'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'What is the correct form for ability in the past?', 'multiple_choice', '["can", "could", "was able to", "would be able to"]', 'could'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Which modal verb expresses possibility?', 'multiple_choice', '["must", "should", "might", "would"]', 'might'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'What is the correct form for advice?', 'multiple_choice', '["must", "should", "would", "could"]', 'should'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 3, 'Which modal verb expresses permission?', 'multiple_choice', '["can", "may", "must", "should"]', 'may'),

-- Phrasal Verbs Quiz
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'What does "give up" mean?', 'multiple_choice', '["start", "stop", "continue", "finish"]', 'stop'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'Which phrasal verb means "postpone"?', 'multiple_choice', '["put on", "put off", "put up", "put down"]', 'put off'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'What does "look after" mean?', 'multiple_choice', '["look for", "look after", "look up", "look down"]', 'take care of'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'Which phrasal verb means "start a journey"?', 'multiple_choice', '["set up", "set off", "set down", "set in"]', 'set off'),
(SELECT id FROM modules WHERE level_id = 3 AND order_id = 4, 'What does "break down" mean?', 'multiple_choice', '["start working", "stop working", "continue working", "finish working"]', 'stop working'); 