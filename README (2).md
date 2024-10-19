# Chatapp

This document provides an overview of the chat application's architecture, data structures, and flow for managing **Groups**, **Channels**, **Users**, and **Messages**.

## Data Structures Used

The data structures in this project are organized to maintain state for the following entities:

### Groups and Channels

It is to organise users into logical groups and each group contains multiple channels.

```typescript

groups: any[] = [
  {
    _id: string,   // Unique identifier for the group
    name: string,  // Group name
    channels: [
      {
        _id: string,   // Unique identifier for the channel
        name: string,  // Channel name
      },
    ],
  },
];

```

### Messages

It is to hold messages sent in channels, it supports notifications for users join/leave events using userId: null.

```typescript

messages: any[] = [
  {
    content: string,        // Message content
    userId: string | null,  // Identifier of the user (null for notifications)
    avatarUrl?: string,     // Optional avatar for the user
  },
];

```

### Selected Group and Channel

It is to maintain the current selection of group and channel and to determine where messages are sent and received.

```typescript

selectedGroup: any = {
  _id: string,
  name: string,
  channels: any[],
};

selectedChannel: any = {
  _id: string,
  name: string,
};


```

### Socket Event Payloads

To do real time communication with server using Socket.IO events and socket listerns in the ChatComponent respond to incoming messages, user joins, and user leaves, updating the message list accordingly.

```typescript

// Incoming messages

{
  content: string,     // Message content
  senderAvatar: string // Avatar of the message sender
}

// User join/leave notification

{
  message: string // Notification message
}


```

### File Upload Handling

Stores the currently selected file for upload and on successful upload FormData object is used to send the file to the server.

```typescript
const formData = new FormData();
formData.append("image", this.selectedFile);
```

### Group Management Data

Manages group and channel creation. and stores temporary values for input fields in group and channel.

```typescript
groupName: string = ""; // Name of the group to be created
channelName: string = ""; // Name of the channel to be added
selectedGroupId: string = ""; // ID of the selected group for adding/removing channels
```

## REST API flow and explaination of each endpoint

Each endpoint is explained with its purpose, HTTP methods, required parameters, request/response format, and error handling.

### User Registration

Registers a new user with provided credentials.

Endpoint: POST /api/auth/register

```typescript

// Request body

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string" // Optional (default: "user")
}


// Response body

{
  "_id": "string",
  "username": "string",
  "email": "string",
  "roles": ["user"]
}

```

Errors: 500 if error registering user and 400 if already exists

### User Login

Logs in a user and returns a JWT token.

Endpoint: POST /api/auth/login

```typescript

// Request body

{
  "username": "string",
  "password": "string"
}

// Response body

{
  "token": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "roles": ["user"]
  }
}

```

Errors: 404 if not found and 400 invalid credentials

### Get All Groups

Fetches all available groups.

Endpoint: GET /api/groups

```typescript

// Request body

[
  {
    "_id": "string",
    "name": "string",
    "channels": []
  }
]


// Response body

{
  "token": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "roles": ["user"]
  }
}

```

### Create a Group

Creates a new group.

Endpoint: POST /api/groups/create

```typescript

// Request body

{
  "name": "string"
}



// Response body

{
  "message": "Group created successfully",
  "group": {
    "_id": "string",
    "name": "string"
  }
}

```

### Delete a Group

Deletes a group by ID.

Endpoint: DELETE /api/groups/:groupId

### Add a Channel to a Group

Adds a new channel to a specific group.

Endpoint: POST /api/groups/:groupId/addChannel

```typescript

// Request body

{
  "name": "string"
}



// Response body

{
  "name": "string",
  "groupId": "string"
}


```

### Delete a Channel

Deletes a channel by Name.

Endpoint: /api/groups/:groupId/:channelName

### Send a Message

Sends a message to a specific channel.

Endpoint: POST /api/chat/:groupId/:channelName/send

```typescript

// Request body

{
  "userId": "string",
  "content": "string"
}


// Response body

{
  "message": "Message sent successfully",
  "message": {
    "content": "string",
    "senderAvatar": "string"
  }
}

```

### Get Messages from a Channel

Retrieves all messages from a specific channel.

Endpoint: GET /api/chat/:groupId/:channelName

```typescript
// Response

[
  {
    content: "string",
    senderAvatar: "string",
  },
];
```

### Promote user

Promotes a user to a higher role.

Endpoint: POST /api/users/promoteUser

```typescript

// Reqyest body

{
  "userId": "string",
  "role": "string"
}

// Response

{
  "message": "User promoted successfully",
  "user": {
    "_id": "string",
    "roles": ["admin"]
  }
}


```

### Delete user

Removes a user by ID

Endpoint: DELETE /api/users/removeUser/:userId

```typescript

// Response

{
  "message": "User removed successfully"
}

```

### File upload

Uploads an avatar image for the user.

Endpoint: POST /api/users/upload-avatar

```typescript

// Request body uses multipart/form-data with a single file upload.

// Response

{
  "message": "Avatar uploaded",
  "user": {
    "_id": "string",
    "avatar": "string"
  }
}

```
