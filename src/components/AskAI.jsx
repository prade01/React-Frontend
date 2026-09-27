/* */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../axios";

import "./AskAI.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";


function AskAi() {

    const navigate = useNavigate();

    const [messages, setMessages] =
        useState([]);

    const [isTyping, setIsTyping] =
        useState(false);

    const [error, setError] =
        useState(null);


    // ============================================================
    // WELCOME MESSAGE
    // ============================================================

    useEffect(() => {

        setMessages([
            {
                message:
                    "Hello, I'm Your AI Assistant !",

                sender: "AI",

                direction: "incoming"
            }
        ]);

    }, []);


    // ============================================================
    // SEND MESSAGE
    // ============================================================

    const handleSend = useCallback(
        async (messageText) => {

            if (!messageText?.trim()) {
                return;
            }


            // ----------------------------------------------------
            // USER MESSAGE
            // ----------------------------------------------------

            const userMessage = {

                message: messageText,

                sender: "user",

                direction: "outgoing"
            };


            setMessages(prev => [
                ...prev,
                userMessage
            ]);


            setIsTyping(true);

            setError(null);


            try {

                await processMessageToChatGPT(     // Handling Get, Post method
                    messageText
                );

            } catch (err) {

                console.error(
                    "Chat API error:",
                    err
                );


                const errorMessage =
                    err.response?.data?.error?.message ||
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Something went wrong.";


                setError(
                    typeof errorMessage === "string"
                        ? errorMessage
                        : "Something went wrong."
                );

            } finally {

                setIsTyping(false);
            }

        },
        []
    );

    // 
    // ============================================================
    // GET /api/chat/ask
    // ============================================================

    async function processMessageToChatGPTGet(chatMessage) {

        const response = await axios.get(
            "/api/chat/ask",
            {
                params: {
                    question: chatMessage
                }
            }
        );

        const data = response.data;

        let botMessageText;

        if (typeof data === "string") {
            botMessageText = data;
        } else {
            botMessageText =
                data.answer ??
                data.response ??
                JSON.stringify(data);
        }

        setMessages(prev => [
            ...prev,
            {
                message: botMessageText,
                sender: "ChatGPT",
                direction: "incoming"
            }
        ]);
    }


    // ============================================================
    // POST /api/chat/ask
    // ============================================================

    async function processMessageToChatGPTPost(chatMessage) {

        const response = await axios.post(
            "/api/chat/ask",
            {
                question: chatMessage
            }
        );

        const data = response.data;

        let botMessageText;

        if (typeof data === "string") {
            botMessageText = data;
        } else {
            botMessageText =
                data.answer ??
                data.response ??
                JSON.stringify(data);
        }

        setMessages(prev => [
            ...prev,
            {
                message: botMessageText,
                sender: "ChatGPT",
                direction: "incoming"
            }
        ]);
    }
    // 


    // ============================================================
    // POST /api/chat
    // ============================================================

    async function processMessageToChatGPT(
        chatMessage
    ) {

        /*
         * IMPORTANT:
         *
         * We do NOT add:
         *
         * Authorization
         * X-CSRF-TOKEN
         * credentials
         *
         * here.
         *
         * axios.js handles them globally.
         */

        const response =
            await axios.post(
                "/api/chat/ask",
                {
                    question: chatMessage
                }
            );


        // ========================================================
        // SUCCESS RESPONSE
        // ========================================================

        const data =
            response.data;


        let botMessageText;


        if (typeof data === "string") {

            botMessageText =
                data;

        } else {

            botMessageText =
                data.answer ??
                data.response ??
                JSON.stringify(data);
        }


        // ========================================================
        // DISPLAY AI RESPONSE
        // ========================================================

        setMessages(prev => [

            ...prev,

            {
                message:
                    botMessageText,

                sender:
                    "ChatGPT",

                direction:
                    "incoming"
            }

        ]);
    }


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="ai-floating-wrapper">

            <div className="ai-floating-card">


                {/* Header */}

                <div className="ai-header">

                    <h5 className="mb-0">

                        <i className="bi bi-robot me-2"></i>

                        PrashruGPT

                    </h5>


                    {/* Close button */}

                    <button
                        type="button"
                        className="ai-close-btn"
                        onClick={() => navigate("/")}
                        aria-label="Close AI Assistant"
                        title="Close"
                    >

                        <i className="bi bi-x-lg"></i>

                    </button>

                </div>


                {/* Chat area */}

                <div className="ai-chat-body">

                    <MainContainer>

                        <ChatContainer>

                            <MessageList
                                scrollBehavior="smooth"
                                typingIndicator={
                                    isTyping
                                        ? (
                                            <TypingIndicator
                                                content=" "
                                            />
                                        )
                                        : null
                                }
                            >

                                {messages.map(
                                    (message, index) => (

                                        <Message
                                            key={index}
                                            model={message}
                                            className={
                                                message.error
                                                    ? "error-message"
                                                    : ""
                                            }
                                        />

                                    )
                                )}

                            </MessageList>


                            <MessageInput
                                placeholder="Type your message here..."
                                onSend={handleSend}
                                attachButton={false}
                                disabled={isTyping}
                            />

                        </ChatContainer>

                    </MainContainer>

                </div>


                {/* Error */}

                {error && (

                    <div
                        className="alert alert-danger ai-error"
                        role="alert"
                    >

                        <i className="bi bi-exclamation-triangle-fill me-2"></i>

                        {error}

                    </div>

                )}

            </div>

        </div>
    );
}


export default AskAi;
/* */