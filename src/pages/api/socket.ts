import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const vectorStore = new MemoryVectorStore(embeddings);

export const config = {
  api: {
    bodyParser: false,
  },
};

declare global {
  var io: IOServer | undefined;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route hit');
  
  if (!res.socket) {
    console.error('res.socket is not available');
    res.end();
    return;
  }
  
  const httpServer = (res.socket as any).server;
  
  if (!global.io) {
    console.log('Initializing Socket.IO');
    global.io = new IOServer(httpServer, { path: '/api/socket' });
    
    global.io.on('connection', (socket) => {
      console.log('Client connected');
      socket.on('userMessage', async (data: { text: string }) => {
        try {
          const aiResponse = await processUserMessage(data.text);
          socket.emit('aiMessage', { text: aiResponse });
        } catch (error) {
          console.error('Error processing user message:', error);
          socket.emit('aiMessage', { text: 'Sorry, we are currently experiencing issues. Please try again later.' });
        }
      });
      
    });
  } else {
    console.log('Socket.IO already initialized');
  }
  
  res.end();
}

async function processUserMessage(userInput: string): Promise<string> {
  const model = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });
  
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  const response = await chain.call({ query: userInput });
  
  console.log('OpenAI response:', response);
  return response.text;
}
