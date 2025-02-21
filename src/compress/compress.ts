import * as fs from 'fs'

// LZW Compression
function lzwCompress(input: string): number[] {
  const dictionary: Record<string, number> = {}
  let dictSize = 256
  const result: number[] = []
  let w = ''

  for (let i = 0; i < 256; i++) dictionary[String.fromCharCode(i)] = i

  for (const char of input) {
    const wc = w + char
    if (dictionary[wc]) {
      w = wc
    } else {
      result.push(dictionary[w])
      dictionary[wc] = dictSize++
      w = char
    }
  }
  if (w) result.push(dictionary[w])
  return result
}

function lzwDecompress(compressed: number[]): string {
  const dictionary: Record<number, string> = {}
  let dictSize = 256
  let w = String.fromCharCode(compressed[0])
  let result = w

  for (let i = 0; i < 256; i++) dictionary[i] = String.fromCharCode(i)

  for (let i = 1; i < compressed.length; i++) {
    const entry = dictionary[compressed[i]] ?? w + w[0]
    result += entry
    dictionary[dictSize++] = w + entry[0]
    w = entry
  }
  return result
}

// Huffman Compression
class HuffmanNode {
  constructor(
    public char: number | null,
    public freq: number,
    public left: HuffmanNode | null = null,
    public right: HuffmanNode | null = null
  ) {}
}

function buildHuffmanTable(node: HuffmanNode, prefix = '', table: Record<number, string> = {}): Record<number, string> {
  if (node.char !== null) table[node.char] = prefix
  else {
    if (node.left) buildHuffmanTable(node.left, prefix + '0', table)
    if (node.right) buildHuffmanTable(node.right, prefix + '1', table)
  }
  return table
}

function buildHuffmanTree(data: number[]): { tree: HuffmanNode; table: Record<number, string> } {
  const freqMap: Record<number, number> = {}
  for (const num of data) freqMap[num] = (freqMap[num] || 0) + 1

  const queue = Object.entries(freqMap)
    .map(([num, freq]) => new HuffmanNode(Number(num), freq))
    .sort((a, b) => a.freq - b.freq)

  while (queue.length > 1) {
    const left = queue.shift()!
    const right = queue.shift()!
    const parent = new HuffmanNode(null, left.freq + right.freq, left, right)
    queue.push(parent)
    queue.sort((a, b) => a.freq - b.freq)
  }

  const tree = queue[0]
  const table = buildHuffmanTable(tree)
  return { tree, table }
}

function huffmanCompress(data: number[]): { encoded: Buffer; table: Record<number, string> } {
  const { table } = buildHuffmanTree(data)
  const bitString = data.map((num) => table[num]).join('')
  const byteArray = Buffer.alloc(Math.ceil(bitString.length / 8))

  for (let i = 0; i < bitString.length; i++) {
    if (bitString[i] === '1') byteArray[Math.floor(i / 8)] |= 1 << (7 - (i % 8))
  }

  return { encoded: byteArray, table }
}

function huffmanDecompress(encoded: Buffer, table: Record<number, string>): number[] {
  const reverseTable = Object.fromEntries(Object.entries(table).map(([num, code]) => [code, Number(num)]))
  const result: number[] = []
  let buffer = ''

  for (let i = 0; i < encoded.length * 8; i++) {
    buffer += encoded[Math.floor(i / 8)] & (1 << (7 - (i % 8))) ? '1' : '0'
    if (reverseTable[buffer]) {
      result.push(reverseTable[buffer])
      buffer = ''
    }
  }
  return result
}

function compressJson(inputPath: string, outputPath: string): void {
  const jsonData = fs.readFileSync(inputPath, 'utf-8')

  const lzwCompressed = lzwCompress(jsonData)

  const { encoded, table } = huffmanCompress(lzwCompressed)

  fs.writeFileSync(outputPath, encoded)
  fs.writeFileSync(outputPath + '.table', JSON.stringify(table), 'utf-8')

  console.log('Compressed file:', outputPath)
}

function decompressJson(inputPath: string, outputPath: string): void {
  const encoded = fs.readFileSync(inputPath)
  const table = JSON.parse(fs.readFileSync(inputPath + '.table', 'utf-8'))

  const huffmanDecoded = huffmanDecompress(encoded, table)

  const lzwDecompressed = lzwDecompress(huffmanDecoded)

  fs.writeFileSync(outputPath, lzwDecompressed, 'utf-8')

  console.log('Decompressed file:', outputPath)
}

compressJson('src/compress/data.json', 'src/compress/data.json.br')
decompressJson('src/compress/data.json.br', 'src/compress/data_decoded.json')
