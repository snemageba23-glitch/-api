// hello_qwen.mjs
import OpenAI from "openai";
import 'dotenv/config';

// 1. 配置客户端
const client = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,  // 从.env文件读取密钥
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1" // 关键：设置通义千问的接入点
});

async function callQwen() {
    try {
        // 2. 发送请求
        const completion = await client.chat.completions.create({
            model: "qwen-turbo",      // 可选的模型：qwen-turbo, qwen-plus, qwen-max
            messages: [
                { role: "system", "content": "你是一个乐于助人的助手。" },
                { role: "user", "content": "你好，请简单介绍一下你自己。" }
            ],
            temperature: 0.7
        });

        // 3. 获取并打印回复
        const reply = completion.choices[0].message.content;
        console.log("AI 回复：", reply);
    } catch (error) {
        console.error("调用失败：", error);
    }
}

callQwen();