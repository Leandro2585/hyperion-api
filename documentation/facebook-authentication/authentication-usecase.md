# Authentication with Facebook

> ## Data:
* Access token

> ## Primary Flow
1. Get data(name, email and Facebook ID) from de Facebook API
2. Verify if already exists user with received email
3. Create account for user with received data from Facebook
4. Create access token from the user ID with expires in 30 minutes
5. Return generated access token

> ## Alternative Flow: User already exists
3. Update the user's account with data received by Facebook (Facebook ID and name - only update the name if the user account does not have a name)

> ## Exception Flow: Invalid token or expired
1. Return an authentication error
