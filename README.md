# Rescue Elite

In this project, we create a website version of the game **Fort Apocalypse** of the C64. The game is about an helicopter trying to rescue people in an active warzone. To do so, the chopper must shoot enemies and press buttons to open doors. The goal is to rescue the people and escape the level.

## Features
This game includes several features:
- A list of pre-made levels acting as a tutorial.
- A level editor allowing players to create, share, and export custom levels.

### Goal: Replayability
We aim to make the game highly replayable by combining procedural content generation (PCG), creative puzzles, and changing gameplay mechanics.

## Thesis Project
This game is part of my thesis project on replayability and AI-driven level design. Using Monte Carlo Tree Search (MCTS), we generate levels that can be played via the import function, showcasing the AI’s ability to create engaging and varied experiences.

## How to Play?
- Use arrow keys to move the chopper.
- Press colored buttons to open respective colored doors.
- Shoot enemies or breakable blocks using 'X' or 'Z'.
- Avoid or fight enemies.
- Rescue the people and reach the exit to complete the level.

## How to setup?
This application can be launched in two different ways:

#### Node.js
The first method is to use Node.js. Activate the program using the following command:
```node server.js```
The server is opened on port `3000`. Here the game can be played.

For the level editor the command is as follows:
```node server_editor.js```
And this can be opened on port `3001`.

#### VSCode Live Server
Visual Studio Code has an option to run a html-file in a live server. In order to do so, open the project in VSCode and open the `public/` directory. Right click on the `index.html` file and click on the first option: `Open with Live Server`. This works similar for the level editor which is located in the `public_editor/` directory.

## Where to Play?
Coming soon..
