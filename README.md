# Kryostack — Full-Stack Website

A complete website for Kryostack: a Python (FastAPI) backend with a SQLite
database, a public marketing site, and an admin dashboard for editing
Services, Featured Work, and Testimonials — all in one project.

## What's inside

```
kryostack/
  backend/            <- Python API server (FastAPI + SQLite)
    main.py
    requirements.txt
    ...
  frontend/            <- The website itself (served by the backend)
    index.html          <- public site
    admin/
      login.html        <- admin login page
      dashboard.html     <- admin dashboard (edit content)
```

You only need to run ONE server (the backend). It serves both the public
site and the admin dashboard.

## Running it on Windows

1. **Install Python** if you don't have it: https://www.python.org/downloads/
   (When installing, tick the box that says "Add Python to PATH".)

2. **Open Command Prompt** (press the Windows key, type `cmd`, press Enter).

3. **Navigate into the backend folder.** Assuming you unzipped this project
   to your Downloads folder, that would be:
   ```
   cd Downloads\kryostack\backend
   ```
   (Adjust the path if you put it somewhere else. Tip: you can type `cd `
   then drag the `backend` folder from File Explorer into the Command
   Prompt window, and it will fill in the path for you.)

4. **Create a virtual environment** (keeps these packages separate from
   anything else on your computer):
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
   Your prompt should now start with `(venv)`.

5. **Install the required packages:**
   ```
   pip install -r requirements.txt
   ```

6. **Start the server:**
   ```
   uvicorn main:app --reload
   ```
   You should see a message ending in something like:
   `Uvicorn running on http://127.0.0.1:8000`

7. **Open your browser** to:
   - Public site: http://127.0.0.1:8000
   - Admin dashboard: http://127.0.0.1:8000/admin/login.html

## Default admin login

```
username: admin
password: changeme123!
```

The very first time you start the server, it prints these credentials to
the Command Prompt window too. **Log in and change the password right away**
from the Settings tab in the dashboard.

## Editing content

Everything on the public site (Services, Featured Work, Testimonials) is
stored in the database and edited through the admin dashboard — no code
editing needed. Contact form submissions from visitors also land in the
dashboard, under "Messages".

## Notes

- The database is a single file, `backend/kryostack.db`, created
  automatically the first time you run the server. Back that file up if you
  want to preserve your content.
- To stop the server, click into the Command Prompt window and press
  `Ctrl + C`.
- Next time you want to run it, you only need steps 3, 4 (just
  `venv\Scripts\activate`, not the whole venv creation again), and 6.
