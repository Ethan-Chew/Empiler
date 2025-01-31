# OCBC Live Chat and Improved FAQ Forum
This project was built as part of the **Full Stack Development Module** in Ngee Ann Polytechnic. As part of the module, we were supposed to build a Full Stack Application which solves a Problem Statement provided by our Stakeholder, OCBC. 

**Problem Statement:** In what ways can the bank reduce the traffic at branches and call centres for assistance and at the same time standardize or improve the customer experience for all? 

Our Application starts by streamlining the OCBC Support. Users can connect with a live advisor to resolve their inquiries. They start by navigating a webpage to select relevant categories and answer simple questions, narrowing down their issue. If available, users are then shown FAQs relating to their issue. Else, they will be prompted to start a Live Chat (recommended) or call the Hotline. The homepage also allows users to view their chat and support history. An estimated wait time is displayed for live chat assistance; if the wait is too long, users can opt to schedule a live chat appointment instead.

Agents manage multiple chats through a dedicated portal, receiving AI-driven recommendations to aid their responses. At the conclusion of each live chat, users can rate their advisor's helpfulness. If further assistance is needed, agents have the capability to help users schedule an appointment at a physical bank branch. This system integrates AI to enhance the user experience and support efficiency, ensuring that users receive timely and appropriate solutions to their queries. Further accessibility features includes, but not limited to, Text-to-Speech and Multi-Language support.

All of these are done while ensuring the upmost security of the customer's personal data.

## Tech Stack
- React.js for Front-End
- TailwindCSS for Styling
- Motion (previously Framer Motion) for Animations
- React Icons for Icons
- Supabase for Database (NoSQL)
- Express and NodeJS for Back-End

## Local Development and Testing
This project is **currently NOT deployed**. The only way to test it is by running it locally.
1. There are THREE main `.env` files, in `/back-end`, `/front-end` and `/telegram-bot`. Populate your own `.env` file based on the environment variables in `.env.example`.
2. Install required dependencies using `npm i`.
    - Dependency installation has to be done in the respective folders. Hence, it is recommended to have 3 Terminal Windows open, one for managing the Front End, one for the Back End, and one for the Telegram Bot (if required).
        - `./front-end` for Front-End
        - `./back-end` for Back-End
        - `/telegram-bot` for Telegram Bot
3. You can now start the Local Servers. Similar to installing dependencies, both Front and Back Ends have different startup procedures
    - On the **Back-End**, run ```node .``` to start the Server. It should now be running on [localhost:8080](http://localhost:8080).
    - On the **Front-End**, run ```npm start``` to start the Server. It should now be running on [localhost:3000](http://localhost:3000).
    - On the **Telegram Bot**, run ```npm run start``` to start the Bot. Once you see 'Telegram Bot Started' in your terminal, you may now use the Bot through Telegram.
    - NOTE: Should the Back-End go down at any point, the behaviour of the Front-End Website may become unstable. Ensure that both Servers are fully running before commencing any tests.

### Telegram Bot
To retrieve your own Telegram Bot API Token, text `@BotFather` on telegram, with the command `/newbot`. Follow the instructions given by BotFather to obtain your API Token. This API Token should then be placed into the `.env` file in the Telegram Bot directory. For more information, visit the Documentation provided by Telegram [here](https://core.telegram.org/bots/tutorial).

## List of Core Features and Contributors
1. Front-End User Interfaces -- Goh Jun Kai, Ethan Chew, Hervin Sie, Jefferson Low
2. Live Chat Implementation via Socket.IO -- Ethan Chew
    - End-to-End Encryption -- Ethan Chew
    - Request Appointment Booking -- Hervin Sie
    - Text-to-Speech -- Ethan Chew
    - Message Language Translation -- Ethan Chew
    - Staff Rating System -- Ethan Chew
    - Dynamic Queue System -- Hervin Sie
3. Appointment Booking System -- Jefferson Low
4. Ticket Based System -- Jefferson Low
5. AI-Enhanced FAQ Page -- Hervin Sie
6. 2-Factor Authentication -- Hervin Sie
7. Staff Statistics -- Goh Jun Kai
8. Email and Telegram Reminders -- Ethan Chew

###### Ethan Chew, Jefferson Low, Hervin Sie, Goh Jun Kai, Lim Tzi