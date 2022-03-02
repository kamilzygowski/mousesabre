# Mouse Sabre
  
 - Typescript - NodeJS - MySQL browser game made for minimum 900px screen width
 - App was created with Webpack js template using Babel, PostCSS and Sass.
 - **This game is posted on:** https://swedishsailor.github.io/mousesabre/

## How to play?

Your task is to defeat as many enemies as you can and survive attacks of flying beings. 
As a player you are transformed into an immortal sword but under the screen is your home village, which is vulnerable and you have to protect it
You can slay your enemies by just passing through them or you can use **one of special skills.** Right now the only player skill is **Samurai Slash** which can be used by     clicking right mouse click and slash all your enemies in slow motion.

## Engine

This game uses custom engine made by SwedishSailor, which works on 60 frames per sec. Every logic/creature effect is applied by taking this creature informations and modify it by logic function, it's pretty simple solution. Thanks to functional creature effects almost every effect can be used on every "living" creature in game. Also this game engine renders many views using grid (square meters values in pixels) and spawn waves of monsters in time intervals.
