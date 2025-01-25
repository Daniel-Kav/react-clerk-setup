Certainly! Here’s the database schema in plain text format that you can easily copy and paste into Microsoft Word:

---

**1. Users Table**  
This table will store user information.

```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  gamertag VARCHAR(255) NOT NULL,
  discord_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  university_id INT NOT NULL,
  game_id INT NOT NULL,
  passport_photo VARCHAR(255) NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(university_id),
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);
```

---

**2. Universities Table**  
This table will store the list of universities.

```sql
CREATE TABLE universities (
  university_id INT PRIMARY KEY AUTO_INCREMENT,
  university_name VARCHAR(255) NOT NULL,
  university_logo VARCHAR(255),
  whatsapp_group_link VARCHAR(255) NOT NULL
);
```

---

**3. Games Table**  
This table will store game titles.

```sql
CREATE TABLE games (
  game_id INT PRIMARY KEY AUTO_INCREMENT,
  game_name VARCHAR(255) NOT NULL,
  description TEXT
);
```

---

**4. Teams Table**  
This table will manage team registrations and their respective captains/vice-captains.

```sql
CREATE TABLE teams (
  team_id INT PRIMARY KEY AUTO_INCREMENT,
  team_name VARCHAR(255) NOT NULL,
  university_id INT NOT NULL,
  game_id INT NOT NULL,
  team_captain_id INT NOT NULL,
  vice_captain_id INT NOT NULL,
  phone_captain VARCHAR(15) NOT NULL,
  phone_vice_captain VARCHAR(15) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(university_id),
  FOREIGN KEY (game_id) REFERENCES games(game_id),
  FOREIGN KEY (team_captain_id) REFERENCES users(user_id),
  FOREIGN KEY (vice_captain_id) REFERENCES users(user_id)
);
```

---

**5. Team Members Table**  
This table keeps track of users and their team memberships.

```sql
CREATE TABLE team_members (
  member_id INT PRIMARY KEY AUTO_INCREMENT,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

**6. Tournaments Table**  
This table stores information about each tournament, including its status and registration deadlines.

```sql
CREATE TABLE tournaments (
  tournament_id INT PRIMARY KEY AUTO_INCREMENT,
  game_id INT NOT NULL,
  tournament_name VARCHAR(255) NOT NULL,
  description TEXT,
  registration_deadline DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rules TEXT,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);
```

---

**7. Tournament Results Table**  
This table stores results of previous tournaments.

```sql
CREATE TABLE tournament_results (
  result_id INT PRIMARY KEY AUTO_INCREMENT,
  tournament_id INT NOT NULL,
  team_id INT NOT NULL,
  position INT NOT NULL,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

---

**8. News Table**  
This table manages the news, blogs, and announcements.

```sql
CREATE TABLE news (
  news_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(user_id)
);
```

---

**9. Events Table**  
This table stores details of upcoming physical events.

```sql
CREATE TABLE events (
  event_id INT PRIMARY KEY AUTO_INCREMENT,
  event_name VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

**10. Sponsors Table**  
This table manages information about KUER’s sponsors and partners.

```sql
CREATE TABLE sponsors (
  sponsor_id INT PRIMARY KEY AUTO_INCREMENT,
  sponsor_name VARCHAR(255) NOT NULL,
  sponsor_logo VARCHAR(255),
  sponsor_url VARCHAR(255)
);
```

---

**11. Admins Table**  
This table will store the KUER team, such as game title admins, shout casters, and web team members.

```sql
CREATE TABLE admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  contact_info VARCHAR(255)
);
```

---

**12. Donations Table**  
This table will track donations made to support KUER.

```sql
CREATE TABLE donations (
  donation_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```




