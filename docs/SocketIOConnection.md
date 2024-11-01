# Socket.IO Connection
This file specifies the different Socket.IO Events that the back-end will listen to.

## Customer Events
<details>
<summary><code>customer:join</code> -- Transmit</summary>
Fired when the customer requests for a live chat.

### Parameters
| Name | Data Type | Description |
| :-- | :-- | :-- |
| customerSessionIdentifier | String | Customer Session Identifier (A Unique Identifier given to every live chat session. Unique to the particular session) |
| faqSection | String | The FAQ Section help is requested for |
| faqQuestion | String | A description / question that the customer is asking |
</details>

<details>
<summary><code>customer:leave</code> -- Transmit</summary>
Fired when the customer leaves the live chat

### Parameters
No Parameters Needed
</details>

## Staff Events


## Utility Events
<details>
<summary><code>utils:send-msg</code> -- Transmit</summary>
Fired when a customer/staff sends a message

### Parameters
TODO
</details>
<details>
<summary><code>utils:receive-msg</code> -- Receive</summary>
Fired when the customer leaves the live chat

### Parameters
No Parameters Needed
</details>