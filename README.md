<h1 align="center">
    <br>Keycard; Enhanced member verification<br>
    <hr>
</h1>

<p align="center">
  <a href="https://kc.astrid.sh/api/invite">Invite</a>
•
  <a href="#overview">Overview</a>
  •
  <a href="#setup">Setup</a>
</p>

## Overview

Keycard is an effortless Discord member verification system, made to be efficent with minimal user friction.
Here are some things you should know:

- No Discord OAuth. OAuth is great, when you need it. In this case, we can get all needed information from the bot itself; why go through another step?
- Keycard provides alternate account detection. Each time a user verifies, their Discord ID and hashed IP address is saved to a database. While verifying, Keycard checks this database to see if there's any previously verified accounts on the same IP, that are in the target server.

## Setup

Setup is relatively simple.

1. Restrict the @everyone role from doing stuff. This can either be restricting view access, or just revoking speaking privileges. Only give it the permissions you wish an unverified user to have.
2. Setup your verified role. You can do this by running `/settings role` :)
3. And now you're done! People can now recieve the specified role if they successfully pass Keycard verification.

## Example

Here is an example of Keycard verification

https://user-images.githubusercontent.com/45674371/230694594-c3ca13a9-12aa-4f87-91f5-d4b79f046653.mp4
