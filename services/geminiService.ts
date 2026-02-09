
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SearchParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function prospectLeads(params: SearchParams): Promise<{ leads: Lead[], sources: any[] }> {
  const prompt = `
    Atue como um especialista em prospecção de vendas B2B. 
    Encontre 20 empresas reais que se encaixam neste critério:
    Nicho: ${params.niche}
    Localização: ${params.location}
    Objetivo: Identificar leads qualificados para expansão de negócios.

    Para cada empresa, forneça:
    - Nome completo
    - Setor/Indústria
    - URL do Website
    - Uma breve descrição do que fazem
    - Pontuação de potencial (0-100) baseada no fit de mercado
    - Sugestões de como abordá-los
    - Localização exata (ex: "São Paulo, Brasil") e também a latitude e longitude precisas como números.
    - Se disponíveis publicamente, inclua o e-mail de contato e o número de telefone principal da empresa (apenas números e e-mails reais, não fictícios).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  industry: { type: Type.STRING },
                  website: { type: Type.STRING },
                  description: { type: Type.STRING },
                  potentialScore: { type: Type.NUMBER },
                  contactSuggestions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  location: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  latitude: { type: Type.NUMBER }, // Adicionado ao schema
                  longitude: { type: Type.NUMBER }  // Adicionado ao schema
                },
                required: ["name", "industry", "website", "description", "potentialScore", "contactSuggestions", "location"]
              }
            }
          },
          required: ["leads"]
        }
      },
    });

    const result = JSON.parse(response.text || '{"leads": []}');
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Add unique IDs to leads
    const leadsWithIds = result.leads.map((l: any, index: number) => ({
      ...l,
      id: `lead-${Date.now()}-${index}`
    }));

    return { leads: leadsWithIds, sources };
  } catch (error) {
    console.error("Erro na prospecção via Gemini:", error);
    throw error;
  }
}

export async function analyzeLeadOutreach(lead: Lead): Promise<string> {
  const prompt = `Crie uma estratégia de abordagem (outreach) personalizada para o seguinte lead:
    Empresa: ${lead.name}
    Indústria: ${lead.industry}
    Descrição: ${lead.description}
    Site: ${lead.website}
    ${lead.email ? `E-mail: ${lead.email}` : ''}
    ${lead.phone ? `Telefone: ${lead.phone}` : ''}
    ${lead.latitude && lead.longitude ? `Coordenadas: ${lead.latitude}, ${lead.longitude}` : ''}
    
    A estratégia deve incluir um script de e-mail frio curto e um gancho para LinkedIn, incorporando os dados de contato disponíveis para personalização.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a estratégia.";
  } catch (error) {
    console.error("Erro na análise de outreach:", error);
    return "Erro ao gerar estratégia personalizada.";
  }
}
