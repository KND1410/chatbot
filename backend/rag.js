import fs from 'fs';

export function loadAndChunk(filePath){
    const text = fs.readFileSync(filePath, 'utf-8');

    const chunks = text
        .split(/\n\n+/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

    console.log(`Loaded ${chunks.length} chunks from ${filePath}`);
    return chunks;
}

export function findRelevantChunks(query, chunks, topK = 2){
    const queryWords = new Set(
        query.toLowerCase().split(/\s+/)
    );

    const scored = chunks.map(chunk => {
        const chunkWorlds = chunk.toLowerCase().split(/\s+/);
        const overlap = chunkWorlds.filter(w => queryWords.has(w)).length;
        return {chunk, score: overlap};
    })

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(item => item.score > 0)
        .map(item => item.chunk);
}