# Next.js Socket.IO + LangChain Chat Bot

This project demonstrates how to integrate Socket.IO with Next.js API routes and [LangChain](https://js.langchain.com/) to create a simple chat bot powered by OpenAI. The bot uses a memory-based vector store for retrieval-augmented generation (RAG) by leveraging OpenAI embeddings and a language model chain.

## Features

- **Real-time Communication:**  
  Uses Socket.IO to establish WebSocket connections between the client and server.

- **Next.js API Route:**  
  Implements a custom API route to initialize and handle Socket.IO connections.

- **LangChain Integration:**  
  Utilizes LangChain's `RetrievalQAChain` to interact with OpenAI's GPT-based model.

- **Memory Vector Store:**  
  Employs a memory-based vector store (via `MemoryVectorStore`) and `OpenAIEmbeddings` for context retrieval.

- **Error Handling:**  
  Includes basic error handling for OpenAI quota errors (e.g., 429 rate limits).

## Prerequisites

- **Node.js:** Version 14.x or higher is recommended.
- **Next.js:** Ensure you have a Next.js project set up.
- **OpenAI API Key:** You must have an API key from [OpenAI](https://platform.openai.com/).

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Andrei1109/RAG-Chat-Integration
   cd RAG-Chat-Integration
   ```
