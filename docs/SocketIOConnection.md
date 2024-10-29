# Socket.IO Connection
This file specifies the different Socket.IO Events that the back-end will listen to.

## Customer Events
<details>
<summary><code>customer:join</code></summary>
Fired when the customer requests for a live chat.

### Parameters
| Name | Data Type | Description |
| :-- | :-- | :-- |
| csi | String | Customer Session Identifier (A Unique Identifier given to every live chat session. Unique to the particular session) |
| faqSection | String | The FAQ Section help is requested for |
| faqQuestion | String | A description / question that the customer is asking |
</details>

<details>
<summary><code>customer:leave</code></summary>
Fired when the customer leaves the live chat

### Parameters
No Parameters Needed
</details>

## Staff Events


## Utility Events

