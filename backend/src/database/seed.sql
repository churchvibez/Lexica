-- Insert Module Levels
INSERT INTO module_levels (name, slug, display_order) VALUES
('A1-A2', 'beginner', 1),
('B1-B2', 'intermediate', 2),
('C1-C2', 'advanced', 3);

-- Insert Modules
INSERT INTO modules (level_id, title, description, sequence) VALUES
(1, 'The Alphabet', 'Learn about the English alphabet and its letters', 1),
(1, 'Basic Numbers', 'Introduction to numbers and counting', 2),
(1, 'Common Greetings', 'Learn how to greet people in English', 3);

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