export async function fetchGroqResponse(messages, apiKey) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 256,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data?.error?.message || JSON.stringify(data) || 'Groq API error';
      console.error('Groq API error:', errorMsg);
      throw new Error(errorMsg);
    }
    return data.choices?.[0]?.message?.content || 'No response from AI.';
  } catch (err) {
    console.error('Groq API call failed:', err.message);
    return `Error: ${err.message}`;
  }
}