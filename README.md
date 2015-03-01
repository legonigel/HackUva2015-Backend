Keep In Touch
=============

Backend services and API Documentation

###API Base URL

The KeepTouch server serves the base url at the address below

```
https://nodejs-cnuhacks.rhcloud.com/api/
```

###Basic response

All responses are in `JSON format`, see a sample below

```
[{
	this 	: 'is_a',
	sample 	: 'response'
}]
```

##Fetching Data

###Getting a user object from their Facebook ID

```
https://nodejs-cnuhacks.rhcloud.com/api/user/fb_id/{facebook_id}
```

###Getting a user object from a user ID

```
https://nodejs-cnuhacks.rhcloud.com/api/user/id/{user_id}
```

###Fetch an individual message by message ID

```
https://nodejs-cnuhacks.rhcloud.com/api/message/{message_id}
```

###Fetch an individual conversation (NO messages, just conversation data) by conversation ID

```
https://nodejs-cnuhacks.rhcloud.com/api/conversation/{conversation_id}
```

###Fetch an individual conversation using the id's of its two recipients

```
https://nodejs-cnuhacks.rhcloud.com/api/conversation/users/{user_id_1}/{user_id_2}
```

###Fetch messages of an entire conversation by conversation ID

```
https://nodejs-cnuhacks.rhcloud.com/api/messages/conversation/{conversation_id}
```

###Fetch all of the conversations where a user is the receiver or sender, using that user's ID

```
https://nodejs-cnuhacks.rhcloud.com/api/conversations/user/{user_id}
```

###Fetch all of the contacts for a specific user using that user's ID

```
https://nodejs-cnuhacks.rhcloud.com/api/contacts/user/{user_id}
```

###Fetch an individual contact by contact ID

```
https://nodejs-cnuhacks.rhcloud.com/api/contact/{contact_id}
```

###Start a (or return an existing) conversation between two user ID's

```
https://nodejs-cnuhacks.rhcloud.com/api/conversation/new/{user_id_1}/{user_id_2}
```

##Posting data

You must send POST requests to the following endpoints

###Posting a new message

```
https://nodejs-cnuhacks.rhcloud.com/api/message
```

- Parameters must be sent in the form

```
sender={sender_id}&recipient={recipient_id}&message={message_body}&conversation_id={conversation_id_to_store_message}
```