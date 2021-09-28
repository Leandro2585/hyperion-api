# Change Profile Avatar

> ## Data
* User Id
* Photo

> ## Primary Flow
1. Save the received photo to a FileStorage
2. Send a unique key to FileStorage to prevent it from overwriting an image that already exists
3. Update user data with URL of the photo sent by FileStorage
4. Clear the username initials field
5. Return the user's URL and initials

> ## Alternate flow 1: User removed their photo
1. If the system does not receive a photo skip steps 1 and 2
2. Clear photo url of user data
3. Update user initials field with first letter of first and last name

> ## Alternate flow 1.1: User has no last name
4. Update the user's initials field with the first two letters of the name

> ## Alternate flow 1.2: User has a single letter name
4. Update user initials field with single letter

> ## Alternate flow 1.3: User has no name
4. Clear the username initials field

> ## Exception flow: Error updating user photo
1. Delete the photo created in FileStorage
2. Check the same error received

